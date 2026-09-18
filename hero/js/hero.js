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

  /* Distancia e tempo a partir da BASE (o hotel reservado).
     Reta pelo haversine x 1,25 para virar rua. A pe ate 1,5 km.
     Carro a 24 km/h (transito de Doha), com piso de 5 min. */
  function daBase(r) {
    var b = C && C.base;
    if (!b || !b.lat || !r || !r.lat) return null;
    var reta = hav(b.lat, b.lng, r.lat, r.lng);
    var km = Math.round(reta * 1.25 * 10) / 10;
    var aPe = km <= 1.5;
    var min = aPe ? Math.max(2, Math.round(km / 0.08)) : Math.max(5, Math.round(km / 0.4));
    return { km: km, min: min, aPe: aPe };
  }
  function txtBase(r) {
    var d = daBase(r); if (!d) return '';
    return d.km.toFixed(1).replace('.', ',') + ' km \u00b7 ' + d.min + ' min ' + (d.aPe ? 'a p\u00e9' : 'de carro');
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
    { id: 'seco', l: '🚫 Área seca' },
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
    if (f === 'ape') { var db = daBase(r); return !!(db && db.aPe); }
    if (f === 'romantico') return (r.ambiente || []).some(function (a) { return a.indexOf('romântic') >= 0; });
    if (f === 'barato') return r.precoQar && r.precoQar[0] <= 100;
    if (f === 'alcool') return r.alcool === true;
    if (f === 'seco') return r.alcool === false;
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
    if (r.alcool === true) vis.appendChild(el('div', 'selo', '🍷 Serve álcool'));
    else if (r.alcool === false) vis.appendChild(el('div', 'selo seco', '🚫 Sem álcool'));
    else vis.appendChild(el('div', 'selo seco', '? Álcool não confirmado'));
    c.appendChild(vis);

    var b = el('div', 'card-body');
    b.appendChild(el('h3', null, esc(r.nome)));
    var d = distDaqui(r);
    var dist = d != null ? d.toFixed(1) + ' km de você' : (txtBase(r) + ' do hotel');
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
      ['Do ' + C.base.nome, txtBase(r) + ' (estimativa por distância; use o botão de rota para o caminho real)'],
      ['Do Souq Waqif', r.aPe ? (String(r.distKm).replace('.', ',') + ' km · ' + r.tempoMin + ' min a pé') : (String(r.distKm).replace('.', ',') + ' km · ~' + r.tempoMin + ' min de carro')],
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

    fichaAberta = r; atualizaClaude();
    bg.classList.add('on'); sh.classList.add('on');
    body.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    try { history.replaceState(null, '', '#r/' + r.id); } catch (e) { }
  }
  function fechar() {
    fichaAberta = null; atualizaClaude();
    maisAberto = false;
    $('#sheetBg').classList.remove('on'); $('#sheet').classList.remove('on');
    document.body.style.overflow = '';
    if ($('#botnav')) pintaNav();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
  }

  /* ---------- abas ---------- */
  /* o app SEMPRE abre na tela de destinos — a viagem tem dois, e decidir
     para onde olhar é a primeira coisa que a pessoa faz. */
  var destino = '';
  var fichaAberta = null;
  var aba = 'lista';
  var ABAS_DOHA = [
    { id: 'lista', l: 'Restaurantes' },
    { id: 'curadoria', l: 'Curadoria' },
    { id: 'roteiros', l: 'Roteiros' },
    { id: 'souq', l: 'Souq Waqif' },
    { id: 'escala', l: '✈️ A escala' },
    { id: 'beber', l: '🍷 Onde beber' },
    { id: 'hoteis', l: '🏨 Hotéis' },
    { id: 'reservaria', l: 'Eu reservaria' },
    { id: 'avisos', l: 'Saber antes' }
  ];
  var ABAS_NY = [
    { id: 'nyroteiro', l: 'Roteiro' },
    { id: 'nymudou', l: 'O que mudou' },
    { id: 'nylugares', l: 'Lugares' },
    { id: 'mapa', l: 'Mapa' },
    { id: 'nyouro', l: 'Continua valendo' }
  ];
  var ABA_MAPA = { id: 'mapa', l: '\ud83d\uddfa\ufe0f Mapa' };
  var ABAS_EU23 = [
    { id: 'euroteiro', l: 'A viagem' },
    { id: 'eunotas', l: 'As notas' },
    { id: 'mapa', l: 'Mapa' },
    { id: 'eureparos', l: 'Reparos' }
  ];
  var ABAS_INDIA = [
    { id: 'chegada', l: '🛬 A chegada' },
    { id: 'iroteiro', l: 'Roteiro' },
    { id: 'ivoos', l: '✈️ Voos' },
    { id: 'ihoteis', l: '🏨 Hotéis' }
  ];
  /* Ícones desenhados, não emoji: emoji muda de forma em cada aparelho
     e denuncia protótipo. Traço de 1.7 para ficar nítido em tela retina. */
  function ico(d, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + (extra || '') + '</svg>';
  }
  var ICONES = {
    destinos: ico('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/>'),
    lista:    ico('<path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10"/><path d="M17 3c-1.6 1.4-2.2 3.4-2.2 5.6 0 1.6.7 2.6 2.2 2.9V21"/>'),
    curadoria:ico('<path d="M12 3.5l2.5 5.3 5.5.8-4 4 .95 5.7L12 16.6l-4.95 2.7L8 13.6l-4-4 5.5-.8z"/>'),
    roteiros: ico('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="8.5" cy="14" r="1.1" fill="currentColor" stroke="none"/>'),
    souq:     ico('<path d="M4 20.5V10.5C4 6.9 7.6 4 12 4s8 2.9 8 6.5v10"/><path d="M2.5 20.5h19M9.5 20.5v-5a2.5 2.5 0 0 1 5 0v5"/>'),
    escala:   ico('<path d="M3 15.5l18-6.6M5.5 12.2L3.2 9.4l1.9-.7 3.3 1.6M9 19.6l-1.3-3.1 1.8-.7 2.2 2.1"/>'),
    beber:    ico('<path d="M7 4h10l-1 6.2a4 4 0 0 1-8 0z"/><path d="M12 14.2V20M8.5 20h7"/>'),
    hoteis:   ico('<path d="M3 19V7M3 12h18v7M21 19v-3"/><path d="M6.5 12V9.5h5V12"/><circle cx="16.5" cy="9.5" r="1.6"/>'),
    reservaria:ico('<path d="M4.5 12.5l5 5 10-11"/>'),
    avisos:   ico('<path d="M4 5.5A2 2 0 0 1 6 3.5h5v17H6a2 2 0 0 0-2 2z"/><path d="M20 5.5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2z"/>'),
    cambio:   ico('<ellipse cx="12" cy="6.5" rx="7.5" ry="3"/><path d="M4.5 6.5v11c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-11M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>'),
    mais:     ico('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    chegada:  ico('<path d="M3 20.5h18M4.5 16.5l15.5-3.4a2 2 0 0 0-1-3.8L14.5 10 9 3.5 6.5 4l3 7-4.2.9-2-2.4-1.6.4z"/>'),
    iroteiro: ico('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="8.5" cy="14" r="1.1" fill="currentColor" stroke="none"/>'),
    ivoos:    ico('<path d="M3 15.5l18-6.6M5.5 12.2L3.2 9.4l1.9-.7 3.3 1.6M9 19.6l-1.3-3.1 1.8-.7 2.2 2.1"/>'),
    ihoteis:  ico('<path d="M3 19V7M3 12h18v7M21 19v-3"/><path d="M6.5 12V9.5h5V12"/><circle cx="16.5" cy="9.5" r="1.6"/>'),
    nyroteiro:ico('<path d="M9 19.5l-5.5 2V5.5L9 3.5m0 16V3.5m0 16l6-2m-6-14l6 2m0 12V5.5m0 12l5.5 2V5.5L15 3.5"/>'),
    nymudou:  ico('<path d="M20.5 11.5A8.5 8.5 0 1 0 19 16.5"/><path d="M20.5 6.5v5h-5"/>'),
    nylugares:ico('<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>'),
    nyouro:   ico('<path d="M12 3.5l2.5 5.3 5.5.8-4 4 .95 5.7L12 16.6l-4.95 2.7L8 13.6l-4-4 5.5-.8z"/>'),
    euroteiro:ico('<path d="M4 20c4-1.5 5-6 5-9.5A4.5 4.5 0 0 0 4 6M20 20c-4-1.5-5-6-5-9.5A4.5 4.5 0 0 1 20 6"/><path d="M12 21V8M9 8h6l-3-4z"/>'),
    eunotas:  ico('<path d="M5 4.5h14v15l-7-3.2-7 3.2z"/><path d="M9 9.5h6M9 13h4"/>'),
    eureparos:ico('<circle cx="12" cy="12" r="9"/><path d="M12 8.5v4.5M12 16h.01"/>'),
    mapa:     ico('<path d="M9 19.5l-5.5 2V5.5L9 3.5l6 2 5.5-2v16l-5.5 2z"/><path d="M9 3.5v16M15 5.5v16"/>')
  };
  var CURTO = {
    destinos:'Destinos', lista:'Comer', curadoria:'Curadoria', roteiros:'Roteiros',
    souq:'Souq', escala:'A escala', beber:'Beber', hoteis:'Hotéis',
    reservaria:'Reservar', avisos:'Saber', cambio:'Moedas',
    chegada:'Chegada', iroteiro:'Roteiro', ivoos:'Voos', ihoteis:'Hotéis',
    nyroteiro:'Roteiro', nymudou:'Mudou', nylugares:'Lugares', nyouro:'Ouro',
    euroteiro:'A viagem', eunotas:'As notas', eureparos:'Reparos', mapa:'Mapa'
  };
  var PRIMARIAS = { doha: ['lista', 'mapa', 'roteiros', 'beber'], india: ['chegada', 'iroteiro', 'ivoos', 'ihoteis'], ny: ['nyroteiro', 'nymudou', 'nylugares', 'mapa'], eu23: ['euroteiro', 'eunotas', 'mapa', 'eureparos'],
                   eu25: ['euroteiro', 'eunotas', 'mapa', 'eureparos'],
                   bos: ['euroteiro', 'eunotas', 'mapa', 'eureparos'] };
  var ABA_HOME = { id: 'destinos', l: '← Destinos' };
  var ABA_CAMBIO = { id: 'cambio', l: '💱 Moedas' };
  function abasAtuais() {
    if (!destino) return [ABA_CAMBIO];
    var base = destino === 'india' ? ABAS_INDIA : destino === 'ny' ? ABAS_NY :
      ehArquivo() ? ABAS_EU23 : ABAS_DOHA.concat([ABA_MAPA]);
    return [ABA_HOME].concat(base, [ABA_CAMBIO]);
  }
  function primeiraAba() {
    return destino === 'india' ? 'chegada' : destino === 'ny' ? 'nyroteiro' :
      ehArquivo() ? 'euroteiro' : destino === 'doha' ? 'lista' : 'destinos';
  }
  function irPara(d) {
    destino = d; pref.destino = d; save(LS_PREF, pref);
    mapaCidade = 'todas';
    aba = primeiraAba(); render();
  }

  function linkR(id, rotulo) {
    var b = el('button', 'pill-link', esc(rotulo || (byId[id] ? byId[id].nome : id)));
    b.onclick = function () { abrir(id); };
    return b;
  }


  /* ---------- navegação inferior ---------- */
  function vaiPara(id) {
    if (id === 'destinos') { destino = ''; pref.destino = ''; save(LS_PREF, pref); aba = 'destinos'; }
    else aba = id;
    fecharMais(); render();
  }
  function pintaNav() {
    var nav = $('#botnav'); nav.innerHTML = '';
    var itens;
    if (!destino) {
      itens = [{ id: 'destinos', l: 'Destinos' }, { id: 'cambio', l: 'Moedas' }];
    } else {
      itens = (PRIMARIAS[destino] || []).map(function (id) { return { id: id, l: CURTO[id] }; });
      itens.push({ id: '__mais', l: 'Mais' });
    }
    itens.forEach(function (it) {
      var b = el('button');
      b.setAttribute('role', 'tab');
      var ativo = it.id === '__mais' ? maisAberto : (it.id === aba);
      b.setAttribute('aria-selected', ativo ? 'true' : 'false');
      b.appendChild(el('i', null, it.id === '__mais' ? ICONES.mais : (ICONES[it.id] || ICONES.destinos)));
      b.appendChild(el('span', null, esc(it.l)));
      b.onclick = function () { it.id === '__mais' ? abrirMais() : vaiPara(it.id); };
      nav.appendChild(b);
    });
  }

  var maisAberto = false;
  function fecharMais() {
    maisAberto = false;
    $('#sheetBg').classList.remove('on'); $('#sheet').classList.remove('on');
    document.body.style.overflow = '';
  }
  function abrirMais() {
    if (maisAberto) { fecharMais(); pintaNav(); return; }
    maisAberto = true;
    $('#sheetTitle').textContent = 'Todas as seções';
    $('#sheetSub').textContent = destino === 'india' ? 'Índia' : C.cidade;
    var body = $('#sheetBody'); body.innerHTML = '';
    var sec = el('div', 'sec');
    var g = el('div', 'mais');
    abasAtuais().forEach(function (a) {
      var b = el('button');
      b.setAttribute('aria-selected', a.id === aba ? 'true' : 'false');
      b.appendChild(el('i', null, ICONES[a.id] || ICONES.destinos));
      b.appendChild(el('span', null, esc(CURTO[a.id] || a.l)));
      b.onclick = function () { vaiPara(a.id); };
      g.appendChild(b);
    });
    sec.appendChild(g);
    body.appendChild(sec);
    $('#sheetBg').classList.add('on'); $('#sheet').classList.add('on');
    document.body.style.overflow = 'hidden';
    pintaNav();
  }

  /* ---------- cabeçalho por destino ---------- */
  function pintaCabecalho() {
    var h = $('#heroHead');
    h.innerHTML = '';
    if (!destino) {
      if (aba === 'cambio') {
        h.appendChild(el('h1', null, 'Moedas e dinheiro'));
        h.appendChild(el('p', null, 'Conversor, taxas e como tirar dinheiro na mão lá fora. ' +
          'Vale para qualquer destino — por isso fica aqui, fora das cidades.'));
        return;
      }
      h.appendChild(el('h1', null, 'Para onde a gente vai'));
      h.appendChild(el('p', null, 'O guia de viagens do Helio e da Roberta. Escolha um destino.'));
      return;
    }
    if (ehArquivo()) {
      var E = dadosEu();
      h.appendChild(el('h1', null, E.cidade));
      h.appendChild(el('p', null, esc(E.rota)));
      var me = el('div', 'meta-row');
      var tot = 0, com = 0;
      E.paradas.forEach(function (x) { x.lugares.forEach(function (l) { tot++; if (l.nota != null) com++; }); });
      me.appendChild(el('span', 'chip', esc(E.periodo)));
      me.appendChild(el('span', 'chip', '<b>' + E.paradas.length + '</b> paradas'));
      me.appendChild(el('span', 'chip', '<b>' + com + '</b> notas de voc\u00eas'));
      h.appendChild(me);
      return;
    }
    if (destino === 'ny') {
      var N = HERO_NY;
      h.appendChild(el('h1', null, 'Nova York'));
      h.appendChild(el('p', null, 'Seu roteiro, do jeito que voc\u00ea escreveu \u2014 com cada lugar conferido em ' +
        'setembro de 2026. O que fechou est\u00e1 marcado, o que mudou de endere\u00e7o est\u00e1 corrigido, e o que ' +
        'eu n\u00e3o consegui confirmar diz isso com todas as letras.'));
      var mn = el('div', 'meta-row');
      var fech = N.lugares.filter(function (x) { return x.conf === 'fechado'; }).length;
      var mud = N.lugares.filter(function (x) { return x.conf === 'mudou'; }).length;
      mn.appendChild(el('span', 'chip', '<b>' + N.lugares.length + '</b> lugares checados'));
      mn.appendChild(el('span', 'chip', '<b>' + fech + '</b> fecharam'));
      mn.appendChild(el('span', 'chip', '<b>' + mud + '</b> mudaram'));
      h.appendChild(mn);
      return;
    }
    if (destino === 'india') {
      h.appendChild(el('h1', null, 'Índia · ' + esc(HERO_INDIA.periodo)));
      h.appendChild(el('p', null, esc(HERO_INDIA.nota)));
      var m = el('div', 'meta-row');
      m.appendChild(el('span', 'chip', '<b>4</b> cidades'));
      m.appendChild(el('span', 'chip', '<b>' + HERO_INDIA.hoteis.length + '</b> hotéis'));
      m.appendChild(el('span', 'chip', '1 INR = <b>R$ 0,054</b>'));
      h.appendChild(m);
      return;
    }
    h.appendChild(el('h1', null, C.cidade + ' · ' + C.periodo));
    h.appendChild(el('p', null, 'Curadoria gastronômica para um casal brasileiro. Alta gastronomia, cozinha qatari, ' +
      'árabe do Golfo e as casas locais que um turista não acha sozinho — com o que é confirmado separado do que é estimativa.'));
    var mr = el('div', 'meta-row');
    mr.appendChild(el('span', 'chip', 'Base: <b>' + esc(C.base.nome) + '</b> ✅'));
    mr.appendChild(el('span', 'chip', '1 QAR = <b>R$ ' + taxa.toFixed(2).replace('.', ',') + '</b>'));
    mr.appendChild(el('span', 'chip', '<b>' + R.length + '</b> lugares avaliados'));
    h.appendChild(mr);
  }

  /* ---------- seletor de destinos ---------- */
  function viewDestinos(root) {
    /* Capa. Se existir hero/img/capa.jpg, ela entra; senão fica só o
       letreiro sobre o fundo de gradiente, sem buraco na página. */
    var capa = el('div', 'capa');
    if (HERO_ARTE.capa) { var ca = el('div', 'capa-arte'); ca.innerHTML = HERO_ARTE.capa(); capa.appendChild(ca); }
    var img = new Image();
    img.alt = '';
    img.onload = function () { capa.classList.add('tem-foto'); capa.insertBefore(img, capa.firstChild); };
    img.src = './img/capa.jpg';
    var ct = el('div', 'capa-txt');
    ct.appendChild(el('strong', null, 'HeRo'));
    ct.appendChild(el('span', null, 'guia de viagens'));
    capa.appendChild(ct);
    root.appendChild(capa);

    var g = el('div', 'destinos');
    HERO_DESTINOS.forEach(function (d) {
      var c = el('button', 'destino');
      c.type = 'button';
      c.onclick = function () { irPara(d.id); };
      var art = el('div', 'destino-arte');
      art.innerHTML = HERO_ARTE[d.arte] ? HERO_ARTE[d.arte]() : '';
      c.appendChild(art);
      var b = el('div', 'destino-txt');
      b.appendChild(el('strong', null, esc(d.nome)));
      b.appendChild(el('span', null, esc(d.pais)));
      b.appendChild(el('em', null, esc(d.periodo)));
      b.appendChild(el('small', null, esc(d.resumo)));
      c.appendChild(b);
      g.appendChild(c);
    });
    root.appendChild(g);
  }

  /* ---------- conversor de moedas ---------- */
  function viewCambio(root) {
    var M = HERO_MOEDAS;
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'Conversor'));
    p.appendChild(el('div', 'lead', 'Digite em qualquer moeda — as outras acompanham. Taxas de ' +
      new Date(M.atualizado + 'T12:00:00').toLocaleDateString('pt-BR') + '.'));

    var campos = {};
    var box = el('div', 'conv');
    M.lista.forEach(function (m) {
      var row = el('label', 'conv-row');
      var lab = el('div', 'conv-lab');
      lab.appendChild(el('b', null, m.c));
      lab.appendChild(el('span', null, esc(m.nome + ' · ' + m.pais)));
      row.appendChild(lab);
      var inp = el('input');
      inp.type = 'text'; inp.inputMode = 'decimal'; inp.id = 'conv-' + m.c;
      inp.autocomplete = 'off'; inp.placeholder = m.simb + ' 0';
      inp.oninput = function () { propaga(m.c, inp.value); };
      row.appendChild(inp);
      campos[m.c] = inp;
      box.appendChild(row);
    });
    p.appendChild(box);

    function fmt(v, dec) {
      return v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    }
    function propaga(origem, txt) {
      var n = parseFloat(String(txt).replace(/\./g, '').replace(',', '.'));
      if (isNaN(n)) {
        M.lista.forEach(function (m) { if (m.c !== origem) campos[m.c].value = ''; });
        return;
      }
      var src = M.lista.filter(function (m) { return m.c === origem; })[0];
      var emBRL = n * src.emBRL;
      M.lista.forEach(function (m) {
        if (m.c === origem) return;
        campos[m.c].value = fmt(emBRL / m.emBRL, m.dec);
      });
    }

    var at = el('div', 'btnrow'); at.style.marginTop = '12px';
    M.atalhos.forEach(function (v) {
      var b = el('button', 'btn sec', 'QAR ' + v);
      b.onclick = function () { campos.QAR.value = fmt(v, 2); propaga('QAR', String(v)); };
      at.appendChild(b);
    });
    p.appendChild(el('div', 'lead', 'Atalhos em riyal:'));
    p.appendChild(at);

    var at2 = el('div', 'btnrow'); at2.style.marginTop = '8px';
    [100, 500, 1000, 5000, 20000, 50000].forEach(function (v) {
      var b = el('button', 'btn sec', '₹ ' + v.toLocaleString('pt-BR'));
      b.onclick = function () { campos.INR.value = fmt(v, 0); propaga('INR', String(v)); };
      at2.appendChild(b);
    });
    p.appendChild(el('div', 'lead', 'Atalhos em rupia:'));
    p.appendChild(at2);
    root.appendChild(p);

    var pn = el('div', 'panel');
    pn.appendChild(el('h2', null, 'O que saber sobre estas taxas'));
    M.notas.forEach(function (t, i) {
      var row = el('div', 'pick');
      row.appendChild(el('div', 'rank', String(i + 1)));
      var b2 = el('div', 'pb'); b2.appendChild(el('div', 'px', esc(t)));
      row.appendChild(b2); pn.appendChild(row);
    });
    var box2 = el('div', 'srcs'); box2.style.marginTop = '12px';
    M.fontes.forEach(function (f) {
      var a = el('a', null, '↗ ' + esc(f.t)); a.href = f.u; a.target = '_blank'; a.rel = 'noopener';
      box2.appendChild(a);
    });
    pn.appendChild(box2);
    root.appendChild(pn);

    if (M.saque) viewSaque(root, M.saque);

    setTimeout(function () { campos.BRL.focus(); }, 60);
  }

  /* ---------- dinheiro na mao: sacar com a Wise na India ---------- */
  function viewSaque(root, S) {
    function painel(titulo) {
      var p = el('div', 'panel');
      p.appendChild(el('h2', null, esc(titulo)));
      return p;
    }
    function paras(p, arr) {
      (Array.isArray(arr) ? arr : [arr]).forEach(function (t) {
        p.appendChild(el('div', 'lead', esc(t)));
      });
    }
    function lista(p, arr) {
      arr.forEach(function (t, i) {
        var row = el('div', 'pick');
        row.appendChild(el('div', 'rank', String(i + 1)));
        var b = el('div', 'pb'); b.appendChild(el('div', 'px', esc(t)));
        row.appendChild(b); p.appendChild(row);
      });
    }

    var p0 = painel(S.titulo);
    p0.appendChild(el('div', 'lead', esc(S.resposta)));
    root.appendChild(p0);

    var p1 = painel(S.comprar.t);
    paras(p1, S.comprar.p);
    root.appendChild(p1);

    var p2 = painel('As três camadas da taxa');
    S.camadas.forEach(function (c, i) {
      var row = el('div', 'pick');
      row.appendChild(el('div', 'rank', String(i + 1)));
      var b = el('div', 'pb');
      b.appendChild(el('div', 'px', esc(c.n)));
      var v = el('div', 'px'); v.appendChild(el('b', null, esc(c.v))); b.appendChild(v);
      b.appendChild(el('div', 'lead', esc(c.d)));
      if (c.alerta) {
        var al = el('div', 'lead'); al.appendChild(el('span', 'tag gold', esc(c.alerta)));
        b.appendChild(al);
      }
      row.appendChild(b);
      p2.appendChild(row);
    });
    root.appendChild(p2);

    var p3 = painel(S.limite.t); paras(p3, S.limite.p); root.appendChild(p3);
    var p4 = painel(S.plano.t); lista(p4, S.plano.p); root.appendChild(p4);
    var p5 = painel(S.ondePrecisa.t); lista(p5, S.ondePrecisa.p); root.appendChild(p5);
    var p6 = painel(S.antesDeSair.t); lista(p6, S.antesDeSair.p); root.appendChild(p6);
    if (S.c6) {
      var pc = painel(S.c6.t);
      pc.appendChild(el('div', 'lead', esc(S.c6.resumo)));
      S.c6.itens.forEach(function (c, i) {
        var row = el('div', 'pick');
        row.appendChild(el('div', 'rank', String(i + 1)));
        var b = el('div', 'pb');
        b.appendChild(el('div', 'px', esc(c.n)));
        var v = el('div', 'px'); v.appendChild(el('b', null, esc(c.v))); b.appendChild(v);
        b.appendChild(el('div', 'lead', esc(c.d)));
        row.appendChild(b);
        pc.appendChild(row);
      });
      root.appendChild(pc);

      var pp = painel(S.c6.papel.t);
      paras(pp, S.c6.papel.p);
      var cf = el('div', 'lead'); cf.appendChild(el('span', 'tag gold', esc(S.c6.confira)));
      pp.appendChild(cf);
      root.appendChild(pp);
    }

    var p7 = painel(S.doha.t); paras(p7, S.doha.p); root.appendChild(p7);
    var p8 = painel(S.reserva.t); paras(p8, S.reserva.p);
    var box = el('div', 'srcs'); box.style.marginTop = '12px';
    S.fontes.forEach(function (f) {
      var a = el('a', null, '↗ ' + esc(f.t)); a.href = f.u; a.target = '_blank'; a.rel = 'noopener';
      box.appendChild(a);
    });
    p8.appendChild(box);
    root.appendChild(p8);
  }

  /* ---------- Índia: a chegada ----------
     Duas coisas diferentes chamadas de "mapa", e a distincao e honesta:
     DENTRO do terminal o GPS nao pega, entao ali vale um ESQUEMA de sequencia.
     FORA, a posicao e real — e quem navega de verdade e o Google Maps, que
     conhece o "Arrival P6"; eu nao invento coordenada de ponto interno. */
  function viewChegada(root) {
    var C2 = HERO_INDIA.chegada;

    var p0 = el('div', 'panel');
    p0.appendChild(el('h2', null, 'A chegada'));
    p0.appendChild(el('div', 'lead', esc(C2.voo)));
    p0.appendChild(el('div', 'lead', '<b>Destino:</b> ' + esc(C2.destino)));
    var pr = el('div', 'note');
    pr.appendChild(el('div', 'px', '<b>' + esc(C2.primeiro.t) + '</b>'));
    pr.appendChild(el('div', 'lead', esc(C2.primeiro.p)));
    p0.appendChild(pr);
    root.appendChild(p0);

    /* o esquema do terminal */
    var pe = el('div', 'panel');
    pe.appendChild(el('h2', null, 'Do avião ao carro'));
    pe.appendChild(el('div', 'lead', 'Dentro do terminal o GPS não funciona — então isto é um esquema da ordem das coisas, não um mapa de posição. A posição ao vivo entra assim que vocês saírem.'));
    var dz = el('div', 'esquema');
    dz.innerHTML = HERO_ARTE.chegadaT3 ? HERO_ARTE.chegadaT3() : '';
    pe.appendChild(dz);
    root.appendChild(pe);

    var pp = el('div', 'panel');
    pp.appendChild(el('h2', null, 'Passo a passo'));
    C2.passos.forEach(function (x, i) {
      var row = el('div', 'pick');
      row.appendChild(el('div', 'rank', String(i + 1)));
      var bb = el('div', 'pb');
      bb.appendChild(el('div', 'px', '<b>' + esc(x.t) + '</b>'));
      bb.appendChild(el('div', 'lead', esc(x.d)));
      row.appendChild(bb); pp.appendChild(row);
    });
    root.appendChild(pp);

    /* mapa ao vivo: so vale do lado de fora, e quem navega e o Maps */
    var pm = el('div', 'panel');
    pm.appendChild(el('h2', null, 'Mapa ao vivo'));
    pm.appendChild(el('div', 'lead', 'Funciona ao ar livre. Os dois botões abrem o Google Maps já com o destino preenchido, a partir de onde vocês estiverem.'));
    caixaGeo(pm, 'a distância até o hotel');
    var br = el('div', 'btnrow'); br.style.marginTop = '10px';
    var b1 = el('a', 'btn gold', '🚶 A pé até o ponto do Uber');
    b1.href = 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=' +
      encodeURIComponent(C2.pontoUber);
    b1.target = '_blank'; b1.rel = 'noopener'; br.appendChild(b1);
    var b2 = el('a', 'btn sec', '🚗 Rota até o hotel');
    b2.href = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' +
      encodeURIComponent(C2.enderecoBusca);
    b2.target = '_blank'; b2.rel = 'noopener'; br.appendChild(b2);
    var b3 = el('button', 'btn sec', '📋 Copiar endereço do hotel');
    b3.onclick = function () {
      var t = C2.enderecoBusca;
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(
        function () { b3.textContent = '✓ Copiado'; },
        function () { prompt('Copie o endereço:', t); });
      else prompt('Copie o endereço:', t);
    };
    br.appendChild(b3);
    pm.appendChild(br);
    root.appendChild(pm);

    var pc = el('div', 'panel');
    pc.appendChild(el('h2', null, esc(C2.comparativo.t)));
    C2.comparativo.linhas.forEach(function (l) {
      var q = el('div', 'note');
      q.appendChild(el('div', 'px', '<b>' + esc(l.k) + '</b>'));
      q.appendChild(el('div', 'lead', esc(l.a)));
      q.appendChild(el('div', 'lead', esc(l.b)));
      pc.appendChild(q);
    });
    pc.appendChild(el('div', 'lead', esc(C2.comparativo.sobretaxa)));
    var vd = el('div', 'note warn');
    vd.appendChild(el('div', 'lead', esc(C2.comparativo.veredito)));
    pc.appendChild(vd);
    root.appendChild(pc);

    var pg = el('div', 'panel');
    pg.appendChild(el('h2', null, 'Os quatro golpes, e a regra de cada um'));
    C2.golpes.forEach(function (x, i) {
      var row = el('div', 'pick');
      row.appendChild(el('div', 'rank', String(i + 1)));
      var bb = el('div', 'pb');
      bb.appendChild(el('div', 'px', '<b>' + esc(x.t) + '</b>'));
      bb.appendChild(el('div', 'lead', esc(x.d)));
      row.appendChild(bb); pg.appendChild(row);
    });
    var bx = el('div', 'srcs'); bx.style.marginTop = '12px';
    C2.fontes.forEach(function (f) {
      var a2 = el('a', null, '↗ ' + esc(f.t));
      a2.href = f.u; a2.target = '_blank'; a2.rel = 'noopener';
      bx.appendChild(a2);
    });
    pg.appendChild(bx);
    root.appendChild(pg);
  }

  /* ---------- Índia ---------- */
  function viewIndiaRoteiro(root) {
    var I = HERO_INDIA;
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'Dia a dia'));
    p.appendChild(el('div', 'lead', 'Roteiro do anfitrião local, com as minhas notas onde tenho algo útil a dizer.'));
    root.appendChild(p);

    I.dias.forEach(function (d) {
      var c = el('div', 'panel dia');
      var art = el('div', 'dia-arte');
      art.innerHTML = HERO_ARTE[d.arte] ? HERO_ARTE[d.arte]() : '';
      c.appendChild(art);
      var b = el('div', 'dia-txt');
      var top = el('div', 'nn');
      top.appendChild(el('span', 'nh', esc(d.d)));
      top.appendChild(document.createTextNode(d.cidade));
      if (d.ponte) top.appendChild(el('span', 'tag gold', 'vira para Doha'));
      b.appendChild(top);
      b.appendChild(el('div', 'nl', esc(d.t)));
      b.appendChild(el('div', 'nx', esc(d.x)));
      b.appendChild(el('div', 'nx', '<b>Hotel:</b> ' + esc(d.hotel)));
      if (d.theo) b.appendChild(el('div', 'note', '<b>Theo:</b> ' + esc(d.theo)));
      if (d.alerta) b.appendChild(el('div', 'note warn', '⚠️ ' + esc(d.alerta)));
      /* passos: uma sequencia para seguir na hora, sem ter que ler nada.
         Existe para o dia da chegada, que e quando ninguem esta em condicoes
         de tomar decisao. */
      if (d.passos) {
        var lp = el('div', 'note');
        lp.appendChild(el('div', 'px', '<b>' + esc(d.passos.t) + '</b>'));
        d.passos.p.forEach(function (x, i) {
          var row = el('div', 'pick');
          row.appendChild(el('div', 'rank', String(i + 1)));
          var pb = el('div', 'pb'); pb.appendChild(el('div', 'px', esc(x)));
          row.appendChild(pb); lp.appendChild(row);
        });
        b.appendChild(lp);
      }
      if (d.ponte) {
        var br = el('div', 'btnrow'); br.style.marginTop = '8px';
        var bt = el('button', 'btn gold', 'Abrir o guia de Doha →');
        bt.onclick = function () { irPara('doha'); };
        br.appendChild(bt); b.appendChild(br);
      }
      c.appendChild(b);
      root.appendChild(c);
    });
  }

  function viewIndiaVoos(root) {
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'Os voos'));
    p.appendChild(el('div', 'lead', 'Seis trechos. Localizadores e números de bilhete ficaram DE FORA de propósito — ' +
      'este repositório é público, e localizador com sobrenome é suficiente para mexer numa reserva.'));
    HERO_INDIA.voos.forEach(function (v) {
      var n = el('div', 'night');
      n.appendChild(el('div', 'nl', esc(v.d) + ' · ' + esc(v.cia)));
      var nn = el('div', 'nn');
      nn.appendChild(document.createTextNode(v.de + '  →  ' + v.para));
      if (v.n !== '—') nn.appendChild(el('span', 'nh', esc(v.n)));
      n.appendChild(nn);
      n.appendChild(el('div', 'nx', '<b>' + esc(v.sai) + '</b> → <b>' + esc(v.chega) + '</b> · ' + esc(v.dur)));
      p.appendChild(n);
    });
    root.appendChild(p);
  }

  function viewIndiaHoteis(root) {
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'Os hotéis da Índia'));
    p.appendChild(el('div', 'lead', 'Com os benefícios que constam nas suas confirmações — vale usar, a maioria some se não perguntar.'));
    HERO_INDIA.hoteis.forEach(function (h) {
      var n = el('div', 'night');
      n.appendChild(el('div', 'nl', esc(h.c) + ' · ' + esc(h.p)));
      n.appendChild(el('div', 'nn', esc(h.n)));
      n.appendChild(el('div', 'nx', esc(h.obs)));
      var br = el('div', 'btnrow'); br.style.marginTop = '8px';
      var m = el('a', 'btn sec', '📍 Mapa');
      m.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(h.n + ' ' + h.c);
      m.target = '_blank'; m.rel = 'noopener'; br.appendChild(m);
      n.appendChild(br);
      p.appendChild(n);
    });
    root.appendChild(p);
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
      var da = daBase(a), db = daBase(b);
      return (da ? da.km : a.distKm) - (db ? db.km : b.distKm);
    });

    var cnt = el('div', 'count');
    cnt.textContent = lista.length + ' de ' + R.length + ' lugares' + (minhaPos ? ' · ordenados por distância de você' : ' · ordenados por distância do ' + C.base.nome);
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

  function viewEscala(root) {
    var E = HERO_ESCALA;
    var p0 = el('div', 'panel');
    p0.appendChild(el('h2', null, esc(E.pergunta)));
    p0.appendChild(el('p', null, '<b>' + esc(E.resposta) + '</b>'));
    root.appendChild(p0);

    /* O aviso da noite curta mora aqui (saiu da página inicial). */
    if (typeof HERO_VIAGEM !== 'undefined' && HERO_VIAGEM.alerta) {
      var a = HERO_VIAGEM.alerta;
      var pa = el('div', 'panel');
      pa.appendChild(el('h2', null, '⚠️ ' + esc(a.t)));
      pa.appendChild(el('div', 'note warn', esc(a.d)));
      pa.appendChild(el('div', 'note ok', esc(a.d2)));
      root.appendChild(pa);
    }

    /* A escala da IDA vem primeiro: e a que acontece em dois dias. */
    if (E.ida) {
      var I2 = E.ida;
      var pi = el('div', 'panel');
      pi.appendChild(el('h2', null, '\u2708\ufe0f ' + esc(I2.t)));
      pi.appendChild(el('div', 'lead', esc(I2.voos)));
      pi.appendChild(el('div', 'note warn', '<b>Tempo real:</b> ' + esc(I2.janela)));
      pi.appendChild(el('div', 'note ok', esc(I2.veredito)));
      I2.linha.forEach(function (x) {
        var n = el('div', 'night');
        n.appendChild(el('div', 'nl', esc(x.h)));
        n.appendChild(el('div', 'nx', esc(x.o)));
        pi.appendChild(n);
      });
      root.insertBefore(pi, root.firstChild);

      if (I2.confirmado) {
        var pcf = el('div', 'panel');
        var C2 = I2.confirmado;
        pcf.appendChild(el('h2', null, '\u2705 ' + esc(C2.t)));
        pcf.appendChild(el('div', 'lead', esc(C2.d)));
        pcf.appendChild(el('div', 'note ok', esc(C2.oQueMuda)));
        C2.atencao.forEach(function (a) {
          pcf.appendChild(el('div', 'note warn', '<b>' + esc(a.t) + '</b><br>' + esc(a.d)));
        });
        pcf.appendChild(el('div', 'note', esc(C2.escolha)));
        pcf.appendChild(el('div', 'note ok', esc(C2.veredito)));
        root.insertBefore(pcf, pi.nextSibling);
        pi = pcf;
      }
      if (I2.onde) {
        var po = el('div', 'panel');
        po.appendChild(el('h2', null, '\ud83e\udded ' + esc(I2.onde.t)));
        po.appendChild(el('div', 'note ok', esc(I2.onde.d)));
        I2.onde.concourses.forEach(function (c) {
          var n = el('div', 'night');
          n.appendChild(el('div', 'nn', esc(c.n)));
          n.appendChild(el('div', 'nx', esc(c.d)));
          po.appendChild(n);
        });
        po.appendChild(el('div', 'note warn', esc(I2.onde.gate)));
        po.appendChild(el('div', 'note', esc(I2.onde.porqueNaoImporta)));
        po.appendChild(el('div', 'note', esc(I2.onde.ressalva)));
        root.insertBefore(po, pi.nextSibling);
      }

      var pcz = el('div', 'panel');
      pcz.appendChild(el('h2', null, '\ud83d\udcb3 ' + esc(I2.cartoes.t)));
      pcz.appendChild(el('div', 'note bad', esc(I2.cartoes.aviso)));
      var dlz = el('dl', 'kv');
      I2.cartoes.linhas.forEach(function (l) {
        dlz.appendChild(el('dt', null, esc(l.prog)));
        dlz.appendChild(el('dd', null, '<b>' + esc(l.abre) + '</b><br>' + esc(l.d)));
      });
      pcz.appendChild(dlz);
      pcz.appendChild(el('div', 'note ok', esc(I2.cartoes.apps)));
      root.insertBefore(pcz, (I2.onde ? po : pi).nextSibling);

      var ancora = pcz;
      [I2.gratis, I2.pagos].forEach(function (bl, i) {
        var pb2 = el('div', 'panel');
        pb2.appendChild(el('h2', null, (i === 0 ? '\ud83c\udd93 ' : '\ud83d\udcb0 ') + esc(bl.t)));
        bl.itens.forEach(function (x) {
          var n = el('div', 'night');
          n.appendChild(el('div', 'nn', esc(x.n)));
          n.appendChild(el('div', 'nx', esc(x.d)));
          pb2.appendChild(n);
        });
        root.insertBefore(pb2, ancora.nextSibling);
        ancora = pb2;
      });
    }

    var pv = el('div', 'panel');
    pv.appendChild(el('h2', null, 'O veredito'));
    E.veredito.forEach(function (t) {
      pv.appendChild(el('p', null, esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')));
    });
    root.appendChild(pv);

    var pc = el('div', 'panel');
    pc.appendChild(el('h2', null, 'As contas, lado a lado'));
    pc.appendChild(el('div', 'lead', 'Tudo para o casal, no dia 30/09.'));
    var dl = el('dl', 'kv');
    E.contas.forEach(function (c) {
      dl.appendChild(el('dt', null, esc(c.o)));
      dl.appendChild(el('dd', null, '<b>' + esc(c.v) + '</b> — ' + esc(c.obs)));
    });
    pc.appendChild(dl);
    root.appendChild(pc);

    var st = E.stopover;
    var ps = el('div', 'panel');
    ps.appendChild(el('h2', null, '⭐ ' + esc(st.t)));
    ps.appendChild(el('p', null, esc(st.d)));
    var g = el('div', 'scores');
    st.precos.forEach(function (x) {
      var b = el('div', 'score');
      b.appendChild(el('div', 'n', 'R$ ' + x.brl));
      b.appendChild(el('div', 'l', esc(x.n) + ' · US$ ' + x.usd + '/pessoa'));
      g.appendChild(b);
    });
    ps.appendChild(g);
    ps.appendChild(el('div', 'note', esc(st.nota)));
    ps.appendChild(el('div', 'note ok', '<b>Como fazer:</b> ' + esc(st.comoFazer)));
    ps.appendChild(el('div', 'note warn', esc(st.ressalva)));
    var br = el('div', 'btnrow'); br.style.marginTop = '10px';
    var a1 = el('a', 'btn gold', '🔗 Discover Qatar');
    a1.href = 'https://www.discoverqatar.qa/'; a1.target = '_blank'; a1.rel = 'noopener';
    br.appendChild(a1);
    var a2 = el('a', 'btn sec', '🔗 Visit Qatar — Stopover');
    a2.href = 'https://visitqatar.com/intl-en/qatar-stopover'; a2.target = '_blank'; a2.rel = 'noopener';
    br.appendChild(a2);
    ps.appendChild(br);
    root.appendChild(ps);

    if (typeof HERO_STOPOVER !== 'undefined') {
      var S = HERO_STOPOVER;
      var pn2 = el('div', 'panel');
      pn2.appendChild(el('h2', null, 'Os quatro níveis do Stopover'));
      pn2.appendChild(el('div', 'note bad', esc(S.honestidade)));
      S.niveis.forEach(function (x) {
        var n = el('div', 'night');
        if (!x.destaque) n.style.borderLeftColor = 'var(--line)';
        n.appendChild(el('div', 'nl', 'US$ ' + x.usd + ' por pessoa/noite'));
        var nn = el('div', 'nn');
        nn.appendChild(document.createTextNode(x.n));
        nn.appendChild(el('span', 'nh', 'R$ ' + x.casalNoite + ' o casal/noite'));
        nn.appendChild(el('span', 'tag', 'R$ ' + x.casal3.toLocaleString('pt-BR') + ' as 3 noites'));
        if (x.destaque) nn.appendChild(el('span', 'tag gold', 'o mais interessante'));
        n.appendChild(nn);
        n.appendChild(el('div', 'nx', '<b>Marcas:</b> ' + esc(x.marcas)));
        n.appendChild(el('div', 'nx', '<b>Exemplos citados:</b> ' + esc(x.exemplos)));
        n.appendChild(el('div', 'nx', esc(x.d)));
        pn2.appendChild(n);
      });
      var dlc = el('dl', 'kv'); dlc.style.marginTop = '14px';
      S.comparativo.linhas.forEach(function (l) {
        dlc.appendChild(el('dt', null, esc(l.o)));
        dlc.appendChild(el('dd', null, '<b>' + esc(l.v) + '</b> — ' + esc(l.obs)));
      });
      pn2.appendChild(el('h3', null, esc(S.comparativo.t)));
      pn2.appendChild(dlc);
      pn2.appendChild(el('h3', null, 'As regras'));
      S.regras.forEach(function (t, i) {
        var row = el('div', 'pick');
        row.appendChild(el('div', 'rank', String(i + 1)));
        var bb = el('div', 'pb'); bb.appendChild(el('div', 'px', esc(t)));
        row.appendChild(bb); pn2.appendChild(row);
      });
      pn2.appendChild(el('h3', null, 'Como ver a lista real, em 10 minutos'));
      S.comoVer.forEach(function (t, i) {
        var row = el('div', 'pick');
        row.appendChild(el('div', 'rank', String(i + 1)));
        var bb = el('div', 'pb'); bb.appendChild(el('div', 'px', esc(t)));
        row.appendChild(bb); pn2.appendChild(row);
      });
      /* A cotacao real entra ANTES de tudo: e o unico bloco com preco confirmado. */
      if (S.cotacaoReal) {
        var pc = el('div', 'panel');
        pc.appendChild(el('h2', null, '\ud83d\udcb0 ' + esc(S.cotacaoReal.t)));
        pc.appendChild(el('div', 'lead', esc(S.cotacaoReal.quem)));
        var dlr = el('dl', 'kv');
        S.cotacaoReal.linhas.forEach(function (l) {
          dlr.appendChild(el('dt', null, esc(l.o)));
          dlr.appendChild(el('dd', null, '<b>QAR ' + l.qar.toLocaleString('pt-BR') + ' \u00b7 R$ ' +
            l.brl.toLocaleString('pt-BR') + '</b><br>' + esc(l.obs)));
        });
        pc.appendChild(dlr);
        S.cotacaoReal.conclusoes.forEach(function (t, i) {
          pc.appendChild(el('div', 'note ' + (i === 0 ? 'bad' : i === 1 ? 'warn' : 'ok'), esc(t)));
        });
        root.insertBefore(pc, root.firstChild);
      }
      if (S.listaPremium) {
        var pl2 = el('div', 'panel');
        pl2.appendChild(el('h2', null, esc(S.listaPremium.t)));
        pl2.appendChild(el('div', 'lead', esc(S.listaPremium.intro)));
        S.listaPremium.hoteis.forEach(function (h2) {
          var n = el('div', 'night');
          n.appendChild(el('div', 'nl', esc(h2.onde)));
          n.appendChild(el('div', 'nn', esc(h2.n)));
          if (h2.bom) n.appendChild(el('div', 'note ok', esc(h2.bom)));
          if (h2.ruim) n.appendChild(el('div', 'note warn', esc(h2.ruim)));
          var fz = fontesDe(h2.f); if (fz) n.appendChild(fz);
          pl2.appendChild(n);
        });
        pl2.appendChild(el('div', 'note', esc(S.listaPremium.contraste)));
        root.insertBefore(pl2, root.firstChild.nextSibling);
      }
      if (S.valeAPena) {
        var pw = el('div', 'panel');
        pw.appendChild(el('h2', null, '⚖️ ' + esc(S.valeAPena.t)));
        var dlw = el('dl', 'kv');
        S.valeAPena.contas.forEach(function (c) {
          dlw.appendChild(el('dt', null, esc(c.o)));
          dlw.appendChild(el('dd', null, '<b>' + esc(c.v) + '</b>'));
        });
        pw.appendChild(dlw);
        S.valeAPena.texto.forEach(function (t) {
          pw.appendChild(el('p', null, esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')));
        });
        root.insertBefore(pw, root.firstChild.nextSibling);
      }
      if (S.email) {
        var pe = el('div', 'panel');
        pe.appendChild(el('h2', null, '✉️ ' + esc(S.email.t)));
        pe.appendChild(el('div', 'lead', esc(S.email.nota)));
        var dle = el('dl', 'kv');
        dle.appendChild(el('dt', null, 'Para')); dle.appendChild(el('dd', null, esc(S.email.para)));
        dle.appendChild(el('dt', null, 'Assunto')); dle.appendChild(el('dd', null, esc(S.email.assunto)));
        pe.appendChild(dle);
        var pre = el('div', 'note');
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.fontSize = '12.5px';
        pre.textContent = S.email.corpo;
        pe.appendChild(pre);
        var bre = el('div', 'btnrow'); bre.style.marginTop = '10px';
        var ml = el('a', 'btn gold', '✉️ Abrir no e-mail');
        ml.href = 'mailto:' + S.email.para + '?subject=' + encodeURIComponent(S.email.assunto) +
                  '&body=' + encodeURIComponent(S.email.corpo);
        bre.appendChild(ml);
        var cp = el('button', 'btn sec', '📋 Copiar o texto');
        cp.onclick = function () {
          if (navigator.clipboard) navigator.clipboard.writeText(S.email.corpo).then(
            function () { cp.textContent = '✓ Copiado'; },
            function () { prompt('Copie:', S.email.corpo); });
          else prompt('Copie:', S.email.corpo);
        };
        bre.appendChild(cp);
        pe.appendChild(bre);
        root.appendChild(pe);
      }
      if (S.alwadiResposta) {
        pn2.appendChild(el('h3', null, esc(S.alwadiResposta.t)));
        pn2.appendChild(el('p', null, esc(S.alwadiResposta.d)));
      }
      if (S.prazos) {
        pn2.appendChild(el('h3', null, esc(S.prazos.t)));
        var dlp = el('dl', 'kv');
        S.prazos.itens.forEach(function (x) {
          dlp.appendChild(el('dt', null, esc(x.o)));
          dlp.appendChild(el('dd', null, esc(x.d)));
        });
        pn2.appendChild(dlp);
      }
      if (S.cuidado) pn2.appendChild(el('div', 'note bad', '⚠️ ' + esc(S.cuidado)));
      pn2.appendChild(el('div', 'note ok', '<b>Meu voto:</b> ' + esc(S.veredito)));
      root.appendChild(pn2);
    }

    var th = E.travaHorario;
    var pt = el('div', 'panel');
    pt.appendChild(el('h2', null, '⏱ ' + esc(th.t)));
    pt.appendChild(el('p', null, esc(th.d)));
    pt.appendChild(el('div', 'note bad', esc(th.agravante)));
    pt.appendChild(el('div', 'note warn', '<b>Possível saída:</b> ' + esc(th.saida)));
    root.appendChild(pt);

    var pa = el('div', 'panel');
    pa.appendChild(el('h2', null, '🍷 ' + esc(E.alcool.t)));
    pa.appendChild(el('p', null, esc(E.alcool.d)));
    root.appendChild(pa);

    var pl = el('div', 'panel');
    pl.appendChild(el('h2', null, 'Os lounges'));
    E.lounges.forEach(function (l) {
      var n = el('div', 'night');
      n.appendChild(el('div', 'nl', esc(l.a)));
      var nn = el('div', 'nn');
      nn.appendChild(document.createTextNode(l.n));
      nn.appendChild(el('span', 'nh', esc(l.p)));
      n.appendChild(nn);
      n.appendChild(el('div', 'nx', esc(l.d)));
      if (l.alerta) n.appendChild(el('div', 'note warn', esc(l.alerta)));
      pl.appendChild(n);
    });
    root.appendChild(pl);

    var pf = el('div', 'panel');
    pf.appendChild(el('h2', null, 'Fontes'));
    var box = el('div', 'srcs');
    E.fontes.forEach(function (f) {
      var a = el('a', null, '↗ ' + esc(f.t)); a.href = f.u; a.target = '_blank'; a.rel = 'noopener';
      box.appendChild(a);
    });
    pf.appendChild(box);
    root.appendChild(pf);
  }

  function viewBeber(root) {
    var B = (typeof HERO_BARES !== 'undefined') ? HERO_BARES : null;
    if (B) {
      var pb = el('div', 'panel');
      pb.appendChild(el('h2', null, 'Os bares'));
      pb.appendChild(el('div', 'lead', 'Ordenados por distância do Souq Waqif. Você NÃO precisa estar hospedado para entrar.'));
      B.lista.forEach(function (x) {
        var n = el('div', 'night');
        if (!x.destaque) n.style.borderLeftColor = 'var(--line)';
        n.appendChild(el('div', 'nl', esc(x.h) + ' · ' + esc(x.b)));
        var nn = el('div', 'nn');
        nn.appendChild(document.createTextNode(x.n));
        nn.appendChild(el('span', 'nh', esc(x.dist)));
        if (x.andar) nn.appendChild(el('span', 'tag', esc(x.andar)));
        if (x.destaque) nn.appendChild(el('span', 'tag gold', 'destaque'));
        n.appendChild(nn);
        n.appendChild(el('div', 'nx', esc(x.d)));
        n.appendChild(el('div', 'nx', '<b>Por quê:</b> ' + esc(x.porque)));
        if (x.hora) n.appendChild(el('div', 'nx', '<b>Horário:</b> ' + esc(x.hora)));
        var br = el('div', 'btnrow'); br.style.marginTop = '8px';
        var m = el('a', 'btn sec', '📍 Mapa');
        m.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(x.n + ' ' + x.h + ' Doha');
        m.target = '_blank'; m.rel = 'noopener'; br.appendChild(m);
        if (x.u) { var a = el('a', 'btn sec', '🌐 Site oficial'); a.href = x.u; a.target = '_blank'; a.rel = 'noopener'; br.appendChild(a); }
        n.appendChild(br);
        pb.appendChild(n);
      });
      root.appendChild(pb);

      var pp = el('div', 'panel');
      pp.appendChild(el('h2', null, 'Quanto custa um drink'));
      pp.appendChild(el('div', 'lead', esc(B.precos.intro)));
      var dlp = el('dl', 'kv');
      B.precos.itens.forEach(function (x) {
        dlp.appendChild(el('dt', null, esc(x.o)));
        dlp.appendChild(el('dd', null, esc(x.d) + ' · <b>' + esc(x.brl) + '</b>'));
      });
      pp.appendChild(dlp);
      root.appendChild(pp);

      var pr = el('div', 'panel');
      pr.appendChild(el('h2', null, 'Cinco regras que evitam problema'));
      B.regras.forEach(function (t, i) {
        var row = el('div', 'pick');
        row.appendChild(el('div', 'rank', String(i + 1)));
        var b2 = el('div', 'pb'); b2.appendChild(el('div', 'px', esc(t)));
        row.appendChild(b2); pr.appendChild(row);
      });
      root.appendChild(pr);
    }
    var A = (typeof HERO_ALCOOL !== 'undefined') ? HERO_ALCOOL : null;
    if (!A) { root.appendChild(el('div', 'panel', '<p>Guia de álcool indisponível.</p>')); return; }

    var imp = el('div', 'panel');
    imp.appendChild(el('h2', null, esc(A.impacto.titulo)));
    A.impacto.texto.forEach(function (t) {
      var html = esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      imp.appendChild(el('p', null, html));
    });
    root.appendChild(imp);

    var p1 = el('div', 'panel');
    p1.appendChild(el('h2', null, 'A regra no Catar'));
    p1.appendChild(el('div', 'lead', 'Pesquisado em 14/09/2026. Nenhuma mudança na lei de álcool em 2026 — as alterações do ano foram em imóveis, trabalho, drones e aluguel.'));
    A.lei.forEach(function (x) {
      p1.appendChild(el('h3', null, esc(x.t)));
      p1.appendChild(el('p', null, esc(x.d)));
    });
    root.appendChild(p1);

    var p2 = el('div', 'panel');
    p2.appendChild(el('h2', null, '🚫 Onde NÃO se bebe'));
    p2.appendChild(el('div', 'lead', 'Áreas e casas secas que afetam diretamente o roteiro de vocês.'));
    A.secas.forEach(function (x) {
      var row = el('div', 'pick');
      row.appendChild(el('div', 'rank', x.forca === 'confirmado' ? '✓' : '?'));
      var pb = el('div', 'pb');
      var pn = el('div', 'pn');
      pn.appendChild(document.createTextNode(x.l));
      pn.appendChild(el('span', 'tag ' + (x.forca === 'confirmado' ? 'bad' : 'warn'),
        x.forca === 'confirmado' ? 'confirmado' : 'provável'));
      pb.appendChild(pn);
      pb.appendChild(el('div', 'px', esc(x.d)));
      row.appendChild(pb); p2.appendChild(row);
    });
    root.appendChild(p2);

    var p3 = el('div', 'panel');
    p3.appendChild(el('h2', null, '🍷 Onde se bebe'));
    p3.appendChild(el('div', 'lead', 'Lembre da pegadinha: a licença é por venue, não por hotel. Um prédio pode ter rooftop licenciado e restaurante seco.'));
    var dl = el('dl', 'kv');
    A.servem.forEach(function (x) {
      dl.appendChild(el('dt', null, esc(x.l)));
      dl.appendChild(el('dd', null, '<b>' + esc(x.v) + '</b> — ' + esc(x.d)));
    });
    p3.appendChild(dl);
    root.appendChild(p3);

    var p4 = el('div', 'panel');
    p4.appendChild(el('h2', null, 'Um drink perto do Souq Waqif'));
    p4.appendChild(el('div', 'lead', esc(A.pertoDoSouq.intro)));
    A.pertoDoSouq.itens.forEach(function (x, i) {
      var row = el('div', 'pick');
      row.appendChild(el('div', 'rank', String(i + 1)));
      var pb = el('div', 'pb');
      var pn = el('div', 'pn');
      pn.appendChild(document.createTextNode(x.n));
      if (x.u) {
        var a = el('a', 'pill-link', 'site oficial');
        a.href = x.u; a.target = '_blank'; a.rel = 'noopener';
        pn.appendChild(a);
      }
      pb.appendChild(pn);
      pb.appendChild(el('div', 'px', esc(x.d)));
      row.appendChild(pb); p4.appendChild(row);
    });
    p4.appendChild(el('div', 'note warn', esc(A.pertoDoSouq.aviso)));
    root.appendChild(p4);

    var p5 = el('div', 'panel');
    p5.appendChild(el('h2', null, 'Ver na lista'));
    p5.appendChild(el('div', 'lead', 'Cada ficha diz se a casa serve. Os filtros abaixo abrem a lista já cortada.'));
    var br = el('div', 'btnrow');
    [['🍷 Só os que servem', 'alcool'], ['🚫 Só os secos', 'seco'], ['Todos', 'todos']].forEach(function (b) {
      var bt = el('button', 'btn sec', b[0]);
      bt.onclick = function () { filtroAtivo = b[1]; aba = 'lista'; render(); };
      br.appendChild(bt);
    });
    p5.appendChild(br);
    var cont = { sim: 0, nao: 0, ind: 0 };
    R.forEach(function (r) { if (r.status === 'fechado') return; r.alcool === true ? cont.sim++ : r.alcool === false ? cont.nao++ : cont.ind++; });
    p5.appendChild(el('div', 'note', 'Dos ' + (cont.sim + cont.nao + cont.ind) + ' lugares abertos: <b>' + cont.sim +
      '</b> servem álcool, <b>' + cont.nao + '</b> não servem, e <b>' + cont.ind +
      '</b> não foi possível confirmar — nesses, a ficha diz exatamente o que falta confirmar e para quem perguntar.'));
    root.appendChild(p5);

    var p6 = el('div', 'panel');
    p6.appendChild(el('h2', null, 'Fontes'));
    var box = el('div', 'srcs');
    A.fontes.forEach(function (f) {
      var a = el('a', null, '↗ ' + esc(f.t)); a.href = f.u; a.target = '_blank'; a.rel = 'noopener';
      box.appendChild(a);
    });
    p6.appendChild(box);
    root.appendChild(p6);
  }

  function viewHoteis(root) {
    var H = (typeof HERO_HOTEIS !== 'undefined') ? HERO_HOTEIS : null;
    if (!H) { root.appendChild(el('div', 'panel', '<p>Dados de hotéis indisponíveis.</p>')); return; }

    if (H.decidido) {
      var pd = el('div', 'panel');
      pd.appendChild(el('h2', null, '✅ ' + esc(H.decidido.t)));
      pd.appendChild(el('p', null, esc(H.decidido.d)));
      pd.appendChild(el('div', 'note warn', esc(H.decidido.falta)));
      root.appendChild(pd);
    }
    var pv = el('div', 'panel');
    pv.appendChild(el('h2', null, esc(H.veredito.titulo)));
    H.veredito.texto.forEach(function (t) {
      pv.appendChild(el('p', null, esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')));
    });
    root.appendChild(pv);

    var pc = el('div', 'panel');
    pc.appendChild(el('h2', null, 'De onde vêm estes números'));
    pc.appendChild(el('div', 'note', '<b>' + esc(H.contexto.datas) + '</b><br>' + esc(H.contexto.origem)));
    pc.appendChild(el('div', 'note ok', esc(H.contexto.pesquisei)));
    root.appendChild(pc);

    var ordenado = H.lista.slice().sort(function (a, b) { return a.noite - b.noite; });
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'Os ' + H.lista.length + ' hotéis, do mais barato ao mais caro'));
    ordenado.forEach(function (x) {
      var n = el('div', 'night');
      if (!x.vencedor) n.style.borderLeftColor = x.seco === true ? 'var(--red)' : 'var(--line)';
      n.appendChild(el('div', 'nl', esc(x.b) + ' · ' + esc(x.dist)));
      var nn = el('div', 'nn');
      nn.appendChild(document.createTextNode(x.n));
      nn.appendChild(el('span', 'nh', 'R$ ' + x.noite + '/noite'));
      nn.appendChild(el('span', 'tag', 'R$ ' + x.total.toLocaleString('pt-BR') + ' as 2 noites'));
      nn.appendChild(el('span', 'tag blue', String(x.nota).replace('.', ',') + ' · ' + x.aval + ' aval.'));
      if (x.seco === true) nn.appendChild(el('span', 'tag bad', '🚫 SECO'));
      else if (x.seco === false) nn.appendChild(el('span', 'tag ok', '🍷 tem bar'));
      else nn.appendChild(el('span', 'tag warn', 'bar não confirmado'));
      if (x.vencedor) nn.appendChild(el('span', 'tag gold', '★ ' + x.vencedor));
      n.appendChild(nn);
      n.appendChild(el('div', 'nx', '<b>Bar:</b> ' + esc(x.bar)));
      n.appendChild(el('div', 'nx', esc(x.d)));
      var br = el('div', 'btnrow'); br.style.marginTop = '8px';
      var m = el('a', 'btn sec', '📍 Mapa');
      m.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(x.n + ' Doha');
      m.target = '_blank'; m.rel = 'noopener'; br.appendChild(m);
      n.appendChild(br);
      p.appendChild(n);
    });
    root.appendChild(p);

    var pf = el('div', 'panel');
    pf.appendChild(el('h2', null, 'Fontes'));
    var box = el('div', 'srcs');
    H.fontes.forEach(function (f) {
      var a = el('a', null, '↗ ' + esc(f.t)); a.href = f.u; a.target = '_blank'; a.rel = 'noopener';
      box.appendChild(a);
    });
    pf.appendChild(box);
    root.appendChild(pf);
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



  /* ---------- localização, para qualquer destino ----------
     Um só painel, usado por Doha, Nova York e Europa 2023. A distância sai do
     haversine entre você e a coordenada do lugar — e a coordenada carrega a
     precisão com que eu a anotei, porque 'a 300 m' só quer dizer alguma coisa
     se você souber que o ponto é o quarteirão e não a porta. */
  var PREC = { end: 'quarteirão', bairro: 'bairro', cidade: 'centro da cidade' };

  function distDe(x) {
    if (!minhaPos || !x || !x.lat) return null;
    return hav(minhaPos.lat, minhaPos.lng, x.lat, x.lng);
  }
  function txtDist(x) {
    var d = distDe(x); if (d == null) return '';
    return d < 1 ? Math.round(d * 1000) + ' m de você' : d.toFixed(1).replace('.', ',') + ' km de você';
  }
  function caixaGeo(root, oQue) {
    var geo = el('div', 'geo-box');
    geo.appendChild(el('span', null, minhaPos
      ? '📍 Ordenando ' + oQue + ' pelos mais perto de você agora.'
      : '📍 Ative a localização para ordenar ' + oQue + ' pelos mais próximos de onde você está.'));
    var gb = el('button', 'btn sec', minhaPos ? 'atualizar' : 'ativar');
    gb.onclick = function () { pedirLocal(gb); };
    geo.appendChild(gb);
    root.appendChild(geo);
  }
  function chipDist(x) {
    var d = distDe(x); if (d == null) return null;
    var t = el('span', 'tag dist', '📍 ' + txtDist(x));
    t.title = 'Coordenada no nível do ' + (PREC[x.prec] || 'quarteirão') + '.';
    return t;
  }
  function rotaPara(x) {
    var de = minhaPos ? (minhaPos.lat + ',' + minhaPos.lng) : '';
    return 'https://www.google.com/maps/dir/?api=1' + (de ? '&origin=' + de : '') +
      '&destination=' + encodeURIComponent(x.lat + ',' + x.lng);
  }
  function botaoRota(x, rotulo) {
    if (!x.lat) return null;
    var a = el('a', 'btn sec', '🧭 ' + (rotulo || (minhaPos ? 'Rota daqui' : 'Ver no mapa')));
    a.href = rotaPara(x); a.target = '_blank'; a.rel = 'noopener';
    a.style.fontSize = '13px'; a.style.padding = '8px 12px';
    return a;
  }

  /* ---------- Nova York: um roteiro antigo, conferido ---------- */
  var SELO_NY = {
    aberto:          { c: 'ok',   l: 'confirmado aberto' },
    fechado:         { c: 'bad',  l: 'FECHOU' },
    mudou:           { c: 'warn', l: 'mudou' },
    'nao-confirmado':{ c: 'blue', l: 'não confirmado' }
  };

  function fontesDe(lista) {
    if (!lista || !lista.length) return null;
    var w = el('div', 'fontes');
    w.appendChild(el('span', 'fl', 'Fonte:'));
    lista.forEach(function (f) {
      var a = el('a', null, esc(f.t)); a.href = f.u; a.target = '_blank'; a.rel = 'noopener';
      w.appendChild(a);
    });
    return w;
  }

  function viewNyRoteiro(root) {
    var N = HERO_NY;
    var p0 = el('div', 'panel');
    p0.appendChild(el('h2', null, 'O roteiro, como você escreveu'));
    p0.appendChild(el('div', 'lead', esc(N.autoria)));
    p0.appendChild(el('div', 'note', 'Seu texto está inteiro. O que eu acrescentei aparece sempre ' +
      'separado, marcado como <b>reparo de 2026</b> — para você ver na hora o que é seu e o que é meu.'));
    root.appendChild(p0);

    N.dias.forEach(function (d) {
      var p = el('div', 'panel');
      p.appendChild(el('h2', null, esc(d.nome)));
      var dl = el('dl', 'kv');
      if (d.manha) { dl.appendChild(el('dt', null, 'Manhã')); dl.appendChild(el('dd', null, esc(d.manha))); }
      if (d.tarde) { dl.appendChild(el('dt', null, 'Tarde')); dl.appendChild(el('dd', null, esc(d.tarde))); }
      if (d.noite) { dl.appendChild(el('dt', null, 'Noite')); dl.appendChild(el('dd', null, esc(d.noite))); }
      p.appendChild(dl);
      (d.voce || []).forEach(function (t) { p.appendChild(el('div', 'note', '“' + esc(t) + '”')); });
      (d.meus || []).forEach(function (m) {
        p.appendChild(el('div', 'note warn', '<b>Reparo de 2026 · ' + esc(m.t) + '</b><br>' + esc(m.d)));
      });
      root.appendChild(p);
    });
  }

  function viewNyMudou(root) {
    var N = HERO_NY;
    var p0 = el('div', 'panel');
    p0.appendChild(el('h2', null, 'O que mudou desde que você escreveu'));
    p0.appendChild(el('div', 'lead', 'Conferido em ' +
      new Date(N.conferidoEm + 'T12:00:00').toLocaleDateString('pt-BR') +
      '. Cada item tem a fonte do lado — se eu não achei fonte, eu digo que não achei.'));
    root.appendChild(p0);

    N.mudou.forEach(function (m) {
      var p = el('div', 'panel');
      var sel = SELO_NY[m.grau] || SELO_NY['nao-confirmado'];
      var h = el('h2', null, esc(m.t));
      p.appendChild(h);
      var tg = el('div', 'tagrow');
      tg.appendChild(el('span', 'tag ' + sel.c, sel.l));
      p.appendChild(tg);
      p.appendChild(el('div', 'note', '<b>Você escreveu:</b> ' + esc(m.antes)));
      p.appendChild(el('div', 'note ' + (m.grau === 'fechado' ? 'bad' : 'warn'), '<b>Hoje:</b> ' + esc(m.agora)));
      var f = fontesDe(m.fontes); if (f) p.appendChild(f);
      root.appendChild(p);
    });

    var pc = el('div', 'panel');
    pc.appendChild(el('h2', null, 'Correções de fato'));
    pc.appendChild(el('div', 'lead', 'Isto não é casa que fechou — é informação que estava errada no texto.'));
    N.correcoes.forEach(function (c) {
      pc.appendChild(el('div', 'note warn', '<b>' + esc(c.t) + '</b><br>' + esc(c.d)));
      var f = fontesDe(c.fontes); if (f) pc.appendChild(f);
    });
    root.appendChild(pc);
  }

  var nyFiltro = 'todos';
  function viewNyLugares(root) {
    var N = HERO_NY;
    var p0 = el('div', 'panel');
    p0.appendChild(el('h2', null, 'Os lugares, um a um'));
    p0.appendChild(el('div', 'lead', 'Todos os lugares citados no seu roteiro, com carimbo de conferência.'));
    root.appendChild(p0);

    caixaGeo(root, 'os lugares');

    var FN = [
      { id: 'todos', l: 'Todos' },
      { id: 'fechado', l: '⚠️ Fecharam' },
      { id: 'mudou', l: 'Mudaram' },
      { id: 'aberto', l: '✅ Confirmados' },
      { id: 'nao-confirmado', l: 'Não confirmados' }
    ];
    var fb = el('div', 'chips');
    FN.forEach(function (f) {
      var b = el('button', 'chip' + (nyFiltro === f.id ? ' on' : ''), f.l);
      b.onclick = function () { nyFiltro = f.id; render(true); };
      fb.appendChild(b);
    });
    root.appendChild(fb);

    var ordem = { fechado: 0, mudou: 1, aberto: 2, 'nao-confirmado': 3 };
    var lista = N.lugares.filter(function (x) { return nyFiltro === 'todos' || x.conf === nyFiltro; }).slice();
    if (minhaPos) {
      lista.sort(function (a, b) {
        var da = distDe(a), db = distDe(b);
        if (da == null) return 1;
        if (db == null) return -1;
        return da - db;
      });
    } else {
      lista.sort(function (a, b) { return ordem[a.conf] - ordem[b.conf]; });
    }

    var cnt = el('div', 'count', lista.length + ' de ' + N.lugares.length + ' lugares');
    cnt.style.margin = '10px 0'; root.appendChild(cnt);

    lista.forEach(function (x) {
      var sel = SELO_NY[x.conf];
      var p = el('div', 'panel');
      p.appendChild(el('h2', null, esc(x.n)));
      var tg = el('div', 'tagrow');
      tg.appendChild(el('span', 'tag ' + sel.c, sel.l));
      tg.appendChild(el('span', 'tag', esc(x.z)));
      tg.appendChild(el('span', 'tag', esc(x.tipo)));
      var cd = chipDist(x); if (cd) tg.appendChild(cd);
      p.appendChild(tg);
      if (x.d) p.appendChild(el('p', null, esc(x.d)));
      var br = botaoRota(x); if (br) { var bw = el('div', 'btnrow'); bw.appendChild(br); p.appendChild(bw); }
      var f = fontesDe(x.f); if (f) p.appendChild(f);
      root.appendChild(p);
    });
  }

  function viewNyOuro(root) {
    var N = HERO_NY;
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'O que você escreveu e continua valendo inteiro'));
    p.appendChild(el('div', 'lead', 'Nada aqui envelheceu. É o julgamento, não a informação — e julgamento não fecha por falência.'));
    N.ouro.forEach(function (t) { p.appendChild(el('div', 'note ok', esc(t))); });
    root.appendChild(p);
  }



  /* ---------- MAPA ----------
     Dois caminhos, de propósito:
     1) Leaflet + OpenStreetMap — mapa de verdade, com ruas. Precisa de internet.
     2) Se o Leaflet não carregar (sem sinal, ou a política de segurança do link
        privado bloqueando), entra um mapa desenhado aqui mesmo, em SVG, a partir
        das coordenadas. Não tem rua, mas mostra onde as coisas estão umas em
        relação às outras — e funciona offline, que é o caso de Doha. */

  var CORPIN = {
    aberto: '#1f7a47', fechado: '#c4383f', mudou: '#d98324', 'nao-confirmado': '#0e8c96'
  };
  function corDoPonto(x) {
    if (x.nota != null) return x.nota >= 10 ? '#a1690f' : x.nota >= 8 ? '#1f7a47' : x.nota >= 6 ? '#0e8c96' : '#c4383f';
    return CORPIN[x.conf] || '#6b6270';
  }

  /* Junta os pontos do destino atual num formato único. */
  function pontosDoDestino() {
    var p = [];
    if (destino === 'doha') {
      R.forEach(function (r) {
        if (!r.lat) return;
        p.push({ n: r.nome, lat: r.lat, lng: r.lng, prec: 'end', conf: r.status === 'aberto' ? 'aberto' : r.status === 'fechado' ? 'fechado' : 'nao-confirmado',
                 nota: null, sub: r.cozinha, id: r.id });
      });
    } else if (destino === 'ny') {
      HERO_NY.lugares.forEach(function (x) { if (x.lat) p.push({ n: x.n, lat: x.lat, lng: x.lng, prec: x.prec, conf: x.conf, nota: null, sub: x.z + ' · ' + x.tipo }); });
    } else if (ehArquivo()) {
      dadosEu().paradas.forEach(function (q) {
        if (mapaCidade !== 'todas' && q.id !== mapaCidade) return;
        q.lugares.forEach(function (l) {
          if (l.lat) p.push({ n: l.n, lat: l.lat, lng: l.lng, prec: l.prec, conf: l.conf, nota: l.nota, sub: q.nome + ' · ' + l.tipo, fora: l.feito === false });
        });
      });
    }
    return p;
  }

  var mapaCidade = 'todas';
  var leafletTentado = false, leafletPronto = false;
  function carregaLeaflet(cb) {
    if (leafletPronto) { cb(true); return; }
    if (leafletTentado) { cb(!!window.L); return; }
    leafletTentado = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    js.onload = function () { leafletPronto = !!window.L; cb(leafletPronto); };
    js.onerror = function () { cb(false); };
    document.head.appendChild(js);
    setTimeout(function () { if (!leafletPronto) cb(!!window.L); }, 6000);
  }

  /* Mapa desenhado aqui, sem dependência nenhuma. */
  function mapaSVG(cx, pts) {
    var las = pts.map(function (x) { return x.lat; }), lns = pts.map(function (x) { return x.lng; });
    if (minhaPos) { las.push(minhaPos.lat); lns.push(minhaPos.lng); }
    var la0 = Math.min.apply(null, las), la1 = Math.max.apply(null, las);
    var ln0 = Math.min.apply(null, lns), ln1 = Math.max.apply(null, lns);
    var mLa = Math.max((la1 - la0) * 0.12, 0.004), mLn = Math.max((ln1 - ln0) * 0.12, 0.004);
    la0 -= mLa; la1 += mLa; ln0 -= mLn; ln1 += mLn;
    var W = 320, H = 260;
    function px(x) { return ((x.lng - ln0) / (ln1 - ln0)) * W; }
    function py(x) { return H - ((x.lat - la0) / (la1 - la0)) * H; }

    var g = '';
    for (var i = 1; i < 6; i++) {
      g += '<line x1="0" y1="' + (H * i / 6) + '" x2="' + W + '" y2="' + (H * i / 6) + '" stroke="currentColor" stroke-width=".4" opacity=".12"/>' +
           '<line x1="' + (W * i / 6) + '" y1="0" x2="' + (W * i / 6) + '" y2="' + H + '" stroke="currentColor" stroke-width=".4" opacity=".12"/>';
    }
    var pins = '';
    pts.forEach(function (x) {
      var cxp = px(x).toFixed(1), cyp = py(x).toFixed(1);
      pins += '<circle cx="' + cxp + '" cy="' + cyp + '" r="4.2" fill="' + corDoPonto(x) + '" stroke="#fff" stroke-width="1.4" opacity="' + (x.fora ? '.45' : '1') + '"><title>' + esc(x.n) + '</title></circle>';
    });
    if (minhaPos) {
      var me = { lat: minhaPos.lat, lng: minhaPos.lng };
      pins += '<circle cx="' + px(me).toFixed(1) + '" cy="' + py(me).toFixed(1) + '" r="7" fill="none" stroke="#c81e64" stroke-width="2"/>' +
              '<circle cx="' + px(me).toFixed(1) + '" cy="' + py(me).toFixed(1) + '" r="3" fill="#c81e64"><title>Você está aqui</title></circle>';
    }
    var larguraKm = hav(la0, ln0, la0, ln1);
    var escala = larguraKm < 3 ? Math.round(larguraKm * 1000) + ' m' : larguraKm.toFixed(larguraKm < 20 ? 1 : 0).replace('.', ',') + ' km';
    cx.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;display:block;color:var(--ink)" role="img" ' +
      'aria-label="Mapa esquemático com ' + pts.length + ' lugares">' + g + pins +
      '<line x1="10" y1="' + (H - 12) + '" x2="70" y2="' + (H - 12) + '" stroke="currentColor" stroke-width="1.6"/>' +
      '<line x1="10" y1="' + (H - 16) + '" x2="10" y2="' + (H - 8) + '" stroke="currentColor" stroke-width="1.6"/>' +
      '<line x1="70" y1="' + (H - 16) + '" x2="70" y2="' + (H - 8) + '" stroke="currentColor" stroke-width="1.6"/>' +
      '<text x="74" y="' + (H - 8.5) + '" font-size="9" fill="currentColor" opacity=".75">' +
      (larguraKm * 60 / W < 1 ? Math.round(larguraKm * 60 / W * 1000) + ' m' : (larguraKm * 60 / W).toFixed(1).replace('.', ',') + ' km') +
      '</text>' +
      '<text x="' + (W - 8) + '" y="' + (H - 8.5) + '" font-size="9" text-anchor="end" fill="currentColor" opacity=".55">' +
      esc(escala) + ' de ponta a ponta</text></svg>';
  }

  function viewMapa(root) {
    var pts = pontosDoDestino();
    var p0 = el('div', 'panel');
    p0.appendChild(el('h2', null, 'Mapa'));
    p0.appendChild(el('div', 'lead', pts.length + ' lugares no mapa. Toque num pino para ver o nome. ' +
      'A cor diz o estado: verde é confirmado, vermelho fechou, laranja mudou, azul não confirmado' +
      (ehArquivo() ? ' — e onde houve nota de vocês, a cor segue a nota.' : '.')));
    root.appendChild(p0);

    if (ehArquivo()) {
      var ch = el('div', 'chips');
      var op = [{ id: 'todas', l: 'A viagem toda' }].concat(dadosEu().paradas.map(function (q) { return { id: q.id, l: q.nome }; }));
      op.forEach(function (o) {
        var b = el('button', 'chip' + (mapaCidade === o.id ? ' on' : ''), esc(o.l));
        b.onclick = function () { mapaCidade = o.id; leafletTentado = leafletTentado && leafletPronto; render(true); };
        ch.appendChild(b);
      });
      root.appendChild(ch);
    }

    caixaGeo(root, 'os pinos');

    var cx = el('div', 'mapa-wrap');
    cx.appendChild(el('div', 'mapa-aviso', 'Carregando o mapa…'));
    root.appendChild(cx);

    var leg = el('div', 'panel');
    leg.appendChild(el('h2', null, 'Legenda'));
    var lg = el('div', 'legenda');
    [['#1f7a47', 'confirmado aberto'], ['#c4383f', 'fechou'], ['#d98324', 'mudou'], ['#0e8c96', 'não confirmado']].forEach(function (x) {
      var r = el('div', 'lg-item');
      r.appendChild(el('i', null, '')); r.lastChild.style.background = x[0];
      r.appendChild(el('span', null, x[1]));
      lg.appendChild(r);
    });
    leg.appendChild(lg);
    if (ehArquivo()) {
      leg.appendChild(el('div', 'note', 'Nos roteiros com nota, o pino usa a NOTA de vocês: dourado é 10 ou mais, ' +
        'verde de 8 a 9, azul de 6 a 7, vermelho abaixo de 6. Pino apagado é o que ficou de fora.'));
    }
    leg.appendChild(el('div', 'note', 'As coordenadas fui eu que anotei, no nível do quarteirão, do bairro ou do ' +
      'centro da cidade — cada ficha diz qual. Para chegar de verdade, use o botão de rota da ficha.'));
    root.appendChild(leg);

    if (!pts.length) { cx.innerHTML = ''; cx.appendChild(el('div', 'mapa-aviso', 'Este destino ainda não tem lugares com coordenada.')); return; }

    carregaLeaflet(function (ok) {
      if (!ok || !window.L) {
        cx.innerHTML = '';
        var av = el('div', 'mapa-aviso', '<b>Sem internet para o mapa com ruas.</b><br>' +
          'Abaixo, o mapa que eu desenho aqui mesmo: sem ruas, mas mostra onde as coisas estão umas em relação às outras.');
        cx.appendChild(av);
        var box = el('div', 'mapa-svg'); cx.appendChild(box);
        mapaSVG(box, pts);
        return;
      }
      cx.innerHTML = '';
      var d = el('div'); d.id = 'mapa-' + destino; d.className = 'mapa'; cx.appendChild(d);
      var mapa = L.map(d, { scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '&copy; OpenStreetMap'
      }).addTo(mapa);
      var grupo = [];
      pts.forEach(function (x) {
        var m = L.circleMarker([x.lat, x.lng], {
          radius: 7, color: '#fff', weight: 2, fillColor: corDoPonto(x),
          fillOpacity: x.fora ? 0.5 : 0.95
        }).addTo(mapa);
        m.bindPopup('<b>' + esc(x.n) + '</b><br>' + esc(x.sub || '') +
          (x.nota != null ? '<br>nota de vocês: <b>' + x.nota + '</b>' : '') +
          (x.fora ? '<br><i>ficou de fora</i>' : '') +
          '<br><a href="' + rotaPara(x) + '" target="_blank" rel="noopener">rota daqui</a>');
        grupo.push([x.lat, x.lng]);
      });
      if (minhaPos) {
        L.circleMarker([minhaPos.lat, minhaPos.lng], { radius: 9, color: '#c81e64', weight: 3, fillColor: '#c81e64', fillOpacity: .5 })
          .addTo(mapa).bindPopup('Você está aqui');
        grupo.push([minhaPos.lat, minhaPos.lng]);
      }
      /* A ORDEM IMPORTA: o Leaflet precisa saber o tamanho real do container
         ANTES de calcular o enquadramento. Fazendo ao contrario, ele enquadra
         num tamanho errado e depois so estica - foi o que cortou metade dos
         pinos de Doha na primeira versao. */
      function enquadra() {
        mapa.invalidateSize(true);
        mapa.fitBounds(grupo, { padding: [30, 30], maxZoom: 16 });
      }
      enquadra();
      setTimeout(enquadra, 250);
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function () { mapa.invalidateSize(false); });
        ro.observe(d);
      }
      window.addEventListener('orientationchange', function () { setTimeout(enquadra, 300); });

      /* Botao para reenquadrar depois de arrastar o mapa. */
      var bz = el('button', 'btn sec mapa-fit', 'ver tudo');
      bz.onclick = function () { mapa.fitBounds(grupo, { padding: [30, 30], maxZoom: 16 }); };
      cx.appendChild(bz);
    });
  }

  /* ---------- Europa 2023: arquivo de veredictos ---------- */
  function corNota(n) {
    if (n == null) return '';
    if (n >= 11) return 'gold';
    if (n >= 9) return 'ok';
    if (n >= 7) return 'blue';
    if (n >= 5) return 'warn';
    return 'bad';
  }
  function chipNota(l) {
    if (l.nota == null) return null;
    return el('span', 'tag ' + corNota(l.nota), l.nota === 11 ? '11/10' : l.nota + '/10');
  }

  function fichaEu(l) {
    var p = el('div', 'panel');
    var h = el('h2', null, esc(l.n));
    if (!l.feito) h.innerHTML = esc(l.n) + ' <span class="riscou">ficou de fora</span>';
    p.appendChild(h);
    var tg = el('div', 'tagrow');
    var cn = chipNota(l); if (cn) tg.appendChild(cn);
    tg.appendChild(el('span', 'tag', esc(l.tipo)));
    var sel = SELO_NY[l.conf];
    if (sel) tg.appendChild(el('span', 'tag ' + sel.c, sel.l));
    var cd = chipDist(l); if (cd) tg.appendChild(cd);
    p.appendChild(tg);
    if (l.voce) p.appendChild(el('div', 'note ' + (l.nota != null && l.nota <= 5 ? 'bad' : 'ok'),
      '<b>Vocês escreveram:</b> “' + esc(l.voce) + '”'));
    if (l.d) p.appendChild(el('div', 'note', esc(l.d)));
    var br = botaoRota(l); if (br) { var bw = el('div', 'btnrow'); bw.appendChild(br); p.appendChild(bw); }
    var f = fontesDe(l.f); if (f) p.appendChild(f);
    return p;
  }

  function dadosEu() {
    return destino === 'eu25' ? HERO_EU25 : destino === 'bos' ? HERO_BOS : HERO_EU23;
  }
  /* Roteiros de arquivo: mesma estrutura (paradas/lugares/reparos), mesmas telas. */
  function ehArquivo() { return destino === 'eu23' || destino === 'eu25' || destino === 'bos'; }

  function viewEuRoteiro(root) {
    var E = dadosEu();
    var p0 = el('div', 'panel');
    p0.appendChild(el('h2', null, 'A viagem, parada por parada'));
    p0.appendChild(el('div', 'lead', esc(E.intro)));
    p0.appendChild(el('div', 'note', 'As notas são de vocês, escritas na hora, e ficam como estão. ' +
      'Eu conferi uma coisa só: a casa ainda existe? Onde não achei fonte, a ficha diz <b>não confirmado</b>.'));
    root.appendChild(p0);

    caixaGeo(root, 'a lista');
    if (minhaPos) {
      var perto = [];
      E.paradas.forEach(function (x) {
        x.lugares.forEach(function (l) { if (l.lat) perto.push({ l: l, onde: x.nome, d: distDe(l) }); });
      });
      perto.sort(function (a, b) { return a.d - b.d; });
      var pp = el('div', 'panel');
      pp.appendChild(el('h2', null, 'Mais perto de você agora'));
      pp.appendChild(el('div', 'lead', 'Se vocês estiverem no Brasil, os números vão ser absurdos — e é assim ' +
        'mesmo: a viagem foi em 2023. Isto serve para quando vocês voltarem à Europa.'));
      perto.slice(0, 8).forEach(function (t) {
        pp.appendChild(el('div', 'note', '<b>' + esc(t.l.n) + '</b> · ' + esc(t.onde) +
          ' — ' + esc(txtDist(t.l)) + (t.l.nota != null ? ' · nota ' + t.l.nota : '')));
      });
      root.appendChild(pp);
    }

    E.paradas.forEach(function (x) {
      var p = el('div', 'panel');
      p.appendChild(el('h2', null, esc(x.nome)));
      p.appendChild(el('div', 'lead', esc(x.datas)));
      if (x.hotel && x.hotel.n) {
        p.appendChild(el('div', 'note', '🏨 <b>' + esc(x.hotel.n) + '</b>' +
          (x.hotel.d ? ' — ' + esc(x.hotel.d) : '')));
      }
      root.appendChild(p);
      x.lugares.forEach(function (l) { root.appendChild(fichaEu(l)); });
    });
  }

  function viewEuNotas(root) {
    var E = dadosEu();
    var todos = [];
    E.paradas.forEach(function (x) {
      x.lugares.forEach(function (l) { if (l.nota != null) todos.push({ l: l, onde: x.nome }); });
    });
    todos.sort(function (a, b) { return b.l.nota - a.l.nota; });

    var p0 = el('div', 'panel');
    if (todos.length) {
      p0.appendChild(el('h2', null, 'As notas de vocês, do topo ao fundo'));
      p0.appendChild(el('div', 'lead', 'Esta é a informação que nenhum guia tem: o que VOCÊS acharam. ' +
        'Nada aqui foi recalculado — só ordenado.'));
    } else {
      p0.appendChild(el('h2', null, 'O que aconteceu, e o que não'));
      p0.appendChild(el('div', 'lead', 'Este roteiro não tem notas — tem ✓ e ◦. Então, em vez de ranking, ' +
        'o que interessa é a lista do que ficou de fora. É ali que mora a informação.'));
    }
    root.appendChild(p0);

    var g = el('div', 'panel');
    if (!todos.length) g.style.display = 'none';
    todos.forEach(function (t) {
      var r = el('div', 'linha-nota');
      var b = el('div', 'ln-nota ' + corNota(t.l.nota), t.l.nota === 11 ? '11' : String(t.l.nota));
      r.appendChild(b);
      var c = el('div', 'ln-txt');
      c.appendChild(el('strong', null, esc(t.l.n)));
      c.appendChild(el('span', null, esc(t.onde) + ' · ' + esc(t.l.tipo)));
      if (t.l.voce) c.appendChild(el('em', null, '“' + esc(t.l.voce) + '”'));
      r.appendChild(c);
      g.appendChild(r);
    });
    root.appendChild(g);

    var pf = el('div', 'panel');
    pf.appendChild(el('h2', null, 'Ficaram de fora'));
    pf.appendChild(el('div', 'lead', 'Marcados com ◦ no roteiro original — estavam no plano e não aconteceram.'));
    E.paradas.forEach(function (x) {
      x.lugares.forEach(function (l) {
        if (l.feito === false) {
          pf.appendChild(el('div', 'note warn', '<b>' + esc(l.n) + '</b> (' + esc(x.nome) + ')' +
            (l.d ? '<br>' + esc(l.d) : '')));
        }
      });
    });
    root.appendChild(pf);
  }

  function viewEuReparos(root) {
    var E = dadosEu();
    var p = el('div', 'panel');
    p.appendChild(el('h2', null, 'O que eu reparei, olhando de fora'));
    p.appendChild(el('div', 'lead', 'Conferência de ' +
      new Date(E.conferidoEm + 'T12:00:00').toLocaleDateString('pt-BR') + '.'));
    root.appendChild(p);
    E.reparos.forEach(function (r) {
      var q = el('div', 'panel');
      q.appendChild(el('h2', null, esc(r.t)));
      q.appendChild(el('p', null, esc(r.d)));
      root.appendChild(q);
    });
  }

  /* ---------- botao do Theo ----------
     Junta em texto o que esta na tela agora (destino, aba, ficha aberta,
     filtro, busca) e entrega isso junto com a pergunta. Texto, nao print:
     um print eu teria que ler de volta; o texto eu ja entendo, chega inteiro
     e nao depende de voce salvar e anexar nada. */
  var NOME_ABA = {
    destinos: 'a tela inicial de destinos', lista: 'a lista de restaurantes de Doha',
    curadoria: 'a curadoria de Doha (os topos e as categorias)', roteiros: 'os roteiros de Doha',
    souq: 'a secao do Souq Waqif', escala: 'a aba "A escala" (o dia 30/09 e o aeroporto)',
    beber: 'a aba "Onde beber" de Doha', hoteis: 'a comparacao de hoteis de Doha',
    reservaria: 'a aba "Eu reservaria"', avisos: 'a aba "Saber antes"',
    cambio: 'o conversor de moedas', chegada: 'a aba "A chegada" (sair do T3 de Delhi ate o hotel)',
    iroteiro: 'o roteiro da India',
    ivoos: 'os voos da India', ihoteis: 'os hoteis da India'
  };

  function contextoAtual() {
    var L = [];
    L.push('Estou no HeRo (nosso guia de viagens), versao ' + HERO_VERSAO.n + '.');
    if (!destino && aba === 'cambio') { L.push('Estou vendo ' + NOME_ABA.cambio + ', fora de um destino.'); return L.join(' '); }
    if (!destino || aba === 'destinos') { L.push('Estou vendo ' + NOME_ABA.destinos + '.'); return L.join(' '); }
    var d = HERO_DESTINOS.filter(function (x) { return x.id === destino; })[0];
    L.push('Estou no destino ' + (d ? d.nome + ' (' + d.periodo + ')' : destino) + ', vendo ' + (NOME_ABA[aba] || aba) + '.');
    if (fichaAberta) {
      var r = fichaAberta, db = daBase(r);
      L.push('A ficha aberta na tela e a do ' + r.nome + ' — ' + r.cozinha + ', ' + r.local + '.');
      L.push('O app mostra: ' + (db ? db.km.toFixed(1).replace('.', ',') + ' km / ' + db.min + ' min ' + (db.aPe ? 'a pe' : 'de carro') + ' do ' + C.base.nome + '; ' : '') +
             'preco ' + faixaTexto(r) + ' por pessoa (' +
             (r.precoNota === 'confirmado' ? 'confirmado' : r.precoNota === 'parcial' ? 'parcialmente confirmado' : 'NAO confirmado, faixa estimada') + '); ' +
             'alcool ' + (r.alcool === true ? 'sim' : r.alcool === false ? 'nao' : 'nao confirmado') + '; ' +
             'reserva ' + (r.reserva === 'obrigatoria' ? 'obrigatoria' : r.reserva === 'recomendavel' ? 'recomendavel' : 'nao precisa') + '.');
    } else if (aba === 'lista') {
      if (filtroAtivo && filtroAtivo !== 'todos') L.push('Filtro ativo: "' + filtroAtivo + '".');
      if (busca) L.push('Busquei por "' + busca + '".');
    }
    return L.join(' ');
  }

  function faixaTexto(r) {
    if (!r.precoQar) return 'sem faixa';
    return 'QAR ' + r.precoQar[0] + '–' + r.precoQar[1] +
           ' (R$ ' + Math.round(r.precoQar[0] * taxa) + '–' + Math.round(r.precoQar[1] * taxa) + ')';
  }

  function textoParaOTheo() {
    return 'Theo, estou com uma duvida usando o app.\n\nCONTEXTO (gerado pelo proprio HeRo, nao precisa perguntar de novo):\n' +
           contextoAtual() + '\n\nMINHA PERGUNTA:\n';
  }

  function atualizaClaude() {
    var a = $('#btnClaude'); if (!a) return;
    var q = textoParaOTheo();
    a.href = 'https://claude.ai/new?q=' + encodeURIComponent(q);
    a.dataset.txt = q;
  }

  function copia(txt) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt); return true; }
    } catch (e) { /* segue para o plano B */ }
    try {
      var t = document.createElement('textarea');
      t.value = txt; t.setAttribute('readonly', '');
      t.style.position = 'fixed'; t.style.top = '-1000px';
      document.body.appendChild(t); t.select(); t.setSelectionRange(0, 99999);
      var ok = document.execCommand('copy'); document.body.removeChild(t); return ok;
    } catch (e2) { return false; }
  }

  function montaBotaoClaude() {
    if ($('#btnClaude')) return;
    var a = el('a', 'fab-claude');
    a.id = 'btnClaude'; a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'Perguntar ao Theo com o contexto desta tela');
    a.innerHTML = '<span class="fab-ico" aria-hidden="true">✨</span><span class="fab-l">Perguntar<br><b>ao Theo</b></span>';
    a.onclick = function () {
      copia(a.dataset.txt || textoParaOTheo());
      var t = el('div', 'toast', 'Contexto copiado. Se o Claude abrir em branco, é só colar e escrever a pergunta.');
      document.body.appendChild(t);
      setTimeout(function () { t.classList.add('on'); }, 10);
      setTimeout(function () { t.classList.remove('on'); setTimeout(function () { t.remove(); }, 400); }, 4200);
    };
    document.body.appendChild(a);
    atualizaClaude();
  }

  function render(mantemFoco) {
    var root = $('#app'); root.innerHTML = '';
    pintaNav();
    pintaCabecalho();
    /* Moedas e a unica aba que NAO depende de um destino escolhido: ela le
       HERO_MOEDAS, nao C. Por isso vem antes do atalho abaixo — era exatamente
       ai que ela morria na tela inicial (destino vazio devolvia a lista de
       destinos sem nunca olhar a aba). */
    if (aba === 'cambio') { viewCambio(root); finaliza(mantemFoco); return; }
    if (aba === 'destinos' || !destino) { viewDestinos(root); finaliza(mantemFoco); return; }
    else if (aba === 'mapa') viewMapa(root);
    else if (aba === 'euroteiro') viewEuRoteiro(root);
    else if (aba === 'eunotas') viewEuNotas(root);
    else if (aba === 'eureparos') viewEuReparos(root);
    else if (aba === 'nyroteiro') viewNyRoteiro(root);
    else if (aba === 'nymudou') viewNyMudou(root);
    else if (aba === 'nylugares') viewNyLugares(root);
    else if (aba === 'nyouro') viewNyOuro(root);
    else if (aba === 'chegada') viewChegada(root);
    else if (aba === 'iroteiro') viewIndiaRoteiro(root);
    else if (aba === 'ivoos') viewIndiaVoos(root);
    else if (aba === 'ihoteis') viewIndiaHoteis(root);
    else if (aba === 'lista') viewLista(root);
    else if (aba === 'curadoria') viewCuradoria(root);
    else if (aba === 'roteiros') viewRoteiros(root);
    else if (aba === 'souq') viewSouq(root);
    else if (aba === 'escala') viewEscala(root);
    else if (aba === 'beber') viewBeber(root);
    else if (aba === 'hoteis') viewHoteis(root);
    else if (aba === 'reservaria') viewReservaria(root);
    else viewAvisos(root);
    finaliza(mantemFoco);
  }
  function finaliza(mantemFoco) {
    if (!mantemFoco) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    montaBotaoClaude(); atualizaClaude();
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

    aba = primeiraAba();

    var brand = $('.brand');
    if (brand) {
      brand.setAttribute('role', 'button');
      brand.setAttribute('tabindex', '0');
      brand.title = 'Voltar para os destinos';
      var irHome = function () {
        destino = ''; pref.destino = ''; save(LS_PREF, pref);
        aba = 'destinos'; fecharMais(); render();
        window.scrollTo(0, 0);
      };
      brand.onclick = irHome;
      brand.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); irHome(); } };
    }

    $('#btnAtualizar').onclick = function () {
      var b = $('#btnAtualizar');
      b.textContent = '…';
      var fim = function () { location.reload(true); };
      try {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage('limpar');
        }
        var p1 = ('caches' in window) ? caches.keys().then(function (ks) {
          return Promise.all(ks.map(function (k) { return caches.delete(k); }));
        }) : Promise.resolve();
        var p2 = (navigator.serviceWorker) ? navigator.serviceWorker.getRegistrations().then(function (rs) {
          return Promise.all(rs.map(function (r) { return r.unregister(); }));
        }) : Promise.resolve();
        Promise.all([p1, p2]).then(fim, fim);
        setTimeout(fim, 2500);
      } catch (e) { fim(); }
    };

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

    var v = (typeof HERO_VERSAO !== 'undefined') ? HERO_VERSAO : null;
    if (v && $('#versao')) {
      $('#versao').innerHTML = 'Versão <b>' + esc(v.n) + '</b> · ' +
        new Date(v.data + 'T12:00:00').toLocaleDateString('pt-BR') +
        '. Se uma seção nova não aparecer, toque em ⟳ no topo — isso limpa o app salvo e recarrega.';
    }

    render();
    registrarSW();

    var h = location.hash.match(/^#r\/(.+)$/);
    if (h && byId[h[1]]) abrir(h[1]);
  }

  function registrarSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(function () {
      pref.swOk = true; save(LS_PREF, pref);
    }).catch(function () {});
  }

  function avisoOffline() {
    var t = el('div', 'offline-tag', '📴 sem internet — usando o app salvo');
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 4000);
  }
  window.addEventListener('offline', avisoOffline);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
