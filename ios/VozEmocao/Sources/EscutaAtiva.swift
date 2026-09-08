import Foundation
import AVFoundation
import Speech
import NaturalLanguage

/// O ouvido da Escuta Ativa.
///
/// Recebe os mesmos buffers do microfone que o Diário já abriu (um só tap —
/// dois taps no mesmo mic foi a disputa que já nos custou um commit), passa o
/// texto reconhecido pelo `GatilhoDetector` e avisa quando o rol dispara.
///
/// O iOS encerra sessões longas de reconhecimento; esta classe reabre sozinha
/// e zera o detector a cada reinício, porque o texto recomeça do zero.
///
/// Privacidade: o texto reconhecido vive só aqui e no callback. O que sai para
/// o dataset é o **sentimento calculado** e os **termos que dispararam** —
/// nunca a transcrição (um minuto de reunião carrega a fala de terceiros).
final class EscutaAtiva {

    /// Disparou: o match e o texto recente (para o canal verbal; morre no callback).
    var onGatilho: ((BusinessKeywords.Match, String) -> Void)?

    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "pt-BR"))
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?
    private let detector: GatilhoDetector
    private var ativa = false
    private var reinicios = 0

    init(custom: [String]) {
        detector = GatilhoDetector(rol: BusinessKeywords.rol(custom: custom))
    }

    var disponivel: Bool { recognizer?.isAvailable ?? false }

    func iniciar() {
        guard !ativa else { return }
        ativa = true
        reinicios = 0
        novaSessao()
    }

    func parar() {
        ativa = false
        task?.cancel(); task = nil
        request?.endAudio(); request = nil
    }

    /// Chamado na thread de áudio, a cada buffer do tap do Diário.
    func alimentar(_ buffer: AVAudioPCMBuffer) {
        request?.append(buffer)
    }

    private func novaSessao() {
        guard ativa, let rec = recognizer, rec.isAvailable else { return }
        let req = SFSpeechAudioBufferRecognitionRequest()
        req.shouldReportPartialResults = true
        // No aparelho quando der: mais privado e sem o limite de duração das
        // sessões enviadas ao servidor da Apple.
        if rec.supportsOnDeviceRecognition { req.requiresOnDeviceRecognition = true }
        request = req
        detector.reset()

        task = rec.recognitionTask(with: req) { [weak self] result, error in
            guard let self, self.ativa else { return }
            if let r = result {
                let texto = r.bestTranscription.formattedString
                if let m = self.detector.avaliar(texto) {
                    self.onGatilho?(m, String(texto.suffix(800)))
                }
            }
            if error != nil || (result?.isFinal ?? false) {
                // Sessão encerrada pelo sistema (limite de duração, silêncio).
                // Reabrir com folga crescente para nunca virar laço apertado.
                self.reinicios += 1
                let espera = min(Double(self.reinicios), 10)
                DispatchQueue.main.asyncAfter(deadline: .now() + espera) { [weak self] in
                    self?.novaSessao()
                }
            } else {
                self.reinicios = 0
            }
        }
    }

    // MARK: - Canal verbal (o degrau 2 da escada: texto + tom)

    /// Sentimento do texto, calculado no aparelho (NaturalLanguage): −1 … +1.
    /// `nil` quando o sistema não tem modelo para o idioma — registrar nil é
    /// mais honesto do que registrar zero.
    static func sentimento(_ texto: String) -> Double? {
        let limpo = texto.trimmingCharacters(in: .whitespacesAndNewlines)
        guard limpo.count > 20 else { return nil }
        let tagger = NLTagger(tagSchemes: [.sentimentScore])
        tagger.string = limpo
        let (tag, _) = tagger.tag(at: limpo.startIndex, unit: .paragraph, scheme: .sentimentScore)
        return tag.flatMap { Double($0.rawValue) }
    }

    /// Quais termos do rol apareceram no texto — só os termos, nunca o texto.
    static func termosPresentes(_ texto: String, custom: [String]) -> [String] {
        let rol = BusinessKeywords.rol(custom: custom)
        let n = BusinessKeywords.normalize(texto)
        var achados = rol.frases.filter { n.contains($0.0) }.map(\.0)
        let tokens = Set(n.split { !$0.isLetter && !$0.isNumber }.map(String.init))
        achados += rol.palavras.keys.filter { tokens.contains($0) }
        return Array(Set(achados)).sorted()
    }
}
