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
    waveform.hidden = false;
    resultCard.hidden = true;
    hintEl.textContent = "Gravando… clique novamente para parar";
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
    const durationMs = frames.length ? frames[frames.length - 1].t : 0;

    renderResult(summary, tl, tips, url, durationMs);

    // salvar no histórico (sem o áudio — localStorage não guarda blobs grandes)
    const record = {
      id: Date.now(),
      date: new Date().toISOString(),
      durationMs,
      summary,
      timeline: tl.map((x) => ({ e: x.energy, v: x.valence, x: x.expressiveness, k: x.emotion.key })),
    };
    saveToHistory(record);
    renderHistory();

    setStatus("Pronto");
    hintEl.textContent = "Clique para gravar outra conversa";
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
      li.innerHTML =
        '<span class="h-emoji">' + emo.emoji + "</span>" +
        '<div class="h-meta">' +
          '<div class="h-title" style="color:' + emo.color + '">' + emo.label + "</div>" +
          '<div class="h-sub">' + dateStr + " · " + fmtTime(r.durationMs) +
            (r.summary ? " · energia " + r.summary.energy + " · positividade " + r.summary.valence : "") +
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

  // Verifica suporte
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    hintEl.textContent = "Seu navegador não suporta gravação de áudio. Use Chrome, Edge ou Firefox recentes.";
    recordBtn.disabled = true;
  }

  renderHistory();
})();
