#!/usr/bin/env node
/*
 * coerencia.js — o "Fakenometro", com o nome honesto: Termômetro de coerência.
 *
 * Pergunta que ele faz: as PALAVRAS e a VOZ do mesmo momento contam a mesma
 * história? ("tá ótimo" dito com a voz tensa = divergência.)
 *
 * O que ele NÃO faz: dizer que alguém está fingindo ou mentindo. Divergência é
 * comportamento observado, não intenção — ironia, educação, cansaço e sotaque
 * produzem o mesmo padrão. A tela nunca diz "fake".
 *
 * Três escolhas que seguram a honestidade:
 *  1. A voz é comparada com o NORMAL DA PRÓPRIA PESSOA (z-score sobre os
 *     momentos anteriores dela, só voz limpa), nunca com uma régua absoluta:
 *     "voz alta" de um é a voz de sempre de outro. Sem 15 momentos de base,
 *     a resposta é "inconclusivo" — não um palpite.
 *  2. Da voz só se usa o que a prosódia mede bem: ativação (altura + volume),
 *     expressividade (variação em semitons) e pausas. A valência da voz NÃO
 *     entra — o 2º dataset deu r = 0.37 nela (Scherer: prosódia prevê
 *     ativação, não valência).
 *  3. Texto neutro (|sentimento| < 0.3) não tem o que comparar → inconclusivo.
 *
 * A mesma regra roda no app (`Coerencia` em ios/.../EscutaAtiva.swift). Mudou
 * aqui, muda lá.
 *
 * Uso:  node research/benchmark/coerencia.js <dataset.json>
 *       (aceita a exportação do iOS — lista de momentos — ou {amostras: [...]})
 *
 * O número que importa no fim: quando palavra e voz discordam, o seu RÓTULO
 * ficou do lado de quem? Se ficar do lado da voz com frequência, o termômetro
 * mede algo real. Se ficar do lado da palavra, ele é ruído — e a gente diz.
 */

const BASE_MIN = 15;     // momentos de voz limpa antes de existir "o seu normal"
const LIMIAR_TEXTO = 0.3; // |sentimento| abaixo disto: texto neutro

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((v) => (v - m) ** 2))); };

/** O normal da pessoa: média e desvio de cada medida da voz. */
function linhaDeBase(momentos) {
  const limpos = momentos.filter((m) => m.observado && m.qualidade === "limpa");
  if (limpos.length < BASE_MIN) return { n: limpos.length };
  const campo = (k) => {
    const v = limpos.map((m) => m.observado[k]);
    return { m: mean(v), s: sd(v) || 1e-9 };
  };
  return {
    n: limpos.length,
    altura: campo("alturaMediaHz"),
    rms: campo("energiaRms"),
    semitons: campo("variacaoPitchSemitons"),
    pausas: campo("pausasPct"),
  };
}

/** Uma leitura de coerência para um momento, dado o normal da pessoa. */
function avaliar(momento, base) {
  const s = momento.verbal && momento.verbal.sentimento;
  const leitura = { estado: "inconclusivo", voz: null, sentimento: s ?? null, baseN: base.n };
  if (s == null) return { ...leitura, frase: "Sem texto para comparar." };
  if (base.n < BASE_MIN) {
    return { ...leitura, frase: `Ainda aprendendo o seu normal (${base.n}/${BASE_MIN}).` };
  }
  const o = momento.observado;
  const z = (v, c) => (v - c.m) / c.s;
  const zA = (z(o.alturaMediaHz, base.altura) + z(o.energiaRms, base.rms)) / 2;
  const zE = z(o.variacaoPitchSemitons, base.semitons);
  const zP = z(o.pausasPct, base.pausas);
  const r2 = (v) => Math.round(v * 100) / 100;
  Object.assign(leitura, { zAtivacao: r2(zA), zExpressividade: r2(zE), zPausas: r2(zP) });

  // Estado da voz, relativo ao normal da pessoa. A ordem importa: o mais
  // específico primeiro.
  let voz = "normal";
  if (zA >= 1 && zE <= 0) voz = "tensa";            // subiu altura/volume sem melodia
  else if (zA <= -1 && zE <= -0.5) voz = "apagada"; // baixa e plana
  else if (zP >= 1.5) voz = "hesitante";            // pausas bem acima do normal
  else if (zE >= 1 && zA >= 0) voz = "viva";
  leitura.voz = voz;

  if (Math.abs(s) < LIMIAR_TEXTO) {
    return { ...leitura, frase: "Palavras neutras — nada a comparar." };
  }
  if (s > 0 && ["tensa", "apagada", "hesitante"].includes(voz)) {
    return { ...leitura, estado: "divergente", frase: `Palavras positivas, voz ${voz}.` };
  }
  if (s < 0 && voz === "viva") {
    // O caso mais fraco: pode ser ironia, brincadeira ou desabafo animado.
    return { ...leitura, estado: "divergente", frase: "Palavras negativas, voz viva." };
  }
  return { ...leitura, estado: "coerente", frase: "Palavras e voz na mesma direção." };
}

/**
 * Lê o dataset em ordem de tempo, cada momento contra a base dos ANTERIORES
 * (sem espiar o futuro — é como o app vê na hora).
 */
function percorrer(momentos) {
  const ord = [...momentos].sort((a, b) => new Date(a.data) - new Date(b.data));
  return ord.map((m, i) => ({ momento: m, leitura: avaliar(m, linhaDeBase(ord.slice(0, i))) }));
}

module.exports = { linhaDeBase, avaliar, percorrer, BASE_MIN, LIMIAR_TEXTO };

if (require.main === module) {
  const fs = require("fs");
  const file = process.argv[2];
  if (!file) {
    console.error("Uso: node research/benchmark/coerencia.js <dataset.json>");
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const momentos = Array.isArray(data) ? data : data.amostras || [];
  const lidas = percorrer(momentos);

  const conta = (e) => lidas.filter((l) => l.leitura.estado === e).length;
  console.log(`\n\x1b[1mTERMÔMETRO DE COERÊNCIA\x1b[0m  ${file}`);
  console.log(`${lidas.length} momentos · ${conta("coerente")} coerentes · ` +
    `${conta("divergente")} divergentes · ${conta("inconclusivo")} inconclusivos\n`);

  const motivos = {};
  lidas.filter((l) => l.leitura.estado === "inconclusivo")
    .forEach((l) => { const k = l.leitura.frase.replace(/\(.*\)/, "(…)"); motivos[k] = (motivos[k] || 0) + 1; });
  Object.entries(motivos).forEach(([k, n]) => console.log(`  \x1b[90minconclusivo: ${k} ×${n}\x1b[0m`));

  // A validação: nos divergentes rotulados com voz limpa, o rótulo concordou
  // com a palavra ou com a voz?
  const julgaveis = lidas.filter((l) => l.leitura.estado === "divergente" &&
    l.momento.qualidade === "limpa" && l.momento.relatado && l.momento.relatado.affect);
  console.log(`\n\x1b[1mVALIDAÇÃO\x1b[0m  (divergentes com voz limpa e rótulo: ${julgaveis.length})\n`);
  if (julgaveis.length < 10) {
    console.log("  Poucos casos para concluir qualquer coisa. Abaixo de ~10, isto é anedota.\n");
  }
  let palavra = 0, voz = 0, empate = 0;
  julgaveis.forEach((l) => {
    const v = l.momento.relatado.affect.valencia; // −2…+2
    const s = l.leitura.sentimento;
    // A palavra aponta para o sinal de s; a voz, para o lado oposto.
    if (Math.abs(v) < 0.25) empate++;
    else if (Math.sign(v) === Math.sign(s)) palavra++;
    else voz++;
  });
  if (julgaveis.length) {
    console.log(`  o seu rótulo ficou com a VOZ     ${voz}`);
    console.log(`  o seu rótulo ficou com a PALAVRA ${palavra}`);
    console.log(`  rótulo neutro (sem lado)         ${empate}\n`);
  }
}
