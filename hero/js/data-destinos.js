/* HeRo — registro de destinos e conversor de moedas.
 * Cidade nova = um objeto aqui + um arquivo de dados. A interface não muda.
 */

const HERO_MOEDAS = {
  base: 'BRL',
  atualizado: '2026-09-14',
  lista: [
    { c: 'BRL', nome: 'Real',        pais: 'Brasil',  simb: 'R$',  emBRL: 1,      dec: 2 },
    { c: 'QAR', nome: 'Riyal',       pais: 'Catar',   simb: 'QAR', emBRL: 1.40,   dec: 2 },
    { c: 'INR', nome: 'Rupia',       pais: 'Índia',   simb: '₹',   emBRL: 0.054,  dec: 0 },
    { c: 'USD', nome: 'Dólar',       pais: 'EUA',     simb: 'US$', emBRL: 5.10,   dec: 2 }
  ],
  notas: [
    'O riyal do Catar tem paridade FIXA com o dólar (3,64 QAR = 1 USD). Só o dólar se move.',
    'A rupia flutua. Nos últimos 30 dias o INR/BRL variou entre 0,0529 e 0,0547 — ou seja, ±2% em torno do valor usado aqui.',
    'Estas são taxas de mercado. Cartão e casa de câmbio cobram spread: conte 3% a 5% a mais na prática.'
  ],
  fontes: [
    { t: 'XE — INR/BRL', u: 'https://www.xe.com/en-us/currencyconverter/convert/?Amount=1&From=INR&To=BRL' },
    { t: 'Wise — INR/BRL', u: 'https://wise.com/gb/currency-converter/inr-to-brl-rate' },
    { t: 'XE — QAR/BRL', u: 'https://www.xe.com/currencyconverter/convert/?Amount=1&From=QAR&To=BRL' }
  ],
  atalhos: [10, 50, 100, 300, 500, 1000, 5000]
};

const HERO_DESTINOS = [
  {
    id: 'doha', nome: 'Doha', pais: 'Catar', arte: 'doha',
    periodo: '28/09 a 1º/10 de 2026', resumo: '54 horas de escala · 43 restaurantes avaliados',
    moeda: 'QAR', pronto: true
  },
  {
    id: 'india', nome: 'Índia', pais: 'Delhi · Agra · Jaipur · Mumbai', arte: 'india',
    periodo: '18 a 28 de setembro de 2026', resumo: '10 dias · 4 cidades · 6 hotéis',
    moeda: 'INR', pronto: true
  }
];

/* A viagem inteira, em uma linha do tempo */
const HERO_VIAGEM = {
  titulo: 'Uma viagem só, dois destinos',
  texto: 'São Paulo → Doha (escala) → Índia, 10 dias → Doha, 54 horas → São Paulo. ' +
         'Doha não é um destino separado: é a escala da volta, e é longa o bastante para ser uma viagem.',
  alerta: {
    t: 'A reserva de hotel em Doha está uma noite curta',
    d: 'Vocês pousam em Doha dia 28/09 às 17h45 e o voo para São Paulo sai dia 1º/10 às 00h05. ' +
       'São 54 horas na cidade. A busca de hotel que você me mandou é 28→30/09, ou seja 2 noites — ' +
       'com check-out na manhã do dia 30 e o voo só à meia-noite, sobram cerca de 9 horas sem quarto, ' +
       'em setembro, com 40 °C. Reserve 28/09 → 01/10 (3 noites) ou negocie late check-out no dia 30.',
    d2: 'A boa notícia: com 54 horas vocês têm TRÊS jantares em Doha (28, 29 e 30), não dois. ' +
        'O roteiro de 3 noites do app é o que vale.'
  }
};
