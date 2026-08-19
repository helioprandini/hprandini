/*
 * affectgrid.js — desenho da grade de afeto (Russell, Weiss & Mendelsohn).
 *
 * Compartilhado pelo app, pelo estúdio e pelo monitor. Os rótulos dos eixos são
 * desenhados DENTRO do canvas, e não em elementos HTML ao redor: assim eles
 * ficam sempre colados nas bordas certas, em qualquer largura de tela. Com
 * <div>s ao redor, o alinhamento dependia de larguras que nem sempre batiam — e
 * "agradável" e "desagradável" acabavam encavalados no mesmo lado.
 *
 * Eixos:  x → valência (esquerda desagradável, direita agradável)
 *         y → ativação (embaixo quieto, em cima agitado)
 */
const AffectGrid = (() => {
  "use strict";

  const QUADRANTS = [
    // [xFrac, yFrac, cor] — o significado de cada canto (Russell)
    [0.0, 0.0, "rgba(255,84,112,0.12)"],   // desagradável + agitado (tensão)
    [0.5, 0.0, "rgba(255,196,107,0.12)"],  // agradável + agitado (entusiasmo)
    [0.0, 0.5, "rgba(108,139,255,0.12)"],  // desagradável + quieto (desânimo)
    [0.5, 0.5, "rgba(94,214,160,0.12)"],   // agradável + quieto (serenidade)
  ];

  /**
   * @param canvas  elemento <canvas>
   * @param point   {x, y} normalizados 0..1, ou null
   * @param opts    { trail: [{x,y}], labels: bool }
   */
  function draw(canvas, point, opts = {}) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const showLabels = opts.labels !== false;

    ctx.clearRect(0, 0, w, h);

    // Quadrantes
    QUADRANTS.forEach(([fx, fy, cor]) => {
      ctx.fillStyle = cor;
      ctx.fillRect(fx * w, fy * h, w / 2, h / 2);
    });

    // Grade fina
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = Math.max(1, w / 440);
    for (let i = 1; i < 8; i++) {
      const p = (i / 8);
      ctx.beginPath(); ctx.moveTo(p * w, 0); ctx.lineTo(p * w, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p * h); ctx.lineTo(w, p * h); ctx.stroke();
    }

    // Eixos centrais
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = Math.max(1, w / 300);
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    // Rótulos dos eixos, presos às bordas
    if (showLabels) {
      const fs = Math.max(13, Math.round(w * 0.052));
      const pad = Math.round(fs * 0.7);
      ctx.font = `600 ${fs}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(238,241,247,0.72)";

      // Horizontal — extremos opostos, cada um no seu lado
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText("desagradável", pad, h / 2);
      ctx.textAlign = "right";
      ctx.fillText("agradável", w - pad, h / 2);

      // Vertical — topo e base
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("agitado", w / 2, pad);
      ctx.textBaseline = "bottom";
      ctx.fillText("quieto", w / 2, h - pad);
    }

    // Rastro (usado pelo monitor ao vivo): o passado desvanece
    if (opts.trail && opts.trail.length) {
      const t = opts.trail;
      t.forEach((p, i) => {
        const age = i / t.length;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, (2 + age * 3) * (w / 300), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,138,91,${0.06 + age * 0.35})`;
        ctx.fill();
      });
    }

    // Ponto atual
    if (point) {
      const px = point.x * w, py = point.y * h;
      const r = w / 300;
      ctx.beginPath(); ctx.arc(px, py, 16 * r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,138,91,0.25)"; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, 8 * r, 0, Math.PI * 2);
      ctx.fillStyle = "#ff8a5b"; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2 * r; ctx.stroke();
    }
  }

  /** Converte ponto normalizado para as dimensões do framework. */
  const toDims = (p) => ({
    valencia: +(p.x * 4 - 2).toFixed(2),   // -2 … +2
    ativacao: +((1 - p.y) * 3).toFixed(2), // 0 … 3
  });

  /** Caminho inverso: dimensões → ponto na grade. */
  const fromDims = (d) => ({
    x: (d.valencia + 2) / 4,
    y: 1 - d.ativacao / 3,
  });

  /** Descrição curta em palavras. */
  function describe(d) {
    const v = d.valencia >= 0.5 ? "agradável"
            : d.valencia <= -0.5 ? "desagradável" : "neutro";
    const a = d.ativacao >= 2 ? "agitado"
            : d.ativacao <= 1 ? "quieto" : "moderado";
    return `${v} · ${a}`;
  }

  return { draw, toDims, fromDims, describe };
})();
