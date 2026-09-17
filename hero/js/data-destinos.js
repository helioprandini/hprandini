/* HeRo — registro de destinos e conversor de moedas.
 * Cidade nova = um objeto aqui + um arquivo de dados. A interface não muda.
 */

const HERO_VERSAO = { n: 'v28', data: '2026-09-17' };

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
  atalhos: [10, 50, 100, 300, 500, 1000, 5000],

  /* DINHEIRO NA MAO — pesquisado em 17/09/2026, para a pergunta do Helio:
   * "consigo sacar facilmente com o cartao da Wise? como funcionam as taxas?"
   * Regra da casa: nada de numero inventado. O que nao foi confirmado em
   * fonte primaria esta marcado como "confira no app da Wise". */
  saque: {
    titulo: 'Dinheiro na mão na Índia',
    resposta: 'Sim, o cartão da Wise saca normalmente em caixa eletrônico na Índia — é Mastercard. O custo do saque tem TRÊS camadas, e duas delas você controla.',
    comprar: {
      t: 'Comprar rupia no Brasil: não dá, e nem deveria querer',
      p: [
        'A rupia não é moeda livremente negociada. Casa de câmbio no Brasil quase nunca tem, e quando tem o spread é absurdo.',
        'Mais forte que isso: o Banco Central da Índia (RBI) proíbe estrangeiro de ENTRAR no país com notas de rupia. O limite de ₹25.000 por viagem vale só para residentes indianos. Não existe franquia para turista.',
        'Ou seja: rupia se consegue LÁ, no caixa eletrônico. É assim mesmo que funciona, não é improviso.'
      ]
    },
    camadas: [
      {
        n: 'A Wise (cartão emitido no Brasil)',
        v: '1º saque do mês: grátis, sem limite de valor. Do 2º em diante: R$ 20 fixos.',
        d: 'Mudou em 1º de maio de 2026 — antes eram 2 saques grátis com teto de valor e mais 1,75% variável. Agora a taxa variável sumiu e sobrou o fixo. Isso muda a estratégia: sacar POUCAS VEZES e VALORES ALTOS.',
        alerta: 'A conta é por MÊS CALENDÁRIO. Você está na Índia de 18 a 28 de setembro — tudo dentro do mesmo mês. Você tem UM saque grátis para a viagem inteira.'
      },
      {
        n: 'O banco indiano (dono do caixa)',
        v: 'Banco público: quase sempre ZERO. Banco privado: ₹200 a ₹335 por saque (R$ 11 a R$ 18).',
        d: 'Procure caixa de banco PÚBLICO: State Bank of India (SBI), Bank of Baroda, Canara, Punjab National Bank, Union Bank, Indian Bank. Evite HDFC, ICICI, Axis, Kotak e Yes Bank — são os que cobram.',
        alerta: null
      },
      {
        n: 'A conversão na tela (DCC) — a armadilha cara',
        v: 'Custa de 3% a 8%. E é 100% evitável.',
        d: 'O caixa vai perguntar se você quer ser cobrado em REAL ou em RUPIA. Ele vai empurrar o real, com cara de favor ("sabemos exatamente quanto vai custar"). É a conversão do banco indiano, com o spread dele. Escolha SEMPRE rupia.',
        alerta: 'Na tela, o botão certo é: "Without conversion" / "Charge in INR" / "Decline conversion" / "Continue without conversion". O errado é qualquer coisa que mostre um valor em BRL.'
      }
    ],
    limite: {
      t: 'O caixa limita o saque, não a Wise',
      p: 'A maioria dos caixas na Índia entrega no máximo ₹10.000 por transação para cartão estrangeiro (uns poucos vão a ₹20.000). ₹10.000 ≈ R$ 540. Então o "sem limite de valor" da Wise, na prática, para no teto da máquina.'
    },
    plano: {
      t: 'O plano para os 10 dias',
      p: [
        'Saque 1 (chegada em Delhi, caixa de banco público, no aeroporto ou no hotel): ₹10.000. Custo: zero.',
        'Saque 2 (quando acabar, provavelmente lá pelo 4º ou 5º dia): ₹10.000. Custo: R$ 20.',
        'Saque 3 se precisar: mais R$ 20.',
        'Total da viagem em taxa de saque: R$ 20 a R$ 40. Fim. Desde que você recuse a conversão nas três vezes.',
        'Para o resto — hotel, restaurante de hotel, loja grande, Uber — use cartão de crédito normalmente. Índia é muito mais digital do que a fama sugere.'
      ]
    },
    ondePrecisa: {
      t: 'Onde o dinheiro vivo é obrigatório',
      p: [
        'Tuk-tuk / auto-rickshaw — só dinheiro, e o preço se combina ANTES de entrar.',
        'Gorjeta de guia e motorista — é o maior gasto em dinheiro de um roteiro como o seu, e é esperado.',
        'Guarda-sapato de templo, doação, entrada de lugar pequeno.',
        'Mercado, feira, barraca, comida de rua, lojinha de bairro.',
        'Carregador de mala em estação — sempre em dinheiro.'
      ]
    },
    antesDeSair: {
      t: 'Duas coisas para conferir ANTES de sair do Brasil',
      p: [
        'A SENHA DE 4 DÍGITOS do cartão Wise. Muita gente usa o cartão anos sem nunca ter definido PIN — e sem PIN não sai dinheiro de caixa nenhum. Está no app da Wise, na tela do cartão.',
        'Se o saque em caixa está habilitado no seu cartão (mesma tela). E confira ali mesmo o seu número de saques grátis do mês — os valores acima são a regra publicada para cartão emitido no Brasil, mas quem manda é o que o SEU app mostra.'
      ]
    },
    doha: {
      t: 'E em Doha?',
      p: 'Não precisa de riyal. No aeroporto e na cidade cartão passa em tudo, inclusive táxi e Karak de QAR 5. E tem um motivo a mais para NÃO sacar lá: um saque em Doha queimaria o seu único saque grátis do mês, que você quer guardar para a Índia.'
    },
    reserva: {
      t: 'Plano B honesto',
      p: 'Se quiser dormir tranquilo, leve US$ 200 a US$ 300 em espécie. Dólar se compra fácil no Brasil, e na Índia se troca em qualquer hotel, aeroporto e casa de câmbio autorizada. É reserva de emergência (cartão bloqueado, caixa engolindo cartão), não é o dinheiro do dia a dia. Abaixo de US$ 5.000 não precisa declarar nada na alfândega indiana.'
    },
    /* WISE x C6 CONTA GLOBAL — pesquisado em 17/09/2026.
     * O IOF saiu da conta de proposito: o Decreto 12.499/2025 unificou em
     * 3,5% saque, compra, carga de pre-pago e transferencia para conta
     * propria no exterior. Os dois pagam igual, entao o IOF nao decide. */
    c6: {
      t: 'Wise ou C6 Conta Global? Para a Índia, Wise — e não é perto',
      resumo: 'O IOF empatou os dois: 3,5% nos dois casos, desde o decreto de 2025 que fechou a brecha da "mesma titularidade". Então quem decide é a tarifa de saque e o spread. E aí o C6 perde por dois motivos somados.',
      itens: [
        {
          n: 'A tarifa: o C6 não tem saque grátis',
          v: 'C6: US$ 5 por saque, sempre. Wise: o 1º do mês é grátis, depois R$ 20.',
          d: 'US$ 5 ≈ R$ 26. Num saque de ₹10.000 (≈ R$ 540, que é o teto do caixa indiano), isso sozinho já é 4,8%. O estorno de tarifa que o C6 oferece é em caixa do Chase, nos Estados Unidos — não existe Chase na Índia.'
        },
        {
          n: 'O spread: a Índia é moeda de terceiro país para o C6',
          v: 'C6: 0,9% no real→dólar + 2% porque a compra é em rupia. Wise: converte real→rupia direto, taxa de mercado.',
          d: 'A C6 Conta Global só existe em DÓLAR e EURO. Não tem rupia. Então todo saque na Índia vira real→dólar→rupia, e o C6 cobra 2% de "spread adicional para outras moedas" em cima da conversão da Mastercard. A Wise não tem essa camada.'
        },
        {
          n: 'A conta fechada, num saque de ₹10.000',
          v: 'C6: ≈ 7,7% de custo. Wise: ≈ 1% no primeiro saque, ≈ 4,7% nos seguintes.',
          d: 'Nos dois casos ainda entra o IOF de 3,5% (igual) e a tarifa do banco dono do caixa (igual, e zero se for banco público). O C6 é mais caro em TODOS os saques da viagem — inclusive contra o segundo e o terceiro saque da Wise.'
        }
      ],
      papel: {
        t: 'Então o C6 não serve para nada nesta viagem?',
        p: [
          'Serve, e para uma coisa importante: ser o PLANO B. Dois cartões de instituições diferentes é a proteção real contra bloqueio antifraude, cartão engolido pela máquina ou app fora do ar. Leve o C6, deixe saldo nele, e não use.',
          'Se o C6 virar o cartão principal por acidente (Wise bloqueada), o prejuízo é da ordem de R$ 30 por saque. É o preço de não ficar sem dinheiro no meio da Índia — barato.',
          'Para COMPRAS (hotel, restaurante, loja), o débito Wise também sai na frente do débito C6, pelo mesmo motivo do spread de 2%. Cartão de crédito brasileiro continua fazendo sentido em conta grande de hotel, pela proteção de compra e pelos pontos — não pelo custo.'
        ]
      },
      confira: 'Como sempre: US$ 5 e os spreads de 0,9% e 2% são a tabela publicada do C6. Confirme no app antes de embarcar — tarifa muda e quem manda é a tela do seu aplicativo.'
    },

    fontes: [
      { t: 'C6 — tarifas e limites de saque da Conta Global', u: 'https://www.c6bank.com.br/blog/quais-as-taxas-e-limites-de-saques-da-conta-global-do-c6-bank' },
      { t: 'C6 — spread de câmbio da Conta Global', u: 'https://www.c6bank.com.br/blog/como-pagar-menos-spread-de-cambio' },
      { t: 'Decreto 12.499/2025 — o IOF unificado em 3,5%', u: 'https://dmgsa.com.br/decreto-no-12-499-2025-altera-regras-do-iof-com-impactos-em-credito-cambio-e-seguros/' },
      { t: 'Wise — tarifas de saque (pt-BR)', u: 'https://wise.com/pt/help/articles/3GuSCwDgRqiYrsUc2eo7MN/estrutura-e-tarifas-de-saque-em-caixas-eletronicos' },
      { t: 'Wise — quanto custa sacar', u: 'https://wise.com/pt/help/articles/2935769/quanto-custa-para-retirar-dinheiro-em-caixas-eletronicos-com-o-meu-cartao-da-wise' },
      { t: 'Melhores Destinos — a mudança de 1º/05/2026', u: 'https://www.melhoresdestinos.com.br/milhas/conta-internacional-wise-muda-regras-saque' },
      { t: 'Regras de moeda para entrar na Índia (RBI/Alfândega)', u: 'https://www.happyfares.in/blog/foreign-currency-carry-to-india-rules/' }
    ]
  }
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
  },
  {
    id: 'ny', nome: 'Nova York', pais: 'Estados Unidos', arte: 'ny',
    periodo: 'Roteiro do Helio · conferido em set/2026', resumo: '6 regiões · 38 lugares checados um a um',
    moeda: 'USD', pronto: true, arquivo: true
  },
  {
    id: 'eu23', nome: 'Europa 2023', pais: 'Alemanha · Suíça · Itália', arte: 'eu23',
    periodo: '12 a 24 de maio de 2023', resumo: 'Arquivo de veredictos · do 11/10 à nota zero',
    moeda: 'EUR', pronto: true, arquivo: true
  },
  {
    id: 'eu25', nome: 'Europa 2025', pais: 'Espanha · Andorra · Portugal · França', arte: 'eu25',
    periodo: '30/12/2025 a 21/01/2026', resumo: '23 dias · 8 cidades · 99 lugares',
    moeda: 'EUR', pronto: true, arquivo: true
  },
  {
    id: 'bos', nome: 'Boston 2024', pais: 'Boston · Connecticut · Nova York', arte: 'bos',
    periodo: '16/01 a 1º/02 de 2024', resumo: 'A estrada · 17 dias · 30 lugares',
    moeda: 'USD', pronto: true, arquivo: true
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

  ida: {
    t: 'A ESCALA DA IDA — 18/09, 22h15 às 02h25',
    voos: 'QR774 chega de Guarulhos às 22h15 do dia 18. QR570 sai para Delhi às 02h25 do dia 19.',
    janela: '4 horas e 10 minutos no papel. Na prática, tire 30 minutos para desembarcar e caminhar, e ' +
            'esteja no portão às 01h40: sobram cerca de TRÊS HORAS úteis.',
    veredito: 'Esta não é uma escala de passear, é uma escala de DORMIR. Vocês vêm de 14h20 de voo, ' +
              'chegam quase meia-noite e pousam em Delhi às 08h45 com o roteiro começando. O objetivo é ' +
              'banho, comida leve e descanso — e dormir no voo de 3h50 para Delhi.',
    linha: [
      { h: '22h15', o: 'Pouso. Conexão internacional: NÃO passa pela imigração do Catar.' },
      { h: '22h45', o: 'Já no lounge ou na sala de descanso. Banho primeiro — é o que mais rende depois de 14 horas.' },
      { h: '23h30', o: 'Comer leve. Evitem álcool e comida pesada: vocês precisam dormir no próximo voo.' },
      { h: '00h30', o: 'Descanso. Se for Quiet Room, escolham a de terminal menos movimentado (A ou D).' },
      { h: '01h40', o: 'No portão. O QR570 embarca antes das 02h25.' }
    ],
    onde: {
      t: 'Em que terminal você pousa? A pergunta tem uma resposta boa',
      d: 'O Hamad tem UM TERMINAL SÓ. Não existe a confusão de Terminal 1 / Terminal 2 — tudo é o mesmo ' +
         'prédio, tudo é área de embarque conectada, e você anda entre qualquer ponto sem passar por ' +
         'segurança de novo. O que varia é o CONCOURSE (o braço do prédio) e o portão.',
      concourses: [
        { n: 'Concourse A', d: 'A oeste do saguão central. Portões A1 a A11.' },
        { n: 'Concourse B', d: 'A leste do saguão central. Portões B1 a B10.' },
        { n: 'Concourse C', d: 'Em frente ao saguão central, o maior. É onde fica o AL MAHA NORTH, no nível 1 do North Node.' },
        { n: 'Concourses D e E', d: 'Os mais novos, abertos para a Copa. Portões D1 a D9 e E1 a E8.' }
      ],
      gate: 'O PORTÃO NÃO DÁ PARA SABER COM ANTECEDÊNCIA. Ele é atribuído poucas horas antes, às vezes no ' +
            'mesmo dia. Onde olhar, em ordem: (1) o aplicativo da Qatar Airways, na sua reserva; ' +
            '(2) dohahamadairport.com, na busca de voo; (3) Flightradar24, que mostra o portão assim que ' +
            'é publicado. No pouso, a primeira coisa a fazer é olhar o painel: ele já mostra o portão do QR570.',
      porqueNaoImporta: 'E aqui está a boa notícia: com três horas úteis, isso quase não pesa. Tudo é ' +
        'conectado, os dois Al Maha ficam em pontos opostos (North Node no Concourse C, e o South na Duty ' +
        'Free Plaza Sul), então um deles sempre está a uma caminhada razoável. A dica prática: ao pousar, ' +
        'ande na direção do CENTRO do terminal — é onde ficam o Lamp Bear, a praça de duty free e a maior ' +
        'parte da comida, e de lá tudo se alcança.',
      ressalva: 'Uma coisa eu não consigo prever: alguns voos param em posição remota e o desembarque é de ' +
        'ônibus. Se acontecer, some uns 15 minutos. Não dá para saber antes.'
    },

    confirmado: {
      t: 'CONFIRMADO no seu app (17/09): o Al Maha está aberto para você',
      d: 'O Helio abriu o aplicativo e mandou as telas. É o DragonPass (o "Explore" laranja), e em ' +
         'Doha · Main Terminal ele lista, como SALA VIP: Al Maha Lounge (Sudeste), Al Maha Lounge (South), ' +
         'mais um Al Maha que ficou cortado na tela, e o Sleepover Doha North Node. Em DESCANSAR, como ' +
         'EXPERIÊNCIA: Sleepover South Node e Sleepover North Node.',
      oQueMuda: 'A dúvida principal acabou: os Al Maha ESTÃO disponíveis. A saída do Priority Pass em ' +
                'maio de 2026 não te afeta, porque o seu programa é outro.',
      atencao: [
        { t: 'SALA VIP e EXPERIÊNCIA não são a mesma coisa',
          d: 'Nesses aplicativos, o que está como "Sala VIP" costuma entrar nos acessos incluídos; o que ' +
             'está como "Experiência" costuma ser desconto, não gratuidade. Repare que o Sleepover aparece ' +
             'nas DUAS listas — vale conferir qual das duas formas é a gratuita.' },
        { t: 'O acompanhante é a conta que pode doer',
          d: 'Vários cartões dão acesso livre ao titular e COBRAM o convidado. Abra a aba "Cartão" ou ' +
             '"Conta" no app e confira duas coisas: quantos acessos grátis restam, e se a Roberta entra ' +
             'de graça. É isso que pode virar uma surpresa no balcão à meia-noite.' },
        { t: 'Sexta à noite em Doha é hora cheia',
          d: '18/09/2026 cai numa SEXTA, e o Al Maha tem fama de lotar. Se o app deixar reservar com ' +
             'antecedência, reserve agora. Chegar às 22h45 e encontrar fila é o pior cenário.' }
      ],
      escolha: 'QUAL DELES: escolha pelo portão. Você só descobre o portão do QR570 ao pousar, então ' +
               'decida no painel: o Al Maha North fica no Concourse C (North Node), o South na Duty Free ' +
               'Plaza Sul. Pegue o que estiver do lado do seu portão de saída — andar 15 minutos com mala ' +
               'de mão à meia-noite não rende nada.',
      veredito: 'MEU VOTO: Al Maha, não a cápsula. Com três horas úteis, a cápsula do Sleepover é ' +
                'marginal — entre entrar, deitar e levantar, sobra uma hora e meia de sono ruim. O lounge ' +
                'te dá BANHO (que é o que mais rende depois de 14h20 de voo), comida e poltrona. O sono ' +
                'de verdade vocês fazem nas 3h50 até Delhi. A cápsula valeria se a escala fosse de 6 horas.'
    },

    cartoes: {
      t: 'O que os seus cartões abrem em Doha — e a armadilha',
      aviso: 'ATENÇÃO, e isto é o mais importante desta página: o programa NÃO depende de o cartão ser ' +
             'Black ou Infinite. Depende do BANCO EMISSOR. O mesmo Visa Infinite pode vir com LoungeKey, ' +
             'com Priority Pass ou com DragonPass, conforme o banco. Você TEM de conferir no aplicativo ' +
             'antes de viajar — é lá que aparece qual programa você tem e quantos acessos restam.',
      linhas: [
        { prog: 'LoungeKey', abre: 'AL MAHA — sim', d: 'Funciona. É o caminho bom.' },
        { prog: 'DragonPass (Mastercard Travel Pass / Visa Airport Companion)', abre: 'AL MAHA — sim, com 6 horas',
          d: 'Funciona, e dá SEIS HORAS de acesso. Mais que suficiente.' },
        { prog: 'Priority Pass', abre: 'AL MAHA — NÃO',
          d: 'Os três lounges Al Maha SAÍRAM do Priority Pass em 15 de maio de 2026. Mas o cartão ainda abre ' +
             'os SLEEP \u2019N FLY (North e South Node) — que são cápsulas de dormir. Para uma escala de ' +
             'madrugada, isso pode ser MELHOR que um lounge comum.' }
      ],
      apps: 'Baixe e confira ANTES de sair de casa: Mastercard Airport Experiences ou Mastercard Travel Pass ' +
            '(para o Black) e Visa Airport Companion (para o Infinite). Os dois mostram o programa e o saldo ' +
            'de acessos grátis. Não descubra isso no balcão, à meia-noite, com sono.'
    },
    gratis: {
      t: 'De graça, sem cartão nenhum',
      itens: [
        { n: 'Quiet Rooms', d: 'Salas de descanso gratuitas espalhadas pelo terminal, com poltronas reclináveis e ' +
          'luz baixa. Há salas separadas para homens, mulheres e famílias. As dos concourses A e D costumam ' +
          'ser as menos cheias. (CORREÇÃO: eu escrevi "terminais A e D" antes. São CONCOURSES — o ' +
          'aeroporto tem um terminal só.)' },
        { n: 'The Orchard', d: 'O jardim tropical coberto no meio do terminal. Não resolve sono, mas é o lugar ' +
          'mais bonito do aeroporto para esticar as pernas.' },
        { n: 'Lamp Bear', d: 'O urso de pelúcia gigante do Urs Fischer, sob o abajur. É a foto obrigatória de Doha ' +
          'e leva dois minutos.' }
      ]
    },
    pagos: {
      t: 'Se os cartões não abrirem',
      itens: [
        { n: 'Al Maha Lounge', d: 'US$ 57,79 por 4 horas, por pessoa. Para dois, uns R$ 600 — caro para três horas.' },
        { n: 'Sleepover (cápsulas)', d: 'Cápsulas de dormir e cabines de família, no North Node, nível inferior dos ' +
          'portões C, em frente aos C30/C31. Dá para pegar de 2 horas. Tem chuveiro.' },
        { n: 'Sleep \u2019n Fly', d: 'Cápsulas perto do portão B10, cobradas por hora. É onde o Priority Pass entra.' },
        { n: 'Oryx Airport Hotel', d: 'Hotel dentro da área de embarque. Para três horas não compensa.' }
      ]
    }
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
