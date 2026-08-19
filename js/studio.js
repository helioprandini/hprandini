/*
 * studio.js — Estúdio de anotação: transforma gravações reais em dataset.
 *
 * Fluxo: carregar áudio → analisar no navegador → fatiar em trechos → você
 * rotula CADA trecho às cegas → o motor revela o palpite → exporta o dataset.
 *
 * Duas decisões metodológicas que não são detalhe:
 *
 * 1. ROTULAÇÃO ÀS CEGAS. O palpite do motor só aparece DEPOIS que você marca.
 *    Se aparecesse antes, sua resposta seria ancorada por ele e o dataset
 *    deixaria de validar qualquer coisa — só confirmaria o que já achávamos.
 *
 * 2. TUDO LOCAL. O áudio é decodificado e analisado no seu aparelho. O dataset
 *    exportado carrega números e rótulos, nunca o som. Gravação de reunião tem
 *    a voz de terceiros — ver "usos vedados" em ESTRATEGIA_DADOS.md.
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const FFT_SIZE = 2048;
  const HOP = 1024;             // ~23ms de passo a 44.1kHz
  const SEGMENT_MS = 20000;     // trecho de 20s: longo o bastante para ter emoção,
                                // curto o bastante para ser uma coisa só
  const STORAGE_KEY = "vem_studio_dataset_v1";

  let segments = [];    // trechos pendentes de anotação
  let current = 0;
  let sampleSize = 6;   // 0 = todos; padrão é a rotina curta pós-reunião
  let audioURL = null;
  let gridPoint = null;
  let label = { speaker: null, affect: null, feeling: null };

  /** Embaralhamento de Fisher-Yates: cada trecho com a mesma chance. */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Carregamento ----------

  $("modeRow").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    $("modeRow").querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
    btn.classList.add("selected");
    sampleSize = parseInt(btn.dataset.mode, 10);
  });

  const drop = $("dropZone");
  const input = $("fileInput");

  drop.addEventListener("click", () => input.click());
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("over");
    handleFiles(e.dataTransfer.files);
  });
  input.addEventListener("change", () => handleFiles(input.files));

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(f.name));
    if (!files.length) {
      alert("Não reconheci nenhum arquivo de áudio.");
      return;
    }
    $("progressBox").hidden = false;
    segments = [];

    for (let i = 0; i < files.length; i++) {
      setProgress(`Lendo ${files[i].name} (${i + 1}/${files.length})…`, i / files.length);
      try {
        const segs = await analyzeFile(files[i], (p) => {
          setProgress(`Analisando ${files[i].name}…`, (i + p) / files.length);
        });
        segments.push(...segs);
      } catch (err) {
        console.error(err);
        alert(`Não consegui ler "${files[i].name}": ${err.message}`);
      }
    }

    setProgress("Pronto", 1);
    $("progressBox").hidden = true;

    if (!segments.length) {
      alert("Não encontrei trechos com fala suficiente nesses arquivos.");
      return;
    }

    // Amostragem aleatória. Rotular só os momentos marcantes enviesaria o
    // dataset para os extremos — e é no meio da distribuição que o motor mais
    // erra. O sorteio também deixa a rotina pós-reunião curta o bastante para
    // ser feita no mesmo dia, com o sentimento ainda fresco.
    if (sampleSize > 0 && segments.length > sampleSize) {
      segments = shuffle(segments).slice(0, sampleSize)
        .sort((a, b) => a.arquivo.localeCompare(b.arquivo) || a.inicioMs - b.inicioMs);
    }

    current = 0;
    $("annotateCard").hidden = false;
    $("statsCard").hidden = false;
    showSegment();
    renderStats();
  }

  function setProgress(label, frac) {
    $("progressLabel").textContent = label;
    $("progressFill").style.width = Math.round(Math.min(1, frac) * 100) + "%";
  }

  /** Decodifica o arquivo e extrai features quadro a quadro, em fatias. */
  async function analyzeFile(file, onProgress) {
    const buf = await file.arrayBuffer();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const audio = await ctx.decodeAudioData(buf);
    const sr = audio.sampleRate;
    const data = audio.getChannelData(0);
    await ctx.close();

    const frames = [];
    const block = new Float32Array(FFT_SIZE);
    let spec = new Uint8Array(FFT_SIZE / 2);

    const totalFrames = Math.max(1, Math.floor((data.length - FFT_SIZE) / HOP));
    for (let f = 0, i = 0; i + FFT_SIZE <= data.length; i += HOP, f++) {
      block.set(data.subarray(i, i + FFT_SIZE));
      spec = FFT.magnitudes255(block, spec);
      const fr = EmotionEngine.analyzeFrame(block, spec, sr, FFT_SIZE);
      frames.push({ ...fr, t: (i / sr) * 1000 });

      // Cede o fio de execução periodicamente para a barra de progresso andar.
      if (f % 400 === 0) {
        onProgress(f / totalFrames);
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    // Fatia em trechos e descarta os que não têm fala suficiente para rotular.
    const url = URL.createObjectURL(file);
    const out = [];
    const durMs = (data.length / sr) * 1000;
    for (let start = 0; start < durMs; start += SEGMENT_MS) {
      const end = Math.min(start + SEGMENT_MS, durMs);
      const seg = frames.filter((fr) => fr.t >= start && fr.t < end);
      const voiced = seg.filter((fr) => fr.voiced).length;
      if (voiced < 30) continue; // menos de ~0.7s de fala: não dá para rotular

      const assessment = EmotionEngine.assess(seg);
      if (!assessment.inferido) continue;

      out.push({
        id: `${file.name}#${Math.round(start)}`,
        arquivo: file.name,
        url,
        inicioMs: start,
        fimMs: end,
        picos: seg.map((fr) => fr.energy),
        assessment,
        resumo: EmotionEngine.summarize(seg),
      });
    }
    return out;
  }

  // ---------- Anotação ----------

  function showSegment() {
    const seg = segments[current];
    if (!seg) { finishAll(); return; }

    label = { speaker: null, affect: null, feeling: null };
    gridPoint = null;
    $("revealBox").hidden = true;
    document.querySelectorAll("#speakerRow .chip, #feelRow .chip")
      .forEach((c) => c.classList.remove("selected"));
    $("stdReadout").textContent = "Nenhum ponto marcado ainda";
    $("stdGrid").classList.remove("marked");
    updateSaveState();
    drawGrid();
    drawSegWave(seg);

    $("segCounter").textContent =
      `trecho ${current + 1} de ${segments.length} · ${seg.arquivo}`;
    $("timecode").textContent =
      `${fmt(seg.inicioMs)} – ${fmt(seg.fimMs)}`;

    const el = $("audioEl");
    if (audioURL !== seg.url) { el.src = seg.url; audioURL = seg.url; }
  }

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  /** Silhueta de energia do trecho — ajuda a lembrar do momento. */
  function drawSegWave(seg) {
    const cv = $("segWave");
    const w = (cv.width = cv.clientWidth * devicePixelRatio);
    const h = (cv.height = cv.clientHeight * devicePixelRatio);
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    const picos = seg.picos;
    if (!picos.length) return;
    const max = Math.max(...picos, 0.01);
    const bw = w / picos.length;
    ctx.fillStyle = "#ff8a5b";
    picos.forEach((e, i) => {
      const bh = Math.max(1, (e / max) * (h - 4));
      ctx.globalAlpha = 0.75;
      ctx.fillRect(i * bw, (h - bh) / 2, Math.max(1, bw - 0.5), bh);
    });
    ctx.globalAlpha = 1;
  }

  // Reprodução do trecho, parando no fim dele
  $("playBtn").addEventListener("click", () => {
    const el = $("audioEl");
    const seg = segments[current];
    if (!seg) return;
    if (!el.paused) { el.pause(); return; }
    el.currentTime = seg.inicioMs / 1000;
    el.play();
    $("playBtn").classList.add("playing");
    $("playBtn").textContent = "⏸ Pausar";
    const stopAt = seg.fimMs / 1000;
    const tick = () => {
      if (el.paused) return;
      if (el.currentTime >= stopAt) { el.pause(); return; }
      requestAnimationFrame(tick);
    };
    tick();
  });
  $("audioEl").addEventListener("pause", () => {
    $("playBtn").classList.remove("playing");
    $("playBtn").textContent = "▶︎ Ouvir trecho";
  });

  // Escolhas
  function wireRow(rowId, attr, field) {
    $(rowId).addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      $(rowId).querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
      btn.classList.add("selected");
      label[field] = btn.dataset[attr];
      updateSaveState();
    });
  }
  wireRow("speakerRow", "spk", "speaker");
  wireRow("feelRow", "feel", "feeling");

  function updateSaveState() {
    // Exige quem fala + o ponto na grade: são os dois campos que dão valor
    // científico ao rótulo. O nome da emoção é complemento.
    //
    // E DIZ o que falta: um botão desabilitado sem explicação trava o usuário
    // sem ele entender por quê — foi exatamente o que aconteceu no primeiro uso.
    const falta = [];
    if (!label.speaker) falta.push("marcar <strong>quem está falando</strong>");
    if (!label.affect) falta.push("<strong>tocar na grade</strong> para dizer como se sentiu");

    $("saveBtn").disabled = falta.length > 0;
    $("missingHint").innerHTML = falta.length
      ? "Para salvar, falta: " + falta.join(" e ") + "."
      : "✓ Pronto para salvar.";
    $("missingHint").classList.toggle("ready", falta.length === 0);
  }

  // ---------- Grade de afeto ----------

  function drawGrid() {
    const cv = $("stdGrid");
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);
    const quads = [
      [0, 0, "rgba(255,84,112,0.10)"],
      [w / 2, 0, "rgba(255,196,107,0.10)"],
      [0, h / 2, "rgba(108,139,255,0.10)"],
      [w / 2, h / 2, "rgba(94,214,160,0.10)"],
    ];
    quads.forEach(([x, y, c]) => { ctx.fillStyle = c; ctx.fillRect(x, y, w / 2, h / 2); });
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) {
      const p = (i / 8) * w;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(w, p); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    if (gridPoint) {
      const px = gridPoint.x * w, py = gridPoint.y * h;
      ctx.beginPath(); ctx.arc(px, py, 17, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,138,91,0.25)"; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#ff8a5b"; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
    }
  }

  const toDims = (p) => ({
    valencia: +(p.x * 4 - 2).toFixed(2),
    ativacao: +((1 - p.y) * 3).toFixed(2),
  });

  const describe = (d) => {
    const v = d.valencia >= 0.5 ? "agradável" : d.valencia <= -0.5 ? "desagradável" : "neutro";
    const a = d.ativacao >= 2 ? "agitado" : d.ativacao <= 1 ? "quieto" : "moderado";
    return `${v} · ${a}`;
  };

  function setPoint(clientX, clientY) {
    const cv = $("stdGrid");
    const r = cv.getBoundingClientRect();
    gridPoint = {
      x: Math.min(1, Math.max(0, (clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (clientY - r.top) / r.height)),
    };
    drawGrid();
    $("stdGrid").classList.add("marked");
    label.affect = toDims(gridPoint);
    $("stdReadout").innerHTML =
      `<strong>${describe(label.affect)}</strong> · valência ` +
      `${label.affect.valencia > 0 ? "+" : ""}${label.affect.valencia} · ` +
      `ativação ${label.affect.ativacao}`;
    updateSaveState();
  }

  $("stdGrid").addEventListener("click", (e) => setPoint(e.clientX, e.clientY));

  // Acessibilidade e alternativa ao clique: setas movem o ponto a partir do centro.
  $("stdGrid").addEventListener("keydown", (e) => {
    if (!e.key.startsWith("Arrow")) return;
    e.preventDefault();
    const p = gridPoint || { x: 0.5, y: 0.5 };
    const step = 0.0625;
    if (e.key === "ArrowLeft") p.x -= step;
    if (e.key === "ArrowRight") p.x += step;
    if (e.key === "ArrowUp") p.y -= step;
    if (e.key === "ArrowDown") p.y += step;
    const r = $("stdGrid").getBoundingClientRect();
    setPoint(r.left + Math.min(1, Math.max(0, p.x)) * r.width,
             r.top + Math.min(1, Math.max(0, p.y)) * r.height);
  });

  // ---------- Salvar e revelar ----------

  $("saveBtn").addEventListener("click", () => {
    const seg = segments[current];
    const a = seg.assessment;
    const eng = a.inferido.dimensoes;

    const registro = {
      id: seg.id,
      arquivo: seg.arquivo,
      inicioMs: seg.inicioMs,
      fimMs: seg.fimMs,
      fonte: "voz",
      origem_rotulo: "humano",     // nunca misturar com rótulo de IA
      canais: { autorrelato: true, paralinguistico: true,
                verbal: false, facial: false, corporal: false, interacional: false },
      relatado: { ...label },
      observado: a.observado,
      inferido: { dimensoes: eng, confianca: a.confianca, inconclusivo: a.inconclusivo,
                  categoria: seg.resumo ? seg.resumo.dominant.key : null },
      anotadoEm: new Date().toISOString(),
    };
    saveRecord(registro);
    reveal(registro);
    renderStats();
  });

  function reveal(reg) {
    const you = reg.relatado.affect;
    const eng = reg.inferido.dimensoes;
    $("revealYou").textContent = describe(you);
    $("revealEngine").textContent =
      reg.inferido.inconclusivo ? "inconclusivo" : describe(eng);

    // Distância no plano valência × ativação, normalizada pelos eixos.
    const dv = Math.abs(you.valencia - eng.valencia) / 4;
    const da = Math.abs(you.ativacao - eng.ativacao) / 3;
    const erro = (dv + da) / 2;

    const v = $("revealVerdict");
    if (reg.inferido.inconclusivo) {
      v.textContent = "não sei"; v.className = "std-vs meh";
    } else if (erro < 0.15) {
      v.textContent = "bateu"; v.className = "std-vs ok";
    } else if (erro < 0.3) {
      v.textContent = "perto"; v.className = "std-vs meh";
    } else {
      v.textContent = "errou"; v.className = "std-vs off";
    }

    $("revealDetail").innerHTML =
      `Você: valência ${fmtN(you.valencia)}, ativação ${you.ativacao} · ` +
      `Motor: valência ${fmtN(eng.valencia)}, ativação ${eng.ativacao} ` +
      `(confiança ${reg.inferido.confianca})<br>` +
      `<span style="color:var(--text-faint)">Quando o motor erra é que ele aprende. ` +
      `Cada trecho rotulado vira um exemplo do dataset da AE.</span>`;

    $("revealBox").hidden = false;
  }

  const fmtN = (n) => (n > 0 ? "+" : "") + n;

  $("nextBtn").addEventListener("click", () => { current++; showSegment(); });
  $("skipBtn").addEventListener("click", () => { current++; showSegment(); });

  function finishAll() {
    $("annotateCard").hidden = true;
    alert("Você anotou todos os trechos carregados. Exporte o dataset ou carregue mais gravações.");
  }

  // ---------- Persistência e estatísticas ----------

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveRecord(reg) {
    const all = loadAll().filter((r) => r.id !== reg.id);
    all.push(reg);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function renderStats() {
    const all = loadAll();
    const meus = all.filter((r) => r.relatado.speaker === "eu");
    const validos = all.filter((r) => !r.inferido.inconclusivo && r.relatado.affect);

    let acertos = 0, somaErro = 0;
    validos.forEach((r) => {
      const dv = Math.abs(r.relatado.affect.valencia - r.inferido.dimensoes.valencia) / 4;
      const da = Math.abs(r.relatado.affect.ativacao - r.inferido.dimensoes.ativacao) / 3;
      const e = (dv + da) / 2;
      somaErro += e;
      if (e < 0.15) acertos++;
    });
    const erroMedio = validos.length ? somaErro / validos.length : null;
    const taxa = validos.length ? Math.round((acertos / validos.length) * 100) : null;

    $("statsGrid").innerHTML = [
      [all.length, "trechos anotados"],
      [meus.length, "com a sua voz"],
      [taxa === null ? "—" : taxa + "%", "leituras que bateram"],
      [erroMedio === null ? "—" : erroMedio.toFixed(2), "erro médio (0 = perfeito)"],
    ].map(([v, l]) =>
      `<div class="std-stat"><div class="std-stat-val">${v}</div><div class="std-stat-label">${l}</div></div>`
    ).join("");

    $("accuracyNote").textContent = validos.length < 20
      ? `Com ${validos.length} trechos ainda é cedo para tirar conclusões — a partir de ~50 o número começa a significar alguma coisa.`
      : `Baseado em ${validos.length} trechos rotulados por você. Este é o número real da precisão do motor hoje.`;
  }

  // ---------- Exportar / limpar ----------

  $("exportBtn").addEventListener("click", () => {
    const all = loadAll();
    if (!all.length) {
      alert("Nada anotado ainda.\n\nPara salvar um trecho é preciso marcar QUEM ESTÁ FALANDO e TOCAR NA GRADE indicando como você se sentiu. Só então o botão \"Salvar e revelar\" habilita.");
      return;
    }
    const blob = new Blob([JSON.stringify({
      versao: 1,
      projeto: "AE — Artificial Emotion / Voice&Emotion",
      descricao: "Trechos de gravações reais rotulados às cegas pelo próprio falante.",
      exportadoEm: new Date().toISOString(),
      amostras: all,
    }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vem-dataset-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  });

  $("clearBtn").addEventListener("click", () => {
    if (confirm("Apagar todas as anotações? Isso não pode ser desfeito.")) {
      localStorage.removeItem(STORAGE_KEY);
      renderStats();
    }
  });

  // Início
  if (loadAll().length) { $("statsCard").hidden = false; renderStats(); }
  drawGrid();
})();
