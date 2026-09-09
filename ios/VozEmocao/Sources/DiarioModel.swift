import Foundation
import AVFoundation
import Combine
import Speech
import UserNotifications

/// Diário de Voz AUTOMÁTICO — o dia inteiro com um toque.
///
/// O pedido do Helio: "quero que meu celular me ouça sem eu fazer nenhum
/// passo". Este é o máximo que o iOS permite a um app legítimo, e é muito:
/// ligado de manhã, o app mantém o microfone aberto (modo de áudio em segundo
/// plano) e captura ~60s de FEATURES em cada momento — o áudio nunca é
/// escrito em disco. A pessoa só é chamada para o único passo que não pode
/// ser automatizado: dizer como se sentia. Esse passo É o dado (ground truth).
///
/// Dois gatilhos, um microfone:
///  · **Escuta Ativa** (2026-09, o centro): o reconhecedor de fala roda no
///    mesmo tap e o rol em camadas (`BusinessKeywords`) dispara quando surge
///    fala que importa. 30s antes + 30s depois viram um momento que fica **em
///    RAM** até a pessoa responder "Posso registrar?" — "não" apaga, sem
///    resposta em 2h apaga, "sim" grava e abre a folha de rótulo. Dois toques.
///  · **Sorteio** (opcional): horários aleatórios no dia, como antes. Ficou
///    fora do centro porque sorteia hora, não fala — a maioria caía em silêncio.
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
        var origem = "diario"          // "diario" (sorteio) | "escuta" (gatilho) — nunca misturar as distribuições
        var chamado = "automatico"     // "automatico" (sorteio) | "gatilho" (rol)
        let fonte = "voz"
        let origemRotulo = "humano"
        var qualidade: String?         // "limpa" | "mista" — quem falou?
        var contexto: Contexto?
        var relatado: Relatado?        // nil enquanto não rotulado
        var observado: Observado
        var inferido: Inferido
        var gatilho: Gatilho?          // o que acordou a Escuta Ativa
        var verbal: Verbal?            // canal verbal: sentimento + termos, nunca o texto

        var rotulado: Bool { relatado != nil }
    }

    struct Gatilho: Codable { var termo: String; var camada: String; var tom: String? }
    struct Verbal: Codable { var sentimento: Double?; var termos: [String]; var disponivel: Bool }

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
    /// Escuta Ativa: quantas vezes o rol acordou hoje, e o momento que espera
    /// o "Posso registrar?" — vive só em RAM até o sim.
    @Published var gatilhosHoje = 0
    @Published var aguardando: Momento?
    @Published var escutaAtiva = false
    /// Sorteio de horários além dos gatilhos (opcional; padrão desligado).
    @Published var sorteioLigado: Bool = UserDefaults.standard.bool(forKey: "diario.sorteio") {
        didSet { UserDefaults.standard.set(sorteioLigado, forKey: "diario.sorteio") }
    }
    /// Notificação de rótulo tocada → a UI navega para o Diário sozinha.
    /// (`abrirPedido` guia a navegação e precisa ficar true enquanto a tela
    /// está aberta; `querRotular` é consumido pela tela para abrir a folha.)
    @Published var abrirPedido = false
    var querRotular = false

    // MARK: - Captura

    private let audioEngine = AVAudioEngine()
    private let buffer = RollingFrameBuffer(keepMs: 65_000)
    private var checkTimer: Timer?
    private var pendentes: [Date] = []
    private var escuta: EscutaAtiva?
    private var capturaAgendada = false
    private var ultimoGatilho: Date = .distantPast
    /// Entre dois momentos por gatilho: dezenas por dia, não um por minuto.
    private let gapGatilho: TimeInterval = 4 * 60
    /// Sem resposta ao "Posso registrar?", o momento morre — frescor é o dado.
    private let validadeConsentimento: TimeInterval = 2 * 60 * 60

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
                    self.sortear(janelaHoras: janelaHoras, vezes: self.sorteioLigado ? vezes : 0)
                    self.estado = .ouvindo
                    self.capturados = 0
                    self.gatilhosHoje = 0
                    self.armarVigia()
                    self.ligarEscutaAtiva()
                } catch {
                    self.statusText = "Não consegui ligar o microfone: \(error.localizedDescription)"
                }
            }
        }
    }

    func encerrarDia() {
        checkTimer?.invalidate(); checkTimer = nil
        escuta?.parar(); escuta = nil; escutaAtiva = false
        aguardando = nil; capturaAgendada = false
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
        // `.defaultToSpeaker`: sem isto, `.playAndRecord` manda TODO o som do
        // aparelho para o alto-falante do ouvido (o de ligação) — o "alto-falante
        // parou de funcionar" que o Helio viu em 2026-09-09.
        try session.setCategory(.playAndRecord, mode: .measurement,
                                options: [.mixWithOthers, .allowBluetoothHFP, .defaultToSpeaker])
        try session.setActive(true)
        observarInterrupcoes()

        let input = audioEngine.inputNode
        let format = input.outputFormat(forBus: 0)
        let sampleRate = Float(format.sampleRate)
        let buffer = self.buffer

        input.installTap(onBus: 0, bufferSize: 2048, format: format) { [weak self] pcm, _ in
            buffer.ingest(pcm, sampleRate: sampleRate)
            self?.escuta?.alimentar(pcm)   // o mesmo buffer alimenta o reconhecedor
        }
        audioEngine.prepare()
        try audioEngine.start()
    }

    // MARK: - Interrupções (ligação, Siri, alarme) e trocas de rota

    private var observandoInterrupcoes = false

    /// Uma ligação toma o microfone; quando termina, o iOS nos devolve — mas
    /// o engine não volta sozinho. Sem isto, a escuta morria em silêncio na
    /// primeira ligação do dia.
    private func observarInterrupcoes() {
        guard !observandoInterrupcoes else { return }
        observandoInterrupcoes = true
        let nc = NotificationCenter.default
        nc.addObserver(forName: AVAudioSession.interruptionNotification, object: nil, queue: .main) { n in
            let raw = n.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt
            Task { @MainActor [weak self] in
                guard let self, self.estado == .ouvindo,
                      let raw, let tipo = AVAudioSession.InterruptionType(rawValue: raw) else { return }
                switch tipo {
                case .began:
                    self.statusText = "Pausado por uma ligação ou outro app. Volto sozinho quando acabar."
                case .ended:
                    self.retomarDepoisDeInterrupcao()
                @unknown default: break
                }
            }
        }
        nc.addObserver(forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main) { n in
            let raw = n.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt
            Task { @MainActor [weak self] in
                guard let self, self.estado == .ouvindo,
                      let raw, let motivo = AVAudioSession.RouteChangeReason(rawValue: raw) else { return }
                // Fone entrou ou saiu: o engine precisa reabrir com o formato novo.
                if motivo == .newDeviceAvailable || motivo == .oldDeviceUnavailable {
                    self.retomarDepoisDeInterrupcao()
                }
            }
        }
    }

    private func retomarDepoisDeInterrupcao() {
        // Pequena folga: o sistema ainda está devolvendo a sessão de áudio.
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) { [weak self] in
            guard let self, self.estado == .ouvindo else { return }
            if self.audioEngine.isRunning { self.audioEngine.stop() }
            self.audioEngine.inputNode.removeTap(onBus: 0)
            do {
                try self.ligarMicrofone()
                self.escuta?.parar(); self.escuta = nil
                self.ligarEscutaAtiva()
                self.statusText = "De volta. Ouvindo o seu dia."
            } catch {
                self.statusText = "Não consegui retomar o microfone: \(error.localizedDescription). Toque em Encerrar e Começar de novo."
            }
        }
    }

    // MARK: - Escuta Ativa (o centro)

    private func ligarEscutaAtiva() {
        SFSpeechRecognizer.requestAuthorization { [weak self] auth in
            Task { @MainActor in
                guard let self, self.estado == .ouvindo else { return }
                guard auth == .authorized else {
                    self.escutaAtiva = false
                    self.statusText = self.sorteioLigado
                        ? "Sem reconhecimento de fala (Ajustes → Voice&Emotion). Sigo só com o sorteio."
                        : "Preciso do reconhecimento de fala para a Escuta Ativa. Ajustes → Voice&Emotion → Reconhecimento de Fala."
                    return
                }
                let e = EscutaAtiva(custom: UserSettings.customKeywords)
                e.onGatilho = { [weak self] match, texto in
                    Task { @MainActor in self?.gatilhou(match, textoRecente: texto) }
                }
                self.escuta = e
                e.iniciar()
                self.escutaAtiva = e.disponivel
                self.statusText = e.disponivel
                    ? "Ouvindo o seu dia. Quando surgir assunto que importa, eu leio o momento e te pergunto se posso registrar."
                    : "Reconhecimento de fala indisponível agora (sem modelo pt-BR no aparelho?). Sigo ouvindo; tento de novo sozinho."
            }
        }
    }

    /// O rol acordou. Espera 30s (para ter o depois, não só o antes) e captura.
    private func gatilhou(_ match: BusinessKeywords.Match, textoRecente: String) {
        guard estado == .ouvindo, !capturaAgendada, aguardando == nil else { return }
        guard Date().timeIntervalSince(ultimoGatilho) >= gapGatilho else { return }
        ultimoGatilho = Date()
        gatilhosHoje += 1
        capturaAgendada = true
        // O canal verbal é calculado AGORA e o texto morre aqui.
        let verbal = Verbal(
            sentimento: EscutaAtiva.sentimento(textoRecente),
            termos: EscutaAtiva.termosPresentes(textoRecente, custom: UserSettings.customKeywords),
            disponivel: true)
        statusText = "Ouvi \"\(match.termo)\". Lendo o próximo meio minuto…"
        DispatchQueue.main.asyncAfter(deadline: .now() + 30) { [weak self] in
            self?.capturarGatilho(match, verbal: verbal)
        }
    }

    private func capturarGatilho(_ match: BusinessKeywords.Match, verbal: Verbal) {
        capturaAgendada = false
        guard estado == .ouvindo else { return }
        guard let m = montarMomento(prefixo: "escuta", janelaMs: 60_000) else {
            // Gatilho em fala que não durou: não registra, não incomoda.
            statusText = "Ouvindo o seu dia."
            return
        }
        var momento = m
        momento.origem = "escuta"
        momento.chamado = "gatilho"
        momento.gatilho = Gatilho(termo: match.termo, camada: match.camada.rawValue, tom: match.tom?.rawValue)
        momento.verbal = verbal
        aguardando = momento               // só RAM até o "sim"
        statusText = "Posso registrar esse momento? Responda na notificação — ou aqui."
        NotificationScheduler.presentConsentimento(termo: match.termo, id: momento.id)
    }

    /// A resposta ao "Posso registrar?". Não = o momento nunca existiu.
    func consentir(_ sim: Bool) {
        guard let m = aguardando else { return }
        aguardando = nil
        guard sim else {
            statusText = "Apagado. Sigo ouvindo."
            return
        }
        momentos.insert(m, at: 0)
        capturados += 1
        salvar()
        querRotular = true
        abrirPedido = true
        statusText = "Registrado. Falta só marcar como você estava."
    }

    // MARK: - Sorteio (mesmas regras do diário web)

    private func sortear(janelaHoras: ClosedRange<Int>, vezes: Int) {
        guard vezes > 0 else { pendentes = []; horarios = []; return }
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
        if let a = aguardando, agora.timeIntervalSince(a.data) > validadeConsentimento {
            aguardando = nil   // sem resposta: o frescor foi embora, o momento vai junto
            statusText = "Ouvindo o seu dia."
        }
        guard let idx = pendentes.firstIndex(where: { $0 <= agora }) else { return }
        pendentes.remove(at: idx)
        capturar()
        if pendentes.isEmpty {
            statusText = "Último momento do dia capturado. Quando quiser, encerre o dia."
        }
    }

    // MARK: - Captura de um momento

    private func capturar() {
        guard let m = montarMomento(prefixo: "diario-auto", janelaMs: 30_000) else {
            // Silêncio no momento sorteado (telefone longe, ninguém falando).
            // Registrar nada é melhor que registrar lixo — mas avisar, porque
            // amostra perdida em silêncio é o pior tipo de perda.
            NotificationScheduler.presentDiario(
                titulo: "Momento sorteado sem fala",
                corpo: "Não ouvi você por perto agora. Se quiser, abra e grave este momento manualmente.")
            return
        }
        momentos.insert(m, at: 0)
        capturados += 1
        salvar()

        NotificationScheduler.presentDiario(
            titulo: "Como você está agora?",
            corpo: "Acabei de ler um momento do seu dia. Toque e marque como você se sente — 10 segundos.")
    }

    /// Lê os últimos `janelaMs` do buffer e monta um momento ainda sem rótulo.
    /// `nil` quando não houve fala suficiente — o motor não resume silêncio.
    private func montarMomento(prefixo: String, janelaMs: Double) -> Momento? {
        let frames = buffer.snapshot(lastMs: janelaMs)
        guard let s = EmotionEngine.summarize(frames) else { return nil }
        return Momento(
            id: "\(prefixo)-\(Int(Date().timeIntervalSince1970))",
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
