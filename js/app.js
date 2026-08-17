/*
 * app.js — Gravação de áudio, captura de features ao vivo e renderização.
 * Depende de emotion.js (EmotionEngine).
 */
(() => {
  "use strict";

  // ---- Elementos ----
  const $ = (id) => document.getElementById(id);
  const recordBtn = $("recordBtn");
  const timerEl = $("timer");
  const hintEl = $("recorderHint");
  const statusBadge = $("statusBadge");
  const liveMeters = $("liveMeters");
  const waveform = $("waveform");
  const resultCard = $("resultCard");
  const historyList = $("historyList");

  // ---- Estado ----
  let audioCtx, analyser, mediaStream, sourceNode, mediaRecorder;
  let rafId = null, timerId = null;
  let recording = false;
  let startTime = 0;
  let frames = [];            // features por frame ao longo do tempo
  let chunks = [];            // pedaços de áudio gravado
  let liveEnergy = 0, livePitchStd = 0, pitchWindow = [];
  let currentRecordId = null; // sessão atual (para anexar o ground truth)

  const STORAGE_KEY = "vozemocao_history_v1";
  const FFT_SIZE = 2048;

  // ---- Utilidades ----
  const fmtTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return String(m).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  };

  function setStatus(text, cls) {
    statusBadge.textContent = text;
    statusBadge.className = "status" + (cls ? " " + cls : "");
  }

  // ---- Início / fim da gravação ----
  async function startRecording() {
    if (monitorWin && !monitorWin.closed) {
      hintEl.textContent = "Feche o monitor ao vivo antes de gravar — os dois usam o microfone.";
      return;
    }
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
      });
    } catch (err) {
      hintEl.textContent = "Não foi possível acessar o microfone. Verifique as permissões do navegador.";
      console.error(err);
      return;
    }

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioCtx.createMediaStreamSource(mediaStream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    sourceNode.connect(analyser);

    // Gravação do áudio para playback/download
    chunks = [];
    const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
    mediaRecorder = new MediaRecorder(mediaStream, mime ? { mimeType: mime } : undefined);
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    mediaRecorder.onstop = onRecordingStopped;
    mediaRecorder.start();

    frames = [];
    pitchWindow = [];
    recording = true;
    startTime = performance.now();

    recordBtn.classList.add("recording");
    liveMeters.hidden = false;
    $("welcomeNote").hidden = true;
    waveform.hidden = false;
    resultCard.hidden = true;
    hintEl.textContent = "Ouvindo… toque de novo quando terminar";
    setStatus("Gravando", "rec");

    timerId = setInterval(() => { timerEl.textContent = fmtTime(performance.now() - startTime); }, 250);
    loop();
  }

  function stopRecording() {
    recording = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (timerId) clearInterval(timerId);
    recordBtn.classList.remove("recording");
    hintEl.textContent = "Processando análise…";
    setStatus("Analisando", "analyzing");
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
  }

  // ---- Loop de captura ao vivo ----
  const timeData = new Float32Array(FFT_SIZE);
  const freqData = new Uint8Array(FFT_SIZE / 2);

  function loop() {
    if (!recording) return;
    analyser.getFloatTimeDomainData(timeData);
    analyser.getByteFrequencyData(freqData);

    const f = EmotionEngine.analyzeFrame(timeData, freqData, audioCtx.sampleRate, FFT_SIZE);
    frames.push({ ...f, t: performance.now() - startTime });

    updateLiveMeters(f);
    drawWaveform();

    rafId = requestAnimationFrame(loop);
  }

  function updateLiveMeters(f) {
    // suaviza energia
    liveEnergy = liveEnergy * 0.8 + f.energy * 0.2;
    const energyPct = Math.min(100, (liveEnergy / 0.22) * 100);
    $("energyFill").style.width = energyPct + "%";

    if (f.voiced) {
      const pitchPct = Math.min(100, Math.max(0, ((f.pitch - 90) / (260 - 90)) * 100));
      $("pitchFill").style.width = pitchPct + "%";
      pitchWindow.push(f.pitch);
      if (pitchWindow.length > 40) pitchWindow.shift();
    }

    // expressividade ao vivo = desvio-padrão do pitch na janela recente
    if (pitchWindow.length > 4) {
      const m = pitchWindow.reduce((s, v) => s + v, 0) / pitchWindow.length;
      livePitchStd = Math.sqrt(pitchWindow.reduce((s, v) => s + (v - m) ** 2, 0) / pitchWindow.length);
      const exprPct = Math.min(100, Math.max(0, ((livePitchStd - 8) / (70 - 8)) * 100));
      $("exprFill").style.width = exprPct + "%";

      const energyDim = Math.min(100, (liveEnergy / 0.22) * 100);
      const exprDim = exprPct;
      const valence = Math.min(100, 0.5 * ((m - 90) / (260 - 90)) * 100 + 0.5 * exprDim);
      const emo = EmotionEngine.classify(energyDim, valence, exprDim);
      const live = $("liveEmotion");
      live.textContent = emo.emoji + "  " + emo.label;
      live.style.color = emo.color;
    }
  }

  // ---- Desenho da onda ao vivo ----
  function drawWaveform() {
    const ctx = waveform.getContext("2d");
    const w = (waveform.width = waveform.clientWidth * devicePixelRatio);
    const h = (waveform.height = waveform.clientHeight * devicePixelRatio);
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 2 * devicePixelRatio;
    ctx.strokeStyle = "#6c8bff";
    ctx.beginPath();
    const step = Math.ceil(timeData.length / w);
    for (let i = 0; i < w; i++) {
      const v = timeData[i * step] || 0;
      const y = (0.5 + v * 0.9) * h;
      i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
    }
    ctx.stroke();
  }

  // ---- Ao parar: monta resultado ----
  function onRecordingStopped() {
    const blob = new Blob(chunks, { type: chunks[0] ? chunks[0].type : "audio/webm" });
    const url = URL.createObjectURL(blob);

    const summary = EmotionEngine.summarize(frames);
    const tl = EmotionEngine.timeline(frames);
    const tips = EmotionEngine.insights(summary);
    const assessment = EmotionEngine.assess(frames);
    const durationMs = frames.length ? frames[frames.length - 1].t : 0;

    renderResult(summary, tl, tips, url, durationMs);
    renderReading(assessment);

    // salvar no histórico (sem o áudio — localStorage não guarda blobs grandes)
    // features = o vetor acústico medido; groundTruth = a verdade dada pelo humano.
    // Juntos, são um exemplo rotulado — o tijolo do dataset da AE.
    const record = {
      id: Date.now(),
      date: new Date().toISOString(),
      durationMs,
      summary,
      features: summary
        ? {
            energy: summary.energy,
            valence: summary.valence,
            expressiveness: summary.expressiveness,
            flow: summary.flow,
            meanPitch: summary.meanPitch,
            pitchStd: summary.pitchStd,
            silenceRatio: summary.silenceRatio,
          }
        : null,
      // Camadas do framework: o que foi medido, o que foi inferido, e a
      // verdade que só o humano tem (relatado).
      assessment: assessment
        ? {
            confianca: assessment.confianca,
            inconclusivo: assessment.inconclusivo,
            coberturaCanais: assessment.coberturaCanais,
            observado: assessment.observado,
            dimensoes: assessment.inferido ? assessment.inferido.dimensoes : null,
          }
        : null,
      groundTruth: { match: null, affect: null, feeling: null, outcome: null },
      timeline: tl.map((x) => ({ e: x.energy, v: x.valence, x: x.expressiveness, k: x.emotion.key })),
    };
    currentRecordId = record.id;
    saveToHistory(record);
    renderHistory();
    resetGroundTruthUI();

    setStatus("Pronto");
    hintEl.textContent = "Toque para gravar outra conversa";
    // Reset base
    if (audioCtx) audioCtx.close();
  }

  // ---- Render do resultado ----
  function renderResult(summary, tl, tips, audioUrl, durationMs) {
    resultCard.hidden = false;

    if (summary) {
      $("domEmoji").textContent = summary.dominant.emoji;
      $("domLabel").textContent = summary.dominant.label;
      $("domLabel").style.color = summary.dominant.color;
      $("dimEnergy").style.width = summary.energy + "%";
      $("dimValence").style.width = summary.valence + "%";
      $("dimExpr").style.width = summary.expressiveness + "%";
      $("dimFlow").style.width = summary.flow + "%";
    } else {
      $("domEmoji").textContent = "🤷";
      $("domLabel").textContent = "Sem fala suficiente";
      ["dimEnergy", "dimValence", "dimExpr", "dimFlow"].forEach((id) => ($(id).style.width = "0%"));
    }

    drawTimeline(tl);
    renderLegend(tl);

    $("audioPlayer").src = audioUrl;
    const dl = $("downloadLink");
    dl.href = audioUrl;
    dl.download = "conversa-" + new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-") + ".webm";

    const ul = $("insightsList");
    ul.innerHTML = "";
    tips.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });

    resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ---- Desenha a linha do tempo emocional ----
  function drawTimeline(tl) {
    const cv = $("timeline");
    const ctx = cv.getContext("2d");
    const w = (cv.width = cv.clientWidth * devicePixelRatio);
    const h = (cv.height = cv.clientHeight * devicePixelRatio);
    ctx.clearRect(0, 0, w, h);
    if (!tl.length) return;

    const n = tl.length;
    const bw = w / n;

    // barras coloridas por emoção, altura = energia
    tl.forEach((seg, i) => {
      const bh = Math.max(4, (seg.energy / 100) * (h - 30 * devicePixelRatio));
      ctx.fillStyle = seg.emotion.color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(i * bw + 1, h - bh - 20 * devicePixelRatio, bw - 2, bh);
    });
    ctx.globalAlpha = 1;

    // linha de positividade (valence) sobreposta
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2 * devicePixelRatio;
    ctx.beginPath();
    tl.forEach((seg, i) => {
      const x = i * bw + bw / 2;
      const y = (h - 20 * devicePixelRatio) - (seg.valence / 100) * (h - 30 * devicePixelRatio);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // eixo de tempo
    ctx.fillStyle = "#9aa2c9";
    ctx.font = 12 * devicePixelRatio + "px system-ui";
    ctx.fillText("0s", 2, h - 4 * devicePixelRatio);
    const totalS = Math.round((tl[tl.length - 1].tEnd || 0) / 1000);
    ctx.fillText(totalS + "s", w - 28 * devicePixelRatio, h - 4 * devicePixelRatio);
  }

  function renderLegend(tl) {
    const seen = new Map();
    tl.forEach((s) => { if (s.emotion.key !== "silencio") seen.set(s.emotion.key, s.emotion); });
    const legend = $("timelineLegend");
    legend.innerHTML = "";
    seen.forEach((emo) => {
      const span = document.createElement("span");
      span.innerHTML = '<span class="dot" style="background:' + emo.color + '"></span>' + emo.emoji + " " + emo.label;
      legend.appendChild(span);
    });
    const line = document.createElement("span");
    line.innerHTML = '<span class="dot" style="background:#ffd166"></span>— linha = positividade';
    legend.appendChild(line);
  }

  // ---- Histórico (localStorage) ----
  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveToHistory(record) {
    const hist = loadHistory();
    hist.unshift(record);
    while (hist.length > 30) hist.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
  }
  function deleteFromHistory(id) {
    const hist = loadHistory().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
    renderHistory();
  }

  function renderHistory() {
    const hist = loadHistory();
    historyList.innerHTML = "";
    if (!hist.length) {
      historyList.innerHTML = '<li class="empty">Nenhuma conversa gravada ainda.</li>';
      return;
    }
    hist.forEach((r) => {
      const li = document.createElement("li");
      li.className = "history-item";
      const emo = r.summary ? r.summary.dominant : { emoji: "🤷", label: "Sem fala", color: "#9aa2c9" };
      const d = new Date(r.date);
      const dateStr = d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const gt = r.groundTruth && r.groundTruth.feeling ? " · 🏷️ senti-me " + r.groundTruth.feeling : "";
      li.innerHTML =
        '<span class="h-emoji">' + emo.emoji + "</span>" +
        '<div class="h-meta">' +
          '<div class="h-title" style="color:' + emo.color + '">' + emo.label + "</div>" +
          '<div class="h-sub">' + dateStr + " · " + fmtTime(r.durationMs) +
            (r.summary ? " · energia " + r.summary.energy + " · positividade " + r.summary.valence : "") +
            gt +
          "</div>" +
        "</div>" +
        '<span class="h-del" title="Excluir">🗑️</span>';
      li.querySelector(".h-del").addEventListener("click", (e) => { e.stopPropagation(); deleteFromHistory(r.id); });
      li.addEventListener("click", () => showHistoryDetail(r));
      historyList.appendChild(li);
    });
  }

  function showHistoryDetail(r) {
    // reconstrói a timeline a partir dos dados salvos e reexibe (sem áudio)
    const palette = { entusiasmado:"#ffd166", animado:"#ff7a59", amigavel:"#4fd1c5", assertivo:"#b085ff",
      tenso:"#ff5470", calmo:"#63d471", desanimado:"#6c8bff", monotono:"#9aa2c9", silencio:"#3a3f5c" };
    const labels = { entusiasmado:"Entusiasmado", animado:"Animado / Envolvente", amigavel:"Amigável / Caloroso",
      assertivo:"Assertivo / Confiante", tenso:"Tenso / Nervoso", calmo:"Calmo / Sereno",
      desanimado:"Desanimado", monotono:"Monótono", silencio:"Silêncio" };
    const emojis = { entusiasmado:"🤩", animado:"😃", amigavel:"😊", assertivo:"😎",
      tenso:"😧", calmo:"🙂", desanimado:"😔", monotono:"😐", silencio:"…" };
    const tl = (r.timeline || []).map((x, i) => ({
      t: i * 1500, tEnd: (i + 1) * 1500, energy: x.e, valence: x.v, expressiveness: x.x,
      emotion: { key: x.k, color: palette[x.k] || "#9aa2c9", label: labels[x.k] || x.k, emoji: emojis[x.k] || "•" },
    }));
    const tips = EmotionEngine.insights(r.summary);
    resultCard.hidden = false;
    renderResult(r.summary, tl, tips, "", r.durationMs);
    $("audioPlayer").removeAttribute("src");
    $("downloadLink").removeAttribute("href");

    // torna esta sessão a "atual" para o ground truth, refletindo o que já foi salvo
    currentRecordId = r.id;
    resetGroundTruthUI();
    const gt = r.groundTruth || {};
    const sel = (rowId, attr, val) => {
      if (!val) return;
      const btn = $(rowId).querySelector('.chip[data-' + attr + '="' + val + '"]');
      if (btn) btn.classList.add("selected");
    };
    sel("gtMatch", "match", gt.match);
    sel("gtFeeling", "feel", gt.feeling);
    sel("gtOutcome", "out", gt.outcome);

    if (gt.affect) {
      gridPoint = { x: (gt.affect.valencia + 2) / 4, y: 1 - gt.affect.ativacao / 3 };
      drawAffectGrid();
      $("gridReadout").innerHTML = "<strong>" + describeGrid(gt.affect) + "</strong> · valência " +
        (gt.affect.valencia > 0 ? "+" : "") + gt.affect.valencia + " · ativação " + gt.affect.ativacao;
    }
    if (r.assessment) {
      renderReading({
        confianca: r.assessment.confianca,
        inconclusivo: r.assessment.inconclusivo,
        coberturaCanais: r.assessment.coberturaCanais,
        observado: r.assessment.observado,
        inferido: { dimensoes: r.assessment.dimensoes },
        motivo: null,
      });
    }
  }

  // ---- Eventos ----
  recordBtn.addEventListener("click", () => {
    if (!recording) startRecording();
    else stopRecording();
  });

  $("clearHistory").addEventListener("click", () => {
    if (confirm("Apagar todo o histórico de conversas?")) {
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
    }
  });

  /* ---- Affect Grid (Russell, Weiss & Mendelsohn) ----
   * Captura valência × ativação num toque. É a forma mais eficiente de obter
   * ground truth dimensional — e permite comparar com escalas validadas.
   *   eixo X: -2 (desagradável) … +2 (agradável)
   *   eixo Y:  0 (quieto)       …  3 (agitado)
   */
  let gridPoint = null; // {x: 0..1, y: 0..1} em coordenadas normalizadas

  function drawAffectGrid() {
    const cv = $("affectGrid");
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);

    // Fundo: quadrantes coloridos pelo significado (Russell)
    const quads = [
      { x: 0,     y: 0,     c: "rgba(255,84,112,0.10)" },  // desagradável+agitado
      { x: w / 2, y: 0,     c: "rgba(255,196,107,0.10)" }, // agradável+agitado
      { x: 0,     y: h / 2, c: "rgba(108,139,255,0.10)" }, // desagradável+quieto
      { x: w / 2, y: h / 2, c: "rgba(94,214,160,0.10)" },  // agradável+quieto
    ];
    quads.forEach((q) => { ctx.fillStyle = q.c; ctx.fillRect(q.x, q.y, w / 2, h / 2); });

    // Grade
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) {
      const p = (i / 8) * w;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(w, p); ctx.stroke();
    }
    // Eixos centrais
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    // Ponto escolhido
    if (gridPoint) {
      const px = gridPoint.x * w, py = gridPoint.y * h;
      ctx.beginPath();
      ctx.arc(px, py, 16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,138,91,0.25)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#ff8a5b";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Converte o ponto normalizado para as dimensões do framework.
  function gridToDims(p) {
    return {
      valencia: +((p.x * 4 - 2)).toFixed(2), // -2 … +2
      ativacao: +(((1 - p.y) * 3)).toFixed(2), // 0 … 3
    };
  }

  function describeGrid(d) {
    const v = d.valencia >= 0.5 ? "agradável" : d.valencia <= -0.5 ? "desagradável" : "neutro";
    const a = d.ativacao >= 2 ? "agitado" : d.ativacao <= 1 ? "quieto" : "moderado";
    return v + " · " + a;
  }

  function setGridPoint(clientX, clientY) {
    const cv = $("affectGrid");
    const r = cv.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    gridPoint = { x, y };
    drawAffectGrid();
    const dims = gridToDims(gridPoint);
    $("gridReadout").innerHTML =
      "<strong>" + describeGrid(dims) + "</strong> · valência " +
      (dims.valencia > 0 ? "+" : "") + dims.valencia + " · ativação " + dims.ativacao;
    updateGroundTruth("affect", dims);
  }

  $("affectGrid").addEventListener("click", (e) => setGridPoint(e.clientX, e.clientY));
  $("affectGrid").addEventListener("keydown", (e) => {
    // acessibilidade: setas movem o ponto a partir do centro
    if (!e.key.startsWith("Arrow")) return;
    e.preventDefault();
    const p = gridPoint || { x: 0.5, y: 0.5 };
    const step = 0.0625;
    if (e.key === "ArrowLeft") p.x -= step;
    if (e.key === "ArrowRight") p.x += step;
    if (e.key === "ArrowUp") p.y -= step;
    if (e.key === "ArrowDown") p.y += step;
    const cv = $("affectGrid").getBoundingClientRect();
    setGridPoint(cv.left + Math.min(1, Math.max(0, p.x)) * cv.width,
                 cv.top + Math.min(1, Math.max(0, p.y)) * cv.height);
  });

  // ---- Leitura dimensional (vetor + confiança + inconclusivo) ----
  function renderReading(assessment) {
    const card = $("readingCard");
    const pct = Math.round(assessment.confianca * 100);
    $("confFill").style.width = pct + "%";
    $("confVal").textContent = assessment.confianca.toFixed(2);
    card.classList.toggle("inconclusive", !!assessment.inconclusivo);

    const vec = $("vecList");
    vec.innerHTML = "";
    const d = assessment.inferido ? assessment.inferido.dimensoes : null;
    const items = [
      ["Valência", d && d.valencia, "−2 a +2"],
      ["Ativação", d && d.ativacao, "0 a 3"],
      ["Dominância", d && d.dominancia, "0 a 1"],
      ["Congruência", d && d.congruencia, "precisa de 2+ canais"],
      ["Reatividade", d && d.reatividade, "0 a 1"],
      ["Estabilidade", d && d.estabilidade, "0 a 1"],
    ];
    items.forEach(([nome, val, faixa]) => {
      const el = document.createElement("div");
      const na = val === null || val === undefined;
      el.className = "vec-item" + (na ? " na" : "");
      el.innerHTML = "<span>" + nome + "</span><b>" +
        (na ? "—" : (val > 0 && nome === "Valência" ? "+" : "") + val) +
        "</b><span>" + (na ? "não disponível" : faixa) + "</span>";
      vec.appendChild(el);
    });

    const cobertura = Math.round((assessment.coberturaCanais || 0) * 100);
    $("readingNote").textContent = assessment.inconclusivo
      ? "⚠️ " + (assessment.motivo || "Evidência insuficiente para uma leitura confiável.") +
        " Prefiro dizer que não sei a arriscar um palpite."
      : "Leitura baseada em " + cobertura + "% dos canais previstos (só voz por enquanto; " +
        "face, corpo e olhar entram nas próximas etapas da AE). Congruência exige mais de um canal.";
  }

  // ---- Ground truth: captura como a pessoa realmente se sentiu ----
  // Cada resposta é anexada à sessão atual e re-salva. É o rótulo do dataset.
  function updateGroundTruth(field, value) {
    if (currentRecordId == null) return;
    const hist = loadHistory();
    const rec = hist.find((r) => r.id === currentRecordId);
    if (!rec) return;
    rec.groundTruth = rec.groundTruth || { match: null, affect: null, feeling: null, outcome: null };
    rec.groundTruth[field] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
    renderHistory();
    $("gtSaved").hidden = false;
  }

  function resetGroundTruthUI() {
    $("gtSaved").hidden = true;
    document.querySelectorAll("#groundTruth .chip.selected")
      .forEach((c) => c.classList.remove("selected"));
    gridPoint = null;
    drawAffectGrid();
    $("gridReadout").textContent = "Nenhum ponto marcado ainda";
  }

  function wireGroundTruthRow(rowId, attr, field) {
    const row = $(rowId);
    row.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      row.querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
      btn.classList.add("selected");
      updateGroundTruth(field, btn.dataset[attr]);
    });
  }
  wireGroundTruthRow("gtMatch", "match", "match");
  wireGroundTruthRow("gtFeeling", "feel", "feeling");
  wireGroundTruthRow("gtOutcome", "out", "outcome");

  // ---- Exporta o dataset (features + ground truth) como JSON ----
  $("exportData").addEventListener("click", () => {
    const hist = loadHistory();
    if (!hist.length) { alert("Ainda não há conversas para exportar."); return; }
    // Formato multicanal: cada amostra carrega as camadas separadas
    // (observado / inferido / relatado), como manda a ESTRATEGIA_DADOS.md.
    const dataset = hist.map((r) => ({
      id: r.id,
      data: r.date,
      duracaoMs: r.durationMs,
      canais: { autorrelato: !!(r.groundTruth && r.groundTruth.affect), paralinguistico: true,
                verbal: false, facial: false, corporal: false, interacional: false },
      observado: r.assessment ? r.assessment.observado : (r.features || null),
      inferido: r.assessment
        ? { dimensoes: r.assessment.dimensoes, confianca: r.assessment.confianca,
            inconclusivo: r.assessment.inconclusivo, categoriaProvisoria: r.summary ? r.summary.dominant.key : null }
        : null,
      relatado: r.groundTruth || null,
    }));
    const blob = new Blob([JSON.stringify({
      versao: 2,
      projeto: "AE — Artificial Emotion / Voice&Emotion",
      exportadoEm: new Date().toISOString(),
      nota: "Camadas separadas: observado (medido), inferido (hipótese + confiança), relatado (verdade humana). Canais não coletados aparecem como false.",
      amostras: dataset,
    }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voiceemotion-dataset-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Monitor ao vivo: no Mac abre como janela pop-up estreita (fica num canto da
  // tela durante a conversa); no iPhone, o navegador ignora o tamanho e abre em
  // tela cheia, o que também serve.
  let monitorWin = null;

  $("openMonitor").addEventListener("click", () => {
    // Gravar e monitorar ao mesmo tempo faz as duas janelas disputarem o
    // microfone — uma delas recebe silêncio. Melhor parar antes.
    if (recording) {
      alert("Pare a gravação antes de abrir o monitor: os dois disputam o microfone.");
      return;
    }
    monitorWin = window.open("monitor.html", "vem-monitor",
      "width=420,height=780,menubar=no,toolbar=no,location=no,status=no");
    if (!monitorWin) window.location.href = "monitor.html"; // pop-up bloqueado
  });

  // Verifica suporte
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    hintEl.textContent = "Seu navegador não suporta gravação de áudio. Use Chrome, Edge ou Firefox recentes.";
    recordBtn.disabled = true;
  }

  renderHistory();
  drawAffectGrid();
})();
