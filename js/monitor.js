/*
 * monitor.js — leitura emocional ao vivo, em janela deslizante.
 *
 * Diferença para o app principal: aqui NADA é gravado. Os quadros vivem numa
 * janela curta em memória e são descartados. O monitor mostra o agora.
 *
 * O que ele mostra são SINAIS OBSERVÁVEIS (camada "observado" do framework),
 * não veredictos:
 *   - Engajamento  → energia + expressividade sustentadas
 *   - Hesitação    → fração de pausas na janela recente
 *   - Tensão vocal → brilho espectral alto + instabilidade de pitch
 *
 * Deliberadamente NÃO existe detecção de mentira. Não há sinal acústico
 * confiável de engano; o que se mede é estresse, que tem dezenas de causas.
 * Ver "usos vedados" em ESTRATEGIA_DADOS.md.
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const FFT_SIZE = 2048;
  const WINDOW_MS = 6000;   // janela de leitura "agora"
  const TREND_MS = 60000;   // linha do tempo curta

  let audioCtx, analyser, stream, sourceNode, rafId;
  let running = false;
  let t0 = 0;

  let maxEnergySeen = 0;    // para detectar stream mudo (mic tomado por outra aba)
  let frames = [];          // janela deslizante (descartada continuamente)
  let trend = [];           // {t, valence, energy, color} a cada ~1s
  let lastTrendAt = 0;
  let gridTrail = [];       // rastro no mapa valência × ativação

  const timeData = new Float32Array(FFT_SIZE);
  const freqData = new Uint8Array(FFT_SIZE / 2);

  // ---- Consentimento ----
  let consented = false;

  $("acceptBtn").addEventListener("click", () => {
    consented = true;
    $("consentCard").hidden = true;
    $("monMain").hidden = false;
    $("toggleBtn").disabled = false;
    drawGrid();
    drawTrend();
    start(); // já começa: o usuário acabou de dizer que quer começar
  });

  // ---- Liga / desliga ----
  $("toggleBtn").addEventListener("click", () => {
    if (!consented) return;
    running ? stop() : start();
  });

  async function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      fail("Microfone indisponível",
           "Abra por http://localhost (não por arquivo) e use Chrome, Edge, Safari ou Firefox.");
      return;
    }
    $("monEmoji").textContent = "⏳";
    $("monLabel").textContent = "Pedindo acesso ao microfone…";

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
      });
    } catch (err) {
      fail("Sem acesso ao microfone",
           err && err.name === "NotAllowedError"
             ? "Permissão negada. Libere o microfone para este site e clique em Iniciar."
             : "Não foi possível abrir o microfone: " + (err && err.name ? err.name : "erro"));
      console.error(err);
      return;
    }

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    sourceNode.connect(analyser);

    frames = []; trend = []; gridTrail = [];
    maxEnergySeen = 0;
    t0 = performance.now();
    lastTrendAt = 0;
    running = true;

    $("toggleBtn").textContent = "Parar";
    $("toggleBtn").classList.add("on");
    $("liveDot").classList.add("live");
    loop();
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (audioCtx) audioCtx.close();
    $("toggleBtn").textContent = "Iniciar";
    $("toggleBtn").classList.remove("on");
    $("liveDot").classList.remove("live");
    $("monLabel").textContent = "Parado";
    $("monEmoji").textContent = "⏸️";
  }

  // ---- Laço de leitura ----
  function loop() {
    if (!running) return;
    analyser.getFloatTimeDomainData(timeData);
    analyser.getByteFrequencyData(freqData);

    const now = performance.now() - t0;
    const f = EmotionEngine.analyzeFrame(timeData, freqData, audioCtx.sampleRate, FFT_SIZE);
    frames.push({ ...f, t: now });
    if (f.energy > maxEnergySeen) maxEnergySeen = f.energy;

    // Medidor de entrada: escala até 0.10 de RMS, que já é fala forte.
    const lvl = Math.min(1, f.energy / 0.10);
    const fill = $("inputFill");
    fill.style.width = (lvl * 100).toFixed(0) + "%";
    fill.classList.toggle("silent", f.energy < 0.002);
    $("inputVal").textContent = f.energy.toFixed(4);

    // Descarta o que saiu da janela — o monitor não guarda histórico.
    const cut = now - WINDOW_MS;
    while (frames.length && frames[0].t < cut) frames.shift();

    render(now);
    rafId = requestAnimationFrame(loop);
  }

  function render(now) {
    // Stream aberto mas totalmente mudo: quase sempre é outra aba/app segurando
    // o microfone. Sem este aviso o monitor fica eternamente "aguardando voz".
    if (now > 3000 && maxEnergySeen < 0.001) {
      $("monEmoji").textContent = "🔇";
      $("monLabel").textContent = "Não estou recebendo áudio";
      $("monLabel").style.color = "var(--valence)";
      $("monConfText").textContent =
        "Outra aba ou app pode estar usando o microfone — pare a gravação lá e reinicie aqui.";
      return;
    }

    const s = EmotionEngine.summarize(frames);
    const assessment = EmotionEngine.assess(frames);

    // --- Leitura principal ---
    if (!s || assessment.inconclusivo) {
      $("monEmoji").textContent = s ? "🤔" : "🎧";
      $("monLabel").textContent = s ? "Sinal fraco" : "Aguardando voz…";
      $("monLabel").style.color = "var(--text-dim)";
    } else {
      const emo = s.dominant;
      $("monEmoji").textContent = emo.emoji;
      $("monLabel").textContent = emo.label;
      $("monLabel").style.color = emo.color;
    }

    const conf = assessment.confianca || 0;
    $("monConfFill").style.width = Math.round(conf * 100) + "%";
    $("monConfText").textContent = "confiança " + conf.toFixed(2);

    // --- Sinais observáveis ---
    const sig = computeSignals(frames, s);
    setSignal("Engage", sig.engajamento, sig.engajamentoTxt);
    setSignal("Hesit", sig.hesitacao, sig.hesitacaoTxt);
    setSignal("Tension", sig.tensao, sig.tensaoTxt);

    // --- Mapa e tendência ---
    if (s) {
      const p = { x: s.valence / 100, y: 1 - s.energy / 100 };
      gridTrail.push(p);
      if (gridTrail.length > 45) gridTrail.shift();

      if (now - lastTrendAt > 1000) {
        lastTrendAt = now;
        trend.push({ t: now, valence: s.valence, energy: s.energy,
                     color: s.dominant.color, weak: assessment.inconclusivo });
        while (trend.length && now - trend[0].t > TREND_MS) trend.shift();
      }
    }
    drawGrid();
    drawTrend();
  }

  function setSignal(key, value, hint) {
    $("fill" + key).style.width = Math.round(value * 100) + "%";
    $("hint" + key).textContent = hint;
  }

  /**
   * Sinais que PODEM ser medidos com honestidade. Cada um vem com uma leitura
   * em linguagem de comportamento, nunca de julgamento.
   */
  function computeSignals(frames, s) {
    if (!frames.length || !s) {
      return { engajamento: 0, hesitacao: 0, tensao: 0,
               engajamentoTxt: "—", hesitacaoTxt: "—", tensaoTxt: "—" };
    }

    // Engajamento: energia e expressividade sustentadas
    const engajamento = clamp((s.energy * 0.55 + s.expressiveness * 0.45) / 100, 0, 1);

    // Hesitação: proporção de pausas na janela recente
    const hesitacao = clamp(s.silenceRatio / 60, 0, 1);

    // Tensão vocal: brilho espectral alto + instabilidade de pitch
    const voiced = frames.filter((f) => f.voiced);
    const meanCentroid = voiced.length
      ? voiced.reduce((a, f) => a + f.centroid, 0) / voiced.length : 0;
    const brightness = clamp((meanCentroid - 1200) / 2000, 0, 1);
    const jitter = clamp((s.pitchStd - 45) / 60, 0, 1);
    const tensao = clamp(brightness * 0.6 + jitter * 0.4, 0, 1);

    return {
      engajamento, hesitacao, tensao,
      engajamentoTxt:
        engajamento > 0.62 ? "voz ativa e variada"
        : engajamento < 0.3 ? "voz baixa e pouco variada"
        : "engajamento moderado",
      hesitacaoTxt:
        hesitacao > 0.62 ? "muitas pausas agora"
        : hesitacao < 0.2 ? "fala corrida, poucas pausas"
        : "pausas dentro do normal",
      tensaoTxt:
        tensao > 0.6 ? "voz mais tensa — pode ser esforço, pressa ou desconforto"
        : tensao < 0.25 ? "voz relaxada"
        : "tensão moderada",
    };
  }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /** Falhas precisam aparecer na tela, não só no console. */
  function fail(title, detail) {
    running = false;
    $("monEmoji").textContent = "⚠️";
    $("monLabel").textContent = title;
    $("monLabel").style.color = "var(--danger)";
    $("monConfText").textContent = detail;
    $("toggleBtn").textContent = "Iniciar";
    $("toggleBtn").classList.remove("on");
    $("liveDot").classList.remove("live");
  }

  // ---- Mapa valência × ativação, com rastro ----
  function drawGrid() {
    const cv = $("monGrid");
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);

    const quads = [
      [0, 0, "rgba(255,84,112,0.10)"],      // desagradável + agitado
      [w / 2, 0, "rgba(255,196,107,0.10)"], // agradável + agitado
      [0, h / 2, "rgba(108,139,255,0.10)"], // desagradável + quieto
      [w / 2, h / 2, "rgba(94,214,160,0.10)"],
    ];
    quads.forEach(([x, y, c]) => { ctx.fillStyle = c; ctx.fillRect(x, y, w / 2, h / 2); });

    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    // Rastro: o passado desvanece, o agora é sólido
    gridTrail.forEach((p, i) => {
      const age = i / gridTrail.length;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 2 + age * 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,138,91," + (0.06 + age * 0.35) + ")";
      ctx.fill();
    });

    const last = gridTrail[gridTrail.length - 1];
    if (last) {
      ctx.beginPath();
      ctx.arc(last.x * w, last.y * h, 13, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,138,91,0.22)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(last.x * w, last.y * h, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ff8a5b";
      ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
    }
  }

  // ---- Tendência dos últimos 60s ----
  function drawTrend() {
    const cv = $("monTrend");
    const ctx = cv.getContext("2d");
    // Só redimensiona quando muda: atribuir width/height limpa o canvas e é
    // caro para fazer a cada quadro.
    const wantW = Math.round(cv.clientWidth * devicePixelRatio);
    const wantH = Math.round(cv.clientHeight * devicePixelRatio);
    if (wantW > 0 && (cv.width !== wantW || cv.height !== wantH)) {
      cv.width = wantW;
      cv.height = wantH;
    }
    const w = cv.width, h = cv.height;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    if (trend.length < 2) return;

    const bw = w / Math.max(trend.length, 20);
    trend.forEach((p, i) => {
      const bh = Math.max(2, (p.energy / 100) * (h - 4));
      ctx.globalAlpha = p.weak ? 0.3 : 0.85;
      ctx.fillStyle = p.color;
      ctx.fillRect(i * bw, h - bh - 2, Math.max(1, bw - 1), bh);
    });
    ctx.globalAlpha = 1;

    // linha de valência por cima
    ctx.strokeStyle = "#ffc46b";
    ctx.lineWidth = 1.6 * devicePixelRatio;
    ctx.beginPath();
    trend.forEach((p, i) => {
      const x = i * bw + bw / 2;
      const y = h - (p.valence / 100) * (h - 6) - 3;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  // Suporte
  if (!navigator.mediaDevices) {
    $("monLabel").textContent = "Navegador sem suporte a microfone";
  }
  window.addEventListener("resize", drawTrend);
})();
