/* HeRo — motor do guia. Sem dependências externas. */
(function () {
  'use strict';

  var C = HERO_CIDADE, R = HERO_RESTAURANTES, K = HERO_CURADORIA;
  var LS_CMT = 'hero.comentarios.' + C.id;
  var LS_PREF = 'hero.pref.' + C.id;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]; }); };
  var byId = {}; R.forEach(function (r) { byId[r.id] = r; });

  /* ---------- armazenamento tolerante a falhas ---------- */
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  var comentarios = load(LS_CMT, {});
  var pref = load(LS_PREF, { autor: 'Helio', tema: null });

  /* ---------- moeda ---------- */
  var taxa = C.cambio.valor;
  function brl(q) {
    if (q == null) return null;
    var v = q * taxa;
    return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  function qar(q) { return q == null ? null : 'QAR ' + q.toLocaleString('pt-BR'); }
  function faixa(r, dobro) {
    if (!r.precoQar) return 'preço não confirmado';
    var m = dobro ? 2 : 1;
    var a = r.precoQar[0] * m, b = r.precoQar[1] * m;
    if (a === b) return qar(a) + ' · ' + brl(a);
    return 'QAR ' + a + '–' + b + ' · R$ ' + Math.round(a * taxa) + '–' + Math.round(b * taxa);
  }

  /* ---------- geolocalização ---------- */
  var minhaPos = null;
  function hav(a1, o1, a2, o2) {
    var Rk = 6371, t = Math.PI / 180;
    var d1 = (a2 - a1) * t, d2 = (o2 - o1) * t;
    var x = Math.sin(d1 / 2) * Math.sin(d1 / 2) +
      Math.cos(a1 * t) * Math.cos(a2 * t) * Math.sin(d2 / 2) * Math.sin(d2 / 2);
    return Rk * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  function distDaqui(r) {
    if (!minhaPos) return null;
    return hav(minhaPos.lat, minhaPos.lng, r.lat, r.lng);
  }
  function pedirLocal(btn) {
    if (!navigator.geolocation) { alert('Este navegador não oferece geolocalização.'); return; }
    btn.disabled = true; btn.textContent = 'localizando…';
    navigator.geolocation.getCurrentPosition(function (p) {
      minhaPos = { lat: p.coords.latitude, lng: p.coords.longitude };
      btn.textContent = 'ativa ✓'; ordenaPorMim = true;
      render();
    }, function (err) {
      btn.disabled = false; btn.textContent = 'tentar de novo';
      alert('Não consegui sua localização: ' + err.message +
        '\n\nNo iPhone, o site precisa estar em HTTPS e você precisa permitir o acesso no Safari.');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }

  function mapsUrl(r) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(r.mapsQuery);
  }
  function rotaUrl(r) {
    var o = minhaPos ? (minhaPos.lat + ',' + minhaPos.lng) : encodeURIComponent(C.base.mapsQuery);
    return 'https://www.google.com/maps/dir/?api=1&origin=' + o +
      '&destination=' + encodeURIComponent(r.mapsQuery) + '&travelmode=driving';
  }

  /* ---------- pedido de reserva ---------- */
  function textoReserva(r) {
    return 'Hello, I would like to request a table at ' + r.nome + '.\n\n' +
      'Date: (DD/MM/2026)\nTime: (HH:MM)\nGuests: 2 (couple)\n' +
      'Name: Helio Prandini\n\n' +
      'Could you please confirm availability, the current set/tasting menu and its price per person?\n' +
      'We would appreciate a quiet table' + (r.vista ? ' with a view, if possible' : '') + '.\n\nThank you.';
  }
  function reservaBotoes(r) {
    var box = el('div', 'btnrow');
    if (r.tel) {
      var a = el('a', 'btn gold', '📞 Ligar');
      a.href = 'tel:' + r.tel; box.appendChild(a);
      var w = el('a', 'btn sec', '💬 WhatsApp');
      w.href = 'https://wa.me/' + r.tel.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(textoReserva(r));
      w.target = '_blank'; w.rel = 'noopener'; box.appendChild(w);
    }
    if (r.reservaUrl) {
      var b = el('a', 'btn sec', '🔗 Reservar no site');
      b.href = r.reservaUrl; b.target = '_blank'; b.rel = 'noopener'; box.appendChild(b);
    }
    var cp = el('button', 'btn sec', '📋 Copiar pedido de reserva');
    cp.onclick = function () {
      var t = textoReserva(r);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(t).then(function () { cp.textContent = '✓ Copiado'; },
          function () { prompt('Copie o texto:', t); });
      } else { prompt('Copie o texto:', t); }
    };
    box.appendChild(cp);
    return box;
  }

  /* ---------- visual do card ---------- */
  var PALETA = {
    qatari: ['#e0c99b', '#9c7130'], arabe: ['#d9b48f', '#9d5f38'],
    alta: ['#c9bfa8', '#6e6250'], internacional: ['#b9c7cf', '#5d7583'],
    peixe: ['#a9c6cd', '#42707f'], doce: ['#e8c2bd', '#ac5f56'],
    cafe: ['#d8c6ac', '#8a6a44'], local: ['#ccd2b0', '#6f7c46']
  };
  var EMOJI = {
    qatari: '🫖', arabe: '🍲', alta: '✨', internacional: '🍽️',
    peixe: '🐟', doce: '🍯', cafe: '☕', local: '🧆'
  };
  function visualDe(r) {
    var ordem = ['qatari', 'arabe', 'peixe', 'doce', 'cafe', 'alta', 'internacional', 'local'];
    for (var i = 0; i < ordem.length; i++) {
      if (r.categorias && r.categorias.indexOf(ordem[i]) >= 0) return ordem[i];
    }
    return 'local';
  }

  /* ---------- filtros ---------- */
  var FILTROS = [
    { id: 'todos', l: 'Todos' },
    { id: 'qatari', l: '🫖 Qatari' },
    { id: 'arabe', l: '🍲 Árabe' },
    { id: 'alta', l: '✨ Alta gastronomia' },
    { id: 'local', l: '🧆 Local' },
    { id: 'peixe', l: '🐟 Peixe' },
    { id: 'internacional', l: '🍽️ Internacional' },
    { id: 'cafe', l: '☕ Café/karak' },
    { id: 'doce', l: '🍯 Doce' },
    { id: 'ape', l: '🚶 A pé do hotel' },
    { id: 'romantico', l: '🕯️ Romântico' },
    { id: 'barato', l: '💰 Até QAR 100' },
    { id: 'alcool', l: '🍷 Serve álcool' },
    { id: 'michelin', l: '⭐ MICHELIN' }
  ];
  var filtroAtivo = 'todos', busca = '', ordenaPorMim = false, mostrarFechados = false;

  function passa(r) {
    if (!mostrarFechados && r.status === 'fechado') return false;
    if (busca) {
      var t = (r.nome + ' ' + r.cozinha + ' ' + r.bairro + ' ' + (r.porque || '')).toLowerCase();
      if (t.indexOf(busca.toLowerCase()) < 0) return false;
    }
    var f = filtroAtivo;
    if (f === 'todos') return true;
    if (f === 'ape') return !!r.aPe;
    if (f === 'romantico') return (r.ambiente || []).some(function (a) { return a.indexOf('romântic') >= 0; });
    if (f === 'barato') return r.precoQar && r.precoQar[0] <= 100;
    if (f === 'alcool') return r.alcool === true;
    if (f === 'michelin') return !!r.destaque && /MICHELIN|BIB|★/i.test(r.destaque);
    return (r.categorias || []).indexOf(f) >= 0;
  }

  /* ---------- card ---------- */
  function card(r) {
    var v = visualDe(r), p = PALETA[v];
    var c = el('button', 'card' + (r.status !== 'aberto' ? ' dim' : ''));
    c.type = 'button';
    c.onclick = function () { abrir(r.id); };

    var vis = el('div', 'card-visual');
    vis.style.setProperty('--g1', p[0]); vis.style.setProperty('--g2', p[1]);
    vis.appendChild(el('div', 'em', EMOJI[v]));
    if (r.destaque) vis.appendChild(el('div', 'badge', esc(r.destaque)));
    c.appendChild(vis);

    var b = el('div', 'card-body');
    b.appendChild(el('h3', null, esc(r.nome)));
    var d = distDaqui(r);
    var dist = d != null ? d.toFixed(1) + ' km de você'
      : (r.aPe ? 'a pé do hotel' : r.distKm + ' km · ' + r.tempoMin + ' min do Souq');
    b.appendChild(el('div', 'sub', esc(r.cozinha) + ' · ' + esc(dist)));
    b.appendChild(el('div', 'price-line', faixa(r) + ' <span>/ pessoa</span>'));
    if (r.porque) {
      var txt = r.porque.length > 155 ? r.porque.slice(0, 152) + '…' : r.porque;
      b.appendChild(el('div', 'porque', esc(txt)));
    }

    var tg = el('div', 'tagrow');
    if (r.status === 'fechado') tg.appendChild(el('span', 'tag bad', 'FECHADO'));
    else if (r.status === 'inconclusivo') tg.appendChild(el('span', 'tag warn', 'STATUS DUVIDOSO'));
    else tg.appendChild(el('span', 'tag ok', 'aberto em set/2026'));
    if (r.precoNota === 'confirmado') tg.appendChild(el('span', 'tag ok', 'preço confirmado'));
    else if (r.precoNota === 'parcial') tg.appendChild(el('span', 'tag blue', 'preço parcial'));
    else if (r.precoQar) tg.appendChild(el('span', 'tag warn', 'preço estimado'));
    if (r.alcool === true) tg.appendChild(el('span', 'tag', '🍷 álcool'));
    if (r.rede === 'local') tg.appendChild(el('span', 'tag gold', 'casa local'));
    var nc = (comentarios[r.id] || []).length;
    if (nc) tg.appendChild(el('span', 'tag blue', '💬 ' + nc));
    b.appendChild(tg);
    c.appendChild(b);
    return c;
  }

  /* ---------- painel de detalhe ---------- */
  function abrir(id) {
    var r = byId[id]; if (!r) return;
    var bg = $('#sheetBg'), sh = $('#sheet');
    $('#sheetTitle').textContent = r.nome;
    $('#sheetSub').textContent = r.cozinha + ' · ' + r.local;
    var body = $('#sheetBody'); body.innerHTML = '';

    function sec(t) { var s = el('div', 'sec'); if (t) s.appendChild(el('h4', null, t)); body.appendChild(s); return s; }

    /* status */
    var s0 = sec(null);
    var cls = r.status === 'aberto' ? 'ok' : (r.status === 'fechado' ? 'bad' : 'warn');
    var rot = r.status === 'aberto' ? 'FUNCIONANDO em setembro/2026'
      : r.status === 'fechado' ? 'FECHADO' : 'INFORMAÇÃO INCONCLUSIVA';
    s0.appendChild(el('div', 'note ' + cls, '<b>' + rot + '</b>' + (r.statusNota ? '<br>' + esc(r.statusNota) : '')));

    /* porquê */
    if (r.porque) { var sp = sec('Por que (ou por que não)'); sp.appendChild(el('div', null, '<p style="margin:0;line-height:1.6">' + esc(r.porque) + '</p>')); }

    /* dados */
    var sd = sec('Dados');
    var d = distDaqui(r);
    var linhas = [
      ['Local', r.local + (r.bairro ? ' — ' + r.bairro : '')],
      ['Do Souq Waqif', r.aPe ? (r.distKm + ' km · ' + r.tempoMin + ' min a pé') : (r.distKm + ' km · ~' + r.tempoMin + ' min de carro')],
      d != null ? ['De você agora', d.toFixed(2) + ' km em linha reta'] : null,
      ['Preço / pessoa', faixa(r)],
      ['Estimativa p/ dois', faixa(r, true)],
      ['Álcool', r.alcool === true ? 'Sim' : r.alcool === false ? 'Não' : 'Não confirmado'],
      ['Reserva', r.reserva === 'obrigatoria' ? 'Obrigatória' : r.reserva === 'recomendavel' ? 'Recomendável' : 'Não precisa'],
      ['Ambiente', (r.ambiente || []).join(', ') || '—'],
      r.vista ? ['Vista', r.vista] : null,
      ['Tipo de casa', r.rede === 'local' ? 'Restaurante local / casa única' : r.rede === 'regional' ? 'Rede regional' : 'Rede internacional']
    ].filter(Boolean);
    var dl = el('dl', 'kv');
    linhas.forEach(function (L) { dl.appendChild(el('dt', null, esc(L[0]))); dl.appendChild(el('dd', null, esc(L[1]))); });
    sd.appendChild(dl);
    if (r.redeNota) sd.appendChild(el('div', 'note', esc(r.redeNota)));
    if (r.alcoolNota) sd.appendChild(el('div', 'note', '🍷 ' + esc(r.alcoolNota)));
    if (r.reservaNota) sd.appendChild(el('div', 'note', '📅 ' + esc(r.reservaNota)));

    /* preços */
    var sv = sec('Preços');
    var aviso = r.precoNota === 'confirmado' ? ['ok', 'Preço confirmado nas fontes citadas abaixo.']
      : r.precoNota === 'parcial' ? ['blue', 'Parte dos preços é confirmada; o resto é estimativa declarada.']
        : ['warn', 'PREÇO NÃO CONFIRMADO. A faixa abaixo é estimativa — não a apresente como preço oficial.'];
    sv.appendChild(el('div', 'note ' + aviso[0], aviso[1]));
    if (r.precoDetalhe) sv.appendChild(el('div', null, '<p style="margin:8px 0 0;font-size:13.2px;line-height:1.55;color:var(--ink-2)">' + esc(r.precoDetalhe) + '</p>'));
    var mods = [];
    if (r.degustacao) mods.push(['Menu degustação', r.degustacao.nome + (r.degustacao.qar ? ' — ' + qar(r.degustacao.qar) + ' (' + brl(r.degustacao.qar) + ')' : ' — preço não confirmado') + (r.degustacao.extra ? '. ' + r.degustacao.extra : '')]);
    if (r.brunch) mods.push(['Brunch', r.brunch.desc + (r.brunch.qar ? ' — ' + qar(r.brunch.qar) + ' (' + brl(r.brunch.qar) + ')' : ' — preço não confirmado') + (r.brunch.extra ? '. ' + r.brunch.extra : '')]);
    if (r.almoco) mods.push(['Almoço', r.almoco.desc + (r.almoco.qar ? ' — a partir de ' + qar(r.almoco.qar) + ' (' + brl(r.almoco.qar) + ')' : '')]);
    if (mods.length) {
      var dl2 = el('dl', 'kv'); dl2.style.marginTop = '10px';
      mods.forEach(function (m) { dl2.appendChild(el('dt', null, esc(m[0]))); dl2.appendChild(el('dd', null, esc(m[1]))); });
      sv.appendChild(dl2);
    }

    /* pratos */
    if (r.pratos && r.pratos.length) {
      var sx = sec('O que pedir');
      r.pratos.forEach(function (p) {
        var dv = el('div', 'dish');
        dv.appendChild(el('b', null, esc(p.nome)));
        dv.appendChild(el('div', 'pr', p.qar ? qar(p.qar) + ' · ' + brl(p.qar) : 'preço não confirmado'));
        dv.appendChild(el('div', 'wy', esc(p.porque)));
        sx.appendChild(dv);
      });
    }

    /* notas */
    if (r.notas && r.notas.gastro != null) {
      var sn = sec('Notas (0–10)');
      var g = el('div', 'scores');
      [['Gastronomia', r.notas.gastro], ['Autenticidade local', r.notas.autent],
      ['Custo-benefício', r.notas.custo], ['Vale por estar em Doha', r.notas.doha]].forEach(function (n) {
        if (n[1] == null) return;
        var b2 = el('div', 'score');
        b2.appendChild(el('div', 'n', String(n[1]).replace('.', ',')));
        b2.appendChild(el('div', 'l', esc(n[0])));
        var bar = el('div', 'bar'); var i = el('i'); i.style.width = (n[1] * 10) + '%'; bar.appendChild(i);
        b2.appendChild(bar); g.appendChild(b2);
      });
      sn.appendChild(g);
    }

    /* ações */
    var sa = sec('Ir e reservar');
    var nav = el('div', 'btnrow');
    var m1 = el('a', 'btn sec', '📍 Ver no mapa'); m1.href = mapsUrl(r); m1.target = '_blank'; m1.rel = 'noopener';
    var m2 = el('a', 'btn sec', '🧭 Rota' + (minhaPos ? ' daqui' : ' do hotel')); m2.href = rotaUrl(r); m2.target = '_blank'; m2.rel = 'noopener';
    nav.appendChild(m1); nav.appendChild(m2);
    if (r.site) { var m3 = el('a', 'btn sec', '🌐 Site / fotos'); m3.href = r.site; m3.target = '_blank'; m3.rel = 'noopener'; nav.appendChild(m3); }
    sa.appendChild(nav);
    if (r.status !== 'fechado') {
      sa.appendChild(reservaBotoes(r));
      sa.appendChild(el('div', 'note', 'O HeRo <b>prepara</b> a reserva — não a confirma sozinho. ' +
        'Praticamente nenhum restaurante de Doha expõe API pública de reserva, então o caminho honesto é este: ' +
        'o pedido sai pronto em inglês, você toca uma vez e envia. Veja a nota "Reservas automáticas" no rodapé.'));
    }

    /* fontes */
    if (r.fontes && r.fontes.length) {
      var sf = sec('Fontes');
      var box = el('div', 'srcs');
      r.fontes.forEach(function (f) {
        var a = el('a', null, '↗ ' + esc(f.t)); a.href = f.u; a.target = '_blank'; a.rel = 'noopener';
        box.appendChild(a);
      });
      sf.appendChild(box);
    }

    /* comentários */
    var sc = sec('Nossos comentários');
    var lista = el('div'); sc.appendChild(lista);
    function pintaCmts() {
      lista.innerHTML = '';
      var arr = comentarios[r.id] || [];
      if (!arr.length) lista.appendChild(el('div', 'note', 'Nenhum comentário ainda. Escreva abaixo — fica salvo neste aparelho.'));
      arr.forEach(function (c, i) {
        var cv = el('div', 'cmt');
        var h = el('div', 'h');
        h.appendChild(el('span', null, esc(c.autor) + ' · ' + esc(c.data) + (c.nota ? ' · ' + '★'.repeat(c.nota) : '')));
        var del = el('button', null, '✕'); del.title = 'apagar';
        del.onclick = function () {
          if (!confirm('Apagar este comentário?')) return;
          comentarios[r.id].splice(i, 1);
          if (!comentarios[r.id].length) delete comentarios[r.id];
          save(LS_CMT, comentarios); pintaCmts(); render();
        };
        h.appendChild(del); cv.appendChild(h);
        cv.appendChild(el('p', null, esc(c.texto)));
        lista.appendChild(cv);
      });
    }
    pintaCmts();

    var who = el('div', 'who');
    ['Helio', 'Roberta', 'Nós dois'].forEach(function (n) {
      var b3 = el('button', pref.autor === n ? 'on' : '', n);
      b3.onclick = function () { pref.autor = n; save(LS_PREF, pref); Array.prototype.forEach.call(who.children, function (x) { x.className = ''; }); b3.className = 'on'; };
      who.appendChild(b3);
    });
    sc.appendChild(who);

    var notaSel = 0;
    var st = el('div', 'stars');
    for (var i = 1; i <= 5; i++) (function (n) {
      var b4 = el('button', '', '★');
      b4.onclick = function () { notaSel = (notaSel === n ? 0 : n); Array.prototype.forEach.call(st.children, function (x, j) { x.className = j < notaSel ? 'on' : ''; }); };
      st.appendChild(b4);
    })(i);
    sc.appendChild(st);

    var ta = el('textarea'); ta.placeholder = 'O que achamos? O que pedir da próxima? Quanto gastamos de verdade?';
    sc.appendChild(ta);
    var addRow = el('div', 'btnrow'); addRow.style.marginTop = '8px';
    var add = el('button', 'btn', 'Salvar comentário');
    add.onclick = function () {
      var t = ta.value.trim(); if (!t) { ta.focus(); return; }
      if (!comentarios[r.id]) comentarios[r.id] = [];
      comentarios[r.id].push({
        autor: pref.autor, texto: t, nota: notaSel,
        data: new Date().toLocaleDateString('pt-BR'), ts: Date.now()
      });
      if (!save(LS_CMT, comentarios)) alert('Não consegui salvar neste navegador (armazenamento bloqueado). O comentário aparece agora mas some ao recarregar.');
      ta.value = ''; notaSel = 0;
      Array.prototype.forEach.call(st.children, function (x) { x.className = ''; });
      pintaCmts(); render();
    };
    addRow.appendChild(add);
    sc.appendChild(addRow);

    bg.classList.add('on'); sh.classList.add('on');
    body.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    try { history.replaceState(null, '', '#r/' + r.id); } catch (e) { }
  }
  function fechar() {
    $('#sheetBg').classList.remove('on'); $('#sheet').classList.remove('on');
    document.body.style.overflow = '';
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
  }

  /* ---------- abas ---------- */
  var aba = 'lista';
  var ABAS = [
    { id: 'lista', l: 'Restaurantes' },
    { id: 'curadoria', l: 'Curadoria' },
    { id: 'roteiros', l: 'Roteiros' },
    { id: 'souq', l: 'Souq Waqif' },
    { id: 'reservaria', l: 'Eu reservaria' },
    { id: 'avisos', l: 'Saber antes' }
  ];

  function linkR(id, rotulo) {
    var b = el('button', 'pill-link', esc(rotulo || (byId[id] ? byId[id].nome : id)));
    b.onclick = function () { abrir(id); };
    return b;
  }

  function viewLista(root) {
    /* geo */
    var geo = el('div', 'geo-box');
    geo.appendChild(el('span', null, minhaPos
      ? '📍 Ordenando pelos mais perto de você agora.'
      : '📍 Ative a localização para ordenar pelos mais próximos de onde você está.'));
    var gb = el('button', 'btn sec', minhaPos ? 'atualizar' : 'ativar');
    gb.onclick = function () { pedirLocal(gb); };
    geo.appendChild(gb);
    root.appendChild(geo);

    /* filtros */
    var f = el('div', 'filters');
    var fr = el('div', 'frow');
    FILTROS.forEach(function (x) {
      var b = el('button', filtroAtivo === x.id ? 'on' : '', x.l);
      b.onclick = function () { filtroAtivo = x.id; render(); };
      fr.appendChild(b);
    });
    f.appendChild(fr);
    var fb = el('div', 'fbar');
    var inp = el('input'); inp.type = 'search'; inp.placeholder = 'Buscar por nome, cozinha, bairro…'; inp.value = busca;
    inp.oninput = function () { busca = inp.value; render(true); };
    fb.appendChild(inp);
    var tf = el('button', mostrarFechados ? 'on' : '', mostrarFechados ? 'ocultar fechados' : 'mostrar fechados');
    tf.className = 'btn sec'; tf.style.fontSize = '13px'; tf.style.padding = '9px 12px';
    tf.onclick = function () { mostrarFechados = !mostrarFechados; render(); };
    fb.appendChild(tf);
    f.appendChild(fb);
    root.appendChild(f);

    var lista = R.filter(passa);
    if (minhaPos) lista.sort(function (a, b) { return distDaqui(a) - distDaqui(b); });
    else lista.sort(function (a, b) {
      if (a.status !== b.status) return a.status === 'aberto' ? -1 : 1;
      return a.distKm - b.distKm;
    });

    var cnt = el('div', 'count');
    cnt.textContent = lista.length + ' de ' + R.length + ' lugares' + (minhaPos ? ' · ordenados por distância de você' : ' · ordenados por distância do Souq Waqif');
    cnt.style.margin = '0 0 10px';
    root.appendChild(cnt);

    var g = el('div', 'grid');
    if (!lista.length) g.appendChild(el('div', 'note', 'Nada com esse filtro. Tente "Todos".'));
    lista.forEach(function (r) { g.appendChild(card(r)); });
    root.appendChild(g);
    if (busca) setTimeout(function () { var i = $('.fbar input'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 0);
  }

  function viewCuradoria(root) {
    var intro = el('div', 'panel');
    intro.appendChild(el('h2', null, 'Curadoria'));
    intro.appendChild(el('div', 'lead', 'Escolhas, não rankings copiados. O motivo está escrito ao lado de cada uma.'));
    root.appendChild(intro);

    K.topos.forEach(function (t) {
      var p = el('div', 'panel');
      p.appendChild(el('h2', null, esc(t.titulo)));
      if (t.sub) p.appendChild(el('div', 'lead', esc(t.sub)));
      t.itens.forEach(function (it, i) {
        var row = el('div', 'pick');
        row.appendChild(el('div', 'rank', String(i + 1)));
        var pb = el('div', 'pb');
        var pn = el('div', 'pn');
        pn.appendChild(document.createTextNode(byId[it.r] ? byId[it.r].nome : it.r));
        pn.appendChild(linkR(it.r, 'ver ficha'));
        pb.appendChild(pn);
        pb.appendChild(el('div', 'px', esc(it.nota)));
        row.appendChild(pb); p.appendChild(row);
      });
      root.appendChild(p);
    });

    var rp = el('div', 'panel');
    rp.appendChild(el('h2', null, 'Redundâncias — o que compete com o quê'));
    rp.appendChild(el('div', 'lead', 'Você pediu para não reservar coisas parecidas. Estes são os grupos que brigam pela mesma noite.'));
    K.redundancias.forEach(function (g) {
      rp.appendChild(el('h3', null, esc(g.grupo)));
      rp.appendChild(el('p', null, esc(g.diagnostico)));
      if (g.escolha) {
        var e = el('p', null, '<b style="color:var(--gold)">Escolho: ' + esc(byId[g.escolha] ? byId[g.escolha].nome : g.escolha) + '.</b> ' + esc(g.porque));
        rp.appendChild(e);
      } else {
        rp.appendChild(el('p', null, esc(g.porque)));
      }
    });
    root.appendChild(rp);
  }

  function viewRoteiros(root) {
    K.roteiros.forEach(function (rt) {
      var p = el('div', 'panel');
      p.appendChild(el('h2', null, esc(rt.titulo) + (rt.recomendado ? ' ⭐' : '')));
      p.appendChild(el('div', 'lead', esc(rt.logica)));
      rt.dias.forEach(function (d) {
        var n = el('div', 'night');
        n.appendChild(el('div', 'nl', esc(d.rotulo)));
        var nn = el('div', 'nn');
        nn.appendChild(document.createTextNode(byId[d.r] ? byId[d.r].nome : d.r));
        if (d.hora) nn.appendChild(el('span', 'nh', esc(d.hora)));
        nn.appendChild(linkR(d.r, 'ficha'));
        n.appendChild(nn);
        n.appendChild(el('div', 'nx', esc(d.nota)));
        p.appendChild(n);
      });
      if (rt.extras && rt.extras.length) {
        p.appendChild(el('h3', null, 'Fora das noites — almoços, cafés e paradas'));
        rt.extras.forEach(function (e) {
          var row = el('div', 'pick');
          row.appendChild(el('div', 'rank', '·'));
          var pb = el('div', 'pb');
          var pn = el('div', 'pn');
          pn.appendChild(document.createTextNode(e.rotulo + ': ' + (byId[e.r] ? byId[e.r].nome : e.r)));
          pn.appendChild(linkR(e.r, 'ficha'));
          pb.appendChild(pn);
          pb.appendChild(el('div', 'px', esc(e.nota)));
          row.appendChild(pb); p.appendChild(row);
        });
      }
      root.appendChild(p);
    });
  }

  function viewSouq(root) {
    function bloco(titulo, sub, ids) {
      var p = el('div', 'panel');
      p.appendChild(el('h2', null, titulo));
      p.appendChild(el('div', 'lead', sub));
      var g = el('div', 'grid');
      ids.forEach(function (id) { if (byId[id]) g.appendChild(card(byId[id])); });
      p.appendChild(g);
      root.appendChild(p);
    }
    bloco('Dentro ou ao redor do Souq Waqif',
      'Tudo a pé do Souq Waqif Boutique Hotels by Tivoli. Lembre: o Souq é área seca — nenhum destes serve álcool.',
      K.souq.dentro);
    bloco('A um táxi curto do Souq Waqif',
      'Até 10 minutos de carro. É onde ficam o IDAM, o Jiwan e as casas qataris de Msheireb.',
      K.souq.curtoTaxi);

    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'As melhores de cada coisa, perto do hotel'));
    K.souq.melhores.forEach(function (m) {
      var row = el('div', 'pick');
      row.appendChild(el('div', 'rank', '★'));
      var pb = el('div', 'pb');
      var pn = el('div', 'pn');
      pn.appendChild(document.createTextNode(m.cat + ': ' + (byId[m.r] ? byId[m.r].nome : m.r)));
      pn.appendChild(linkR(m.r, 'ficha'));
      pb.appendChild(pn);
      pb.appendChild(el('div', 'px', esc(m.nota)));
      row.appendChild(pb); p.appendChild(row);
    });
    root.appendChild(p);
  }

  function viewReservaria(root) {
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, K.reservaria.titulo));
    p.appendChild(el('div', 'lead', 'Seis reservas: duas de alta gastronomia, um qatari, um árabe regional, um local popular e um hidden gem. Nenhuma cozinha repetida.'));
    K.reservaria.itens.forEach(function (it, i) {
      var r = byId[it.r];
      var n = el('div', 'night');
      n.appendChild(el('div', 'nl', esc(it.papel)));
      var nn = el('div', 'nn');
      nn.appendChild(document.createTextNode((i + 1) + '. ' + (r ? r.nome : it.r)));
      nn.appendChild(linkR(it.r, 'ficha'));
      n.appendChild(nn);
      var dl = el('dl', 'kv'); dl.style.marginTop = '8px';
      [['Por que vale', it.vale], ['O que pedir', it.pedir], ['Reservar em BRL (2 pessoas)', it.brl],
      ['Melhor horário', it.hora], ['Precisa reservar?', it.reserva], ['Tempo de experiência', it.tempo]]
        .forEach(function (L) { dl.appendChild(el('dt', null, esc(L[0]))); dl.appendChild(el('dd', null, esc(L[1]))); });
      n.appendChild(dl);
      p.appendChild(n);
    });
    p.appendChild(el('p', null, '<b>' + esc(K.reservaria.fecho) + '</b>'));
    root.appendChild(p);

    var q = el('div', 'panel');
    q.appendChild(el('h2', null, K.resposta.pergunta));
    K.resposta.texto.forEach(function (t) { q.appendChild(el('p', null, esc(t))); });
    root.appendChild(q);
  }

  function viewAvisos(root) {
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'O que saber antes de ir'));
    K.avisos.forEach(function (a) {
      p.appendChild(el('h3', null, esc(a.t)));
      p.appendChild(el('p', null, esc(a.d)));
    });
    root.appendChild(p);

    var m = el('div', 'panel');
    m.appendChild(el('h2', null, 'Método e limites desta pesquisa'));
    m.appendChild(el('p', null, 'Prioridade de fontes, nesta ordem: site oficial do restaurante, site oficial do hotel, MICHELIN Guide, Qatar Tourism (Visit Qatar), Qatar Museums e veículos gastronômicos locais (Time Out Doha, Marhaba, Gulf Times, The Peninsula). TripAdvisor e listas genéricas <b>não</b> foram usados como fonte principal — aparecem, quando aparecem, apenas como sinal de que uma casa continua recebendo clientes.'));
    m.appendChild(el('p', null, '<b>Limite honesto:</b> o ambiente onde esta pesquisa rodou bloqueia o acesso direto às páginas (guide.michelin.com, qm.org.qa, sites dos próprios restaurantes). Tudo foi levantado por busca na web, que devolve o conteúdo dessas fontes já resumido. Consequência prática: <b>status e recomendações são sólidos; preços nem sempre.</b> Onde um preço não pôde ser confirmado, está marcado como estimativa — nunca foi inventado um número e apresentado como oficial.'));
    m.appendChild(el('p', null, '<b>Fotos de prato:</b> não há fotos próprias aqui. Publicar foto de prato de terceiros num repositório público é problema de direito autoral. O botão "Site / fotos" de cada ficha leva ao material oficial da casa, que é a foto legítima.'));
    m.appendChild(el('p', null, '<b>Coordenadas:</b> aproximadas, no nível do quarteirão, e servem para ordenar por proximidade. Para navegar, use sempre "Ver no mapa" ou "Rota" — a busca pelo nome é o que o Google resolve com precisão.'));
    root.appendChild(m);

    var res = el('div', 'panel');
    res.appendChild(el('h2', null, 'Reservas automáticas — o que dá e o que não dá'));
    res.appendChild(el('p', null, 'Você pediu que o app <b>fizesse as reservas sozinho</b>. O que é honesto dizer:'));
    res.appendChild(el('p', null, '<b>Não dá hoje, e não é limitação de esforço.</b> Reservar sozinho exige que o restaurante exponha uma API de reserva com credencial. Em Doha, a maioria não expõe nada: Jiwan e IDAM reservam por telefone e formulário, Argan pela recepção do hotel, Shay Al Shomous e Bandar Aden simplesmente não trabalham com reserva. Zuma usa SevenRooms e alguns usam OpenTable — essas duas têm API, mas só para o próprio restaurante, não para terceiros.'));
    res.appendChild(el('p', null, '<b>O que dá, e já está funcionando:</b> cada ficha monta o pedido de reserva pronto em inglês, com data, horário, "2 pessoas", seu nome e a pergunta certa sobre preço do menu do dia. Um toque abre o WhatsApp ou o discador com tudo preenchido, ou copia o texto para colar em e-mail. Isso reduz a reserva a um toque e uma confirmação — que é o mais perto do automático que existe sem mentir.'));
    res.appendChild(el('p', null, '<b>O caminho para chegar mais perto,</b> se você quiser investir nisso depois: (1) integrar OpenTable e SevenRooms para as casas que os usam — resolve talvez 30% da lista; (2) um serviço de e-mail que dispare e leia a resposta; (3) concierge humano do próprio hotel, que é o que o Tivoli já faz de graça para hóspede. Prefiro te dizer isto agora do que construir um botão "Reservar" que não reserva nada.'));
    root.appendChild(res);
  }

  /* ---------- render ---------- */
  function render(mantemFoco) {
    var root = $('#app'); root.innerHTML = '';
    Array.prototype.forEach.call($('#tabs').children, function (b) {
      b.setAttribute('aria-selected', b.dataset.id === aba ? 'true' : 'false');
    });
    if (aba === 'lista') viewLista(root);
    else if (aba === 'curadoria') viewCuradoria(root);
    else if (aba === 'roteiros') viewRoteiros(root);
    else if (aba === 'souq') viewSouq(root);
    else if (aba === 'reservaria') viewReservaria(root);
    else viewAvisos(root);
    if (!mantemFoco) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /* ---------- exportar / importar comentários ---------- */
  function exportar() {
    var payload = { app: 'HeRo', cidade: C.id, exportadoEm: new Date().toISOString(), comentarios: comentarios };
    var txt = JSON.stringify(payload, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(function () {
        alert('Comentários copiados para a área de transferência.\n\nCole num e-mail ou nota para guardar — ' +
          'o app não consegue baixar arquivos dentro do navegador do iPhone.');
      }, function () { prompt('Copie o backup:', txt); });
    } else { prompt('Copie o backup:', txt); }
  }
  function importar() {
    var t = prompt('Cole aqui o backup (JSON) dos comentários:');
    if (!t) return;
    try {
      var o = JSON.parse(t);
      var c = o.comentarios || o;
      Object.keys(c).forEach(function (k) {
        if (!comentarios[k]) comentarios[k] = [];
        var vistos = {};
        comentarios[k].forEach(function (x) { vistos[x.ts] = 1; });
        c[k].forEach(function (x) { if (!vistos[x.ts]) comentarios[k].push(x); });
        comentarios[k].sort(function (a, b) { return a.ts - b.ts; });
      });
      save(LS_CMT, comentarios); render();
      alert('Comentários importados.');
    } catch (e) { alert('Não consegui ler esse texto como JSON.'); }
  }

  /* ---------- montagem ---------- */
  function montar() {
    /* tema */
    if (pref.tema) document.documentElement.setAttribute('data-theme', pref.tema);

    var tabs = $('#tabs');
    ABAS.forEach(function (a) {
      var b = el('button', null, a.l);
      b.dataset.id = a.id; b.setAttribute('role', 'tab');
      b.onclick = function () { aba = a.id; render(); };
      tabs.appendChild(b);
    });

    $('#hTitulo').textContent = C.cidade + ' · ' + C.periodo;
    $('#hBase').innerHTML = 'Base: <b>' + esc(C.base.nome) + '</b>';
    $('#hCambio').innerHTML = '1 QAR = <b>R$ ' + taxa.toFixed(2).replace('.', ',') + '</b>';
    $('#hData').innerHTML = 'Pesquisa de <b>' + new Date(C.pesquisadoEm + 'T12:00:00').toLocaleDateString('pt-BR') + '</b>';
    $('#hQtd').innerHTML = '<b>' + R.length + '</b> lugares avaliados';
    $('#cambioNota').textContent = C.cambio.metodo;

    $('#btnTema').onclick = function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var novo = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', novo);
      pref.tema = novo; save(LS_PREF, pref);
    };
    $('#btnExp').onclick = exportar;
    $('#btnImp').onclick = importar;
    $('#sheetBg').onclick = fechar;
    $('#sheetClose').onclick = fechar;
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });

    render();

    var h = location.hash.match(/^#r\/(.+)$/);
    if (h && byId[h[1]]) abrir(h[1]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
