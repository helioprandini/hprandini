import Foundation
import Accelerate

/// Motor de análise emocional baseado em prosódia.
///
/// Mede, por quadro de áudio, os correlatos acústicos da emoção na fala:
///  - Energia (RMS) .......... excitação / arousal
///  - Altura da voz (F0) ..... tensão / animação (autocorrelação)
///  - Variação do pitch ...... expressividade vs. monotonia
///  - Brilho espectral ....... esforço / tensão vocal
///  - Pausas ................. hesitação vs. fluência
///
/// É uma ESTIMATIVA de treino de tom, não um diagnóstico.
enum EmotionEngine {

    struct Frame {
        var energy: Float
        var pitch: Float      // Hz; -1 se sem voz
        var centroid: Float   // Hz
        var voiced: Bool
        var t: Double         // ms desde o início
    }

    struct Emotion {
        let key: String
        let label: String
        let emoji: String
        let colorHex: String
    }

    struct Summary {
        var energy: Int
        var valence: Int
        var expressiveness: Int
        var flow: Int
        var meanPitch: Int
        var pitchStd: Int
        var silenceRatio: Int
        var dominant: Emotion
    }

    // MARK: - Features de um quadro

    static func rms(_ samples: [Float]) -> Float {
        guard !samples.isEmpty else { return 0 }
        var result: Float = 0
        vDSP_rmsqv(samples, 1, &result, vDSP_Length(samples.count))
        return result
    }

    /// Detecção de pitch por autocorrelação **normalizada**. Retorna F0 em Hz,
    /// ou -1 quando não há voz clara.
    ///
    /// A normalização por potência é essencial: a autocorrelação bruta escala
    /// com o quadrado da amplitude, então um limiar fixo sobre ela só aceitaria
    /// voz alta ou muito perto do microfone. Normalizada, a medida fica em 0..1
    /// e o limiar passa a significar "quão periódico é o sinal", independente
    /// do volume. (Espelha `js/emotion.js`; validado em
    /// `research/benchmark/engine-validation.js`.)
    static func detectPitch(_ samples: [Float], sampleRate: Float) -> Float {
        let energy = rms(samples)
        if energy < 0.008 { return -1 }

        let power = energy * energy      // = autocorrelação em offset 0
        guard power > 0 else { return -1 }

        let size = samples.count
        let minOffset = Int(sampleRate / 500)                // 500 Hz
        let maxOffset = min(Int(sampleRate / 70), size - 1)  // 70 Hz
        guard maxOffset > minOffset + 1 else { return -1 }

        // Autocorrelação normalizada em toda a faixa
        var corr = [Float](repeating: 0, count: maxOffset + 1)
        var peak: Float = 0
        for offset in minOffset...maxOffset {
            var sum: Float = 0
            let n = size - offset
            samples.withUnsafeBufferPointer { buf in
                vDSP_dotpr(buf.baseAddress!, 1,
                           buf.baseAddress! + offset, 1,
                           &sum, vDSP_Length(n))
            }
            let c = sum / Float(n) / power
            corr[offset] = c
            if c > peak { peak = c }
        }

        // Abaixo disto o sinal não é periódico o bastante para ser voz.
        let voicingThreshold: Float = 0.3
        guard peak >= voicingThreshold else { return -1 }

        // Primeiro pico próximo do máximo (não o máximo global): r(2T) é quase
        // tão alto quanto r(T), e pegar o global erraria uma oitava abaixo.
        var bestOffset = -1
        for offset in (minOffset + 1)..<maxOffset {
            if corr[offset] >= 0.85 * peak,
               corr[offset] > corr[offset - 1],
               corr[offset] >= corr[offset + 1] {
                bestOffset = offset
                break
            }
        }
        guard bestOffset > 0 else { return -1 }

        // Interpolação parabólica: o período verdadeiro raramente cai exatamente
        // sobre uma amostra. Reduz bastante o erro de F0.
        let y0 = corr[bestOffset - 1], y1 = corr[bestOffset], y2 = corr[bestOffset + 1]
        let denom = 2 * (2 * y1 - y0 - y2)
        let shift = denom != 0 ? (y2 - y0) / denom : 0
        let period = Float(bestOffset) + (abs(shift) < 1 ? shift : 0)

        return period > 0 ? sampleRate / period : -1
    }

    /// Centroide espectral (brilho) a partir das magnitudes do espectro.
    static func spectralCentroid(_ magnitudes: [Float], sampleRate: Float, fftSize: Int) -> Float {
        var weighted: Float = 0
        var total: Float = 0
        for (i, mag) in magnitudes.enumerated() {
            weighted += Float(i) * mag
            total += mag
        }
        guard total > 0 else { return 0 }
        let binHz = sampleRate / Float(fftSize)
        return (weighted / total) * binHz
    }

    // MARK: - Normalizações

    private static func clamp(_ v: Float, _ a: Float, _ b: Float) -> Float { max(a, min(b, v)) }
    private static func norm(_ v: Float, _ min: Float, _ max: Float) -> Float {
        clamp((v - min) / (max - min) * 100, 0, 100)
    }

    // MARK: - Classificação

    static func classify(energy: Float, valence: Float, expr: Float) -> Emotion {
        if energy < 22 && expr < 30 {
            return Emotion(key: "monotono", label: "Monótono", emoji: "😐", colorHex: "#9AA2C9")
        }
        if energy < 30 {
            return valence >= 50
                ? Emotion(key: "calmo", label: "Calmo / Sereno", emoji: "🙂", colorHex: "#63D471")
                : Emotion(key: "desanimado", label: "Desanimado", emoji: "😔", colorHex: "#6C8BFF")
        }
        if energy >= 68 && expr >= 55 && valence >= 55 {
            return Emotion(key: "entusiasmado", label: "Entusiasmado", emoji: "🤩", colorHex: "#FFD166")
        }
        if energy >= 60 && valence < 45 {
            return Emotion(key: "tenso", label: "Tenso / Nervoso", emoji: "😧", colorHex: "#FF5470")
        }
        if energy >= 55 && expr >= 45 {
            return Emotion(key: "animado", label: "Animado / Envolvente", emoji: "😃", colorHex: "#FF7A59")
        }
        if valence >= 55 && expr >= 40 {
            return Emotion(key: "amigavel", label: "Amigável / Caloroso", emoji: "😊", colorHex: "#4FD1C5")
        }
        return Emotion(key: "assertivo", label: "Assertivo / Confiante", emoji: "😎", colorHex: "#B085FF")
    }

    // MARK: - Agregação

    static func summarize(_ frames: [Frame]) -> Summary? {
        let voiced = frames.filter { $0.voiced }
        let total = Float(max(frames.count, 1))
        guard voiced.count >= 3 else { return nil }

        let pitches = voiced.map { $0.pitch }
        let energies = voiced.map { $0.energy }
        let centroids = voiced.map { $0.centroid }

        func mean(_ a: [Float]) -> Float { a.reduce(0, +) / Float(a.count) }
        func std(_ a: [Float], _ m: Float) -> Float {
            sqrt(mean(a.map { ($0 - m) * ($0 - m) }))
        }

        let meanPitch = mean(pitches)
        let pitchStd = std(pitches, meanPitch)
        let meanEnergy = mean(energies)
        let meanCentroid = mean(centroids)
        let silenceRatio = 1 - Float(voiced.count) / total

        let energyDim = norm(meanEnergy, 0.02, 0.22)
        let exprDim = norm(pitchStd, 8, 70)
        let pitchLevel = norm(meanPitch, 90, 260)
        let brightness = norm(meanCentroid, 900, 3200)
        let tensionPenalty = clamp(brightness - 60, 0, 40)
        let valenceDim = clamp(0.5 * pitchLevel + 0.4 * exprDim + 0.1 * (100 - tensionPenalty * 2), 0, 100)
        let flowDim = clamp((1 - silenceRatio) * 100, 0, 100)

        let dominant = classify(energy: energyDim, valence: valenceDim, expr: exprDim)

        return Summary(
            energy: Int(energyDim.rounded()),
            valence: Int(valenceDim.rounded()),
            expressiveness: Int(exprDim.rounded()),
            flow: Int(flowDim.rounded()),
            meanPitch: Int(meanPitch.rounded()),
            pitchStd: Int(pitchStd.rounded()),
            silenceRatio: Int((silenceRatio * 100).rounded()),
            dominant: dominant
        )
    }

    // MARK: - Linha do tempo (uma emoção por janela ~1.5s)

    struct TimelineSegment {
        var t: Double
        var tEnd: Double
        var energy: Int
        var valence: Int
        var expressiveness: Int
        var emotion: Emotion
    }

    static func timeline(_ frames: [Frame], windowMs: Double = 1500) -> [TimelineSegment] {
        guard let first = frames.first else { return [] }
        var out = [TimelineSegment]()
        var bucket = [Frame]()
        var bucketStart = first.t

        func flush(_ endT: Double) {
            let voiced = bucket.filter { $0.voiced }
            if voiced.count >= 2, let sub = summarize(bucket) {
                out.append(TimelineSegment(t: bucketStart, tEnd: endT,
                    energy: sub.energy, valence: sub.valence,
                    expressiveness: sub.expressiveness, emotion: sub.dominant))
            } else {
                out.append(TimelineSegment(t: bucketStart, tEnd: endT,
                    energy: 0, valence: 0, expressiveness: 0,
                    emotion: Emotion(key: "silencio", label: "Silêncio", emoji: "…", colorHex: "#3A3F5C")))
            }
            bucket.removeAll()
        }

        for f in frames {
            if f.t - bucketStart >= windowMs {
                flush(f.t)
                bucketStart = f.t
            }
            bucket.append(f)
        }
        if !bucket.isEmpty { flush(frames.last!.t) }
        return out
    }

    // MARK: - Observações de coaching

    /// Fala com a pessoa, não sobre ela: profissional no conteúdo, humano no
    /// tom. Sem vocabulário preso a um segmento — vale para quem vende, ensina,
    /// lidera ou defende uma ideia. (Espelha `js/emotion.js`.)
    static func insights(_ s: Summary?) -> [String] {
        guard let s = s else {
            return ["Não captei fala suficiente para ler. Tente falar um pouco mais perto do microfone."]
        }
        var tips = [String]()

        if s.expressiveness < 30 {
            tips.append("🎵 Sua entonação variou pouco — a fala soou mais plana. Deixar a voz subir e descer nos pontos que importam ajuda quem ouve a sentir o que você sente.")
        } else if s.expressiveness > 70 {
            tips.append("🎵 Sua entonação variou bastante, e isso é bom: a fala soou viva e fácil de acompanhar.")
        }
        if s.energy < 30 {
            tips.append("🔊 A energia esteve baixa. Um pouco mais de projeção costuma ser lido como convicção — sem precisar falar mais alto o tempo todo.")
        } else if s.energy > 80 {
            tips.append("🔊 A energia esteve bem alta o tempo todo. Intercalar momentos mais calmos dá contraste e evita cansar quem escuta.")
        }
        if s.silenceRatio > 45 {
            tips.append("⏸️ Você fez muitas pausas (\(s.silenceRatio)% do tempo). Pausa é uma ferramenta poderosa — em excesso, porém, pode soar como hesitação.")
        } else if s.silenceRatio < 12 {
            tips.append("⏸️ Você quase não pausou. Um respiro depois de uma ideia importante dá tempo do outro absorver o que você disse.")
        }
        if s.valence < 40 {
            tips.append("💬 O tom soou mais sério e contido. Quando quiser aproximar alguém, um tom mais caloroso costuma abrir a porta.")
        } else if s.valence > 65 {
            tips.append("💬 Seu tom soou caloroso — é o tipo de voz que cria proximidade.")
        }
        tips.append("📊 No conjunto: \(s.dominant.label) \(s.dominant.emoji) · energia \(s.energy) · calor \(s.valence) · expressividade \(s.expressiveness).")
        return tips
    }
}
