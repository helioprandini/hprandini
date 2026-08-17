/*
 * fft.js — FFT radix-2 iterativa, para análise de arquivos (offline).
 *
 * O app ao vivo usa o AnalyserNode do navegador, que só existe em tempo real.
 * Para processar gravações já feitas, precisamos calcular o espectro nós
 * mesmos. A saída imita o formato do AnalyserNode (magnitudes 0-255), para o
 * mesmo motor de emoção servir aos dois caminhos sem duplicar lógica.
 */
const FFT = (() => {
  "use strict";

  /** Tabelas de seno/cosseno e bit-reversal, calculadas uma vez por tamanho. */
  function makePlan(n) {
    const levels = Math.log2(n) | 0;
    if (2 ** levels !== n) throw new Error("FFT: tamanho precisa ser potência de 2");

    const cos = new Float32Array(n / 2);
    const sin = new Float32Array(n / 2);
    for (let i = 0; i < n / 2; i++) {
      cos[i] = Math.cos((2 * Math.PI * i) / n);
      sin[i] = Math.sin((2 * Math.PI * i) / n);
    }

    const rev = new Uint32Array(n);
    for (let i = 0; i < n; i++) {
      let x = i, r = 0;
      for (let j = 0; j < levels; j++) { r = (r << 1) | (x & 1); x >>= 1; }
      rev[i] = r;
    }

    // Janela de Hann: reduz vazamento espectral nas bordas do bloco.
    const window = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
    }

    return { n, levels, cos, sin, rev, window,
             re: new Float32Array(n), im: new Float32Array(n) };
  }

  const plans = new Map();
  function planFor(n) {
    if (!plans.has(n)) plans.set(n, makePlan(n));
    return plans.get(n);
  }

  // Faixa de decibéis usada pelo AnalyserNode do navegador (valores padrão da
  // Web Audio API). Precisamos da MESMA escala aqui: o motor foi calibrado com
  // dados do AnalyserNode, e se o caminho offline usasse outra escala, a
  // leitura de um arquivo não seria comparável à leitura ao vivo — e o dataset
  // nasceria inconsistente.
  const MIN_DB = -100;
  const MAX_DB = -30;

  /**
   * Magnitudes (0-255) da metade útil do espectro, no mesmo formato e na mesma
   * escala em decibéis que o AnalyserNode entrega — assim
   * `EmotionEngine.analyzeFrame` funciona igual para áudio ao vivo e arquivo.
   */
  function magnitudes255(samples, out) {
    const n = samples.length;
    const p = planFor(n);
    const { cos, sin, rev, window, re, im } = p;

    for (let i = 0; i < n; i++) {
      re[rev[i]] = samples[i] * window[i];
      im[i] = 0;
    }
    im.fill(0);

    for (let size = 2; size <= n; size *= 2) {
      const half = size / 2;
      const step = n / size;
      for (let i = 0; i < n; i += size) {
        for (let j = i, k = 0; j < i + half; j++, k += step) {
          const l = j + half;
          const tRe = re[l] * cos[k] + im[l] * sin[k];
          const tIm = -re[l] * sin[k] + im[l] * cos[k];
          re[l] = re[j] - tRe; im[l] = im[j] - tIm;
          re[j] += tRe;        im[j] += tIm;
        }
      }
    }

    const half = n / 2;
    const result = out && out.length === half ? out : new Uint8Array(half);
    // Normaliza pelo ganho da janela de Hann (soma ≈ n/2) para que a magnitude
    // não dependa do tamanho do bloco, e converte para a escala em dB.
    const norm = 2 / n;
    const range = MAX_DB - MIN_DB;
    for (let i = 0; i < half; i++) {
      const mag = Math.sqrt(re[i] * re[i] + im[i] * im[i]) * norm;
      const db = 20 * Math.log10(mag + 1e-12);
      const v = ((db - MIN_DB) / range) * 255;
      result[i] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
    return result;
  }

  return { magnitudes255 };
})();
