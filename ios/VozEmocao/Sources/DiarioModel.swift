import Foundation
import AVFoundation
import Combine
import UserNotifications

/// Diário de Voz AUTOMÁTICO — o dia inteiro com um toque.
///
/// O pedido do Helio: "quero que meu celular me ouça sem eu fazer nenhum
/// passo". Este é o máximo que o iOS permite a um app legítimo, e é muito:
/// ligado de manhã, o app mantém o microfone aberto (modo de áudio em segundo
/// plano, o mesmo da escuta de palavras), sorteia os momentos sozinho e, em
/// cada um, captura ~30s de FEATURES — o áudio nunca é escrito em disco. A
/// pessoa só é chamada para o único passo que não pode ser automatizado:
/// dizer como se sentia. Esse passo É o dado (ground truth).
///
/// Limites de plataforma, para ninguém se enganar:
///  · é preciso abrir o app e tocar "Começar o dia" uma vez (após reiniciar o
///    aparelho, de novo) — o iOS não deixa um app se auto-iniciar;
///  · o indicador laranja de microfone fica visível o dia todo (correto:
///    é o sistema sendo honesto com o usuário);
///  · escuta contínua custa bateria.
@MainActor
final class DiarioModel: NSObject, ObservableObject {

    static let shared = DiarioModel()

    // MARK: - Registro (espelha o esquema do dataset web)

    struct Affect: Codable {
        var valencia: Double   // -2 … +2
        var ativacao: Double   //  0 … +3
    }

    struct Momento: Codable, Identifiable {
        let id: String
        let data: Date
        let origem = "diario"
        let chamado = "automatico"     // capturado pelo sorteio, sem toque
        let fonte = "voz"
        let origemRotulo = "humano"
        var qualidade: String?         // "limpa" | "mista" — quem falou?
        var contexto: Contexto?
        var relatado: Relatado?        // nil enquanto não rotulado
        var observado: Observado
        var inferido: Inferido

        var rotulado: Bool { relatado != nil }
    }

    struct Contexto: Codable { var onde: String?; var comQuem: String?; var hora: Int }
    struct Relatado: Codable { var speaker = "eu"; var affect: Affect; var feeling: String? }

    struct Observado: Codable {
        var energiaMedia: Int
        var energiaRms: Float
        var alturaMediaHz: Int
        var variacaoPitchHz: Int
        var variacaoPitchSemitons: Float
        var pausasPct: Int
    }

    struct Inferido: Codable {
        var dimensoes: Affect
        var categoria: String
        var motorVersao = EmotionEngine.engineVersion
    }

    // MARK: - Estado observável

    enum Estado { case desligado, ouvindo }

    @Published var estado: Estado = .desligado
    @Published var statusText = "Um toque de manhã. O resto do dia é comigo."
    @Published var horarios: [Date] = []
    @Published var capturados = 0
    @Published var momentos: [Momento] = []
    /// Notificação de rótulo tocada → a UI navega para o Diário sozinha.
    /// (`abrirPedido` guia a navegação e precisa ficar true enquanto a tela
    /// está aberta; `querRotular` é consumido pela tela para abrir a folha.)
    @Published var abrirPedido = false
    var querRotular = false

    // MARK: - Captura

    private let audioEngine = AVAudioEngine()
    private let buffer = RollingFrameBuffer(keepMs: 35_000)
    private var checkTimer: Timer?
    private var pendentes: [Date] = []

    private let storeURL: URL = {
        let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return dir.appendingPathComponent("diario-automatico.json")
    }()

    override init() {
        super.init()
        momentos = (try? JSONDecoder().decode([Momento].self,
                                              from: Data(contentsOf: storeURL))) ?? []
    }

    // MARK: - Liga / desliga

    func comecarDia(janelaHoras: ClosedRange<Int> = 9...21, vezes: Int = 5) {
        // Diário e escuta de palavras disputam o mesmo microfone — um por vez.
        ConversationModel.shared.stopListening()

        AVAudioSession.sharedInstance().requestRecordPermission { [weak self] ok in
            Task { @MainActor in
                guard let self else { return }
                guard ok else {
                    self.statusText = "Preciso do microfone. Ajustes → Voice&Emotion → Microfone."
                    return
                }
                do {
                    try self.ligarMicrofone()
                    self.sortear(janelaHoras: janelaHoras, vezes: vezes)
                    self.estado = .ouvindo
                    self.capturados = 0
                    self.statusText = "Ouvindo o seu dia. Pode bloquear a tela e guardar o telefone — eu chamo você."
                    self.armarVigia()
                } catch {
                    self.statusText = "Não consegui ligar o microfone: \(error.localizedDescription)"
                }
            }
        }
    }

    func encerrarDia() {
        checkTimer?.invalidate(); checkTimer = nil
        if audioEngine.isRunning { audioEngine.stop() }
        audioEngine.inputNode.removeTap(onBus: 0)
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        estado = .desligado
        pendentes = []
        horarios = []
        statusText = capturados > 0
            ? "Dia encerrado — \(capturados) momento(s) capturado(s). Marque os que faltam abaixo."
            : "Dia encerrado."
    }

    private func ligarMicrofone() throws {
        let session = AVAudioSession.sharedInstance()
        // `.mixWithOthers`: o dia inteiro não pode silenciar música/ligações.
        try session.setCategory(.playAndRecord, mode: .measurement,
                                options: [.mixWithOthers, .allowBluetooth])
        try session.setActive(true)

        let input = audioEngine.inputNode
        let format = input.outputFormat(forBus: 0)
        let sampleRate = Float(format.sampleRate)
        let buffer = self.buffer

        input.installTap(onBus: 0, bufferSize: 2048, format: format) { pcm, _ in
            buffer.ingest(pcm, sampleRate: sampleRate)
        }
        audioEngine.prepare()
        try audioEngine.start()
    }

    // MARK: - Sorteio (mesmas regras do diário web)

    private func sortear(janelaHoras: ClosedRange<Int>, vezes: Int) {
        let cal = Calendar.current
        let agora = Date()
        let inicioJanela = cal.date(bySettingHour: janelaHoras.lowerBound, minute: 0,
                                    second: 0, of: agora)!
        let fimJanela = cal.date(bySettingHour: janelaHoras.upperBound, minute: 0,
                                 second: 0, of: agora)!
        // Nunca sortear no passado (folga de 10 min), nunca amontoar (gap 45 min).
        let inicio = max(inicioJanela, agora.addingTimeInterval(10 * 60))
        let gap: TimeInterval = 45 * 60
        let janela = fimJanela.timeIntervalSince(inicio)
        guard janela > gap else { pendentes = []; horarios = []; return }

        let n = min(vezes, Int(janela / gap) + 1)
        var pontos: [TimeInterval] = []
        for _ in 0..<200 {
            let tentativa = (0..<n).map { _ in TimeInterval.random(in: 0...janela) }.sorted()
            if zip(tentativa, tentativa.dropFirst()).allSatisfy({ $1 - $0 >= gap }) {
                pontos = tentativa; break
            }
        }
        if pontos.isEmpty {   // fallback uniforme com jitter
            let passo = janela / Double(n)
            pontos = (0..<n).map { passo * (Double($0) + 0.5) + .random(in: -passo * 0.2...passo * 0.2) }
        }
        pendentes = pontos.map { inicio.addingTimeInterval($0) }
        horarios = pendentes
    }

    /// Vigia leve: a cada 20s confere se chegou um horário sorteado. Rodar um
    /// timer não impede o sono do processo — quem o mantém vivo é a sessão de
    /// áudio ativa; o timer só dispara enquanto o app estiver rodando.
    private func armarVigia() {
        checkTimer?.invalidate()
        let t = Timer(timeInterval: 20, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.conferir() }
        }
        // `.common`: continua contando mesmo com a UI em rolagem.
        RunLoop.main.add(t, forMode: .common)
        checkTimer = t
    }

    private func conferir() {
        guard estado == .ouvindo else { return }
        let agora = Date()
        guard let idx = pendentes.firstIndex(where: { $0 <= agora }) else { return }
        pendentes.remove(at: idx)
        capturar()
        if pendentes.isEmpty {
            statusText = "Último momento do dia capturado. Quando quiser, encerre o dia."
        }
    }

    // MARK: - Captura de um momento

    private func capturar() {
        let frames = buffer.snapshot(lastMs: 30_000)
        guard let s = EmotionEngine.summarize(frames) else {
            // Silêncio no momento sorteado (telefone longe, ninguém falando).
            // Registrar nada é melhor que registrar lixo — mas avisar, porque
            // amostra perdida em silêncio é o pior tipo de perda.
            NotificationScheduler.presentDiario(
                titulo: "Momento sorteado sem fala",
                corpo: "Não ouvi você por perto agora. Se quiser, abra e grave este momento manualmente.")
            return
        }

        let m = Momento(
            id: "diario-auto-\(Int(Date().timeIntervalSince1970))",
            data: Date(),
            qualidade: nil,
            contexto: Contexto(onde: nil, comQuem: nil,
                               hora: Calendar.current.component(.hour, from: Date())),
            relatado: nil,
            observado: Observado(
                energiaMedia: s.energy,
                energiaRms: s.meanEnergyRms,
                alturaMediaHz: s.meanPitch,
                variacaoPitchHz: s.pitchStd,
                variacaoPitchSemitons: s.pitchStdSemitones,
                pausasPct: s.silenceRatio),
            inferido: Inferido(
                dimensoes: Affect(valencia: Double(s.valence - 50) / 25,
                                  ativacao: Double(s.energy) / 100 * 3),
                categoria: s.dominant.key)
        )
        momentos.insert(m, at: 0)
        capturados += 1
        salvar()

        NotificationScheduler.presentDiario(
            titulo: "Como você está agora?",
            corpo: "Acabei de ler um momento do seu dia. Toque e marque como você se sente — 10 segundos.")
    }

    // MARK: - Rótulo (o passo humano)

    func rotular(id: String, affect: Affect, feeling: String?,
                 onde: String?, comQuem: String?, qualidade: String) {
        guard let i = momentos.firstIndex(where: { $0.id == id }) else { return }
        momentos[i].relatado = Relatado(affect: affect, feeling: feeling)
        momentos[i].qualidade = qualidade
        momentos[i].contexto?.onde = onde
        momentos[i].contexto?.comQuem = comQuem
        salvar()
    }

    func descartar(id: String) {
        momentos.removeAll { $0.id == id }
        salvar()
    }

    var pendentesDeRotulo: [Momento] { momentos.filter { !$0.rotulado } }

    // MARK: - Persistência / exportação

    private func salvar() {
        let enc = JSONEncoder()
        enc.dateEncodingStrategy = .iso8601
        if let data = try? enc.encode(momentos) { try? data.write(to: storeURL) }
    }

    /// Gera o arquivo de exportação no mesmo espírito do dataset web.
    func exportar() -> URL? {
        let enc = JSONEncoder()
        enc.dateEncodingStrategy = .iso8601
        enc.outputFormatting = [.prettyPrinted, .sortedKeys]
        guard let data = try? enc.encode(momentos) else { return nil }
        let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
        let url = FileManager.default.temporaryDirectory
            .appendingPathComponent("vem-diario-auto-\(df.string(from: Date())).json")
        try? data.write(to: url)
        return url
    }
}

/// Buffer circular de FEATURES — nunca de áudio.
///
/// O tap roda na thread de áudio em tempo real; este buffer é o único ponto de
/// contato entre ela e o resto do app (mesma razão de existir do
/// `RecordingSession`, mas sem `AVAudioFile`: aqui o áudio é medido e morre).
final class RollingFrameBuffer: @unchecked Sendable {
    private let keepMs: Double
    private let lock = NSLock()
    private var frames = [EmotionEngine.Frame]()
    private let analyzer = AudioAnalyzer(fftSize: 2048)
    private let epoch = Date()

    init(keepMs: Double) { self.keepMs = keepMs }

    func ingest(_ buffer: AVAudioPCMBuffer, sampleRate: Float) {
        guard let channel = buffer.floatChannelData?[0] else { return }
        let samples = Array(UnsafeBufferPointer(start: channel, count: Int(buffer.frameLength)))

        let energy = EmotionEngine.rms(samples)
        let pitch = EmotionEngine.detectPitch(samples, sampleRate: sampleRate)
        var block = samples
        if block.count < 2048 { block.append(contentsOf: [Float](repeating: 0, count: 2048 - block.count)) }
        let mags = analyzer.magnitudes(Array(block.prefix(2048)))
        let centroid = EmotionEngine.spectralCentroid(mags, sampleRate: sampleRate, fftSize: 2048)

        let t = Date().timeIntervalSince(epoch) * 1000
        let frame = EmotionEngine.Frame(
            energy: energy, pitch: pitch, centroid: centroid,
            voiced: pitch > 0 && energy > EmotionEngine.voiceEnergyFloor, t: t)

        lock.lock()
        frames.append(frame)
        let cutoff = t - keepMs
        if let first = frames.first, first.t < cutoff {
            frames.removeAll { $0.t < cutoff }
        }
        lock.unlock()
    }

    /// Cópia dos últimos `lastMs` de features, com o tempo rebaseado em zero.
    func snapshot(lastMs: Double) -> [EmotionEngine.Frame] {
        lock.lock(); defer { lock.unlock() }
        guard let last = frames.last else { return [] }
        let cutoff = last.t - lastMs
        let cut = frames.filter { $0.t >= cutoff }
        guard let t0 = cut.first?.t else { return [] }
        return cut.map { f in
            var g = f; g.t = f.t - t0; return g
        }
    }
}
