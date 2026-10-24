/* HeRo — ilustrações dos destinos.
 *
 * São desenhos ORIGINAIS em SVG, feitos aqui. Não são fotos.
 * Motivo: este ambiente não alcança bancos de imagem, e foto de terceiro
 * num repositório público é problema de direito autoral. Desenho resolve
 * os dois, pesa alguns KB e fica nítido em qualquer tela.
 */

var HERO_ARTE = (function () {
  var uid = 0;
  function g() { return 'ga' + (++uid); }

  function moldura(inner, c1, c2, ceu1, ceu2) {
    var a = g(), b = g();
    return '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">' +
      '<defs>' +
      '<linearGradient id="' + a + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + ceu1 + '"/><stop offset="1" stop-color="' + ceu2 + '"/></linearGradient>' +
      '<linearGradient id="' + b + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>' +
      '</defs>' +
      '<rect width="320" height="200" fill="url(#' + a + ')"/>' +
      inner.replace(/%SOL%/g, 'url(#' + b + ')') +
      '</svg>';
  }

  return {
  /* Esquema do T3 — NAO e mapa GPS, e um diagrama de sequencia. Dentro do
     terminal o GPS nao funciona, entao desenhar "voce esta aqui" ali seria
     mentira. O que vale la dentro e saber a ordem das coisas. */
  chegadaT3: function () {
    var passos = [
      ['1', 'Port\u00f5es 5 \u00b7 6 \u00b7 7', 'desembarque internacional'],
      ['2', 'Imigra\u00e7\u00e3o', 'escada rolante \u00b7 45 a 90 min'],
      ['3', 'Esteiras 7 a 12', 'bagagem internacional'],
      ['4', 'Alf\u00e2ndega', 'canal verde'],
      ['5', 'SA\u00cdDA', 'caixa SBI \u00e0 direita \u00b7 Airtel'],
      ['6', 'Port\u00f5es 5 e 6', 'agora do lado de fora']
    ];
    var h = 74, topo = 26, alt = topo + passos.length * h + 130;
    var o = '<svg viewBox="0 0 320 ' + alt + '" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
      'font-family="system-ui,sans-serif" role="img" aria-label="Sequencia do Terminal 3">';
    o += '<line x1="34" y1="' + (topo + 14) + '" x2="34" y2="' +
         (topo + (passos.length - 1) * h + 14) + '" opacity=".3"/>';
    passos.forEach(function (x, i) {
      var y = topo + i * h;
      o += '<circle cx="34" cy="' + (y + 14) + '" r="13"/>';
      o += '<text x="34" y="' + (y + 19) + '" text-anchor="middle" stroke="none" ' +
           'fill="currentColor" font-size="13" font-weight="700">' + x[0] + '</text>';
      o += '<text x="60" y="' + (y + 11) + '" stroke="none" fill="currentColor" ' +
           'font-size="14" font-weight="600">' + x[1] + '</text>';
      o += '<text x="60" y="' + (y + 29) + '" stroke="none" fill="currentColor" ' +
           'font-size="11.5" opacity=".6">' + x[2] + '</text>';
    });
    /* daqui a rota se divide: Uber de um lado, taxi oficial do outro */
    var yb = topo + (passos.length - 1) * h + 14;
    o += '<path d="M34 ' + yb + ' v30 M34 ' + (yb + 30) + ' h196 M34 ' + (yb + 30) +
         ' v26 M230 ' + (yb + 30) + ' v26" opacity=".3"/>';
    o += '<rect x="6" y="' + (yb + 56) + '" width="150" height="64" rx="11"/>';
    o += '<text x="81" y="' + (yb + 79) + '" text-anchor="middle" stroke="none" ' +
         'fill="currentColor" font-size="13" font-weight="700">UBER</text>';
    o += '<text x="81" y="' + (yb + 96) + '" text-anchor="middle" stroke="none" ' +
         'fill="currentColor" font-size="10.5" opacity=".65">passarela coberta</text>';
    o += '<text x="81" y="' + (yb + 110) + '" text-anchor="middle" stroke="none" ' +
         'fill="currentColor" font-size="10.5" opacity=".65">MLCP \u00b7 Arrival P6</text>';
    o += '<rect x="166" y="' + (yb + 56) + '" width="148" height="64" rx="11"/>';
    o += '<text x="240" y="' + (yb + 79) + '" text-anchor="middle" stroke="none" ' +
         'fill="currentColor" font-size="13" font-weight="700">T\u00c1XI OFICIAL</text>';
    o += '<text x="240" y="' + (yb + 96) + '" text-anchor="middle" stroke="none" ' +
         'fill="currentColor" font-size="10.5" opacity=".65">Bharat Prepaid</text>';
    o += '<text x="240" y="' + (yb + 110) + '" text-anchor="middle" stroke="none" ' +
         'fill="currentColor" font-size="10.5" opacity=".65">entre as pistas 2 e 3</text>';
    o += '</svg>';
    return o;
  },
    /* Doha — torre de vento (barjeel), dhow e sol do Golfo */
    doha: function () {
      return moldura(
        '<circle cx="232" cy="96" r="38" fill="%SOL%" opacity=".85"/>' +
        /* skyline de West Bay ao fundo */
        '<g fill="#3d3career" opacity="0"/>' +
        '<g fill="#7a6a52" opacity=".45">' +
        '<rect x="246" y="70" width="12" height="80"/><rect x="262" y="52" width="10" height="98"/>' +
        '<rect x="276" y="82" width="14" height="68"/><rect x="294" y="64" width="11" height="86"/>' +
        '</g>' +
        /* torre de vento */
        '<g fill="#5c4a33">' +
        '<rect x="44" y="58" width="52" height="92"/>' +
        '<rect x="38" y="48" width="64" height="12"/>' +
        '<rect x="52" y="30" width="8" height="20"/><rect x="66" y="30" width="8" height="20"/><rect x="80" y="30" width="8" height="20"/>' +
        '<rect x="46" y="24" width="48" height="8"/>' +
        '</g>' +
        '<g fill="#efe4cf" opacity=".9"><rect x="56" y="78" width="12" height="24" rx="6"/><rect x="74" y="78" width="12" height="24" rx="6"/></g>' +
        /* dhow */
        '<g>' +
        '<path d="M126 150 L176 150 L166 138 L134 138 Z" fill="#4a3b28"/>' +
        '<path d="M150 136 L150 78 L186 136 Z" fill="#f6efe1" opacity=".95"/>' +
        '<path d="M148 136 L148 96 L124 136 Z" fill="#e8dcc4" opacity=".9"/>' +
        '</g>' +
        /* mar e duna */
        '<path d="M0 150 L320 150 L320 200 L0 200 Z" fill="#2f5d6b" opacity=".55"/>' +
        '<path d="M0 158 Q80 148 160 158 T320 156 L320 200 L0 200 Z" fill="#c8a86a" opacity=".55"/>',
        '#ffd27a', '#f08a3c', '#f6e3c4', '#e9b27a');
    },

    /* Nova York — o skyline de Midtown ao anoitecer */
    /* ===== CIDADES =====
       Nove desenhos novos (24/10), para a entrada por cidade ter a mesma
       dignidade que a grade de viagens tinha. Regra de cada um: a silhueta
       que AQUELA cidade tem e nenhuma outra — torre, cúpula, arco, ponte.
       Genérico "prédios europeus" não serve: seria desenho de lugar nenhum. */

    /* Paris — a torre, o Sena e os telhados mansarda */
    paris: function () {
      var tel = '';
      [[2, 150, 30], [36, 158, 26], [66, 146, 24], [240, 152, 28], [272, 144, 26], [300, 156, 20]].forEach(function (b) {
        tel += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + (200 - b[1]) + '" fill="#4a4158" opacity=".85"/>' +
               '<path d="M' + (b[0] - 2) + ' ' + b[1] + ' L' + (b[0] + b[2] / 2) + ' ' + (b[1] - 12) + ' L' + (b[0] + b[2] + 2) + ' ' + b[1] + ' Z" fill="#3a3246"/>' +
               '<rect x="' + (b[0] + 5) + '" y="' + (b[1] + 10) + '" width="6" height="9" fill="#ffd9a0" opacity=".65"/>';
      });
      /* O cartao corta ~24px em cima e embaixo: a torre vive entre y=32 e
         y=168, senao ela aparece sem a ponta. */
      var t = '<g stroke="#2f2740" stroke-width="3.4" fill="none" stroke-linecap="round">' +
        '<path d="M124 168 C 139 126 150 102 155 58"/><path d="M196 168 C 181 126 170 102 165 58"/>' +
        '<path d="M138 128 C 150 115 170 115 182 128"/>' +
        '</g>' +
        '<g fill="#2f2740">' +
        '<rect x="130" y="128" width="60" height="5" rx="2"/>' +
        '<rect x="142" y="100" width="36" height="4.5" rx="2"/>' +
        '<rect x="151" y="55" width="18" height="5" rx="2"/>' +
        '<rect x="158" y="36" width="4" height="20"/>' +
        '<path d="M131 168 L189 168 L185 160 L135 160 Z"/>' +
        '</g>' +
        '<g stroke="#2f2740" stroke-width="1.5" opacity=".5" fill="none">' +
        '<path d="M144 158 L176 132 M176 158 L144 132 M149 126 L171 104 M171 126 L149 104"/></g>' +
        '<circle cx="160" cy="34" r="2.6" fill="#ffb3c9"/>';
      var rio = '<path d="M0 168 L320 168 L320 200 L0 200 Z" fill="#2b3b52" opacity=".9"/>' +
        '<g fill="#ffd9a0" opacity=".2"><rect x="152" y="170" width="16" height="26"/>' +
        '<rect x="46" y="172" width="7" height="18"/><rect x="268" y="172" width="8" height="20"/></g>';
      return moldura('<circle cx="250" cy="62" r="25" fill="%SOL%" opacity=".6"/>' + tel + t + rio,
        '#ffd9b0', '#e08a9c', '#f3cdd6', '#6b5a86');
    },

    /* Barcelona — as torres da Sagrada Família, afiladas e perfuradas */
    barcelona: function () {
      var torres = '';
      [[96, 46, 15], [122, 24, 17], [152, 16, 18], [184, 28, 17], [212, 52, 15]].forEach(function (t) {
        var x = t[0], topo = t[1], w = t[2];
        torres += '<path d="M' + x + ' 200 L' + (x + w * 0.22) + ' ' + (topo + 16) +
          ' L' + (x + w / 2) + ' ' + topo + ' L' + (x + w * 0.78) + ' ' + (topo + 16) +
          ' L' + (x + w) + ' 200 Z" fill="#6b4a3a"/>';
        for (var j = topo + 34; j < 190; j += 16) {
          torres += '<rect x="' + (x + w * 0.3) + '" y="' + j + '" width="' + (w * 0.4) + '" height="6" rx="2.5" fill="#2e2030" opacity=".45"/>';
        }
        torres += '<circle cx="' + (x + w / 2) + '" cy="' + (topo - 4) + '" r="3.2" fill="#f2c14e"/>';
      });
      var base = '<rect x="78" y="150" width="164" height="50" fill="#5d4034"/>' +
        '<path d="M78 150 L160 128 L242 150 Z" fill="#6b4a3a"/>' +
        '<g fill="#f2c14e" opacity=".5"><rect x="96" y="166" width="9" height="16" rx="4"/>' +
        '<rect x="155" y="164" width="10" height="18" rx="5"/><rect x="214" y="166" width="9" height="16" rx="4"/></g>';
      var palm = '<g stroke="#3f5a3a" stroke-width="3" fill="none" stroke-linecap="round">' +
        '<path d="M28 200 L30 160"/><path d="M30 160 C 18 150 10 152 6 158 M30 160 C 42 150 50 152 54 158 M30 160 C 22 146 24 138 30 134 M30 160 C 40 148 44 144 44 138"/>' +
        '<path d="M292 200 L290 166"/><path d="M290 166 C 280 158 272 160 268 165 M290 166 C 300 158 308 160 312 165 M290 166 C 286 152 290 146 294 143"/></g>';
      return moldura('<circle cx="52" cy="48" r="25" fill="%SOL%" opacity=".62"/>' + base + torres + palm,
        '#ffe2a8', '#e2894a', '#ffd9b4', '#c9705c');
    },

    /* Lisboa — a ponte vermelha, o rio e a colina de telhados */
    lisboa: function () {
      /* A ordem importa e foi o bug da primeira versao: o rio entrava DEPOIS
         das casas e engolia a colina inteira. Agora o rio vem primeiro. */
      var rio = '<path d="M0 150 L320 150 L320 200 L0 200 Z" fill="#35718c" opacity=".92"/>' +
        '<g stroke="#ffffff" stroke-width="1.6" opacity=".18"><path d="M18 166h44M96 180h58M206 168h48M250 188h44"/></g>';
      /* a colina de telhados, a esquerda, com os pes na agua */
      var casas = '';
      for (var i = 0; i < 7; i++) {
        var x = 2 + i * 18, y = 104 + i * 6, w = 16;
        casas += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (150 - y) + '" fill="#f0e3d2"/>' +
          '<path d="M' + (x - 2) + ' ' + y + ' L' + (x + w / 2) + ' ' + (y - 8) + ' L' + (x + w + 2) + ' ' + y + ' Z" fill="#c2563f"/>' +
          '<rect x="' + (x + 5) + '" y="' + (y + 11) + '" width="5" height="7" fill="#8a7f8e" opacity=".55"/>';
      }
      /* Ponte 25 de Abril: pilares, cabo em catenaria e os tirantes */
      var p = '<g fill="#c0392b">' +
        '<rect x="128" y="44" width="7" height="106"/><rect x="258" y="44" width="7" height="106"/>' +
        '<rect x="124" y="64" width="15" height="5"/><rect x="254" y="64" width="15" height="5"/>' +
        '<rect x="60" y="134" width="260" height="6"/></g>' +
        '<path d="M60 112 C 100 140 110 140 131.5 66 C 170 140 222 140 261.5 66 C 288 104 306 114 320 110" ' +
        'stroke="#c0392b" stroke-width="3.4" fill="none"/>';
      var tir = '<g stroke="#c0392b" stroke-width="1.3" opacity=".85">';
      for (var k = 138; k < 258; k += 11) {
        var t = (k - 131.5) / 130, yy = 66 + 70 * t * t;
        tir += '<line x1="' + k + '" y1="' + yy.toFixed(1) + '" x2="' + k + '" y2="134"/>';
      }
      tir += '</g>';
      return moldura('<circle cx="60" cy="52" r="24" fill="%SOL%" opacity=".6"/>' + rio + casas + p + tir,
        '#ffeab4', '#f0a85e', '#ffe6c2', '#6fa8bf');
    },

    /* Madri — a Puerta de Alcalá, com a quadriga de pedra */
    madri: function () {
      var arco = '<g fill="#d8cdbc">' +
        '<rect x="88" y="74" width="144" height="92" rx="3"/>' +
        '<rect x="82" y="62" width="156" height="13" rx="3"/>' +
        '<rect x="86" y="52" width="148" height="11" rx="4"/></g>' +
        '<g fill="#8c7f72" opacity=".92">' +
        '<path d="M137 166 V118 a23 24 0 0 1 46 0 V166 Z"/>' +
        '<path d="M106 166 V128 a11 12 0 0 1 22 0 V166 Z"/>' +
        '<path d="M192 166 V128 a11 12 0 0 1 22 0 V166 Z"/></g>' +
        '<g fill="#c2b6a3">' +
        '<rect x="96" y="76" width="8" height="90"/><rect x="128" y="76" width="6" height="38"/>' +
        '<rect x="186" y="76" width="6" height="38"/><rect x="216" y="76" width="8" height="90"/></g>' +
        /* os grupos escultoricos: ficam ACIMA de y=34 so na base, nunca cortados */
        '<g fill="#b9ab96"><circle cx="106" cy="45" r="6.5"/><circle cx="142" cy="42" r="7.5"/>' +
        '<circle cx="178" cy="42" r="7.5"/><circle cx="214" cy="45" r="6.5"/></g>';
      var chao = '<rect x="0" y="166" width="320" height="34" fill="#9a8f7f" opacity=".5"/>';
      var arv = '<g fill="#3f5a3a" opacity=".9"><circle cx="32" cy="138" r="21"/><circle cx="48" cy="148" r="14"/>' +
        '<rect x="35" y="148" width="5" height="20" fill="#4a3a2c"/>' +
        '<circle cx="290" cy="140" r="19"/><circle cx="274" cy="150" r="12"/>' +
        '<rect x="287" y="150" width="5" height="18" fill="#4a3a2c"/></g>';
      return moldura('<circle cx="272" cy="48" r="20" fill="%SOL%" opacity=".45"/>' + chao + arco + arv,
        '#ffe6a8', '#e0a040', '#bcd9ef', '#6f94c4');
    },

    /* Roma — o Coliseu em arcos e os pinheiros-manso */
    roma: function () {
      var col = '<path d="M68 166 V102 a92 44 0 0 1 184 0 V166 Z" fill="#cdb79a"/>' +
        '<path d="M68 102 a92 44 0 0 1 184 0" fill="none" stroke="#b9a184" stroke-width="3.5"/>' +
        '<g fill="#a08a6f" opacity=".92">';
      /* tres ordens de arcos; a de cima ja em ruina a direita */
      for (var f = 0; f < 3; f++) {
        var y = 104 + f * 21;
        for (var a = 0; a < 7; a++) {
          var x = 78 + a * 24;
          if (f === 0 && a > 4) continue;
          col += '<path d="M' + x + ' ' + (y + 17) + ' V' + (y + 7) + ' a6.5 7.5 0 0 1 13 0 V' + (y + 17) + ' Z"/>';
        }
      }
      col += '</g>' +
        '<path d="M186 100 L194 80 L210 78 L224 86 L242 84 L252 98 Z" fill="#e8dcc6" opacity=".32"/>';
      /* pinheiros-manso: tronco fino, copa larga e achatada */
      function pinho(x, y, s) {
        return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
          '<rect x="-2.5" y="-30" width="5" height="30" fill="#4a3a2c"/>' +
          '<ellipse cx="0" cy="-36" rx="24" ry="10" fill="#2f5137"/>' +
          '<ellipse cx="-9" cy="-30" rx="13" ry="6.5" fill="#355c3d"/>' +
          '<ellipse cx="11" cy="-31" rx="12" ry="6.5" fill="#355c3d"/></g>';
      }
      var chao = '<rect x="0" y="166" width="320" height="34" fill="#9c8a6e" opacity=".5"/>';
      return moldura('<circle cx="282" cy="50" r="21" fill="%SOL%" opacity=".5"/>' + chao + col +
        pinho(30, 168, 1.05) + pinho(298, 166, .95) + pinho(62, 170, .65),
        '#ffe0a0', '#dd8f4a', '#ffd9b0', '#c87a62');
    },

    /* Florença — a cúpula de Brunelleschi e o campanário de Giotto */
    florenca: function () {
      var cupula = '<g>' +
        /* tambor octogonal, depois a cupula de Brunelleschi */
        '<rect x="116" y="130" width="92" height="36" fill="#e8dcc6"/>' +
        '<path d="M120 130 Q162 66 204 130 Z" fill="#b4522f"/>' +
        '<g stroke="#8d3d22" stroke-width="2.6" fill="none">' +
        '<path d="M162 68 V130"/><path d="M140 80 Q135 108 133 130"/><path d="M184 80 Q189 108 187 130"/></g>' +
        /* a lanterna: tambor, telhadinho conico e a bola dourada */
        '<rect x="152" y="54" width="20" height="16" rx="2" fill="#e8dcc6"/>' +
        '<path d="M149 54 L162 40 L175 54 Z" fill="#b4522f"/>' +
        '<circle cx="162" cy="36" r="4" fill="#f2c14e"/>' +
        '<g fill="#8d7f6a" opacity=".55"><rect x="157" y="58" width="5" height="9" rx="2.5"/></g>' +
        '<g fill="#b4522f" opacity=".5"><rect x="116" y="130" width="92" height="5"/>' +
        '<rect x="128" y="142" width="7" height="15" rx="3.5"/><rect x="158" y="140" width="8" height="17" rx="4"/>' +
        '<rect x="189" y="142" width="7" height="15" rx="3.5"/></g></g>';
      var campan = '<g><rect x="216" y="76" width="28" height="90" fill="#e8dcc6"/>' +
        '<g fill="#b4522f" opacity=".5"><rect x="216" y="76" width="28" height="5"/>' +
        '<rect x="216" y="104" width="28" height="4"/><rect x="216" y="132" width="28" height="4"/></g>' +
        '<g fill="#8d7f6a" opacity=".7"><rect x="223" y="86" width="6" height="12" rx="3"/>' +
        '<rect x="232" y="86" width="6" height="12" rx="3"/><rect x="223" y="114" width="6" height="13" rx="3"/>' +
        '<rect x="232" y="114" width="6" height="13" rx="3"/></g>' +
        '<path d="M214 76 h32 l-4 -9 h-24 Z" fill="#b4522f"/></g>';
      var cidade = '<g fill="#d9c9ae" opacity=".9">' +
        '<rect x="0" y="140" width="46" height="26"/><rect x="50" y="148" width="38" height="18"/>' +
        '<rect x="256" y="142" width="38" height="24"/><rect x="296" y="150" width="24" height="16"/></g>' +
        '<g fill="#b4522f" opacity=".75"><rect x="0" y="138" width="46" height="4"/><rect x="50" y="146" width="38" height="4"/>' +
        '<rect x="256" y="140" width="38" height="4"/><rect x="296" y="148" width="24" height="4"/></g>' +
        '<rect x="0" y="166" width="320" height="34" fill="#8e7f66" opacity=".45"/>';
      return moldura('<circle cx="58" cy="54" r="23" fill="%SOL%" opacity=".55"/>' + cidade + cupula + campan,
        '#ffe6ae', '#e09a52', '#ffdcc0', '#b9748a');
    },

    /* Milão — a floresta de pináculos góticos do Duomo */
    milao: function () {
      var pin = '';
      for (var i = 0; i < 13; i++) {
        var x = 36 + i * 20, h = 74 + (i % 3) * 16 + (i === 6 ? -26 : 0);
        pin += '<path d="M' + (x - 6) + ' 160 L' + (x - 3) + ' ' + h + ' L' + x + ' ' + (h - 13) +
               ' L' + (x + 3) + ' ' + h + ' L' + (x + 6) + ' 160 Z" fill="#cfc4ae"/>' +
               '<circle cx="' + x + '" cy="' + (h - 17) + '" r="2" fill="#f2c14e" opacity=".9"/>';
      }
      var corpo = '<rect x="24" y="154" width="272" height="28" fill="#ded3bd"/>' +
        '<g fill="#a89a80" opacity=".85">' +
        '<path d="M146 182 V166 a14 16 0 0 1 28 0 V182 Z"/>' +
        '<path d="M92 182 V170 a9 11 0 0 1 18 0 V182 Z"/>' +
        '<path d="M210 182 V170 a9 11 0 0 1 18 0 V182 Z"/>' +
        '<path d="M46 182 V172 a7 9 0 0 1 14 0 V182 Z"/>' +
        '<path d="M260 182 V172 a7 9 0 0 1 14 0 V182 Z"/></g>' +
        '<rect x="0" y="182" width="320" height="18" fill="#9b8f78" opacity=".5"/>';
      /* a Madonnina, dourada, no pinaculo central — y=40 para nunca ser cortada */
      var mad = '<circle cx="156" cy="40" r="4.6" fill="#f2c14e"/>' +
        '<path d="M152.6 45 L159.4 45 L158.2 58 L153.8 58 Z" fill="#f2c14e"/>';
      return moldura('<circle cx="272" cy="58" r="20" fill="%SOL%" opacity=".4"/>' + corpo + pin + mad,
        '#ffeec6', '#cfa36a', '#d9dde8', '#8e8aa6');
    },

    /* Boston — a cúpula dourada do State House, tijolo e um veleiro no Charles */
    boston: function () {
      var casas = '';
      [[0, 128, 34], [36, 136, 30], [68, 130, 28], [226, 134, 30], [258, 128, 32], [292, 138, 28]].forEach(function (b) {
        casas += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + (164 - b[1]) + '" fill="#8e4a3c"/>' +
          '<rect x="' + b[0] + '" y="' + (b[1] - 4) + '" width="' + b[2] + '" height="5" fill="#6f382d"/>';
        for (var r = b[1] + 10; r < 158; r += 16) {
          casas += '<rect x="' + (b[0] + 5) + '" y="' + r + '" width="7" height="10" fill="#ffd9a0" opacity=".55"/>' +
                   '<rect x="' + (b[0] + b[2] - 12) + '" y="' + r + '" width="7" height="10" fill="#ffd9a0" opacity=".4"/>';
        }
      });
      var state = '<g>' +
        '<rect x="118" y="106" width="84" height="58" fill="#b23a2e"/>' +
        '<path d="M112 106 h96 l-6 -10 h-84 Z" fill="#e8dcc6"/>' +
        '<g fill="#e8dcc6"><rect x="124" y="118" width="7" height="46"/><rect x="142" y="118" width="7" height="46"/>' +
        '<rect x="171" y="118" width="7" height="46"/><rect x="189" y="118" width="7" height="46"/></g>' +
        '<path d="M136 96 a24 26 0 0 1 48 0 Z" fill="#f2c14e"/>' +
        '<rect x="152" y="60" width="16" height="12" rx="3" fill="#f2c14e"/>' +
        '<rect x="158" y="44" width="4" height="17" fill="#f2c14e"/><circle cx="160" cy="41" r="3.4" fill="#ffe9a8"/>' +
        '</g>';
      var rio = '<path d="M0 164 L320 164 L320 200 L0 200 Z" fill="#2f5d7a" opacity=".9"/>' +
        '<g stroke="#ffffff" stroke-width="1.5" opacity=".18"><path d="M18 176h44M120 186h60M230 178h52"/></g>';
      var barco = '<g><path d="M72 178 L72 142 L98 174 Z" fill="#f6f1e6"/>' +
        '<path d="M68 178 L68 152 L52 178 Z" fill="#e8dcc6"/>' +
        '<path d="M44 180 h62 l-9 8 h-44 Z" fill="#3a2f2a"/></g>';
      return moldura('<circle cx="258" cy="48" r="24" fill="%SOL%" opacity=".5"/>' + casas + state + rio + barco,
        '#ffe2b4', '#d98a5a', '#cfdcea', '#7d8fb0');
    },

    /* Zaragoza — as torres e cúpulas da Basílica del Pilar, no Ebro */
    zaragoza: function () {
      var torre = function (x) {
        return '<g>' +
          '<rect x="' + (x - 11) + '" y="62" width="22" height="98" fill="#e0d2b8"/>' +
          '<rect x="' + (x - 13) + '" y="56" width="26" height="8" rx="2" fill="#cdbd9e"/>' +
          '<rect x="' + (x - 10) + '" y="44" width="20" height="13" rx="2" fill="#e0d2b8"/>' +
          '<path d="M' + (x - 11) + ' 44 L' + x + ' 26 L' + (x + 11) + ' 44 Z" fill="#9a7d5a"/>' +
          '<circle cx="' + x + '" cy="23" r="3.2" fill="#f2c14e"/>' +
          '<g fill="#8d7f6a" opacity=".6">' +
          '<rect x="' + (x - 4.5) + '" y="47" width="9" height="9" rx="4.5"/>' +
          '<rect x="' + (x - 5) + '" y="78" width="10" height="14" rx="5"/>' +
          '<rect x="' + (x - 5) + '" y="108" width="10" height="14" rx="5"/></g></g>';
      };
      var cupulas = '';
      [[112, 114, 19], [160, 102, 25], [208, 114, 19]].forEach(function (c) {
        cupulas += '<path d="M' + (c[0] - c[2]) + ' ' + (c[1] + c[2] * 0.7) + ' a' + c[2] + ' ' + c[2] +
          ' 0 0 1 ' + (c[2] * 2) + ' 0 Z" fill="#4e7fa0"/>' +
          '<rect x="' + (c[0] - c[2] - 2) + '" y="' + (c[1] + c[2] * 0.7) + '" width="' + (c[2] * 2 + 4) + '" height="6" fill="#cdbd9e"/>' +
          '<rect x="' + (c[0] - 1.5) + '" y="' + (c[1] - c[2] * 0.42 - 9) + '" width="3" height="9" fill="#cdbd9e"/>' +
          '<circle cx="' + c[0] + '" cy="' + (c[1] - c[2] * 0.42 - 11) + '" r="2.8" fill="#f2c14e"/>';
      });
      var corpo = '<rect x="74" y="130" width="172" height="32" fill="#e0d2b8"/>' +
        '<g fill="#9a8a70" opacity=".7"><rect x="92" y="140" width="8" height="15" rx="4"/>' +
        '<rect x="152" y="138" width="10" height="17" rx="5"/><rect x="216" y="140" width="8" height="15" rx="4"/></g>';
      var rio = '<path d="M0 162 L320 162 L320 200 L0 200 Z" fill="#53707e" opacity=".9"/>' +
        '<g fill="#e0d2b8" opacity=".2"><rect x="104" y="164" width="16" height="28"/>' +
        '<rect x="152" y="164" width="20" height="30"/><rect x="200" y="164" width="16" height="28"/></g>';
      return moldura('<circle cx="42" cy="54" r="22" fill="%SOL%" opacity=".5"/>' +
        corpo + cupulas + torre(80) + torre(240) + rio,
        '#ffe8b8', '#dd9a52', '#ffdfc0', '#9a7a9c');
    },

    /* São Paulo — a curva do Copan, os prédios do centro e garoa.
       Escolhi o Copan porque é a única silhueta que diz "São Paulo" sem
       legenda: a onda horizontal com os brises é dele e de mais ninguém. */
    sp: function () {
      var torres = '';
      var esp = [[4, 98, 15], [22, 114, 13], [38, 90, 16], [56, 108, 12], [74, 122, 14], [92, 102, 15],
                 [196, 106, 13], [214, 88, 16], [232, 118, 12], [250, 100, 15], [268, 112, 14], [288, 94, 16]];
      for (var i = 0; i < esp.length; i++) {
        var x = esp[i][0], y = esp[i][1], w = esp[i][2];
        torres += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (200 - y) + '" fill="#39324a" opacity=".72"/>';
        for (var j = y + 7; j < 158; j += 12) {
          torres += '<rect x="' + (x + 3) + '" y="' + j + '" width="' + (w - 6) + '" height="4" fill="#ffd9a0" opacity=".38"/>';
        }
      }
      /* Edifício Itália ao centro, mais alto e com a coroa iluminada */
      var italia =
        '<g fill="#332b44">' +
        '<rect x="142" y="56" width="32" height="104"/>' +
        '<rect x="150" y="42" width="16" height="16"/>' +
        '<rect x="156" y="28" width="4" height="15"/>' +
        '</g>' +
        '<g fill="#ffd9a0" opacity=".52">' +
        '<rect x="147" y="66" width="22" height="4"/><rect x="147" y="78" width="22" height="4"/>' +
        '<rect x="147" y="90" width="22" height="4"/><rect x="147" y="102" width="22" height="4"/>' +
        '<rect x="147" y="114" width="22" height="4"/><rect x="147" y="126" width="22" height="4"/>' +
        '</g>' +
        '<circle cx="158" cy="26" r="2.6" fill="#ff6f91"/>';
      /* O Copan: o corpo e os brises seguindo a mesma curva, deslocados */
      var copan = '<path d="M10 200 L10 152 C 74 128 140 176 310 142 L310 200 Z" fill="#241e30"/>';
      for (var k = 0; k < 5; k++) {
        var dy = 9 + k * 10;
        copan += '<path d="M10 ' + (152 + dy) + ' C 74 ' + (128 + dy) + ' 140 ' + (176 + dy) +
                 ' 310 ' + (142 + dy) + '" stroke="#f4e7d2" stroke-width="3.4" fill="none" opacity=".46"/>';
      }
      /* Garoa — fina, inclinada e discreta. É o clima da cidade. */
      var chuva = '';
      for (var m = 0; m < 54; m++) {
        var gx = (m * 37 + 11) % 320, gy = (m * 23 + 5) % 132;
        chuva += '<line x1="' + gx + '" y1="' + gy + '" x2="' + (gx - 3) + '" y2="' + (gy + 12) +
                 '" stroke="#ffffff" stroke-width="1" opacity=".15"/>';
      }
      return moldura(
        '<circle cx="232" cy="52" r="24" fill="%SOL%" opacity=".38"/>' +
        chuva + torres + italia + copan,
        '#ffe3b0', '#d79a62', '#cdd0dc', '#6f6886');
    },

    ny: function () {
      var torres = '';
      var esp = [[8,104,16],[28,88,14],[46,116,12],[62,96,18],[84,124,13],[100,108,15],
                 [214,110,14],[232,92,17],[252,120,12],[268,100,16],[288,86,13],[304,114,14]];
      for (var i = 0; i < esp.length; i++) {
        var x = esp[i][0], y = esp[i][1], w = esp[i][2];
        torres += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (160 - y) + '" fill="#2b2436" opacity=".82"/>';
        for (var j = y + 6; j < 154; j += 11) {
          torres += '<rect x="' + (x + 3) + '" y="' + j + '" width="' + (w - 6) + '" height="4" fill="#ffd27a" opacity=".55"/>';
        }
      }
      return moldura(
        '<circle cx="250" cy="70" r="26" fill="%SOL%" opacity=".55"/>' +
        torres +
        /* Empire State ao centro, com a antena */
        '<g fill="#3a3048">' +
        '<rect x="140" y="62" width="34" height="98"/>' +
        '<rect x="146" y="44" width="22" height="20"/>' +
        '<rect x="152" y="32" width="10" height="14"/>' +
        '<rect x="155" y="14" width="4" height="20"/>' +
        '</g>' +
        '<g fill="#ffd27a" opacity=".7">' +
        '<rect x="145" y="74" width="24" height="4"/><rect x="145" y="86" width="24" height="4"/>' +
        '<rect x="145" y="98" width="24" height="4"/><rect x="145" y="110" width="24" height="4"/>' +
        '<rect x="145" y="122" width="24" height="4"/><rect x="145" y="134" width="24" height="4"/>' +
        '</g>' +
        '<circle cx="157" cy="12" r="3" fill="#ff5f8f"/>' +
        /* rio e reflexo */
        '<path d="M0 160 L320 160 L320 200 L0 200 Z" fill="#1d2b3a" opacity=".8"/>' +
        '<g fill="#ffd27a" opacity=".22">' +
        '<rect x="148" y="162" width="18" height="30"/><rect x="34" y="164" width="8" height="22"/>' +
        '<rect x="238" y="164" width="9" height="24"/></g>',
        '#ff9ec4', '#7a3f8c', '#f7c9dc', '#8a5aa8');
    },

    /* Europa 2023 — cúpula toscana, ciprestes e colinas */
    eu23: function () {
      var colinas = '';
      for (var i = 0; i < 3; i++) {
        var y = 132 + i * 14;
        colinas += '<path d="M0 ' + y + ' Q80 ' + (y - 16) + ' 160 ' + y + ' T320 ' + (y - 6) +
                   ' L320 200 L0 200 Z" fill="#8a9a58" opacity="' + (0.3 + i * 0.18) + '"/>';
      }
      var cip = '';
      [[24, 1], [42, .78], [270, .9], [292, .7], [306, 1.05]].forEach(function (c) {
        cip += '<path d="M' + c[0] + ' 150 C' + (c[0] - 7 * c[1]) + ' 130 ' + (c[0] - 5 * c[1]) + ' ' +
               (150 - 52 * c[1]) + ' ' + c[0] + ' ' + (150 - 62 * c[1]) + ' C' + (c[0] + 5 * c[1]) + ' ' +
               (150 - 52 * c[1]) + ' ' + (c[0] + 7 * c[1]) + ' 130 ' + c[0] + ' 150 Z" fill="#3f5730" opacity=".88"/>';
      });
      return moldura(
        '<circle cx="238" cy="60" r="24" fill="%SOL%" opacity=".7"/>' +
        colinas +
        /* a cúpula */
        '<g>' +
        '<rect x="128" y="104" width="64" height="48" fill="#e8d6bc"/>' +
        '<path d="M130 104 Q160 50 190 104 Z" fill="#b8532f"/>' +
        '<path d="M156 50 h8 v-12 h-8 z" fill="#c9b08a"/>' +
        '<circle cx="160" cy="36" r="4" fill="#e8d6bc"/>' +
        '<rect x="196" y="72" width="16" height="80" fill="#e0cdb2"/>' +
        '<path d="M194 72 h20 l-10 -14 z" fill="#b8532f"/>' +
        '<g fill="#9a7f5e" opacity=".8">' +
        '<rect x="138" y="118" width="8" height="14" rx="4"/><rect x="156" y="118" width="8" height="14" rx="4"/>' +
        '<rect x="174" y="118" width="8" height="14" rx="4"/><rect x="200" y="96" width="8" height="12" rx="4"/></g>' +
        '</g>' +
        cip +
        '<path d="M0 168 Q90 160 180 170 T320 166 L320 200 L0 200 Z" fill="#c2a86c" opacity=".5"/>',
        '#f2c179', '#c9713f', '#fbe7c6', '#e6a86f');
    },

    /* Europa 2025 — torre, neve e telhados de Paris/Lisboa */
    eu25: function () {
      var telhados = '';
      [[8,118,26,34],[38,108,22,44],[64,124,30,28],[248,116,24,36],[276,106,20,46],[300,122,20,30]].forEach(function (b) {
        telhados += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" fill="#6b5a70" opacity=".7"/>' +
                    '<path d="M' + (b[0] - 3) + ' ' + b[1] + ' L' + (b[0] + b[2] / 2) + ' ' + (b[1] - 12) +
                    ' L' + (b[0] + b[2] + 3) + ' ' + b[1] + ' Z" fill="#4a3c52" opacity=".8"/>';
      });
      var flocos = '';
      for (var i = 0; i < 26; i++) {
        var x = (i * 47 % 320), y = (i * 29 % 120) + 8, r = 1 + (i % 3) * .6;
        flocos += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" opacity="' + (0.25 + (i % 4) * 0.12) + '"/>';
      }
      return moldura(
        '<circle cx="62" cy="52" r="20" fill="%SOL%" opacity=".5"/>' +
        flocos + telhados +
        /* a torre */
        '<g fill="#3b3042">' +
        '<path d="M160 28 L156 44 L164 44 Z"/>' +
        '<path d="M150 46 h20 l6 28 h-32 z" opacity=".92"/>' +
        '<path d="M140 76 h40 l10 34 h-60 z" opacity=".92"/>' +
        '<path d="M126 112 h68 l14 40 h-96 z" opacity=".92"/>' +
        '<rect x="124" y="108" width="72" height="5"/>' +
        '<rect x="136" y="72" width="48" height="5"/>' +
        '</g>' +
        '<path d="M113 152 h94" stroke="#3b3042" stroke-width="4" fill="none"/>' +
        '<path d="M0 152 L320 152 L320 200 L0 200 Z" fill="#e9e2ee" opacity=".55"/>' +
        '<path d="M0 162 Q80 152 160 162 T320 158 L320 200 L0 200 Z" fill="#fff" opacity=".45"/>',
        '#ffd9a8', '#c96f9a', '#dfe7f5', '#a88bc4');
    },

    /* Boston 2024 — a cúpula dourada, tijolo e neve */
    bos: function () {
      var flocos = '';
      for (var i = 0; i < 34; i++) {
        flocos += '<circle cx="' + (i * 61 % 320) + '" cy="' + ((i * 37 % 130) + 6) + '" r="' + (1 + (i % 3) * .5) +
                  '" fill="#fff" opacity="' + (0.3 + (i % 4) * 0.13) + '"/>';
      }
      var casario = '';
      [[6,126,30],[40,118,26],[70,132,24],[252,128,26],[282,116,24],[308,130,22]].forEach(function (b) {
        casario += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + (158 - b[1]) + '" fill="#8c4b3a" opacity=".72"/>' +
                   '<path d="M' + (b[0] - 2) + ' ' + b[1] + ' L' + (b[0] + b[2] / 2) + ' ' + (b[1] - 9) + ' L' + (b[0] + b[2] + 2) + ' ' + b[1] + ' Z" fill="#5f3327" opacity=".85"/>';
      });
      return moldura(
        '<circle cx="256" cy="54" r="20" fill="%SOL%" opacity=".5"/>' + flocos + casario +
        /* Massachusetts State House */
        '<g>' +
        '<rect x="118" y="106" width="84" height="52" fill="#b2352f"/>' +
        '<rect x="112" y="100" width="96" height="8" fill="#e8ddcb"/>' +
        '<g fill="#e8ddcb"><rect x="126" y="116" width="9" height="20" rx="4"/><rect x="146" y="116" width="9" height="20" rx="4"/>' +
        '<rect x="166" y="116" width="9" height="20" rx="4"/><rect x="186" y="116" width="9" height="20" rx="4"/></g>' +
        '<rect x="142" y="88" width="36" height="14" fill="#c9b08a"/>' +
        '<path d="M142 88 Q160 58 178 88 Z" fill="#e0a92a"/>' +
        '<rect x="158" y="46" width="4" height="12" fill="#e0a92a"/>' +
        '<circle cx="160" cy="43" r="4" fill="#e0a92a"/>' +
        '</g>' +
        /* neve no chão */
        '<path d="M0 158 L320 158 L320 200 L0 200 Z" fill="#eef2f7" opacity=".85"/>' +
        '<path d="M0 166 Q90 156 180 166 T320 162 L320 200 L0 200 Z" fill="#fff" opacity=".7"/>',
        '#ffd9a0', '#9c5b7a', '#dbe6f2', '#8fa8c9');
    },

    /* Índia — Taj Mahal */
    india: function () {
      return moldura(
        '<circle cx="70" cy="62" r="30" fill="%SOL%" opacity=".8"/>' +
        '<g fill="#f7f1e6">' +
        /* minaretes */
        '<rect x="62" y="84" width="9" height="70"/><circle cx="66.5" cy="82" r="7"/>' +
        '<rect x="250" y="84" width="9" height="70"/><circle cx="254.5" cy="82" r="7"/>' +
        '<rect x="88" y="94" width="7" height="60"/><circle cx="91.5" cy="92" r="5.5"/>' +
        '<rect x="228" y="94" width="7" height="60"/><circle cx="231.5" cy="92" r="5.5"/>' +
        /* corpo */
        '<rect x="104" y="104" width="112" height="50"/>' +
        /* cúpula */
        '<path d="M124 106 Q160 44 196 106 Z"/>' +
        '<path d="M157 46 q3 -12 6 0 z"/><rect x="158.5" y="34" width="3" height="12"/>' +
        /* cúpulas laterais */
        '<path d="M108 106 Q120 84 132 106 Z"/><path d="M188 106 Q200 84 212 106 Z"/>' +
        '</g>' +
        /* arco central */
        '<path d="M148 154 L148 124 Q160 110 172 124 L172 154 Z" fill="#b08a63" opacity=".6"/>' +
        /* base e espelho d\'água */
        '<rect x="96" y="154" width="128" height="8" fill="#e6dcc9"/>' +
        '<rect x="0" y="162" width="320" height="38" fill="#7fa9b5" opacity=".45"/>' +
        '<rect x="140" y="162" width="40" height="38" fill="#cfe0e4" opacity=".35"/>',
        '#ffd9a8', '#e3776b', '#fdeee0', '#f2c0a8');
    },

    /* Delhi — India Gate */
    delhi: function () {
      return moldura(
        '<circle cx="250" cy="70" r="26" fill="%SOL%" opacity=".75"/>' +
        '<g fill="#c59a68">' +
        '<rect x="104" y="72" width="112" height="82"/>' +
        '<rect x="96" y="62" width="128" height="12"/>' +
        '<rect x="112" y="48" width="96" height="12"/>' +
        '</g>' +
        '<path d="M136 154 L136 104 Q160 78 184 104 L184 154 Z" fill="#4b3a26"/>' +
        '<rect x="0" y="154" width="320" height="46" fill="#8f9e6a" opacity=".45"/>' +
        '<g fill="#6f7d4e" opacity=".6"><rect x="20" y="130" width="6" height="24"/><circle cx="23" cy="126" r="12"/>' +
        '<rect x="292" y="130" width="6" height="24"/><circle cx="295" cy="126" r="12"/></g>',
        '#ffe1a6', '#e79a55', '#fdf0d8', '#e8b98c');
    },

    /* Agra — cúpula do Taj em close */
    agra: function () {
      return moldura(
        '<g fill="#f7f1e6">' +
        '<path d="M92 150 Q160 20 228 150 Z"/>' +
        '<rect x="154" y="16" width="5" height="18"/><circle cx="156.5" cy="12" r="6"/>' +
        '<rect x="84" y="150" width="152" height="12"/>' +
        '</g>' +
        '<path d="M140 162 L140 118 Q160 98 180 118 L180 162 Z" fill="#b08a63" opacity=".55"/>' +
        '<g fill="#f2e9da"><rect x="60" y="96" width="8" height="66"/><circle cx="64" cy="94" r="7"/>' +
        '<rect x="252" y="96" width="8" height="66"/><circle cx="256" cy="94" r="7"/></g>' +
        '<rect x="0" y="162" width="320" height="38" fill="#87a7ad" opacity=".45"/>',
        '#ffd4b0', '#d9666a', '#fceadb', '#efb59c');
    },

    /* Jaipur — Hawa Mahal */
    jaipur: function () {
      var j = '';
      for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 9; c++) {
          j += '<rect x="' + (80 + c * 18) + '" y="' + (80 + r * 20) + '" width="12" height="14" rx="6" fill="#8d3a2a" opacity=".55"/>';
        }
      }
      return moldura(
        '<circle cx="54" cy="58" r="24" fill="%SOL%" opacity=".75"/>' +
        '<g fill="#e08a6b">' +
        '<rect x="72" y="70" width="176" height="90"/>' +
        '<path d="M72 72 Q160 26 248 72 Z"/>' +
        '</g>' + j +
        '<g fill="#e08a6b"><path d="M96 70 q12 -20 24 0 z"/><path d="M148 62 q12 -22 24 0 z"/><path d="M200 70 q12 -20 24 0 z"/></g>' +
        '<rect x="64" y="160" width="192" height="10" fill="#c2735a"/>' +
        '<rect x="0" y="170" width="320" height="30" fill="#b98a6a" opacity=".45"/>',
        '#ffd9a0', '#e4633f', '#fde6cf', '#f0ab84');
    },

    /* Mumbai — Gateway of India */
    mumbai: function () {
      return moldura(
        '<circle cx="262" cy="62" r="24" fill="%SOL%" opacity=".7"/>' +
        '<g fill="#c2a276">' +
        '<rect x="112" y="66" width="96" height="94"/>' +
        '<rect x="104" y="54" width="112" height="14"/>' +
        '<path d="M136 54 Q160 22 184 54 Z"/>' +
        '<rect x="90" y="88" width="20" height="72"/><path d="M90 88 q10 -16 20 0 z"/>' +
        '<rect x="210" y="88" width="20" height="72"/><path d="M210 88 q10 -16 20 0 z"/>' +
        '</g>' +
        '<path d="M138 160 L138 108 Q160 82 182 108 L182 160 Z" fill="#4a3a26"/>' +
        '<rect x="0" y="160" width="320" height="40" fill="#3f6b78" opacity=".5"/>' +
        '<path d="M24 150 L64 150 L58 140 L30 140 Z" fill="#2e4a52"/><rect x="42" y="118" width="3" height="22" fill="#2e4a52"/>',
        '#ffe0b0', '#e08a4c', '#f3e7d5', '#cdb493');
    }
  ,
  /* Capa da home: pôster de 1985 — sol listrado, grade em fuga, palmeiras.
     Desenho original; entra só enquanto não houver hero/img/capa.jpg. */
  capa: function () {
    var sol = '';
    for (var k = 0; k < 7; k++) {
      sol += '<rect x="112" y="' + (30 + k * 9) + '" width="176" height="' + (5 - k * 0.45) + '" fill="url(#cgs)" opacity="' + (1 - k * 0.1) + '"/>';
    }
    var grade = '';
    for (var i = 0; i <= 12; i++) {
      grade += '<line x1="' + (i * 33) + '" y1="200" x2="' + (-260 + i * 154) + '" y2="130" stroke="#ff4d9d" stroke-width="1" opacity=".35"/>';
    }
    for (var j = 0; j < 6; j++) {
      var y = 132 + j * j * 2.4 + j * 4;
      grade += '<line x1="0" y1="' + y + '" x2="400" y2="' + y + '" stroke="#31d7e0" stroke-width="1" opacity="' + (0.16 + j * 0.07) + '"/>';
    }
    function palmeira(x, e) {
      var f = '';
      for (var a = 0; a < 7; a++) {
        var ang = -150 + a * 25;
        var rad = ang * Math.PI / 180;
        f += '<path d="M0 0 Q' + (Math.cos(rad) * 26 * e) + ' ' + (Math.sin(rad) * 20 * e - 6) +
             ' ' + (Math.cos(rad) * 44 * e) + ' ' + (Math.sin(rad) * 30 * e) +
             '" fill="none" stroke="#ff8fc0" stroke-width="' + (3 * e) + '" stroke-linecap="round"/>';
      }
      return '<g opacity=".55" transform="translate(' + x + ',200)"><path d="M0 0 C' + (-5 * e) + ' ' + (-30 * e) +
             ' ' + (4 * e) + ' ' + (-58 * e) + ' ' + (-2 * e) + ' ' + (-80 * e) +
             '" fill="none" stroke="#ff8fc0" stroke-width="' + (5 * e) + '" stroke-linecap="round"/>' +
             '<g transform="translate(' + (-2 * e) + ',' + (-80 * e) + ')">' + f + '</g></g>';
    }
    return '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<defs><linearGradient id="cgs" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#ff4d9d"/></linearGradient></defs>' +
      sol + grade + palmeira(48, 1) + palmeira(356, .82) + '</svg>';
  }
};
})();
