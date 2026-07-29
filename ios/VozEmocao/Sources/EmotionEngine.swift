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

    /// Detecção de pitch por autocorrelação. Retorna F0 em Hz, ou -1.
    static func detectPitch(_ samples: [Float], sampleRate: Float) -> Float {
        let energy = rms(samples)
        if energy < 0.008 { return -1 }

        let size = samples.count
        let minOffset = Int(sampleRate / 500)   // 500 Hz
        let maxOffset = min(Int(sampleRate / 70), size - 1) // 70 Hz
        guard maxOffset > minOffset else { return -1 }

        var bestOffset = -1
        var bestCorr: Float = 0
        var lastCorr: Float = 1
        var foundGood = false

        var offset = minOffset
        while offset <= maxOffset {
            var corr: Float = 0
            let n = size - offset
            vDSP_dotpr(samples, 1, Array(samples[offset...]), 1, &corr, vDSP_Length(n))
            corr /= Float(n)

            if corr > 0.9 * bestCorr && corr > lastCorr {
                foundGood = true
                if corr > bestCorr { bestCorr = corr; bestOffset = offset }
            } else if foundGood && corr < lastCorr {
                break
            }
            lastCorr = corr
            offset += 1
        }

        if bestOffset > 0 && bestCorr > 0.01 {
            return sampleRate / Float(bestOffset)
        }
        return -1
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

    static func insights(_ s: Summary?) -> [String] {
        guard let s = s else {
            return ["Não houve fala suficiente para analisar. Fale mais perto do microfone."]
        }
        var tips = [String]()

        if s.expressiveness < 30 {
            tips.append("🎵 Sua voz ficou bastante monótona. Varie mais a entonação para prender a atenção.")
        } else if s.expressiveness > 70 {
            tips.append("🎵 Ótima variação de entonação — sua fala soa expressiva e envolvente.")
        }
        if s.energy < 30 {
            tips.append("🔊 A energia da voz esteve baixa. Projete mais o som para passar confiança.")
        } else if s.energy > 80 {
            tips.append("🔊 Energia bem alta. Cuidado para não soar agressivo — alterne com momentos calmos.")
        }
        if s.silenceRatio > 45 {
            tips.append("⏸️ Muitas pausas (\(s.silenceRatio)%). Em excesso passam hesitação.")
        } else if s.silenceRatio < 12 {
            tips.append("⏸️ Quase não houve pausas. Pausas estratégicas ajudam o ouvinte a absorver os pontos-chave.")
        }
        if s.valence < 40 {
            tips.append("💬 O tom soou mais neutro/sério. Para acolher o cliente, experimente um tom mais caloroso.")
        } else if s.valence > 65 {
            tips.append("💬 Tom caloroso e positivo — excelente para criar conexão.")
        }
        tips.append("📊 Predominância: \(s.dominant.label) \(s.dominant.emoji) (energia \(s.energy), positividade \(s.valence), expressividade \(s.expressiveness)).")
        return tips
    }
}
