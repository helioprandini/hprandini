/* HeRo — Europa 2023
 *
 * ORIGEM: o roteiro do Helio e da Roberta, com as notas que eles deram na hora.
 *
 * O QUE ESTE ARQUIVO É: um arquivo de VEREDICTOS. Não é um guia para atualizar —
 * é o julgamento de vocês dois, e julgamento não vence. "Nota zero" continua
 * nota zero em 2026. O que eu conferi foi só uma coisa: a casa ainda existe?
 *
 * conf: 'aberto' -> confirmado em fonte citada
 *       'mudou'  -> existe, mas o endereço/entendimento do roteiro estava torto
 *       'nao-confirmado' -> NÃO achei fonte. Pode estar aberta. Nunca afirmar.
 *
 * feito: true  -> vocês foram (✓ no roteiro original)
 *        false -> estava no plano e ficou de fora (◦ no roteiro original)
 */

const HERO_EU23 = {
  id: 'eu23',
  cidade: 'Europa 2023',
  pais: 'Alemanha · Suíça · Itália',
  periodo: '12 a 24 de maio de 2023',
  rota: 'Frankfurt → Zurique → Lago di Como → Milão → Piacenza → Val Trebbia → Parma → Modena → Florença → Pisa → San Gimignano → Siena → Val d’Orcia → Roma',
  conferidoEm: '2026-09-14',
  intro: 'Treze dias de carro, quatro mil anos de estrada romana e uma quantidade indecente de massa. ' +
         'As notas são de vocês, escritas na hora — inclusive as duas que doem.',

  paradas: [
    {
      id: 'frankfurt', nome: 'Frankfurt', datas: '12/05',
      hotel: { n: 'Scandic Frankfurt Hafenpark', conf: 'nao-confirmado', d: 'Ponto de entrada e de saída da viagem.' },
      lugares: []
    },
    {
      id: 'zurique', nome: 'Zurique', datas: '13/05 · 4h de estrada desde Frankfurt',
      hotel: { n: 'Acasa Suites', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: '25hours Hotel', lat: 47.382, lng: 8.533, prec: 'cidade', tipo: 'bar', feito: true, nota: null, voce: 'animadinho',
          conf: 'nao-confirmado', d: 'Parada só para o drink. Não confirmei em fonte primária.', f: [] }
      ]
    },
    {
      id: 'como', nome: 'Lago di Como', datas: '14/05 · 3h de estrada',
      hotel: { n: 'Griso Collection Hotel', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'L’EK Bistrot Contemporaneo', lat: 45.8566, lng: 9.3977, prec: 'end', tipo: 'jantar', feito: true, nota: 11, voce: 'nota 11!',
          conf: 'mudou',
          d: 'ABERTO — e uma correção de mapa: ele não fica em Como, fica em LECCO, na Piazza XX Settembre 50. ' +
             'É o outro braço do lago, uns 30 km pelo lado oposto. Cozinha do chef Luca Dell’Orto. ' +
             'Se alguém for repetir o roteiro procurando "L’EK em Como", vai rodar à toa.',
          f: [{ t: 'L’EK bistrot contemporaneo — site', u: 'https://www.lekbistrot.it/' }] }
      ]
    },
    {
      id: 'milao', nome: 'Milão', datas: '15/05',
      hotel: { n: 'UNAHOTELS Galles Milano', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Duomo', lat: 45.4642, lng: 9.19, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Galleria Vittorio Emanuele II', lat: 45.4658, lng: 9.19, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Nabucco Milano', lat: 45.472, lng: 9.182, prec: 'bairro', tipo: 'almoço', feito: true, nota: 6, voce: 'ok',
          conf: 'nao-confirmado', d: 'O único "ok" seco da viagem. Não confirmei em fonte primária.', f: [] },
        { n: 'Food Hall', lat: 45.465, lng: 9.19, prec: 'cidade', tipo: 'mercado', feito: true, nota: 10, voce: 'nota 10!',
          conf: 'nao-confirmado', d: 'O roteiro não diz qual — Milão tem mais de uma. Se você lembrar, me diga que eu confiro.', f: [] },
        { n: 'Milano Locatelli', lat: 45.478, lng: 9.19, prec: 'cidade', tipo: 'jantar', feito: true, nota: 8, voce: '8/10',
          conf: 'nao-confirmado', d: 'Jantar das 21h. Não confirmado em fonte primária.', f: [] }
      ]
    },
    {
      id: 'trebbia', nome: 'Piacenza e Val Trebbia', datas: '16/05',
      hotel: { n: 'Residenza Torre di San Martino', conf: 'nao-confirmado', d: 'Jantar no próprio hotel.' },
      lugares: [
        { n: 'Luini (panzerotti)', lat: 45.4659, lng: 9.1907, prec: 'end', tipo: 'café da manhã', feito: true, nota: 11, voce: '11/10',
          conf: 'aberto',
          d: 'ABERTO: Via Santa Radegonda 16, ao lado do Duomo de Milão. AVISO QUE IMPORTA: seg–sáb, 10h às 20h — ' +
             'FECHA AOS DOMINGOS (só abre no período do Natal). Se repetir o roteiro num domingo, o café da manhã nota 11 não acontece.',
          f: [{ t: 'Luini — forno dal 1888', u: 'https://www.luini.it/' }] },
        { n: 'Trattoria Regina (Piacenza)', lat: 45.0526, lng: 9.693, prec: 'cidade', tipo: 'almoço', feito: false, nota: null,
          voce: 'Gnocco fritto, salumi, pasta e fasoi, gnocchi allo zola e ravioli. Vinho: Malvasia e gutturnio.',
          conf: 'nao-confirmado',
          d: 'FICOU DE FORA. Vocês já tinham escolhido os pratos e o vinho e não foram. É a maior ' +
             'pendência gastronômica desta viagem — e continua sendo, porque não achei nada dizendo que fechou.', f: [] }
      ]
    },
    {
      id: 'parma', nome: 'Parma e Pontremoli', datas: '17/05',
      hotel: { n: 'Agriturismo Costa d’Orsola, Pontremoli', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Trattoria Sorelle Picchi', lat: 44.802, lng: 10.329, prec: 'end', tipo: 'almoço', feito: true, nota: 10, voce: '10/10',
          conf: 'aberto',
          d: 'ABERTA, no mesmo lugar: Strada Farini 27/A. Todos os dias, 12h–15h e 19h–22h30. ' +
             'Nasceu de uma salumeria histórica no centro de Parma. Tortelli d’erbetta, tortelli de abóbora, cappelletti e os embutidos.',
          f: [{ t: 'Trattoria Sorelle Picchi — site', u: 'https://www.trattoriasorellepicchi.com/' },
               { t: 'Parma Welcome', u: 'https://parmawelcome.it/scheda/trattoria-sorelle-picchi-la-cucina-del-maestro/' }] }
      ]
    },
    {
      id: 'modena', nome: 'Modena e chegada a Florença', datas: '18/05',
      hotel: { n: 'Hotel Rapallo, Florença', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Franceschetta 58', lat: 44.639, lng: 10.935, prec: 'end', tipo: 'almoço', feito: true, nota: 10, voce: 'PERFEITO!',
          conf: 'aberto',
          d: 'ABERTA e no Guia MICHELIN Itália 2026. É a casa informal do Massimo Bottura — a versão sem gravata ' +
             'da Osteria Francescana, que tem três estrelas. Reserva, como vocês fizeram (13:30).',
          f: [{ t: 'MICHELIN — Franceschetta 58', u: 'https://guide.michelin.com/us/en/emilia-romagna/modena/restaurant/franceschetta-58' },
               { t: 'Franceschetta 58 — site', u: 'https://franceschetta.it/en/team/' }] },
        { n: 'Outlet de Florença', lat: 43.7360, lng: 11.4680, prec: 'cidade', tipo: 'compras', feito: false, nota: null, voce: '',
          conf: 'nao-confirmado', d: 'Ficou de fora.', f: [] },
        { n: 'Perseus', lat: 43.7842, lng: 11.2679, prec: 'end', tipo: 'jantar', feito: true, nota: 10, voce: 'nota 10, não é fancy, ambiente cult',
          conf: 'aberto',
          d: 'ABERTO: Viale Don Giovanni Minzoni 10R. Seg–Sáb 11h30–15h e 19h30–meia-noite. ' +
             'FECHA AOS DOMINGOS. Fica fora do centro turístico, o que explica o "ambiente cult" da sua nota. Bistecca fiorentina de verdade.',
          f: [{ t: 'Ristorante Perseus — site', u: 'https://www.ristoranteperseus.it/en/homepage/' }] }
      ]
    },
    {
      id: 'firenze', nome: 'Florença', datas: '19/05',
      hotel: { n: 'Hotel Rapallo', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'I Fratellini', lat: 43.77, lng: 11.254, prec: 'end', tipo: 'café da manhã', feito: false, nota: null, voce: '',
          conf: 'nao-confirmado', d: 'Ficou de fora.', f: [] },
        { n: 'Duomo', lat: 43.7731, lng: 11.2560, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'entrada 10:30', conf: 'aberto', d: '', f: [] },
        { n: 'Trattoria Zà Zà', lat: 43.7766, lng: 11.2534, prec: 'end', tipo: 'almoço', feito: true, nota: 10,
          voce: 'nota 10, comer qualquer coisa simples com trufa',
          conf: 'aberto',
          d: 'ABERTA: Piazza del Mercato Centrale 26R, todos os dias das 11h às 23h. Casa de 1977. ' +
             'Sua dica de pedir "qualquer coisa simples com trufa" continua sendo o melhor jeito de usar esse cardápio.',
          f: [{ t: 'Trattoria Zà Zà — site', u: 'https://www.trattoriazaza.it/en/' }] },
        { n: 'Galleria degli Uffizi', lat: 43.7678, lng: 11.2553, prec: 'end', tipo: 'museu', feito: true, nota: null, voce: 'entrada 16:45', conf: 'aberto', d: '', f: [] },
        { n: 'Ponte Vecchio', lat: 43.768, lng: 11.2531, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Trattoria 13 Gobbi', lat: 43.7738, lng: 11.2482, prec: 'end', tipo: 'jantar', feito: true, nota: 10, voce: 'nota 10',
          conf: 'aberto',
          d: 'ABERTA: Via del Porcellana 9R, todos os dias, 12h30–15h e 19h30–23h. Perto de Santa Maria Novella.',
          f: [{ t: 'Yelp — Trattoria 13 Gobbi', u: 'https://www.yelp.com/biz/trattoria-13-gobbi-firenze' }] }
      ]
    },
    {
      id: 'pisa', nome: 'Pisa, Chianti e San Gimignano', datas: '20/05',
      hotel: { n: 'Antica Dimora, San Gimignano', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Mercato Centrale (Florença)', lat: 43.7765, lng: 11.2536, prec: 'end', tipo: 'café da manhã', feito: true, nota: 11, voce: '11/10',
          conf: 'aberto', d: 'A parada antes de pegar a estrada. Segue operando.',
          f: [{ t: 'Mercato Centrale Firenze — horários', u: 'https://www.mercatocentrale.it/firenze/info/' }] },
        { n: 'Torre de Pisa', lat: 43.723, lng: 10.3966, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'L’Officina della Bistecca', lat: 43.5450, lng: 11.3160, prec: 'end', tipo: 'almoço', feito: true, nota: 11, voce: '11/10',
          conf: 'mudou',
          d: 'ABERTA — e outra correção de mapa, esta grande. Ela fica em PANZANO IN CHIANTI ' +
             '(Via XX Luglio 11), a casa do açougueiro Dario Cecchini. No roteiro ela aparece no dia de Pisa, ' +
             'mas são uns 110 km a leste de Pisa, e depois vocês voltaram para o oeste rumo a San Gimignano. ' +
             'Foi um belo zigue-zague, e a nota 11 diz que valeu. Menu fixo, reserva obrigatória, e os horários ' +
             'de almoço mudam com a temporada — ligue antes (+39 055 852020).',
          f: [{ t: 'Dario Cecchini — Officina della Bistecca', u: 'https://www.dariocecchini.com/dariocecchini/en/to-the-table/officina-della-bistecca/' }] }
      ]
    },
    {
      id: 'orcia', nome: 'Siena, Montalcino, Montepulciano e Val d’Orcia', datas: '21/05',
      hotel: { n: 'Dimora del Poggio, San Quirico d’Orcia', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Gelateria Dondoli', lat: 43.4677, lng: 11.0432, prec: 'end', tipo: 'doce', feito: false, nota: null, voce: '',
          conf: 'aberto',
          d: 'FICOU DE FORA — e esta é a que eu te mandaria voltar. Piazza della Cisterna 4, San Gimignano, ' +
             'todos os dias das 9h às 23h30. O Sergio Dondoli foi CAMPEÃO MUNDIAL de gelato em 2006 e 2008. ' +
             'De todos os ◦ desta viagem, este é o que mais custou.',
          f: [{ t: 'Gelateria Dondoli — site', u: 'https://www.gelateriadondoli.com/en' }] },
        { n: 'Mongulone (Siena)', lat: 43.3188, lng: 11.3308, prec: 'cidade', tipo: 'almoço', feito: true, nota: null, voce: '',
          conf: 'nao-confirmado', d: 'Sem nota no roteiro e sem fonte que eu tenha achado.', f: [] }
      ]
    },
    {
      id: 'roma', nome: 'Roma', datas: '22 e 23/05',
      hotel: { n: 'Triviho Hotel', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Fontana di Trevi', lat: 41.9009, lng: 12.4833, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Piazza di Spagna', lat: 41.9058, lng: 12.4823, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Taverna Trilussa', lat: 41.8895, lng: 12.4699, prec: 'end', tipo: 'jantar', feito: true, nota: 5, voce: 'bem médio, não vale a pena',
          conf: 'aberto',
          d: 'ABERTA: Via del Politeama 23, no Trastevere. Seg–Sáb das 19h à meia-noite, FECHA AOS DOMINGOS. ' +
             'Casa de 1910, famosa pela amatriciana e pela cacio e pepe servidas na frigideira ou na roda de queijo. ' +
             'Ela continua existindo e continua famosa — e a sua nota continua sendo "bem médio". As duas coisas podem ser verdade.',
          f: [{ t: 'Taverna Trilussa — site', u: 'https://tavernatrilussa.com/' }] },
        { n: 'Basílica de São Pedro', lat: 41.9022, lng: 12.4539, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Museus do Vaticano e Capela Sistina', lat: 41.9065, lng: 12.4536, prec: 'end', tipo: 'museu', feito: true, nota: null, voce: 'entrada 11h', conf: 'aberto', d: '', f: [] },
        { n: 'Poldo e Gianna Osteria + Giolitti', lat: 41.9, lng: 12.477, prec: 'bairro', tipo: 'almoço', feito: true, nota: 8, voce: 'bem gostoso',
          conf: 'nao-confirmado', d: 'Não confirmei nenhum dos dois em fonte primária.', f: [] },
        { n: 'Coliseu', lat: 41.8902, lng: 12.4922, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Trastevere', lat: 41.889, lng: 12.47, prec: 'bairro', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Trattoria Barbieri', lat: 41.889, lng: 12.471, prec: 'bairro', tipo: 'jantar', feito: true, nota: 0, voce: 'nota zero',
          conf: 'nao-confirmado',
          d: 'A única nota zero da viagem. Não consegui confirmar se ainda existe — e, honestamente, ' +
             'não é uma informação de que você precise.', f: [] }
      ]
    }
  ],

  /* ---------------- o que eu reparei, olhando de fora ---------------------- */
  reparos: [
    {
      t: 'Duas casas não ficam onde o roteiro sugere',
      d: 'O L’EK está anotado como "JANTAR COMO" e fica em LECCO — o braço oposto do lago, uns 30 km. ' +
         'E a Officina della Bistecca está no dia de Pisa, mas fica em Panzano in Chianti, 110 km a leste. ' +
         'Nenhum dos dois é erro de quem viveu a viagem; é erro de quem for repetir só lendo o texto.'
    },
    {
      t: 'Três das melhores fecham em dias que pegam viajante desprevenido',
      d: 'Luini (o café da manhã 11/10) fecha aos DOMINGOS. Perseus (jantar nota 10) fecha aos DOMINGOS. ' +
         'Taverna Trilussa também. Se alguém montar o mesmo roteiro num fim de semana, perde três paradas de uma vez.'
    },
    {
      t: 'A pendência que eu voltaria para resolver',
      d: 'Duas ficaram de fora e valem uma viagem: a Gelateria Dondoli, em San Gimignano — o Sergio Dondoli ' +
         'foi campeão mundial de gelato em 2006 e 2008, e vocês passaram do lado — e a Trattoria Regina, em ' +
         'Piacenza, para a qual vocês já tinham escolhido os pratos (gnocco fritto, pasta e fasoi, gnocchi allo zola) ' +
         'e o vinho (Malvasia e gutturnio). As duas seguem de pé.'
    },
    {
      t: 'O que este arquivo NÃO é',
      d: 'Não é uma lista atualizada de "onde comer na Itália". É o que VOCÊS acharam, em maio de 2023, ' +
         'com o paladar de vocês. Conferi só se a porta ainda abre. As notas são de vocês e ficam como estão — ' +
         'inclusive o "ok" do Nabucco e a nota zero do Barbieri.'
    }
  ]
};
