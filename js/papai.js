/*
 * papai.js — o acervo do Helio para a Vicky e o Toni.
 *
 * ---------------------------------------------------------------------------
 * POR QUE ESTE ARQUIVO QUEBRA UMA REGRA DO PROJETO, DE PROPÓSITO
 * ---------------------------------------------------------------------------
 * Em todo o resto do V&E o áudio é analisado e DESCARTADO — só números e
 * rótulos sobrevivem (Princípio 3: privacidade primeiro; e um dataset não
 * precisa da voz, precisa das medidas).
 *
 * Aqui é o contrário: o áudio É o produto. Um dia a Vicky e o Toni não vão
 * querer ler que o pai tinha "valência +0,8 e ativação 2,1" ao falar da mãe
 * deles — vão querer OUVIR. A medida vira nota de rodapé; a voz vira o
 * documento. Guardar só os números aqui seria guardar a sombra e jogar fora
 * a pessoa.
 *
 * A razão da regra original (voz de terceiros, dado íntimo exposto) continua
 * valendo e é respeitada de outro jeito: nada sai deste aparelho, nada entra
 * no Git, e quem fala é uma pessoa só, que é dona do que fala.
 *
 * ---------------------------------------------------------------------------
 * O QUE FAZ DISTO UM HISTÓRICO E NÃO UMA COLEÇÃO
 * ---------------------------------------------------------------------------
 * O pedido foi "histórico de opiniões". Histórico pressupõe mudança. Por isso
 * dois campos carregam o peso:
 *   · `certeza` (1-5) — o quanto ele estava firme naquele dia. Sem isso, um
 *     palpite de terça e uma convicção de vida chegam iguais aos filhos.
 *   · `revisaoDe` — a resposta nova aponta para a velha, e a velha NUNCA é
 *     apagada. O que eles recebem é a trajetória de um pensamento, não o
 *     último frame dele.
 *
 * Onde mora: metadados em localStorage, áudio em IndexedDB (blob de áudio não
 * cabe em localStorage — 5MB de cota estouram na terceira resposta).
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const CHAVE = "papai_registros_v1";
  const DB_NOME = "papai_v1";
  const DB_STORE = "audio";
  const FFT_SIZE = 2048;
  const MIN_REC_S = 4;      // abaixo disso não é resposta, é engano
  const MAX_REC_S = 360;    // 6 min: história de família precisa de espaço

  // Estado da resposta em curso
  let perguntaAtual = null;        // {id, texto, categoria}
  let categoriaFiltro = null;      // eixo escolhido em "1"
  let modo = "voz";
  let audioBlob = null;
  let revisaoDe = null;            // id do registro que esta resposta revisa
  let lastFrames = [];
  let lastAssessment = null;
  let meta = { para: "ambos", certeza: 3, abrir: "sempre" };
  let filtroCat = "todos", filtroPara = "todos";

  // ======================================================================
  // IndexedDB — só para os áudios
  // ======================================================================
  function abrirDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB_NOME, 1);
      r.onupgradeneeded = () => {
        if (!r.result.objectStoreNames.contains(DB_STORE)) r.result.createObjectStore(DB_STORE);
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function guardarAudio(id, blob) {
    const db = await abrirDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).put(blob, id);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  }
  async function buscarAudio(id) {
    const db = await abrirDB();
    return new Promise((res, rej) => {
      const req = db.transaction(DB_STORE, "readonly").objectStore(DB_STORE).get(id);
      req.onsuccess = () => res(req.result || null);
      req.onerror = () => rej(req.error);
    });
  }
  async function apagarAudio(id) {
    const db = await abrirDB();
    return new Promise((res) => {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).delete(id);
      tx.oncomplete = () => res();
      tx.onerror = () => res();
    });
  }

  // ======================================================================
  // Persistência dos metadados
  // ======================================================================
  const carregar = () => {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch { return []; }
  };
  function gravar(lista) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
      return true;
    } catch (e) {
      // Cota estourada é exatamente o cenário que este acervo não pode viver
      // em silêncio: o registro sumiria sem ninguém perceber.
      alert("O navegador recusou o registro (memória cheia). Exporte o acervo " +
            "agora, na seção 4, antes de qualquer outra coisa.");
      return false;
    }
  }

  // ======================================================================
  // 1 · Escolher a pergunta
  // ======================================================================
  function montarCategorias() {
    $("catRow").innerHTML = PapaiPerguntas.CATEGORIAS.map((c) => `
      <button class="pap-cat" data-cat="${c.id}" style="--cor:${c.cor}">
        <span class="pap-cat-emoji">${c.emoji}</span>
        <span class="pap-cat-nome">${c.nome}</span>
        <span class="pap-cat-desc">${c.descricao}</span>
        <span class="pap-cat-n" id="catN-${c.id}"></span>
      </button>`).join("");

    $("filtroCatRow").innerHTML =
      `<button class="chip selected" data-fcat="todos">Tudo</button>` +
      PapaiPerguntas.CATEGORIAS.map((c) =>
        `<button class="chip" data-fcat="${c.id}">${c.emoji} ${c.nome}</button>`).join("");
  }

  $("catRow").addEventListener("click", (e) => {
    const b = e.target.closest(".pap-cat");
    if (!b) return;
    const jaEra = categoriaFiltro === b.dataset.cat;
    categoriaFiltro = jaEra ? null : b.dataset.cat;
    document.querySelectorAll(".pap-cat").forEach((x) =>
      x.classList.toggle("selected", x.dataset.cat === categoriaFiltro));
    $("listaPerguntas").hidden = true;
    if (categoriaFiltro) sortearPergunta();
  });

  const idsRespondidos = () =>
    carregar().map((r) => r.pergunta && r.pergunta.id).filter(Boolean);

  function mostrarPergunta(p) {
    perguntaAtual = p;
    const c = PapaiPerguntas.porId(p.categoria);
    $("qCat").textContent = c ? `${c.emoji} ${c.nome}` : "✍️ Pergunta sua";
    $("qText").textContent = p.texto;
    $("questionBox").style.setProperty("--cor", c ? c.cor : "#98a2b8");
    $("responderRow").hidden = false;
  }

  function sortearPergunta() {
    const p = PapaiPerguntas.sortear(idsRespondidos(), categoriaFiltro);
    if (!p) { $("qText").textContent = "Acabaram as perguntas deste eixo."; return; }
    mostrarPergunta(p);
  }

  $("sortearBtn").addEventListener("click", () => { $("listaPerguntas").hidden = true; sortearPergunta(); });

  $("listarBtn").addEventListener("click", () => {
    const box = $("listaPerguntas");
    if (!box.hidden) { box.hidden = true; return; }
    const respondidas = idsRespondidos();
    const pool = PapaiPerguntas.todas()
      .filter((p) => !categoriaFiltro || p.categoria === categoriaFiltro);
    box.innerHTML = pool.map((p) => {
      const feito = respondidas.includes(p.id);
      return `<button class="pap-list-item${feito ? " feito" : ""}" data-pid="${p.id}">
        <span class="pap-list-mark">${feito ? "✓" : "○"}</span>
        <span>${p.texto}</span></button>`;
    }).join("");
    box.hidden = false;
  });

  $("listaPerguntas").addEventListener("click", (e) => {
    const b = e.target.closest(".pap-list-item");
    if (!b) return;
    const p = PapaiPerguntas.todas().find((x) => x.id === b.dataset.pid);
    if (p) { mostrarPergunta(p); $("listaPerguntas").hidden = true; }
  });

  $("livreBtn").addEventListener("click", () => {
    $("livreBox").hidden = !$("livreBox").hidden;
    if (!$("livreBox").hidden) $("livreInput").focus();
  });

  $("livreOkBtn").addEventListener("click", () => {
    const t = $("livreInput").value.trim();
    if (!t) return;
    mostrarPergunta({ id: null, texto: t, categoria: categoriaFiltro || "opiniao", livre: true });
    $("livreBox").hidden = true;
    $("livreInput").value = "";
  });

  $("responderBtn").addEventListener("click", () => abrirResposta());

  // ======================================================================
  // 2 · Responder
  // ======================================================================
  function abrirResposta() {
    if (!perguntaAtual) return;
    const c = PapaiPerguntas.porId(perguntaAtual.categoria);
    $("aCat").textContent = c ? `${c.emoji} ${c.nome}` : "✍️ Pergunta sua";
    $("aText").textContent = perguntaAtual.texto;
    $("answerCard").hidden = false;
    $("revelacao").hidden = true;
    $("metaBloco").hidden = true;
    $("previewBox").hidden = true;
    $("escritoInput").value = "";
    $("notaInput").value = "";
    audioBlob = null;
    lastFrames = [];
    lastAssessment = null;
    $("recHint").textContent = "Toque e fale como você fala. Sem ensaiar.";
    $("recTimer").textContent = "00:00";

    if (revisaoDe) {
      const velho = carregar().find((r) => r.id === revisaoDe);
      $("revisaoNota").hidden = false;
      $("revisaoNota").innerHTML = velho
        ? `🔄 Revisando o que você disse em <strong>${dataCurta(velho.data)}</strong>. ` +
          `A resposta antiga <strong>não será apagada</strong> — as duas ficam, lado a lado.`
        : "🔄 Revisão.";
    } else {
      $("revisaoNota").hidden = true;
    }
    $("answerCard").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("fecharRespostaBtn").addEventListener("click", fecharResposta);
  $("descartarBtn").addEventListener("click", () => {
    if (confirm("Descartar esta resposta?")) fecharResposta();
  });
  function fecharResposta() {
    pararGravacao(true);
    revisaoDe = null;
    $("answerCard").hidden = true;
  }

  $("modoRow").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $("modoRow").querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
    b.classList.add("selected");
    modo = b.dataset.modo;
    $("vozBloco").hidden = modo !== "voz";
    $("escritoBloco").hidden = modo !== "escrito";
    $("metaBloco").hidden = modo === "voz" && !audioBlob;
    atualizarSalvar();
  });

  $("escritoInput").addEventListener("input", atualizarSalvar);

  // ---------- Gravação: áudio E prosódia, do mesmo stream ----------
  let audioCtx, analyser, stream, sourceNode, rafId, timerId, recorder;
  let gravando = false, comecouEm = 0, chunks = [];
  const timeData = new Float32Array(FFT_SIZE);
  const freqData = new Uint8Array(FFT_SIZE / 2);

  function escolherMime() {
    const cands = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"];
    for (const m of cands) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
    }
    return "";  // deixa o navegador decidir (Safari antigo)
  }

  async function comecarGravacao() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        // autoGainControl desligado: ele achata justamente a variação de
        // energia que o motor mede. Mesma escolha do resto do V&E.
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
      });
    } catch {
      $("recHint").textContent = "Sem acesso ao microfone. Libere a permissão e tente de novo.";
      return;
    }
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    sourceNode.connect(analyser);

    chunks = [];
    const mime = escolherMime();
    try {
      recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch {
      recorder = new MediaRecorder(stream);
    }
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      // O blob só existe AQUI. Quem libera o botão "Guardar" é este callback,
      // e não a função que parou a gravação — ela roda antes do áudio ficar
      // pronto, e habilitar o botão lá deixava o acervo salvar registro sem voz.
      audioBlob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      $("previewAudio").src = URL.createObjectURL(audioBlob);
      $("previewBox").hidden = false;
      $("recHint").textContent = "\u2713 Guardado na memória. Ouça abaixo, ou siga.";
      atualizarSalvar();
    };
    recorder.start();

    lastFrames = [];
    gravando = true;
    comecouEm = performance.now();
    $("recBtn").classList.add("recording");
    $("recHint").textContent = "Falando… toque de novo quando terminar.";
    timerId = setInterval(tique, 200);
    laco();
  }

  function tique() {
    const s = Math.floor((performance.now() - comecouEm) / 1000);
    $("recTimer").textContent =
      `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    if (s >= MAX_REC_S) { pararGravacao(); return; }
    if (s >= MIN_REC_S && s % 30 === 0) {
      $("recHint").textContent = "Pode falar o quanto quiser. Toque para terminar.";
    }
  }

  function laco() {
    if (!gravando) return;
    analyser.getFloatTimeDomainData(timeData);
    analyser.getByteFrequencyData(freqData);
    const f = EmotionEngine.analyzeFrame(timeData, freqData, audioCtx.sampleRate, FFT_SIZE);
    lastFrames.push({ ...f, t: performance.now() - comecouEm });
    $("levelFill").style.width = Math.min(100, (f.energy / 0.10) * 100).toFixed(0) + "%";
    rafId = requestAnimationFrame(laco);
  }

  function pararGravacao(abortar = false) {
    if (!gravando) return;
    gravando = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (timerId) clearInterval(timerId);

    const dur = lastFrames.length ? lastFrames[lastFrames.length - 1].t / 1000 : 0;
    const curtaDemais = dur < MIN_REC_S;

    if (recorder && recorder.state !== "inactive") {
      // Desarmar o onstop ANTES do stop(): o blob descartado chegaria depois
      // desta função e ressuscitaria uma resposta que não serve.
      if (abortar || curtaDemais) recorder.onstop = null;
      recorder.stop();
    }
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (audioCtx) audioCtx.close();
    $("recBtn").classList.remove("recording");
    $("levelFill").style.width = "0%";
    if (abortar) return;

    if (curtaDemais) {
      $("recHint").textContent = `Só ${dur.toFixed(0)}s — fale um pouco mais.`;
      audioBlob = null;
      atualizarSalvar();
      return;
    }
    lastAssessment = EmotionEngine.assess(lastFrames);
    // O botão continua travado até o onstop entregar o áudio.
    $("recHint").textContent = "Fechando o áudio…";
    $("metaBloco").hidden = false;
    atualizarSalvar();
  }

  $("recBtn").addEventListener("click", () => {
    gravando ? pararGravacao() : comecarGravacao();
  });

  $("regravarBtn").addEventListener("click", () => {
    audioBlob = null; lastFrames = []; lastAssessment = null;
    $("previewBox").hidden = true;
    $("metaBloco").hidden = true;
    $("recTimer").textContent = "00:00";
    $("recHint").textContent = "Toque e fale de novo.";
    atualizarSalvar();
  });

  // ---------- Metadados ----------
  function ligarChips(rowId, campo, transformar = (v) => v) {
    $(rowId).addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $(rowId).querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
      b.classList.add("selected");
      meta[campo] = transformar(b.dataset[campo]);   // data-para / data-certeza / data-abrir
      if (campo === "abrir") $("abrirQuando").hidden = meta.abrir !== "momento";
    });
  }
  ligarChips("paraRow", "para");
  ligarChips("certezaRow", "certeza", (v) => parseInt(v, 10));
  ligarChips("abrirRow", "abrir");

  function atualizarSalvar() {
    const temConteudo = modo === "voz" ? !!audioBlob : $("escritoInput").value.trim().length > 10;
    $("salvarBtn").disabled = !temConteudo;
    $("faltando").textContent = temConteudo ? ""
      : (modo === "voz" ? "Grave a sua resposta para poder guardar."
                        : "Escreva um pouco mais para poder guardar.");
  }

  // ---------- Salvar ----------
  $("salvarBtn").addEventListener("click", async () => {
    const id = "papai-" + Date.now();
    const a = lastAssessment;
    const resumo = modo === "voz" && lastFrames.length ? EmotionEngine.summarize(lastFrames) : null;
    const dur = lastFrames.length ? lastFrames[lastFrames.length - 1].t / 1000 : 0;

    const reg = {
      id,
      data: new Date().toISOString(),
      origem: "papai",              // nunca se mistura com o dataset de treino
      fonte: "voz",
      tipo: modo,                   // "voz" | "escrito"
      pergunta: perguntaAtual
        ? { id: perguntaAtual.id, texto: perguntaAtual.texto, livre: !!perguntaAtual.livre }
        : null,
      categoria: perguntaAtual ? perguntaAtual.categoria : "opiniao",
      para: meta.para,              // "ambos" | "vicky" | "toni"
      certeza: meta.certeza,        // 1..5 — o eixo que faz disto um histórico
      abrir: meta.abrir === "momento"
        ? { quando: "momento", qual: $("abrirQuando").value.trim() || "no dia certo" }
        : { quando: meta.abrir },
      revisaoDe,                    // aponta para a opinião anterior; ela fica
      nota: $("notaInput").value.trim() || null,
      texto: modo === "escrito" ? $("escritoInput").value.trim() : null,
      audio: modo === "voz" && audioBlob
        ? { mime: audioBlob.type, bytes: audioBlob.size, duracaoS: +dur.toFixed(1) }
        : null,
      // Estrutura multicanal do framework: o que não foi medido aparece como
      // ausente, nunca como zero (ESTRATEGIA_DADOS.md).
      canais: { autorrelato: true, paralinguistico: modo === "voz",
                verbal: modo === "escrito", facial: false, corporal: false, interacional: false },
      observado: a ? a.observado : null,
      inferido: a && a.inferido
        ? { dimensoes: a.inferido.dimensoes, confianca: a.confianca,
            inconclusivo: a.inconclusivo, motorVersao: a.motorVersao,
            categoria: resumo ? resumo.dominant.key : null }
        : null,
    };

    if (audioBlob) {
      try { await guardarAudio(id, audioBlob); }
      catch {
        alert("Não consegui guardar o áudio neste aparelho (memória). " +
              "O texto e a leitura foram guardados, mas a voz não. Exporte agora.");
        reg.audio = null;
      }
    }

    const lista = carregar();
    lista.push(reg);
    if (!gravar(lista)) return;

    revelar(reg, resumo);
    revisaoDe = null;
    renderAcervo();
    atualizarProgresso();
    atualizarEspaco();
  });

  function revelar(reg, resumo) {
    $("metaBloco").hidden = true;
    $("previewBox").hidden = true;
    const inf = reg.inferido;
    if (!inf || inf.inconclusivo) {
      $("revelacaoTexto").textContent = reg.tipo === "escrito"
        ? "Guardado por escrito — sem leitura de voz, e tudo bem."
        : "A leitura ficou inconclusiva — pouca fala captada. O áudio está guardado do mesmo jeito, que é o que importa.";
      $("revelacaoDetalhe").textContent = "";
    } else {
      const d = inf.dimensoes;
      const dom = resumo ? resumo.dominant : null;
      $("revelacaoTexto").innerHTML =
        `${dom ? dom.emoji + " <strong>" + dom.label + "</strong> · " : ""}` +
        `${AffectGrid.describe(d)}`;
      $("revelacaoDetalhe").innerHTML =
        `valência ${d.valencia > 0 ? "+" : ""}${d.valencia} · ativação ${d.ativacao} ` +
        `· confiança ${inf.confianca} · motor v${inf.motorVersao}<br>` +
        `<em>É como a sua voz soou, não um veredito sobre o que você sentia.</em>`;
    }
    $("revelacao").hidden = false;
    $("revelacao").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  $("proximaBtn").addEventListener("click", () => {
    $("revelacao").hidden = true;
    sortearPergunta();
    if (perguntaAtual) abrirResposta();
  });
  $("pararBtn").addEventListener("click", () => {
    $("answerCard").hidden = true;
    $("acervoCard").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ======================================================================
  // 3 · O acervo
  // ======================================================================
  const dataCurta = (iso) =>
    new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  const CERTEZA_TXT = {
    1: "🤷 pensando alto", 2: "🤔 acho que é por aí", 3: "🙂 penso assim hoje",
    4: "💪 convicção", 5: "🪨 isso eu não mudo",
  };
  const PARA_TXT = { ambos: "👧🧒 os dois", vicky: "👧 Vicky", toni: "🧒 Toni" };

  /** Sobe a corrente de revisões até a resposta original. */
  function raiz(reg, porId) {
    let r = reg, guarda = 0;
    while (r.revisaoDe && porId[r.revisaoDe] && guarda++ < 50) r = porId[r.revisaoDe];
    return r.id;
  }

  function renderAcervo() {
    const todos = carregar();
    $("acervoCard").hidden = todos.length === 0;
    if (!todos.length) {
      // Esconder o cartão não basta: o HTML antigo continuava lá dentro e
      // reaparecia inteiro no próximo registro, como se nada tivesse sido
      // apagado. Tela escondida que guarda estado velho é tela que mente.
      $("registros").innerHTML = "";
      $("acervoStats").innerHTML = "";
      $("acervoContador").textContent = "—";
      PapaiPerguntas.CATEGORIAS.forEach((c) => {
        const el = $("catN-" + c.id);
        if (el) el.textContent = "";
      });
      return;
    }

    const porId = Object.fromEntries(todos.map((r) => [r.id, r]));

    // Estatísticas: o que conta é cobertura e mudança, não volume.
    const comVoz = todos.filter((r) => r.audio).length;
    const segundos = todos.reduce((s, r) => s + (r.audio ? r.audio.duracaoS : 0), 0);
    // Arredondar tudo para minuto mostrava "0 min" depois da primeira resposta
    // guardada — a tela dizia que não havia nada, e havia.
    const tempo = segundos >= 60 ? `${(segundos / 60).toFixed(0)} min` : `${Math.round(segundos)} s`;
    const revisoes = todos.filter((r) => r.revisaoDe).length;
    const eixos = new Set(todos.map((r) => r.categoria)).size;
    $("acervoStats").innerHTML = [
      [todos.length, "registros"],
      [tempo, "de voz guardada"],
      [`${eixos}/${PapaiPerguntas.CATEGORIAS.length}`, "eixos tocados"],
      [revisoes, "vezes que você mudou de ideia"],
    ].map(([v, l]) =>
      `<div class="std-stat"><div class="std-stat-val">${v}</div><div class="std-stat-label">${l}</div></div>`
    ).join("");
    $("acervoContador").textContent = `${todos.length} guardados · ${comVoz} com voz`;

    // Agrupa por corrente de revisão: cada assunto aparece UMA vez, com a
    // versão mais recente na frente e as anteriores embaixo. É isso que
    // transforma a lista em histórico.
    const correntes = {};
    todos.forEach((r) => {
      const k = raiz(r, porId);
      (correntes[k] = correntes[k] || []).push(r);
    });

    const blocos = Object.values(correntes)
      .map((c) => c.sort((a, b) => new Date(b.data) - new Date(a.data)))
      .filter((c) => {
        const atual = c[0];
        if (filtroCat !== "todos" && atual.categoria !== filtroCat) return false;
        if (filtroPara !== "todos" && atual.para !== filtroPara && atual.para !== "ambos") return false;
        return true;
      })
      .sort((a, b) => new Date(b[0].data) - new Date(a[0].data));

    $("registros").innerHTML = blocos.length
      ? blocos.map(renderBloco).join("")
      : `<p class="std-note">Nada neste filtro ainda.</p>`;

    // Contadores por eixo, na seção 1
    PapaiPerguntas.CATEGORIAS.forEach((c) => {
      const el = $("catN-" + c.id);
      if (el) {
        const n = todos.filter((r) => r.categoria === c.id).length;
        el.textContent = n ? `${n} guardado${n > 1 ? "s" : ""}` : "";
      }
    });
  }

  function renderBloco(corrente) {
    const atual = corrente[0];
    const antigos = corrente.slice(1);
    const c = PapaiPerguntas.porId(atual.categoria);
    const cor = c ? c.cor : "#98a2b8";

    return `
      <article class="pap-reg" style="--cor:${cor}">
        <div class="pap-reg-top">
          <span class="pap-reg-cat">${c ? c.emoji + " " + c.nome : "✍️"}</span>
          <span class="pap-reg-data">${dataCurta(atual.data)}</span>
        </div>
        <div class="pap-reg-q">${escapar(atual.pergunta ? atual.pergunta.texto : "—")}</div>
        ${corpoRegistro(atual)}
        <div class="pap-reg-tags">
          <span class="pap-tag">${PARA_TXT[atual.para] || ""}</span>
          <span class="pap-tag">${CERTEZA_TXT[atual.certeza] || ""}</span>
          ${atual.abrir && atual.abrir.quando === "18" ? `<span class="pap-tag">🎂 abrir aos 18</span>` : ""}
          ${atual.abrir && atual.abrir.quando === "momento"
            ? `<span class="pap-tag">✉️ ${escapar(atual.abrir.qual || "no dia certo")}</span>` : ""}
          ${atual.inferido && !atual.inferido.inconclusivo
            ? `<span class="pap-tag voz">🎚️ ${AffectGrid.describe(atual.inferido.dimensoes)}</span>` : ""}
        </div>
        ${atual.nota ? `<div class="pap-reg-nota">📝 ${escapar(atual.nota)}</div>` : ""}
        ${antigos.length ? `
          <details class="pap-historico">
            <summary>🔄 Como você pensava antes (${antigos.length})</summary>
            ${antigos.map((r) => `
              <div class="pap-reg-antigo">
                <div class="pap-reg-data">${dataCurta(r.data)} · ${CERTEZA_TXT[r.certeza] || ""}</div>
                ${corpoRegistro(r)}
                ${r.nota ? `<div class="pap-reg-nota">📝 ${escapar(r.nota)}</div>` : ""}
              </div>`).join("")}
          </details>` : ""}
        <div class="pap-reg-acoes">
          <button class="btn ghost sm" data-rever="${atual.id}">🔄 Hoje eu penso diferente</button>
          <button class="btn ghost sm" data-apagar="${atual.id}">🗑️</button>
        </div>
      </article>`;
  }

  function corpoRegistro(r) {
    if (r.tipo === "escrito" && r.texto) {
      return `<div class="pap-reg-texto">${escapar(r.texto)}</div>`;
    }
    if (r.audio) {
      return `<div class="pap-reg-audio" data-audio="${r.id}">
        <button class="pap-play" data-play="${r.id}">▶︎</button>
        <span class="pap-dur">${Math.round(r.audio.duracaoS)}s</span>
        <span class="pap-audio-slot"></span>
      </div>`;
    }
    return `<div class="pap-reg-texto vazio">— sem conteúdo —</div>`;
  }

  const escapar = (s) => String(s || "").replace(/[&<>"]/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  // Tocar, revisar, apagar
  $("registros").addEventListener("click", async (e) => {
    const play = e.target.closest("[data-play]");
    if (play) {
      const id = play.dataset.play;
      const slot = play.parentElement.querySelector(".pap-audio-slot");
      if (slot.querySelector("audio")) return;
      const blob = await buscarAudio(id);
      if (!blob) { slot.textContent = "áudio não está neste aparelho"; return; }
      const el = document.createElement("audio");
      el.controls = true;
      el.src = URL.createObjectURL(blob);
      slot.innerHTML = "";
      slot.appendChild(el);
      el.play();
      play.remove();
      return;
    }

    const rever = e.target.closest("[data-rever]");
    if (rever) {
      const velho = carregar().find((r) => r.id === rever.dataset.rever);
      if (!velho) return;
      revisaoDe = velho.id;
      mostrarPergunta({
        id: velho.pergunta ? velho.pergunta.id : null,
        texto: velho.pergunta ? velho.pergunta.texto : "—",
        categoria: velho.categoria,
        livre: velho.pergunta ? velho.pergunta.livre : false,
      });
      abrirResposta();
      return;
    }

    const apagar = e.target.closest("[data-apagar]");
    if (apagar) {
      if (!confirm("Apagar este registro? A voz vai junto, e não volta.")) return;
      const id = apagar.dataset.apagar;
      await apagarAudio(id);
      gravar(carregar().filter((r) => r.id !== id));
      renderAcervo();
      atualizarProgresso();
      atualizarEspaco();
    }
  });

  $("filtroCatRow").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $("filtroCatRow").querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
    b.classList.add("selected");
    filtroCat = b.dataset.fcat;
    renderAcervo();
  });
  $("filtroParaRow").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $("filtroParaRow").querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
    b.classList.add("selected");
    filtroPara = b.dataset.fpara;
    renderAcervo();
  });

  // ======================================================================
  // 4 · Exportar, restaurar, espaço
  // ======================================================================
  const blobParaDataURL = (blob) => new Promise((res) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.readAsDataURL(blob);
  });

  function baixar(objeto, nome) {
    const blob = new Blob([JSON.stringify(objeto, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
    // A data do backup é carimbada aqui, no ato — e não por um timer paralelo,
    // que corria contra o empacotamento e às vezes perdia.
    localStorage.setItem("papai_ultimo_export", new Date().toISOString());
    atualizarEspaco();
  }

  function envelope(registros) {
    return {
      versao: 1,
      acervo: "Papai",
      de: "Helio Prandini",
      para: ["Vicky", "Toni"],
      projeto: "AE — Artificial Emotion / Voice&Emotion",
      descricao:
        "Histórico de opiniões, decisões morais e sentimentos, com a voz de quem falou. " +
        "Cada registro tem data e o quanto havia de certeza naquele dia. " +
        "Quando uma opinião muda, a anterior permanece: 'revisaoDe' liga as duas. " +
        "As leituras de emoção são correlatos acústicos — descrevem como a voz soou, " +
        "não afirmam o que a pessoa sentia.",
      exportadoEm: new Date().toISOString(),
      registros,
    };
  }

  $("exportTextoBtn").addEventListener("click", () => {
    const todos = carregar();
    if (!todos.length) { alert("Nada guardado ainda."); return; }
    baixar(envelope(todos), `papai-palavras-${new Date().toISOString().slice(0, 10)}.json`);
  });

  $("exportTudoBtn").addEventListener("click", async () => {
    const todos = carregar();
    if (!todos.length) { alert("Nada guardado ainda."); return; }
    const btn = $("exportTudoBtn");
    const rotulo = btn.textContent;
    btn.disabled = true;

    const saida = [];
    for (let i = 0; i < todos.length; i++) {
      btn.textContent = `Empacotando ${i + 1}/${todos.length}…`;
      const r = { ...todos[i] };
      if (r.audio) {
        const blob = await buscarAudio(r.id);
        // Áudio embutido em base64: o arquivo fica maior, mas é UM arquivo —
        // e um arquivo só é o que sobrevive a dez anos de mudança de aparelho.
        if (blob) r.audio = { ...r.audio, dados: await blobParaDataURL(blob) };
        else r.audio = { ...r.audio, ausente: true };
      }
      saida.push(r);
    }
    baixar(envelope(saida), `papai-acervo-${new Date().toISOString().slice(0, 10)}.json`);
    btn.disabled = false;
    btn.textContent = rotulo;
  });

  $("importInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let pacote;
    try { pacote = JSON.parse(await file.text()); }
    catch { alert("Não consegui ler este arquivo."); return; }
    const vindos = pacote.registros || pacote.amostras || [];
    if (!Array.isArray(vindos) || !vindos.length) { alert("Arquivo sem registros."); return; }

    const atuais = carregar();
    const jaTem = new Set(atuais.map((r) => r.id));
    let novos = 0, comVoz = 0;
    for (const r of vindos) {
      if (jaTem.has(r.id)) continue;
      const copia = { ...r };
      if (copia.audio && copia.audio.dados) {
        try {
          const blob = await (await fetch(copia.audio.dados)).blob();
          await guardarAudio(copia.id, blob);
          comVoz++;
        } catch { /* segue sem a voz: o texto ainda vale */ }
        delete copia.audio.dados;
      }
      atuais.push(copia);
      novos++;
    }
    gravar(atuais);
    renderAcervo();
    atualizarProgresso();
    atualizarEspaco();
    alert(`${novos} registro(s) restaurado(s), ${comVoz} com a voz.`);
    e.target.value = "";
  });

  $("limparBtn").addEventListener("click", async () => {
    if (!confirm("Apagar TODO o acervo deste aparelho?\n\nSe você não exportou, não tem volta.")) return;
    if (!confirm("Confirma mesmo? A voz gravada some junto.")) return;
    for (const r of carregar()) await apagarAudio(r.id);
    localStorage.removeItem(CHAVE);
    renderAcervo();
    atualizarProgresso();
    atualizarEspaco();
  });

  async function atualizarEspaco() {
    const todos = carregar();
    const bytes = todos.reduce((s, r) => s + (r.audio ? r.audio.bytes : 0), 0);
    let texto = `Guardado neste aparelho: <strong>${(bytes / 1048576).toFixed(1)} MB</strong> de voz.`;
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        if (est.quota) {
          const pct = (est.usage / est.quota) * 100;
          texto += ` Cota do navegador: ${(est.quota / 1073741824).toFixed(1)} GB, ` +
                   `${pct.toFixed(1)}% em uso.`;
        }
      } catch { /* navegador sem a API: o número acima já basta */ }
    }
    if (navigator.storage && navigator.storage.persisted) {
      try {
        const durar = await navigator.storage.persisted();
        texto += durar
          ? ` <span style="color:var(--flow)">Armazenamento durável: ligado.</span>`
          : ` <span style="color:var(--warm)">Armazenamento durável: não concedido — ` +
            `adicione esta página à tela de início para o navegador respeitá-la.</span>`;
      } catch { /* sem a API */ }
    }
    const ultima = localStorage.getItem("papai_ultimo_export");
    texto += ultima
      ? `<br>Último backup: <strong>${dataCurta(ultima)}</strong>.`
      : `<br><strong>⚠️ Você nunca exportou este acervo.</strong>`;
    $("espacoNota").innerHTML = texto;
  }
  function atualizarProgresso() {
    const total = PapaiPerguntas.todas().length;
    const feitas = new Set(idsRespondidos()).size;
    $("progressoGeral").textContent = `${feitas} de ${total} perguntas`;
  }

  // ======================================================================
  // Início
  // ======================================================================

  /**
   * Pede ao navegador que NÃO despeje este acervo sozinho.
   *
   * Sem isto, IndexedDB é "best effort": quando o aparelho fica sem espaço, o
   * navegador apaga dados de sites por conta própria, sem avisar ninguém. Para
   * um cache isso é correto; para a voz de um pai é catastrófico. `persist()`
   * marca o armazenamento como durável — no Safari e no Chrome o pedido é
   * concedido quando o site foi adicionado à tela de início ou é usado com
   * frequência, que é exatamente o caso aqui.
   *
   * Não substitui o backup: o aparelho ainda pode quebrar ou ser trocado.
   * É a primeira das duas travas, não a única.
   */
  async function pedirPersistencia() {
    if (!navigator.storage || !navigator.storage.persist) return;
    try {
      const jaE = navigator.storage.persisted ? await navigator.storage.persisted() : false;
      if (!jaE) await navigator.storage.persist();
    } catch { /* navegador sem a API: o aviso da seção 4 segue valendo */ }
  }
  pedirPersistencia();

  montarCategorias();
  atualizarProgresso();
  renderAcervo();
  atualizarEspaco();
  sortearPergunta();

  // Sair no meio de uma gravação é perder a resposta inteira.
  window.addEventListener("beforeunload", (e) => {
    if (gravando || audioBlob) { e.preventDefault(); e.returnValue = ""; }
  });
})();
