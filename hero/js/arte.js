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
