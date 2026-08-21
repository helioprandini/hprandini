/*
 * diario.js — Diário de Voz: amostragem do dia inteiro (Experience Sampling).
 *
 * Por que existe: gravação de reunião cobre uma faixa emocional estreita. O
 * primeiro dataset mostrou isso — a valência do usuário nunca entrou no lado
 * negativo. Um motor treinado só nisso aprende "a pessoa em reunião".
 *
 * Método (Csikszentmihalyi & Larson, 1987): avisos em horários ALEATÓRIOS ao
 * longo do dia; a pessoa registra o estado NO MOMENTO, não em retrospecto.
 *
 * Decisão de desenho — sorteio de MOMENTOS, não gravação contínua:
 *   · gravação passiva o dia todo não é possível no iOS;
 *   · gravaria terceiros sem consentimento;
 *   · e daria dado PIOR, porque o rótulo viria horas depois, quando a memória
 *     emocional já decaiu e foi reescrita pelo desfecho.
 * O aviso sorteado ganha nos três critérios.
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const FFT_SIZE = 2048;
  const STORAGE_KEY = "vem_diario_v1";
  const SCHEDULE_KEY = "vem_diario_agenda_v1";
  const MIN_GAP_MIN = 45;   // espaçamento mínimo entre avisos
  const BUFFER_MIN = 10;    // folga mínima entre "sortear" e o primeiro aviso
  const MIN_REC_S = 8;      // abaixo disso não há fala suficiente para ler

  let count = 5;
  let schedule = [];        // [{at: ms, done: bool}]
  let timers = [];
  let gridPoint = null;
  let label = { contexto: null, companhia: null, affect: null, feeling: null };
  let lastAssessment = null;
  let lastFrames = [];

  // ---------- Áudio ----------
  let audioCtx, analyser, stream, sourceNode, rafId, timerId;
  let recording = false, startedAt = 0;
  const timeData = new Float32Array(FFT_SIZE);
  const freqData = new Uint8Array(FFT_SIZE / 2);

  async function startRec() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
      });
    } catch (err) {
      $("recHint").textContent = "Sem acesso ao microfone. Libere a permissão e tente de novo.";
      return;
    }
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    sourceNode.connect(analyser);

    lastFrames = [];
    recording = true;
    startedAt = performance.now();
    $("recBtn").classList.add("recording");
    $("recHint").textContent = "Falando… toque de novo quando terminar";
    timerId = setInterval(tick, 200);
    loop();
  }

  function tick() {
    const s = Math.floor((performance.now() - startedAt) / 1000);
    $("recTimer").textContent =
      `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    if (s >= MIN_REC_S) $("recHint").textContent = "Pode parar quando quiser — já tem material";
  }

  function loop() {
    if (!recording) return;
    analyser.getFloatTimeDomainData(timeData);
    analyser.getByteFrequencyData(freqData);
    const f = EmotionEngine.analyzeFrame(timeData, freqData, audioCtx.sampleRate, FFT_SIZE);
    lastFrames.push({ ...f, t: performance.now() - startedAt });
    $("levelFill").style.width = Math.min(100, (f.energy / 0.10) * 100).toFixed(0) + "%";
    rafId = requestAnimationFrame(loop);
  }

  function stopRec() {
    recording = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (timerId) clearInterval(timerId);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (audioCtx) audioCtx.close();
    $("recBtn").classList.remove("recording");
    $("levelFill").style.width = "0%";

    const dur = lastFrames.length ? lastFrames[lastFrames.length - 1].t / 1000 : 0;
    if (dur < MIN_REC_S) {
      $("recHint").textContent =
        `Só ${dur.toFixed(0)}s — preciso de pelo menos ${MIN_REC_S}s de fala. Tente de novo.`;
      return;
    }

    lastAssessment = EmotionEngine.assess(lastFrames);
    // O áudio some aqui: nunca foi guardado, só as medidas.
    $("recHint").textContent = "✓ Gravado. Agora me diga como você está.";
    $("contextBlock").hidden = false;
    updateSaveState();
  }

  $("recBtn").addEventListener("click", () => (recording ? stopRec() : startRec()));

  // ---------- Sorteio dos horários ----------

  $("countRow").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $("countRow").querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
    b.classList.add("selected");
    count = parseInt(b.dataset.n, 10);
  });

  /**
   * Sorteia N horários dentro da janela, com espaçamento mínimo.
   * Sem o espaçamento, o acaso agrupa avisos e o dia fica mal amostrado.
   */
  function sortearHorarios(deMin, ateMin, n) {
    const janela = ateMin - deMin;
    if (janela <= 0) return [];
    // Se não couber com folga, reduz a quantidade em vez de amontoar.
    const maxCabe = Math.floor(janela / MIN_GAP_MIN) + 1;
    n = Math.min(n, maxCabe);

    for (let tentativa = 0; tentativa < 200; tentativa++) {
      const pts = Array.from({ length: n }, () => deMin + Math.random() * janela)
        .sort((a, b) => a - b);
      let ok = true;
      for (let i = 1; i < pts.length; i++) {
        if (pts[i] - pts[i - 1] < MIN_GAP_MIN) { ok = false; break; }
      }
      if (ok) return pts.map(Math.round);
    }
    // Fallback determinístico: distribui uniformemente com jitter pequeno.
    const passo = janela / n;
    return Array.from({ length: n }, (_, i) =>
      Math.round(deMin + passo * (i + 0.5) + (Math.random() - 0.5) * passo * 0.4));
  }

  const paraMinutos = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const paraTexto = (min) =>
    `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

  $("startBtn").addEventListener("click", async () => {
    const de = paraMinutos($("fromTime").value);
    const ate = paraMinutos($("toTime").value);
    if (ate <= de) { alert("O horário final precisa ser depois do inicial."); return; }

    // O sorteio só pode cair no futuro.
    //
    // Antes ele sorteava na janela inteira e marcava como "done" o que já tinha
    // passado. Quem configurasse às 13h com janela desde as 9h pedia 5 avisos e
    // recebia 3 sem entender por quê — e os horários mortos ainda iam para o
    // calendário. Amostra perdida em silêncio é o pior tipo: some do dataset
    // sem deixar rastro.
    const agora = new Date();
    const agoraMin = agora.getHours() * 60 + agora.getMinutes();
    const deEfetivo = Math.max(de, agoraMin + BUFFER_MIN);
    if (ate - deEfetivo < MIN_GAP_MIN) {
      alert("Já é tarde para a janela de hoje. Aumente o horário final, ou use " +
            "\"Gravar agora\" para registrar este momento.");
      return;
    }

    const minutos = sortearHorarios(deEfetivo, ate, count);
    if (!minutos.length) { alert("Janela curta demais para sortear."); return; }
    $("windowNote").textContent = deEfetivo > de
      ? `Sorteado às ${paraTexto(agoraMin)}, então o dia útil começa em ` +
        `${paraTexto(deEfetivo)} — ${minutos.length} aviso(s) hoje` +
        (minutos.length < count ? `, não ${count}: não cabe mais na janela.` : ".")
      : "";
    $("windowNote").hidden = deEfetivo <= de;

    const hoje = new Date();
    schedule = minutos.map((m) => {
      const d = new Date(hoje);
      d.setHours(Math.floor(m / 60), m % 60, 0, 0);
      return { at: d.getTime(), done: d.getTime() < Date.now() };
    });
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));

    // Notificação do navegador: ajuda no computador, e só.
    //
    // No iPhone o Safari só oferece notificação para site adicionado à Tela de
    // Início, e mesmo assim a aba congela no bolso. Quem manda de verdade é o
    // calendário do aparelho — por isso o texto abaixo nunca trata a falta de
    // permissão como problema a resolver: aponta para o botão que resolve.
    let permOK = false;
    if ("Notification" in window) {
      try {
        const p = await Notification.requestPermission();
        permOK = p === "granted";
      } catch { /* Safari antigo rejeita a chamada; o calendário cobre. */ }
    }
    $("permNote").textContent = permOK
      ? "🔔 Aviso do navegador ligado — funciona com esta aba aberta. Com o " +
        "telefone no bolso, quem avisa é o calendário: baixe os alarmes abaixo."
      : "🔔 Este navegador não avisa sozinho — normal no iPhone. Baixe os " +
        "alarmes abaixo e o calendário do aparelho faz o trabalho.";

    renderSchedule();
    armarTimers();
    $("stopBtn").hidden = false;
    $("scheduleBox").hidden = false;
  });

  $("stopBtn").addEventListener("click", () => {
    timers.forEach(clearTimeout);
    timers = [];
    schedule = [];
    localStorage.removeItem(SCHEDULE_KEY);
    $("scheduleBox").hidden = true;
    $("stopBtn").hidden = true;
  });

  $("nowBtn").addEventListener("click", () => abrirCaptura("fora do sorteio"));

  /**
   * Exporta os horários sorteados como eventos de calendário (.ics) com alarme.
   *
   * Por que isto existe: no iPhone o navegador congela abas em segundo plano,
   * então `setTimeout` NÃO dispara com o telefone no bolso. O calendário do
   * próprio aparelho, sim — o alerta é nativo e confiável. Importado uma vez,
   * o dia inteiro fica agendado sem depender do navegador estar aberto.
   */
  $("icsBtn").addEventListener("click", () => {
    if (!schedule.length) { alert("Sorteie os horários primeiro."); return; }

    // Só o que ainda vai acontecer. Evento no passado não dispara alarme —
    // só enche o calendário de lembrete morto.
    const futuros = schedule.filter((s) => s.at > Date.now());
    if (!futuros.length) {
      alert("Todos os horários de hoje já passaram. Sorteie de novo.");
      return;
    }

    const pad = (n) => String(n).padStart(2, "0");
    const utc = (ms) => {
      const d = new Date(ms);
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
             `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    };
    const url = location.href.split("#")[0];

    const linhas = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Voice&Emotion//Diario de Voz//PT",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    ];
    futuros.forEach((s, i) => {
      linhas.push(
        "BEGIN:VEVENT",
        `UID:vem-diario-${s.at}-${i}@voiceemotion`,
        `DTSTAMP:${utc(Date.now())}`,
        `DTSTART:${utc(s.at)}`,
        `DTEND:${utc(s.at + 5 * 60000)}`,
        "SUMMARY:🎙️ Como você está agora?",
        `DESCRIPTION:20 segundos de voz + como você se sente. Abra: ${url}`,
        `URL:${url}`,
        "BEGIN:VALARM", "ACTION:DISPLAY",
        "DESCRIPTION:Voice&Emotion — registre o momento",
        "TRIGGER:PT0M", "END:VALARM",
        "END:VEVENT"
      );
    });
    linhas.push("END:VCALENDAR");

    const blob = new Blob([linhas.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `diario-de-voz-${new Date().toISOString().slice(0, 10)}.ics`;
    a.click();
  });

  function armarTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    schedule.forEach((s, i) => {
      const espera = s.at - Date.now();
      if (s.done || espera <= 0) return;
      timers.push(setTimeout(() => {
        s.done = true;
        localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
        renderSchedule();
        avisar(i);
      }, espera));
    });
  }

  function avisar(i) {
    if ("Notification" in window && Notification.permission === "granted") {
      const n = new Notification("Como você está agora?", {
        body: "20 segundos de voz + como você se sente. Leva menos de um minuto.",
        tag: "vem-diario",
      });
      n.onclick = () => { window.focus(); abrirCaptura("horário sorteado"); };
    }
    abrirCaptura("horário sorteado");
  }

  function renderSchedule() {
    const agora = Date.now();
    const proximo = schedule.find((s) => !s.done && s.at > agora);
    $("timesList").innerHTML = schedule.map((s) => {
      const d = new Date(s.at);
      const cls = s.done ? "done" : (s === proximo ? "next" : "");
      return `<span class="dia-time ${cls}">${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}</span>`;
    }).join("");
  }

  // ---------- Captura ----------

  function abrirCaptura(origem) {
    label = { contexto: null, companhia: null, affect: null, feeling: null };
    gridPoint = null;
    lastFrames = [];
    lastAssessment = null;

    $("captureCard").hidden = false;
    $("contextBlock").hidden = true;
    $("diaReveal").hidden = true;
    $("recTimer").textContent = "00:00";
    $("recHint").textContent = "Toque para começar";
    $("captureWhen").textContent =
      `${origem} · ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    document.querySelectorAll("#ctxRow .chip, #companyRow .chip, #diaFeelRow .chip")
      .forEach((c) => c.classList.remove("selected"));
    $("diaReadout").innerHTML =
      "👆 <strong>Clique dentro do quadrado acima</strong> — direita = agradável, esquerda = desagradável, em cima = agitado, embaixo = quieto.";
    drawGrid();
    $("captureCard").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function wireRow(rowId, attr, field) {
    $(rowId).addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $(rowId).querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
      b.classList.add("selected");
      label[field] = b.dataset[attr];
      updateSaveState();
    });
  }
  wireRow("ctxRow", "ctx", "contexto");
  wireRow("companyRow", "comp", "companhia");
  wireRow("diaFeelRow", "feel", "feeling");

  function updateSaveState() {
    const falta = [];
    if (!label.contexto) falta.push("<strong>onde</strong> você está");
    if (!label.companhia) falta.push("<strong>com quem</strong>");
    if (!label.affect) falta.push("<strong>o ponto na grade</strong>");
    $("saveDiaBtn").disabled = falta.length > 0;
    $("diaMissing").innerHTML = falta.length
      ? "Para salvar, falta: " + falta.join(", ") + "."
      : "✓ Pronto para salvar.";
    $("diaMissing").classList.toggle("ready", falta.length === 0);
  }

  // ---------- Grade ----------
  function drawGrid() { AffectGrid.draw($("diaGrid"), gridPoint); }

  function setPoint(cx, cy) {
    const r = $("diaGrid").getBoundingClientRect();
    gridPoint = {
      x: Math.min(1, Math.max(0, (cx - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (cy - r.top) / r.height)),
    };
    drawGrid();
    label.affect = AffectGrid.toDims(gridPoint);
    $("diaReadout").innerHTML =
      `<strong>${AffectGrid.describe(label.affect)}</strong> · valência ` +
      `${label.affect.valencia > 0 ? "+" : ""}${label.affect.valencia} · ativação ${label.affect.ativacao}`;
    updateSaveState();
  }
  $("diaGrid").addEventListener("pointerdown", (e) => { e.preventDefault(); setPoint(e.clientX, e.clientY); });

  // ---------- Salvar ----------

  $("discardBtn").addEventListener("click", () => { $("captureCard").hidden = true; });

  $("saveDiaBtn").addEventListener("click", () => {
    const a = lastAssessment;
    const eng = a && a.inferido ? a.inferido.dimensoes : null;
    const resumo = EmotionEngine.summarize(lastFrames);

    const reg = {
      id: "diario-" + Date.now(),
      data: new Date().toISOString(),
      origem: "diario",            // separa da distribuição de reunião
      fonte: "voz",
      origem_rotulo: "humano",
      qualidade: "limpa",          // só a voz de quem rotula, por construção
      canais: { autorrelato: true, paralinguistico: true,
                verbal: false, facial: false, corporal: false, interacional: false },
      contexto: { onde: label.contexto, comQuem: label.companhia,
                  hora: new Date().getHours() },
      relatado: { speaker: "eu", affect: label.affect, feeling: label.feeling },
      observado: a ? a.observado : null,
      inferido: eng
        ? { dimensoes: eng, confianca: a.confianca, inconclusivo: a.inconclusivo, motorVersao: a.motorVersao,
            categoria: resumo ? resumo.dominant.key : null }
        : null,
      nota: "Fala sob demanda (Experience Sampling) — estado real, produção vocal um pouco mais monitorada.",
    };
    salvar(reg);
    revelar(reg);
    renderDia();
  });

  function revelar(reg) {
    if (!reg.inferido) {
      $("diaYou").textContent = AffectGrid.describe(reg.relatado.affect);
      $("diaEngine").textContent = "sem leitura";
      $("diaVerdict").textContent = "não sei";
      $("diaVerdict").className = "std-vs meh";
      $("diaDetail").textContent = "Não captei fala suficiente para uma leitura.";
      $("diaReveal").hidden = false;
      return;
    }
    const you = reg.relatado.affect, eng = reg.inferido.dimensoes;
    $("diaYou").textContent = AffectGrid.describe(you);
    $("diaEngine").textContent = reg.inferido.inconclusivo ? "inconclusivo" : AffectGrid.describe(eng);

    const erro = (Math.abs(you.valencia - eng.valencia) / 4 +
                  Math.abs(you.ativacao - eng.ativacao) / 3) / 2;
    const v = $("diaVerdict");
    if (reg.inferido.inconclusivo) { v.textContent = "não sei"; v.className = "std-vs meh"; }
    else if (erro < 0.15) { v.textContent = "bateu"; v.className = "std-vs ok"; }
    else if (erro < 0.3) { v.textContent = "perto"; v.className = "std-vs meh"; }
    else { v.textContent = "errou"; v.className = "std-vs off"; }

    $("diaDetail").innerHTML =
      `Você: valência ${fmtN(you.valencia)}, ativação ${you.ativacao} · ` +
      `Motor: valência ${fmtN(eng.valencia)}, ativação ${eng.ativacao} ` +
      `(confiança ${reg.inferido.confianca})`;
    $("diaReveal").hidden = false;
  }
  const fmtN = (n) => (n > 0 ? "+" : "") + n;

  $("diaDoneBtn").addEventListener("click", () => { $("captureCard").hidden = true; });

  // ---------- Persistência e mapa do dia ----------

  const carregar = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  };
  function salvar(reg) {
    const all = carregar();
    all.push(reg);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  const CORES = {
    trabalho: "#6c8bff", reuniao: "#b085ff", casa: "#5ed6a0",
    transito: "#ffc46b", lazer: "#ff8a5b", outro: "#98a2b8",
  };

  function renderDia() {
    const all = carregar();
    if (!all.length) { $("dayCard").hidden = true; return; }
    $("dayCard").hidden = false;

    // Mapa: cada momento do dia como um ponto, colorido pelo contexto.
    const cv = $("dayMap");
    AffectGrid.draw(cv, null);
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height;
    all.forEach((r) => {
      if (!r.relatado || !r.relatado.affect) return;
      const p = AffectGrid.fromDims(r.relatado.affect);
      const cor = CORES[r.contexto && r.contexto.onde] || "#98a2b8";
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 9, 0, Math.PI * 2);
      ctx.fillStyle = cor;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    const usados = [...new Set(all.map((r) => r.contexto && r.contexto.onde).filter(Boolean))];
    $("dayLegend").innerHTML = usados.map((c) =>
      `<span><span class="dot" style="background:${CORES[c] || "#98a2b8"}"></span>${c}</span>`).join("");

    // O número que importa: quanto da grade a vida real ocupou.
    const vals = all.filter((r) => r.relatado && r.relatado.affect).map((r) => r.relatado.affect);
    const vMin = Math.min(...vals.map((v) => v.valencia));
    const vMax = Math.max(...vals.map((v) => v.valencia));
    const aMin = Math.min(...vals.map((v) => v.ativacao));
    const aMax = Math.max(...vals.map((v) => v.ativacao));
    const negativos = vals.filter((v) => v.valencia < -0.2).length;

    $("diaStats").innerHTML = [
      [all.length, "momentos registrados"],
      [`${vMin.toFixed(1)} a ${vMax.toFixed(1)}`, "faixa de valência"],
      [`${aMin.toFixed(1)} a ${aMax.toFixed(1)}`, "faixa de ativação"],
      [negativos, "momentos no lado negativo"],
    ].map(([v, l]) =>
      `<div class="std-stat"><div class="std-stat-val">${v}</div><div class="std-stat-label">${l}</div></div>`
    ).join("");

    $("dayNote").textContent = negativos === 0
      ? "Ainda não há nenhum momento no lado desagradável. Se o dia tiver um, registre — é justamente o que falta no dataset de reunião."
      : `${negativos} momento(s) no lado negativo — é esse contraste que o dataset de reunião não tinha.`;
  }

  $("diaExportBtn").addEventListener("click", () => {
    const all = carregar();
    if (!all.length) { alert("Nada registrado ainda."); return; }
    const blob = new Blob([JSON.stringify({
      versao: 1,
      projeto: "AE — Artificial Emotion / Voice&Emotion",
      descricao: "Diário de Voz: momentos sorteados do dia, rotulados no instante (Experience Sampling).",
      exportadoEm: new Date().toISOString(),
      amostras: all,
    }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vem-diario-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  });

  $("diaClearBtn").addEventListener("click", () => {
    if (confirm("Apagar todos os momentos registrados?")) {
      localStorage.removeItem(STORAGE_KEY);
      renderDia();
    }
  });

  // ---------- Início ----------
  try {
    const salva = JSON.parse(localStorage.getItem(SCHEDULE_KEY));
    if (salva && salva.length) {
      const hoje = new Date().toDateString();
      if (new Date(salva[0].at).toDateString() === hoje) {
        schedule = salva;
        renderSchedule();
        armarTimers();
        $("scheduleBox").hidden = false;
        $("stopBtn").hidden = false;
      }
    }
  } catch { /* agenda antiga inválida: ignora */ }

  drawGrid();
  renderDia();
})();
