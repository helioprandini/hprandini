/* HeRo — registro de destinos e conversor de moedas.
 * Cidade nova = um objeto aqui + um arquivo de dados. A interface não muda.
 */

const HERO_VERSAO = { n: 'v15', data: '2026-09-14' };

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

/* ============================================================
   A ESCALA — o dia 30/09 e o aeroporto de Doha
   Pesquisado em 14/09/2026.
   ============================================================ */
const HERO_ESCALA = {
  pergunta: 'Dia 30: sair do hotel mais cedo e esperar no aeroporto?',
  resposta: 'Não, do jeito que está. Mas existe uma terceira saída melhor que as duas que você está pesando.',

  travaHorario: {
    t: 'A trava é o horário do check-in',
    d: 'O voo é 1º/10 às 00h05. Os balcões de check-in em Doha abrem cerca de 3 horas antes — ' +
       'ou seja, por volta das 21h05 do dia 30. Sem cartão de embarque e sem despachar mala, ' +
       'não se passa pela imigração. Sair do hotel ao meio-dia significa cerca de 9 horas na área ' +
       'pública do aeroporto, com as malas, sem acesso a lounge nenhum.',
    agravante: 'Os armários de bagagem oficiais do aeroporto estão SUSPENSOS. A alternativa é o ' +
       'Travel Hub da Tawfeeq, na estação de metrô do aeroporto, a 5 minutos a pé do terminal.',
    saida: 'A Qatar Airways às vezes oferece early check-in, de 12 a 4 horas antes da partida. ' +
       'Se valer para o voo de vocês, dá para despachar a mala por volta do meio-dia e entrar. ' +
       'Isso PRECISA ser confirmado com a companhia — não é garantido.'
  },

  alcool: {
    t: 'Sim, dá para beber no lounge',
    d: 'O Al Maha serve bebida alcoólica, inclusive espumante. Detalhe prático relatado por quem esteve lá: ' +
       'o álcool não fica exposto no balcão principal — cerveja e vinho ficam em geladeiras no fundo do salão. ' +
       'É só pedir. A única exceção do ano é o Ramadã, que não afeta setembro.'
  },

  lounges: [
    { n: 'Al Maha Lounge (South e North/Orchard)', a: 'Aberto a quem paga · 24 horas',
      p: 'US$ 57,79 por 4h · US$ 115,58 por 8h, por pessoa',
      d: 'O lounge de contrato mais útil do aeroporto. Buffet quente e frio, bebidas à vontade, wi-fi rápido e chuveiro sem custo extra.',
      alerta: 'ATENÇÃO: o Al Maha SAIU do Priority Pass em 15 de maio de 2026. Se você contava com o cartão, não vale mais aqui. DragonPass e alguns outros ainda entram.' },
    { n: 'Al Mourjan Business Lounge', a: 'Só classe executiva ou oneworld Sapphire',
      p: 'incluído na passagem', d: 'O grande lounge da Qatar Airways. Só entra quem tem o bilhete ou o status.' },
    { n: 'Al Safwa First', a: 'Só primeira classe ou oneworld Emerald', p: 'incluído na passagem',
      d: 'O topo da casa.' },
    { n: 'Oryx Lounge', a: 'Aberto a quem paga', p: 'a partir de US$ 55',
      d: 'Tem armários de bagagem, embora pequenos — o que resolve o problema das malas para quem está esperando.' },
    { n: 'Oryx Airport Hotel', a: 'Airside, só para quem está em trânsito', p: '~£216–235 a diária · tarifa por hora sob consulta',
      d: 'Hotel dentro da área de embarque, estadia máxima de 24h, com piscina e spa. Resolve o descanso, mas esbarra na mesma trava: só se entra depois do check-in.' }
  ],

  stopover: {
    t: 'A saída que eu não esperava encontrar: o programa Stopover da Qatar Airways',
    d: 'Quem tem bilhete Qatar Airways com trânsito em Doha entre 12 e 96 horas pode reservar hotel ' +
       'subsidiado pelo Qatar Tourism através da Discover Qatar. O trânsito de vocês é de 54 horas — ' +
       'está dentro da janela.',
    precos: [
      { n: '4 estrelas', usd: 14, brl: 143 },
      { n: '5 estrelas', usd: 24, brl: 245 },
      { n: '5 estrelas com praia', usd: 31, brl: 316 }
    ],
    nota: 'Preços por pessoa, por noite, em quarto duplo. Os valores em BRL são para o CASAL, ao câmbio de R$ 5,10 por dólar.',
    comoFazer: 'Reserve o voo primeiro (já está). Depois entre em qatarairways.com → Ofertas → Qatar Stopover, com o localizador da reserva, e escolha a categoria.',
    ressalva: 'Estes preços vêm de veículos de viagem, não da página oficial — eu não consegui abrir o site da Discover Qatar deste ambiente. A lista de hotéis do programa é fechada e pode não incluir o Park Hyatt. Confirme antes de cancelar qualquer coisa.'
  },

  contas: [
    { o: 'Lounge Al Maha, 8h, os dois', v: 'R$ 1.179', obs: 'mais caro que uma diária de hotel' },
    { o: 'Lounge Al Maha, 4h, os dois', v: 'R$ 589', obs: 'e ainda sobram 5 horas landside' },
    { o: '3ª noite no Park Hyatt', v: 'R$ 565', obs: 'quarto até o fim do dia, banho antes do voo' },
    { o: 'Stopover 5 estrelas, o casal', v: 'R$ 245', obs: 'se o programa aceitar a reserva de vocês' },
    { o: 'Stopover 4 estrelas, o casal', v: 'R$ 143', obs: 'o mais barato de todos' }
  ],

  veredito: [
    '**Não vá para o aeroporto ao meio-dia.** Sem early check-in confirmado, vocês passariam nove horas na área pública, com malas, e os armários do aeroporto estão fora de serviço.',
    '**O lounge não é a economia que parece.** Oito horas de Al Maha para duas pessoas custam R$ 1.179 — mais que o dobro da terceira diária do Park Hyatt. Quatro horas custam R$ 589 e ainda deixam vocês cinco horas do lado de fora.',
    '**Reserve a terceira noite.** Com quarto até o fim do dia 30, vocês almoçam, descansam, tomam banho e vão para o aeroporto às 21h já com tudo resolvido. Custa R$ 565 no Park Hyatt.',
    '**Mas antes, teste o programa Stopover.** Se a reserva de vocês se qualificar — e 54 horas de trânsito em bilhete Qatar Airways diz que sim — a noite de 5 estrelas sai por R$ 245 para o casal. Vale meia hora de telefonema.',
    'E no dia 30, com o quarto garantido, use o lounge do jeito certo: chegue ao aeroporto às 21h, entre no Al Maha por 4 horas se quiser, e beba lá — porque a última noite em Doha é a única em que vocês estarão num lugar licenciado sem precisar procurar.'
  ],

  fontes: [
    { t: 'Hamad International Airport — informações de check-in (oficial)', u: 'https://dohahamadairport.com/airport-guide/at-the-airport/check-in-info' },
    { t: 'Qatar Airways — serviços Al Maha (oficial)', u: 'https://www.qatarairways.com/en-us/hia-hamad-international-airport/al-maha-services.html' },
    { t: 'Qatar Airways — Qatar Stopover (oficial, é por aqui que se reserva)', u: 'https://www.qatarairways.com/en-us/offers/qatar-stopover.html' },
    { t: 'Discover Qatar — termos do Stopover', u: 'https://www.discoverqatar.qa/stopover-terms/' },
    { t: 'Visit Qatar — programa Qatar Stopover', u: 'https://visitqatar.com/intl-en/qatar-stopover' },
    { t: 'Upgraded Points — review do Al Maha Lounge', u: 'https://upgradedpoints.com/travel/airports/al-maha-lounge-doha-doh-review/' },
    { t: 'LoungePair — Al Maha, preços de acesso avulso', u: 'https://www.loungepair.com/at/DOH/al-maha-lounge-doha-international-airport/' },
    { t: 'Doha Guides — armazenamento de bagagem no aeroporto', u: 'https://www.dohaguides.com/luggage-storage-at-doha-airport/' },
    { t: 'Wego — programa Stopover 2026', u: 'https://blog.wego.com/qatar-airways-stopover-program/' }
  ]
};
