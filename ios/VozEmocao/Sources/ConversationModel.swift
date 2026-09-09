import Foundation
import AVFoundation
import Speech
import Combine

/// Orquestra os dois modos do app:
///  1. ESCUTA (app aberto): reconhece fala e procura palavras-gatilho de
///     negócio. Ao achar uma, dispara o pop-up perguntando se deve gravar.
///  2. GRAVAÇÃO: captura o áudio, extrai as features de prosódia quadro a
///     quadro e, ao parar, resume a emoção da conversa.
///
/// Observação de plataforma: no iOS a escuta só ocorre com o app ativo — o
/// sistema não permite microfone contínuo em segundo plano com a tela travada.
@MainActor
final class ConversationModel: NSObject, ObservableObject {

    /// Instância única, usada também pela Siri (App Intents) e pelas ações da
    /// notificação para iniciar escuta/gravação.
    static let shared = ConversationModel()

    enum Mode { case idle, listening, recording }

    @Published var mode: Mode = .idle
    @Published var statusText: String = "Toque em Ouvir e fale como você fala no dia a dia"
    @Published var showRecordPrompt: Bool = false
    @Published var triggeredKeyword: String = ""
    /// Camada do rol que disparou (A–E) e, se emocional, o tom — vai para o dataset.
    @Published var triggeredCamada: BusinessKeywords.Camada?
    @Published var triggeredTom: BusinessKeywords.Tom?

    // Medidores ao vivo (0...1)
    @Published var liveEnergy: Double = 0
    @Published var livePitch: Double = 0
    @Published var liveExpr: Double = 0
    @Published var liveEmotion: String = "—"
    @Published var elapsed: TimeInterval = 0

    // Resultado
    @Published var lastSummary: EmotionEngine.Summary?
    @Published var lastTimeline: [EmotionEngine.TimelineSegment] = []
    @Published var lastInsights: [String] = []
    @Published var lastRecordingURL: URL?

    private let audioEngine = AVAudioEngine()
    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "pt-BR"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?

    private var detector = GatilhoDetector(rol: BusinessKeywords.rol(custom: []))

    private var session: RecordingSession?
    private var recentPitches = [Float]()
    private var timer: Timer?

    override init() {
        super.init()
        reloadKeywords()
    }

    func reloadKeywords() {
        let custom = UserSettings.customKeywords
        detector = GatilhoDetector(rol: BusinessKeywords.rol(custom: custom))
    }

    // MARK: - Permissões

    func requestPermissions(_ completion: @escaping (Bool) -> Void) {
        SFSpeechRecognizer.requestAuthorization { speechAuth in
            AVAudioSession.sharedInstance().requestRecordPermission { micAuth in
                DispatchQueue.main.async {
                    completion(speechAuth == .authorized && micAuth)
                }
            }
        }
    }

    // MARK: - Modo escuta

    func startListening() {
        reloadKeywords()
        requestPermissions { [weak self] granted in
            guard let self else { return }
            guard granted else {
                self.statusText = "Permita microfone e reconhecimento de fala nos Ajustes."
                return
            }
            do {
                try self.beginSpeechRecognition()
                self.mode = .listening
                self.statusText = "Ouvindo… pode bloquear a tela: continuo escutando e te aviso por notificação quando surgir um assunto de negócio."
            } catch {
                self.statusText = "Não foi possível iniciar a escuta: \(error.localizedDescription)"
            }
        }
    }

    private func beginSpeechRecognition() throws {
        let session = AVAudioSession.sharedInstance()
        // `.record` silencia toda a reprodução do aparelho enquanto ouvimos.
        // Mesmo arranjo do Diário: grava, deixa os outros tocarem, som no alto-falante.
        try session.setCategory(.playAndRecord, mode: .measurement,
                                options: [.mixWithOthers, .allowBluetooth, .defaultToSpeaker])
        try session.setActive(true, options: .notifyOthersOnDeactivation)

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        // Reconhecimento no próprio aparelho quando disponível: mais privado e
        // sem o limite de duração das sessões enviadas ao servidor da Apple.
        if recognizer?.supportsOnDeviceRecognition == true {
            request.requiresOnDeviceRecognition = true
        }
        recognitionRequest = request

        let input = audioEngine.inputNode
        let format = input.outputFormat(forBus: 0)
        input.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak self] buffer, _ in
            self?.recognitionRequest?.append(buffer)
        }
        audioEngine.prepare()
        try audioEngine.start()

        recognitionTask = recognizer?.recognitionTask(with: request) { [weak self] result, error in
            guard let self else { return }
            if let result = result {
                let text = result.bestTranscription.formattedString
                if let match = self.detector.avaliar(text) {
                    Task { @MainActor in self.handleKeyword(match) }
                }
            }
            if error != nil {
                // reinicia a sessão de reconhecimento (limite de duração do iOS)
                Task { @MainActor in
                    if self.mode == .listening { self.restartRecognition() }
                }
            }
        }
    }

    private func restartRecognition() {
        tearDownAudio()
        detector.reset() // o texto reconhecido recomeça do zero
        try? beginSpeechRecognition()
    }

    @MainActor
    private func handleKeyword(_ match: BusinessKeywords.Match) {
        guard mode == .listening, !showRecordPrompt else { return }
        triggeredKeyword = match.termo
        triggeredCamada = match.camada
        triggeredTom = match.tom
        showRecordPrompt = true
        NotificationScheduler.presentRecordPrompt(keyword: match.termo)
    }

    func stopListening() {
        tearDownAudio()
        mode = .idle
        statusText = "Escuta pausada. Quando quiser, é só tocar em Ouvir."
    }

    // MARK: - Modo gravação

    func confirmRecording() {
        showRecordPrompt = false
        tearDownAudio()
        startRecording()
    }

    func dismissPrompt() {
        showRecordPrompt = false
        // permanece ouvindo
    }

    private func startRecording() {
        recentPitches.removeAll()

        do {
            let audioSession = AVAudioSession.sharedInstance()
            try audioSession.setCategory(.playAndRecord, mode: .measurement,
                                         options: [.mixWithOthers, .allowBluetooth, .defaultToSpeaker])
            try audioSession.setActive(true)

            let input = audioEngine.inputNode
            let format = input.outputFormat(forBus: 0)
            let sampleRate = Float(format.sampleRate)

            // Toda a captura/análise vive fora do main actor (ver RecordingSession).
            let recording = try RecordingSession(format: format)
            session = recording
            lastRecordingURL = recording.url

            input.installTap(onBus: 0, bufferSize: 2048, format: format) { [weak self] buffer, _ in
                guard let frame = recording.process(buffer, sampleRate: sampleRate) else { return }
                Task { @MainActor in self?.updateLive(frame) }
            }
            audioEngine.prepare()
            try audioEngine.start()

            mode = .recording
            statusText = "Gravando… estou ouvindo você"
            startTimer()
        } catch {
            statusText = "Erro ao gravar: \(error.localizedDescription)"
            mode = .idle
        }
    }

    @MainActor
    private func updateLive(_ f: EmotionEngine.Frame) {
        liveEnergy = liveEnergy * 0.8 + Double(min(f.energy / 0.22, 1)) * 0.2
        if f.voiced {
            livePitch = Double(min(max((f.pitch - 90) / 170, 0), 1))
            recentPitches.append(f.pitch)
            if recentPitches.count > 40 { recentPitches.removeFirst() }
        }
        if recentPitches.count > 4 {
            let m = recentPitches.reduce(0, +) / Float(recentPitches.count)
            let std = sqrt(recentPitches.map { ($0 - m) * ($0 - m) }.reduce(0, +) / Float(recentPitches.count))
            liveExpr = Double(min(max((std - 8) / 62, 0), 1))
            let emo = EmotionEngine.classify(energy: Float(liveEnergy * 100),
                                             valence: Float((livePitch * 0.5 + liveExpr * 0.5) * 100),
                                             expr: Float(liveExpr * 100))
            liveEmotion = "\(emo.emoji)  \(emo.label)"
        }
    }

    func stopRecording() {
        timer?.invalidate()
        tearDownAudio()
        mode = .idle

        let frames = session?.finish() ?? []
        session = nil

        let summary = EmotionEngine.summarize(frames)
        lastSummary = summary
        lastTimeline = EmotionEngine.timeline(frames)
        lastInsights = EmotionEngine.insights(summary)
        statusText = summary != nil ? "Pronto — veja como você soou." : "Não captei fala suficiente para ler."

        if let summary = summary {
            History.add(summary: summary, timeline: lastTimeline, durationMs: frames.last?.t ?? 0)
        }
    }

    // MARK: - Infra

    private func startTimer() {
        elapsed = 0
        timer?.invalidate()
        let start = Date()
        timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.elapsed = Date().timeIntervalSince(start) }
        }
    }

    private func tearDownAudio() {
        if audioEngine.isRunning {
            audioEngine.stop()
        }
        audioEngine.inputNode.removeTap(onBus: 0)
        recognitionRequest?.endAudio()
        recognitionTask?.cancel()
        recognitionRequest = nil
        recognitionTask = nil
    }
}
