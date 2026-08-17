import Foundation
import AVFoundation

/// Captura e analisa o áudio **fora do main actor**.
///
/// O tap do `AVAudioEngine` roda numa thread de áudio em tempo real. Tudo o que
/// ele toca (arquivo, quadros, FFT, marco de tempo) precisa viver aqui — e não
/// no `ConversationModel`, que é `@MainActor`. Isso evita corrida de dados e o
/// aviso "Main actor-isolated property can not be referenced from a Sendable
/// closure".
final class RecordingSession: @unchecked Sendable {

    /// Arquivo gerado, para playback e compartilhamento.
    let url: URL

    private let analyzer = AudioAnalyzer(fftSize: 2048)
    private let startTime = Date()
    private let lock = NSLock()

    // Protegidos por `lock`.
    private var audioFile: AVAudioFile?
    private var frames = [EmotionEngine.Frame]()

    init(format: AVAudioFormat) throws {
        url = FileManager.default.temporaryDirectory
            .appendingPathComponent("conversa-\(Int(Date().timeIntervalSince1970)).caf")
        audioFile = try AVAudioFile(forWriting: url, settings: format.settings)
    }

    /// Processa um bloco vindo da thread de áudio e devolve o quadro medido,
    /// para a UI atualizar os medidores ao vivo.
    func process(_ buffer: AVAudioPCMBuffer, sampleRate: Float) -> EmotionEngine.Frame? {
        guard let channel = buffer.floatChannelData?[0] else { return nil }
        let samples = Array(UnsafeBufferPointer(start: channel, count: Int(buffer.frameLength)))

        let energy = EmotionEngine.rms(samples)
        let pitch = EmotionEngine.detectPitch(samples, sampleRate: sampleRate)

        var block = samples
        if block.count < 2048 {
            block.append(contentsOf: [Float](repeating: 0, count: 2048 - block.count))
        }
        let mags = analyzer.magnitudes(Array(block.prefix(2048)))
        let centroid = EmotionEngine.spectralCentroid(mags, sampleRate: sampleRate, fftSize: 2048)

        let frame = EmotionEngine.Frame(
            energy: energy,
            pitch: pitch,
            centroid: centroid,
            voiced: pitch > 0 && energy > EmotionEngine.voiceEnergyFloor,
            t: Date().timeIntervalSince(startTime) * 1000
        )

        lock.lock()
        try? audioFile?.write(from: buffer)
        frames.append(frame)
        lock.unlock()

        return frame
    }

    /// Encerra a gravação e devolve todos os quadros capturados.
    func finish() -> [EmotionEngine.Frame] {
        lock.lock()
        defer { lock.unlock() }
        audioFile = nil
        return frames
    }
}
