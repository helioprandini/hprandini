/*
 * emotion.js — Motor de análise emocional baseado em prosódia.
 *
 * A emoção na fala tem correlatos acústicos bem estudados (Scherer, Juslin & Laukka):
 *   - Energia / volume (RMS)      -> excitação / arousal
 *   - Altura da voz (pitch, F0)   -> tensão / animação
 *   - Variação do pitch           -> expressividade vs. monotonia
 *   - Brilho espectral (centroid) -> tensão / esforço vocal
 *   - Pausas / silêncio           -> hesitação vs. fluência
 *
 * A partir dessas medidas montamos dois eixos ("energia" e "positividade")
 * e classificamos em variantes emocionais. É uma ESTIMATIVA de treino, não
 * um diagnóstico clínico.
 */
const EmotionEngine = (() => {
  "use strict";

  // ---- Extração de features de um frame de áudio ----

  // RMS (energia) do sinal no domínio do tempo. Entrada: Float32Array [-1,1].
  function rms(timeData) {
    let sum = 0;
    for (let i = 0; i < timeData.length; i++) sum += timeData[i] * timeData[i];
    return Math.sqrt(sum / timeData.length);
  }

  // Detecção de pitch por autocorrelação (F0 em Hz). Retorna -1 se não houver
  // voz clara (silêncio ou ruído).
  function detectPitch(timeData, sampleRate) {
    const SIZE = timeData.length;
    const energy = rms(timeData);
    if (energy < 0.008) return -1; // silêncio / muito baixo

    // Autocorrelação
    let bestOffset = -1;
    let bestCorr = 0;
    let lastCorr = 1;
    let foundGoodCorr = false;

    // Faixa útil da voz humana: ~70 Hz a ~500 Hz
    const minOffset = Math.floor(sampleRate / 500);
    const maxOffset = Math.floor(sampleRate / 70);

    for (let offset = minOffset; offset <= maxOffset; offset++) {
      let corr = 0;
      for (let i = 0; i < SIZE - offset; i++) {
        corr += timeData[i] * timeData[i + offset];
      }
      corr /= SIZE - offset;

      if (corr > 0.9 * bestCorr && corr > lastCorr) {
        foundGoodCorr = true;
        if (corr > bestCorr) {
          bestCorr = corr;
          bestOffset = offset;
        }
      } else if (foundGoodCorr && corr < lastCorr) {
        // passou do primeiro pico -> encerra
        break;
      }
      lastCorr = corr;
    }

    if (bestOffset > 0 && bestCorr > 0.01) {
      return sampleRate / bestOffset;
    }
    return -1;
  }

  // Centroide espectral (brilho) a partir do espectro de magnitude (Uint8Array 0-255).
  function spectralCentroid(freqData, sampleRate, fftSize) {
    let weighted = 0;
    let total = 0;
    for (let i = 0; i < freqData.length; i++) {
      const mag = freqData[i];
      weighted += i * mag;
      total += mag;
    }
    if (total === 0) return 0;
    const binHz = sampleRate / fftSize;
    return (weighted / total) * binHz; // Hz médio
  }

  // Analisa um frame e devolve as features cruas.
  function analyzeFrame(timeData, freqData, sampleRate, fftSize) {
    const energy = rms(timeData);
    const pitch = detectPitch(timeData, sampleRate);
    const centroid = spectralCentroid(freqData, sampleRate, fftSize);
    const voiced = pitch > 0 && energy > 0.008;
    return { energy, pitch, centroid, voiced };
  }

  // ---- Normalizações auxiliares (0-100) ----
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const norm = (v, min, max) => clamp(((v - min) / (max - min)) * 100, 0, 100);

  // ---- Classificação de emoção a partir dos eixos ----
  // energy: 0-100 (arousal), valence: 0-100 (positividade), expr: 0-100 (variação de pitch)
  function classify(energy, valence, expr) {
    if (energy < 22 && expr < 30) {
      return { key: "monotono", label: "Monótono", emoji: "😐", color: "#9aa2c9" };
    }
    if (energy < 30) {
      return valence >= 50
        ? { key: "calmo", label: "Calmo / Sereno", emoji: "🙂", color: "#63d471" }
        : { key: "desanimado", label: "Desanimado", emoji: "😔", color: "#6c8bff" };
    }
    if (energy >= 68 && expr >= 55 && valence >= 55) {
      return { key: "entusiasmado", label: "Entusiasmado", emoji: "🤩", color: "#ffd166" };
    }
    if (energy >= 60 && valence < 45) {
      return { key: "tenso", label: "Tenso / Nervoso", emoji: "😧", color: "#ff5470" };
    }
    if (energy >= 55 && expr >= 45) {
      return { key: "animado", label: "Animado / Envolvente", emoji: "😃", color: "#ff7a59" };
    }
    if (valence >= 55 && expr >= 40) {
      return { key: "amigavel", label: "Amigável / Caloroso", emoji: "😊", color: "#4fd1c5" };
    }
    return { key: "assertivo", label: "Assertivo / Confiante", emoji: "😎", color: "#b085ff" };
  }

  // ---- Agregação de uma sessão inteira ----
  // frames: [{energy, pitch, centroid, voiced, t}]
  function summarize(frames) {
    const voiced = frames.filter((f) => f.voiced);
    const total = frames.length || 1;

    if (voiced.length < 3) {
      return null; // sem fala suficiente
    }

    const pitches = voiced.map((f) => f.pitch);
    const energies = voiced.map((f) => f.energy);
    const centroids = voiced.map((f) => f.centroid);

    const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
    const std = (a, m) => Math.sqrt(mean(a.map((v) => (v - m) ** 2)));

    const meanPitch = mean(pitches);
    const pitchStd = std(pitches, meanPitch);
    const meanEnergy = mean(energies);
    const meanCentroid = mean(centroids);

    // Fração de silêncio (pausas)
    const silenceRatio = 1 - voiced.length / total;

    // Eixos 0-100
    // Energia/excitação: RMS típico de fala ~0.02 a 0.25
    const energyDim = norm(meanEnergy, 0.02, 0.22);

    // Expressividade: desvio de pitch. Fala monótona ~<15 Hz, expressiva >60 Hz
    const exprDim = norm(pitchStd, 8, 70);

    // Positividade (proxy): vozes positivas tendem a ter pitch mais alto e
    // variado, com brilho moderado (não estridente). Combinamos pitch médio,
    // variação e centroide de forma heurística.
    const pitchLevel = norm(meanPitch, 90, 260);
    const brightness = norm(meanCentroid, 900, 3200);
    // brilho excessivo indica tensão -> penaliza positividade
    const tensionPenalty = clamp((brightness - 60), 0, 40);
    const valenceDim = clamp(0.5 * pitchLevel + 0.4 * exprDim + 0.1 * (100 - tensionPenalty * 2), 0, 100);

    // Fluência: menos pausas = mais fluente/confiante
    const flowDim = clamp((1 - silenceRatio) * 100, 0, 100);

    const dominant = classify(energyDim, valenceDim, exprDim);

    return {
      energy: Math.round(energyDim),
      valence: Math.round(valenceDim),
      expressiveness: Math.round(exprDim),
      flow: Math.round(flowDim),
      meanPitch: Math.round(meanPitch),
      pitchStd: Math.round(pitchStd),
      silenceRatio: Math.round(silenceRatio * 100),
      dominant,
    };
  }

  // ---- Série temporal de emoção (uma emoção por janela) ----
  // Agrupa frames em janelas de ~1.5s e classifica cada uma.
  function timeline(frames, windowMs = 1500) {
    if (!frames.length) return [];
    const out = [];
    const startT = frames[0].t;
    let bucket = [];
    let bucketStart = startT;

    const flush = (endT) => {
      const voiced = bucket.filter((f) => f.voiced);
      if (voiced.length >= 2) {
        const sub = summarize(bucket);
        if (sub) {
          out.push({
            t: bucketStart,
            tEnd: endT,
            energy: sub.energy,
            valence: sub.valence,
            expressiveness: sub.expressiveness,
            emotion: sub.dominant,
          });
        }
      } else {
        out.push({
          t: bucketStart,
          tEnd: endT,
          energy: 0,
          valence: 0,
          expressiveness: 0,
          emotion: { key: "silencio", label: "Silêncio", emoji: "…", color: "#3a3f5c" },
        });
      }
      bucket = [];
    };

    for (const f of frames) {
      if (f.t - bucketStart >= windowMs) {
        flush(f.t);
        bucketStart = f.t;
      }
      bucket.push(f);
    }
    if (bucket.length) flush(frames[frames.length - 1].t);
    return out;
  }

  // ---- Observações de coaching a partir do resumo ----
  function insights(s) {
    const tips = [];
    if (!s) return ["Não houve fala suficiente para analisar. Tente falar mais perto do microfone."];

    if (s.expressiveness < 30) {
      tips.push("🎵 Sua voz ficou bastante monótona. Varie mais a entonação para prender a atenção e transmitir emoção.");
    } else if (s.expressiveness > 70) {
      tips.push("🎵 Ótima variação de entonação — sua fala soa expressiva e envolvente.");
    }

    if (s.energy < 30) {
      tips.push("🔊 A energia da sua voz esteve baixa. Projete mais o som para passar confiança e entusiasmo.");
    } else if (s.energy > 80) {
      tips.push("🔊 Energia bem alta. Cuidado para não soar agressivo ou cansar o ouvinte — alterne com momentos mais calmos.");
    }

    if (s.silenceRatio > 45) {
      tips.push("⏸️ Muitas pausas/silêncios (" + s.silenceRatio + "%). Pausas são boas para ênfase, mas em excesso passam hesitação.");
    } else if (s.silenceRatio < 12) {
      tips.push("⏸️ Você quase não fez pausas. Inserir pausas estratégicas ajuda o ouvinte a absorver os pontos-chave.");
    }

    if (s.valence < 40) {
      tips.push("💬 O tom soou mais neutro/sério. Se o objetivo é acolher o cliente, experimente um tom mais caloroso e sorrir ao falar.");
    } else if (s.valence > 65) {
      tips.push("💬 Tom caloroso e positivo — excelente para criar conexão com o ouvinte.");
    }

    tips.push("📊 Predominância emocional: " + s.dominant.label + " " + s.dominant.emoji +
      " (energia " + s.energy + ", positividade " + s.valence + ", expressividade " + s.expressiveness + ").");
    return tips;
  }

  return { analyzeFrame, summarize, timeline, insights, classify };
})();
