#!/usr/bin/env node
/*
 * engine-validation.js — a régua do motor.
 *
 * Antes de falar em "melhorar a accuracy", é preciso SABER a accuracy. Este
 * script mede a camada mais básica e mais importante: o motor recupera
 * corretamente os parâmetros acústicos de sinais cujo valor verdadeiro é
 * conhecido por construção?
 *
 * Se a medição de F0 (altura da voz) estiver errada, tudo o que vem acima —
 * expressividade, valência, categoria — é ruído bem formatado. Esta é a
 * fundação, e ela é testável sem nenhum corpus externo.
 *
 * Uso:  node research/benchmark/engine-validation.js
 */

const fs = require("fs");
const path = require("path");

// ---- Carrega o motor (mesmo código do app, sem duplicar lógica) ----
const enginePath = path.join(__dirname, "..", "..", "js", "emotion.js");
const src = fs.readFileSync(enginePath, "utf8").replace("const EmotionEngine =", "module.exports.E =");
const mod = { exports: {} };
new Function("module", "window", src)(mod, {});
const E = mod.exports.E;

const SR = 44100; // taxa de amostragem
const FFT = 2048;

// ---- Geradores de sinal com verdade conhecida ----

/**
 * Sinal tipo vogal: uma fundamental com harmônicos decaindo — parecido o
 * bastante com voz para exercitar o detector de pitch.
 */
function vowel(f0, { amp = 0.15, n = FFT, harmonics = 6, jitterHz = 0 } = {}) {
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = f0 + (jitterHz ? jitterHz * Math.sin(2 * Math.PI * 3 * t) : 0);
    let v = 0;
    for (let h = 1; h <= harmonics; h++) v += Math.sin(2 * Math.PI * f * h * t) / h;
    out[i] = (v / 2) * amp;
  }
  return out;
}

/** Ruído branco, para testar rejeição (não deve virar pitch). */
function noise(amp = 0.15, n = FFT) {
  const out = new Float32Array(n);
  let seed = 42;
  for (let i = 0; i < n; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff; // determinístico
    out[i] = ((seed / 0x7fffffff) * 2 - 1) * amp;
  }
  return out;
}

/** Espectro de magnitude aproximado (0-255), como o AnalyserNode entrega. */
function spectrumOf(signal) {
  const half = FFT / 2;
  const out = new Uint8Array(half);
  for (let k = 0; k < half; k++) {
    let re = 0, im = 0;
    for (let i = 0; i < FFT; i += 4) { // passo 4: rápido e suficiente aqui
      const ang = (-2 * Math.PI * k * i) / FFT;
      re += signal[i] * Math.cos(ang);
      im += signal[i] * Math.sin(ang);
    }
    out[k] = Math.min(255, Math.sqrt(re * re + im * im) * 2);
  }
  return out;
}

// ---- Relatório ----
const results = [];
function record(suite, name, passed, detail) {
  results.push({ suite, name, passed, detail });
  const mark = passed ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
  console.log(`  ${mark} ${name}  \x1b[90m${detail}\x1b[0m`);
}

// =====================================================================
console.log("\n\x1b[1m1. Detecção de altura da voz (F0)\x1b[0m");
console.log("  \x1b[90mfaixa da voz humana: ~85 Hz (grave) a ~255 Hz (agudo)\x1b[0m\n");

const f0Cases = [90, 110, 130, 160, 190, 220, 250];
const f0Errors = [];

for (const trueF0 of f0Cases) {
  const sig = vowel(trueF0);
  const measured = E.detectPitch(Array.from(sig), SR);
  const errPct = measured > 0 ? Math.abs(measured - trueF0) / trueF0 * 100 : 100;
  f0Errors.push(errPct);
  record("f0", `${trueF0} Hz`, errPct < 5,
    `medido ${measured > 0 ? measured.toFixed(1) + " Hz" : "não detectado"} · erro ${errPct.toFixed(1)}%`);
}

const meanF0Err = f0Errors.reduce((a, b) => a + b, 0) / f0Errors.length;
console.log(`\n  \x1b[1mErro médio de F0: ${meanF0Err.toFixed(2)}%\x1b[0m`);

// =====================================================================
console.log("\n\x1b[1m2. Rejeição de sinal inválido\x1b[0m\n");

const silence = new Float32Array(FFT); // zeros
record("reject", "silêncio não vira pitch", E.detectPitch(Array.from(silence), SR) === -1,
  `retornou ${E.detectPitch(Array.from(silence), SR)}`);

const quiet = vowel(150, { amp: 0.002 });
record("reject", "sinal fraco é descartado", E.detectPitch(Array.from(quiet), SR) === -1,
  "abaixo do limiar de energia");

const n = noise();
const noisePitch = E.detectPitch(Array.from(n), SR);
record("reject", "ruído branco não produz F0 na faixa vocal",
  noisePitch === -1 || noisePitch < 85 || noisePitch > 300,
  `retornou ${noisePitch > 0 ? noisePitch.toFixed(1) + " Hz" : "-1"}`);

// =====================================================================
console.log("\n\x1b[1m3. Energia (RMS)\x1b[0m\n");

for (const amp of [0.05, 0.10, 0.20]) {
  const sig = vowel(150, { amp });
  const rms = E.rms(Array.from(sig));
  // RMS de uma soma de harmônicos normalizada fica proporcional à amplitude
  const monotonic = rms > 0 && rms < amp;
  record("rms", `amplitude ${amp}`, monotonic, `RMS ${rms.toFixed(4)}`);
}

const rmsA = E.rms(Array.from(vowel(150, { amp: 0.05 })));
const rmsB = E.rms(Array.from(vowel(150, { amp: 0.20 })));
record("rms", "RMS cresce com a amplitude", rmsB > rmsA * 2.5,
  `${rmsA.toFixed(4)} → ${rmsB.toFixed(4)} (${(rmsB / rmsA).toFixed(1)}×)`);

// =====================================================================
console.log("\n\x1b[1m4. Expressividade (variação de F0)\x1b[0m\n");

function framesFrom(f0Fn, count = 150) {
  const frames = [];
  for (let i = 0; i < count; i++) {
    const f0 = f0Fn(i);
    const sig = vowel(f0);
    const spec = spectrumOf(sig);
    const f = E.analyzeFrame(Array.from(sig), spec, SR, FFT);
    frames.push({ ...f, t: i * 40 });
  }
  return frames;
}

// Amplitude da variação → desvio-padrão de F0 = A/√2.
//   A=45 → σ≈32 Hz (fala moderadamente expressiva)
//   A=60 → σ≈42 Hz (fala bem expressiva)
// A escala do motor é norm(σ, 8, 70), coerente com a literatura de F0 em fala
// emocional. Os limiares abaixo seguem essa correspondência.
const flat = framesFrom(() => 150);
const moderate = framesFrom((i) => 150 + 45 * Math.sin(i / 4));
const varied = framesFrom((i) => 150 + 60 * Math.sin(i / 4));
const sFlat = E.summarize(flat);
const sModerate = E.summarize(moderate);
const sVaried = E.summarize(varied);

record("expr", "fala moderada → expressividade intermediária",
  sModerate && sModerate.expressiveness > 25 && sModerate.expressiveness < 50,
  `expressividade ${sModerate ? sModerate.expressiveness : "n/a"}`);

record("expr", "fala monótona → expressividade baixa",
  sFlat && sFlat.expressiveness < 30, `expressividade ${sFlat ? sFlat.expressiveness : "n/a"}`);
record("expr", "fala variada → expressividade alta",
  sVaried && sVaried.expressiveness > 45, `expressividade ${sVaried ? sVaried.expressiveness : "n/a"}`);
record("expr", "variada > monótona",
  sVaried && sFlat && sVaried.expressiveness > sFlat.expressiveness + 20,
  `${sFlat ? sFlat.expressiveness : "?"} → ${sVaried ? sVaried.expressiveness : "?"}`);

// =====================================================================
console.log("\n\x1b[1m5. Honestidade da confiança\x1b[0m\n");

const shortFrames = framesFrom(() => 150, 8);
const longFrames = framesFrom((i) => 150 + 40 * Math.sin(i / 4), 200);
const aShort = E.assess(shortFrames);
const aLong = E.assess(longFrames);

record("conf", "amostra curta → inconclusivo", aShort.inconclusivo,
  `confiança ${aShort.confianca}`);
record("conf", "amostra longa → leitura válida", !aLong.inconclusivo,
  `confiança ${aLong.confianca}`);
record("conf", "confiança nunca chega a 1 com um só canal", aLong.confianca < 0.8,
  `cobertura de canais ${aLong.coberturaCanais} · confiança ${aLong.confianca}`);
record("conf", "silêncio total é inconclusivo",
  E.assess(Array.from({ length: 60 }, (_, i) => ({
    energy: 0.0005, pitch: -1, centroid: 0, voiced: false, t: i * 40,
  }))).inconclusivo, "sem fala captada");

// =====================================================================
const total = results.length;
const passed = results.filter((r) => r.passed).length;
const pct = ((passed / total) * 100).toFixed(1);

console.log("\n" + "─".repeat(58));
console.log(`\x1b[1mRESULTADO: ${passed}/${total} (${pct}%)\x1b[0m`);
console.log(`Erro médio na medição de F0: \x1b[1m${meanF0Err.toFixed(2)}%\x1b[0m`);
console.log("─".repeat(58));

if (passed < total) {
  console.log("\n\x1b[33mFalhas:\x1b[0m");
  results.filter((r) => !r.passed).forEach((r) => console.log(`  · ${r.name} — ${r.detail}`));
}

console.log(`
\x1b[90mIMPORTANTE: isto valida a MEDIÇÃO (o motor lê corretamente os sinais
físicos?), não a INTERPRETAÇÃO (o sinal significa a emoção que dizemos?).
A segunda pergunta só se responde com corpus rotulado por humanos —
ver research/PLANO_APRENDIZADO.md.\x1b[0m
`);

process.exit(passed === total ? 0 : 1);
