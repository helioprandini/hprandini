#!/usr/bin/env node
/*
 * analyze-dataset.js — compara o que o motor leu com o que o humano sentiu.
 *
 * Este é o número que importa: não "o motor parece bom", mas "o quanto ele
 * erra, e para que lado". Erro sistemático (sempre para o mesmo lado) é
 * calibração — tem conserto. Erro espalhado é limite do sinal — não tem.
 *
 * Uso:  node research/benchmark/analyze-dataset.js <arquivo.json>
 */

const fs = require("fs");

const file = process.argv[2];
if (!file) {
  console.error("Uso: node research/benchmark/analyze-dataset.js <dataset.json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const todas = data.amostras || [];

// A precisão só é honesta sobre trechos em que a voz MEDIDA é a de quem
// rotulou. Se outra pessoa fala, o motor lê a voz dela enquanto o rótulo
// descreve o sentimento de quem ouve — o par sinal↔rótulo não existe.
const comRotulo = todas.filter(
  (a) => a.relatado && a.relatado.affect && a.inferido && a.inferido.dimensoes
);
const amostras = comRotulo.filter(
  (a) => a.qualidade === "limpa" || (!a.qualidade && a.relatado.speaker === "eu")
);
const misturadas = comRotulo.filter(
  (a) => a.qualidade === "misturada" || (!a.qualidade && a.relatado.speaker === "mistura")
);

if (!amostras.length) {
  console.error("Nenhuma amostra com rótulo humano e leitura do motor.");
  process.exit(1);
}

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((v) => (v - m) ** 2))); };
const fmt = (n, d = 2) => (n >= 0 ? "+" : "") + n.toFixed(d);

// Correlação de Pearson — mede se o motor ao menos ACOMPANHA a variação
// humana, mesmo que com deslocamento ou escala erradas.
function pearson(x, y) {
  const mx = mean(x), my = mean(y);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  return dx && dy ? num / Math.sqrt(dx * dy) : NaN;
}

console.log(`\n\x1b[1mDATASET:\x1b[0m ${file}`);
console.log(`${todas.length} trechos registrados · ${amostras.length} com a voz de quem rotulou` +
  (misturadas.length ? ` · \x1b[33m${misturadas.length} com vozes misturadas (fora da conta)\x1b[0m` : "") +
  `\n`);
if (misturadas.length) {
  console.log(`\x1b[90mTrechos com mais de uma voz ficam de fora: o sinal acústico não é só de\nquem rotulou, então o par sinal↔rótulo não é limpo.\x1b[0m\n`);
}

// ---------- Tabela ----------
console.log("\x1b[1m  #  quem      sentiu       VOCÊ val/ativ   MOTOR val/ativ   erro val  erro ativ\x1b[0m");
console.log("  " + "─".repeat(80));

const errV = [], errA = [], humV = [], humA = [], engV = [], engA = [];

amostras.forEach((a, i) => {
  const h = a.relatado.affect, e = a.inferido.dimensoes;
  const ev = e.valencia - h.valencia;
  const ea = e.ativacao - h.ativacao;
  errV.push(ev); errA.push(ea);
  humV.push(h.valencia); humA.push(h.ativacao);
  engV.push(e.valencia); engA.push(e.ativacao);

  const cor = (v) => Math.abs(v) < 0.3 ? "\x1b[32m" : Math.abs(v) < 0.7 ? "\x1b[33m" : "\x1b[31m";
  console.log(
    `  ${String(i + 1).padStart(2)}  ${(a.relatado.speaker || "-").padEnd(9)} ` +
    `${(a.relatado.feeling || "-").padEnd(11)} ` +
    `${fmt(h.valencia).padStart(6)} / ${h.ativacao.toFixed(2).padStart(4)}   ` +
    `${fmt(e.valencia).padStart(6)} / ${e.ativacao.toFixed(2).padStart(4)}   ` +
    `${cor(ev)}${fmt(ev).padStart(7)}\x1b[0m   ${cor(ea)}${fmt(ea).padStart(7)}\x1b[0m` +
    (a.inferido.inconclusivo ? "  \x1b[90m(inconclusivo)\x1b[0m" : "")
  );
});

// ---------- Viés sistemático ----------
console.log("\n\x1b[1mVIÉS SISTEMÁTICO\x1b[0m  (erro médio; se todos vão para o mesmo lado, é calibração)\n");

function relatarVies(nome, erros, escala) {
  const m = mean(erros);
  const s = sd(erros);
  const mesmoLado = erros.every((e) => e > 0) || erros.every((e) => e < 0);
  const pctEscala = Math.abs(m) / escala * 100;
  console.log(`  ${nome.padEnd(10)} erro médio ${fmt(m).padStart(6)}  (desvio ${s.toFixed(2)})  ` +
    `= ${pctEscala.toFixed(0)}% da escala`);
  if (mesmoLado) {
    console.log(`             \x1b[33m⚠ TODAS as amostras erram para o mesmo lado — viés claro\x1b[0m`);
  }
  return { m, s, mesmoLado };
}

const vV = relatarVies("Valência", errV, 4);   // escala -2..+2
const vA = relatarVies("Ativação", errA, 3);   // escala 0..3

// ---------- Amplitude usada ----------
console.log("\n\x1b[1mAMPLITUDE\x1b[0m  (o motor usa a régua toda, ou fica preso numa faixa?)\n");

function relatarAmplitude(nome, hum, eng) {
  const rh = Math.max(...hum) - Math.min(...hum);
  const re = Math.max(...eng) - Math.min(...eng);
  const razao = rh ? re / rh : NaN;
  console.log(`  ${nome.padEnd(10)} humano usou ${rh.toFixed(2)}  |  motor usou ${re.toFixed(2)}  ` +
    `(${(razao * 100).toFixed(0)}% da variação)`);
  console.log(`             motor foi de ${Math.min(...eng).toFixed(2)} a ${Math.max(...eng).toFixed(2)}`);
  if (razao < 0.5) {
    console.log(`             \x1b[31m⚠ faixa comprimida — o motor quase não varia\x1b[0m`);
  }
  return razao;
}

relatarAmplitude("Valência", humV, engV);
relatarAmplitude("Ativação", humA, engA);

// ---------- Correlação ----------
console.log("\n\x1b[1mCORRELAÇÃO\x1b[0m  (o motor acompanha a direção da variação?)\n");
const rV = pearson(humV, engV);
const rA = pearson(humA, engA);
const julgar = (r) => isNaN(r) ? "sem variação" :
  r > 0.7 ? "\x1b[32mboa\x1b[0m" : r > 0.4 ? "\x1b[33mfraca\x1b[0m" :
  r > 0 ? "\x1b[31mmuito fraca\x1b[0m" : "\x1b[31mINVERTIDA\x1b[0m";
console.log(`  Valência   r = ${isNaN(rV) ? "—" : rV.toFixed(2).padStart(5)}   ${julgar(rV)}`);
console.log(`  Ativação   r = ${isNaN(rA) ? "—" : rA.toFixed(2).padStart(5)}   ${julgar(rA)}`);

// ---------- Categorias ----------
const cats = {};
amostras.forEach((a) => {
  const c = a.inferido.categoria || "—";
  cats[c] = (cats[c] || 0) + 1;
});
console.log("\n\x1b[1mCATEGORIAS QUE O MOTOR DEU\x1b[0m\n");
Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
  const pct = Math.round((n / amostras.length) * 100);
  console.log(`  ${c.padEnd(14)} ${String(n).padStart(2)}x  ${"█".repeat(Math.round(pct / 5))} ${pct}%`);
});
const dominante = Object.values(cats).sort((a, b) => b - a)[0] / amostras.length;
if (dominante > 0.6) {
  console.log(`\n  \x1b[31m⚠ o motor dá quase sempre a mesma resposta — o classificador colapsou\x1b[0m`);
}

// ---------- Features cruas ----------
console.log("\n\x1b[1mFEATURES MEDIDAS\x1b[0m  (as escalas do motor cobrem o que a fala real produz?)\n");
const obs = amostras.map((a) => a.observado).filter(Boolean);
if (obs.length) {
  const campos = [
    ["energiaMedia", "energia (0-100)", null],
    ["alturaMediaHz", "altura F0 (Hz)", [90, 260]],
    ["variacaoPitchHz", "variação F0 (Hz)", [8, 70]],
    ["pausasPct", "pausas (%)", null],
  ];
  campos.forEach(([k, nome, escala]) => {
    const vals = obs.map((o) => o[k]).filter((v) => v != null);
    if (!vals.length) return;
    const mn = Math.min(...vals), mx = Math.max(...vals);
    let aviso = "";
    if (escala) {
      const acimaDoTeto = vals.filter((v) => v >= escala[1]).length;
      if (acimaDoTeto) {
        aviso = `  \x1b[31m⚠ ${acimaDoTeto}/${vals.length} acima do teto da escala (${escala[1]}) — SATURA\x1b[0m`;
      }
    }
    console.log(`  ${nome.padEnd(20)} ${mn.toFixed(0)} … ${mx.toFixed(0)}` +
      (escala ? `   escala do motor: ${escala[0]}–${escala[1]}` : "") + aviso);
  });
}

console.log("\n" + "─".repeat(82));
console.log(amostras.length < 20
  ? `\x1b[33mAtenção: ${amostras.length} amostras é pouco para conclusões finas. Viés que aparece em\nTODAS elas e saturação de escala, porém, já são sinais estruturais confiáveis.\x1b[0m`
  : `Baseado em ${amostras.length} amostras.`);
console.log("");
