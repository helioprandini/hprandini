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

  /* ==================================================================
   * CAMADA DIMENSIONAL (framework Helio / ESTRATEGIA_DADOS.md)
   *
   * Saída primária = VETOR + CONFIANÇA. A etiqueta é secundária e provisória.
   * O sistema pode — e deve — dizer "inconclusivo".
   * Estrutura multicanal: canais ausentes não viram zero, viram indisponíveis,
   * os pesos são renormalizados e a confiança cai.
   * ================================================================== */

  // Canais previstos pela AE. Hoje o V&E cobre só voz + autorrelato.
  const CHANNELS = {
    autorrelato:     { peso: 0.30, disponivel: false }, // vem do "Me ensina"
    paralinguistico: { peso: 0.25, disponivel: true  }, // V&E hoje
    verbal:          { peso: 0.20, disponivel: false }, // requer transcrição
    facial:          { peso: 0.10, disponivel: false }, // futuro
    corporal:        { peso: 0.10, disponivel: false }, // futuro
    interacional:    { peso: 0.05, disponivel: false }, // futuro
  };

  // Cobertura = fração do peso total efetivamente coletada.
  function channelCoverage(channels) {
    const ch = channels || CHANNELS;
    let total = 0, have = 0;
    for (const k in ch) {
      total += ch[k].peso;
      if (ch[k].disponivel) have += ch[k].peso;
    }
    return total ? have / total : 0;
  }

  // Converte as escalas internas (0-100) para as dimensões do framework.
  //   valência  -2..+2   |  ativação 0..3  |  dominância/congruência 0..1
  function toDimensions(s) {
    return {
      valencia: +(((s.valence - 50) / 25)).toFixed(2),      // -2 … +2
      ativacao: +((s.energy / 100) * 3).toFixed(2),          // 0 … 3
      // Dominância (proxy): voz firme = energia sustentada + fala fluente,
      // sem o brilho excessivo que sinaliza tensão.
      dominancia: +clamp((0.5 * s.energy + 0.5 * s.flow) / 100, 0, 1).toFixed(2),
      // Congruência entre canais só existe com 2+ canais. Com um só, é nula
      // por construção — e isso é honesto, não uma falha.
      congruencia: null,
      // Reatividade e estabilidade são preenchidas a partir da linha do tempo.
      reatividade: null,
      estabilidade: null,
    };
  }

  /**
   * Confiança da inferência (0..1). Deriva do que REALMENTE temos:
   * cobertura de canais, quantidade de fala e consistência do sinal.
   * Nunca inflar — falsa precisão é um dos riscos listados na estratégia.
   */
  function confidence({ coverage, voicedFrames, silenceRatio, pitchStd }) {
    const sample = clamp(voicedFrames / 120, 0, 1);
    // Muito silêncio = pouco sinal para ler.
    const signal = clamp(1 - silenceRatio / 100, 0, 1);
    // Pitch instável demais costuma ser ruído/microfone, não expressividade.
    const stability = pitchStd > 110 ? 0.5 : 1;
    const raw = coverage * 0.45 + sample * 0.30 + signal * 0.25;
    // Porta de suficiência: pouca fala derruba a confiança inteira, não só a
    // parcela dela. Sem isso, 0,3s de áudio limpo passava como leitura válida —
    // exatamente a "falsa precisão" que a estratégia proíbe.
    const sufficiency = clamp(voicedFrames / 60, 0, 1);
    const gate = 0.4 + 0.6 * sufficiency;
    return +clamp(raw * stability * gate, 0, 1).toFixed(2);
  }

  // Abaixo disto, o sistema declara INCONCLUSIVO em vez de arriscar um rótulo.
  const CONFIDENCE_FLOOR = 0.35;

  const INCONCLUSIVE = {
    key: "inconclusivo",
    label: "Inconclusivo",
    emoji: "🤔",
    color: "#6b7590",
  };

  /**
   * Leitura completa de uma sessão, nas quatro camadas do framework.
   * Retorna { observado, inferido, inconclusivo, confianca, canais }.
   */
  function assess(frames) {
    const s = summarize(frames);
    if (!s) {
      return {
        inconclusivo: true,
        motivo: "Fala insuficiente para leitura.",
        confianca: 0,
        observado: null,
        inferido: null,
        canais: CHANNELS,
      };
    }

    const voicedFrames = frames.filter((f) => f.voiced).length;
    const coverage = channelCoverage();
    const conf = confidence({
      coverage,
      voicedFrames,
      silenceRatio: s.silenceRatio,
      pitchStd: s.pitchStd,
    });

    const dims = toDimensions(s);
    const tl = timeline(frames);
    // Reatividade: o quanto a valência oscila ao longo da conversa.
    // Estabilidade: o inverso disso.
    if (tl.length >= 3) {
      const vals = tl.filter((x) => x.emotion.key !== "silencio").map((x) => x.valence);
      if (vals.length >= 3) {
        const m = vals.reduce((a, b) => a + b, 0) / vals.length;
        const sd = Math.sqrt(vals.reduce((a, v) => a + (v - m) ** 2, 0) / vals.length);
        dims.reatividade = +clamp(sd / 30, 0, 1).toFixed(2);
        dims.estabilidade = +(1 - dims.reatividade).toFixed(2);
      }
    }

    return {
      inconclusivo: conf < CONFIDENCE_FLOOR,
      motivo: conf < CONFIDENCE_FLOOR
        ? "Evidência insuficiente: poucos canais disponíveis ou pouca fala captada."
        : null,
      confianca: conf,
      // CAMADA "OBSERVADO": comportamento medido, sem julgamento.
      observado: {
        energiaMedia: s.energy,
        alturaMediaHz: s.meanPitch,
        variacaoPitchHz: s.pitchStd,
        pausasPct: s.silenceRatio,
        quadrosComVoz: voicedFrames,
      },
      // CAMADA "INFERIDO": hipótese dimensional + etiqueta secundária.
      inferido: {
        dimensoes: dims,
        categoriaProvisoria: conf < CONFIDENCE_FLOOR ? INCONCLUSIVE : s.dominant,
      },
      canais: CHANNELS,
      coberturaCanais: +coverage.toFixed(2),
    };
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
  // Fala com a pessoa, não sobre ela: profissional no conteúdo, humano no tom.
  // Sem vocabulário preso a um segmento — vale para quem vende, ensina, lidera
  // ou defende uma ideia.
  function insights(s) {
    const tips = [];
    if (!s) return ["Não captei fala suficiente para ler. Tente falar um pouco mais perto do microfone."];

    if (s.expressiveness < 30) {
      tips.push("🎵 Sua entonação variou pouco — a fala soou mais plana. Deixar a voz subir e descer nos pontos que importam ajuda quem ouve a sentir o que você sente.");
    } else if (s.expressiveness > 70) {
      tips.push("🎵 Sua entonação variou bastante, e isso é bom: a fala soou viva e fácil de acompanhar.");
    }

    if (s.energy < 30) {
      tips.push("🔊 A energia esteve baixa. Um pouco mais de projeção costuma ser lido como convicção — sem precisar falar mais alto o tempo todo.");
    } else if (s.energy > 80) {
      tips.push("🔊 A energia esteve bem alta o tempo todo. Intercalar momentos mais calmos dá contraste e evita cansar quem escuta.");
    }

    if (s.silenceRatio > 45) {
      tips.push("⏸️ Você fez muitas pausas (" + s.silenceRatio + "% do tempo). Pausa é uma ferramenta poderosa — em excesso, porém, pode soar como hesitação.");
    } else if (s.silenceRatio < 12) {
      tips.push("⏸️ Você quase não pausou. Um respiro depois de uma ideia importante dá tempo do outro absorver o que você disse.");
    }

    if (s.valence < 40) {
      tips.push("💬 O tom soou mais sério e contido. Quando quiser aproximar alguém, um tom mais caloroso costuma abrir a porta.");
    } else if (s.valence > 65) {
      tips.push("💬 Seu tom soou caloroso — é o tipo de voz que cria proximidade.");
    }

    tips.push("📊 No conjunto: " + s.dominant.label + " " + s.dominant.emoji +
      " · energia " + s.energy + " · calor " + s.valence + " · expressividade " + s.expressiveness + ".");
    return tips;
  }

  return {
    analyzeFrame, summarize, timeline, insights, classify,
    // camada dimensional
    assess, toDimensions, confidence, channelCoverage,
    CHANNELS, CONFIDENCE_FLOOR, INCONCLUSIVE,
  };
})();
