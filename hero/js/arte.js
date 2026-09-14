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
  };
})();
