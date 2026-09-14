/* HeRo — Onde beber + Hotéis · Doha, setembro/2026
 *
 * PREÇOS DE HOTEL: vêm da SUA busca no hoteis.com em 14/09/2026, para
 * 28–30/09/2026, 2 adultos, 2 noites. São cotações suas, não pesquisa minha —
 * e mudam. As notas também são de lá (escala 0–10 do próprio site).
 * O QUE EU PESQUISEI foi outra coisa: se cada hotel tem bar licenciado,
 * e o que existe em volta. Isso está marcado fonte a fonte.
 */

const HERO_BARES = {
  precos: {
    intro: 'Faixas relatadas por veículos locais em 2026 — indicativas, não tabela oficial.',
    itens: [
      { o: 'Cerveja', d: 'QAR 30 no happy hour · QAR 47–50 preço cheio', brl: 'R$ 42–70' },
      { o: 'Taça de vinho', d: 'a partir de QAR 45', brl: 'a partir de R$ 63' },
      { o: 'Coquetel', d: 'QAR 50–70 na maioria · QAR 75–120 nos rooftops caros', brl: 'R$ 70–168' },
      { o: 'Happy hour', d: 'drinks a partir de QAR 25–33', brl: 'a partir de R$ 35' }
    ]
  },

  lista: [
    {
      n: 'Infinity Rooftop Lounge', h: 'Alwadi Hotel — MGallery', b: 'Msheireb',
      dist: '0,5 km · 5–7 min a pé', andar: '20º andar',
      hora: 'Todo dia, 17h–00h · "Golden Hours" 16h–20h com preço especial',
      d: '42 coquetéis de 28 países, num roteiro inspirado em "A Volta ao Mundo em 80 Dias". Vista que pega do Souq Waqif até West Bay.',
      porque: 'É o bar licenciado MAIS PRÓXIMO do Souq Waqif com confirmação em site oficial de hotel. Se vocês ficarem no Tivoli (que é seco), este é o drink de antes ou depois do jantar.',
      destaque: true,
      u: 'https://www.alwadihoteldoha.com/restaurants-bars/infinity-rooftop-bar/'
    },
    {
      n: 'Sora Rooftop', h: 'Park Hyatt Doha', b: 'Msheireb',
      dist: '~1 km · 10 min a pé', andar: '21º andar',
      hora: 'Verificar no hotel',
      d: 'Japonês contemporâneo com bar, num dos terraços mais bonitos de Doha. A vista alcança o Palácio de Doha, a Mesquita Verde, o Souq Waqif, a Corniche e o skyline de West Bay.',
      porque: 'Se vocês se hospedarem no Park Hyatt, o bar está no prédio. Se não, ainda é um dos rooftops com a vista mais completa da cidade — e olha para o Souq, não só para os arranha-céus.',
      destaque: true,
      u: 'https://www.hyatt.com/park-hyatt/en-US/dohph-park-hyatt-doha'
    },
    {
      n: 'Ambar', h: 'Mandarin Oriental, Doha', b: 'Msheireb',
      dist: '0,6 km · 10 min a pé', andar: null,
      hora: 'Seg–Qua 17h30–00h · Qui–Sex 17h30–01h',
      d: 'Bar de coquetéis de assinatura inspirado no deserto e na luz âmbar do fim de tarde. Um dos poucos bares de charuto de Doha. Petiscos à altura: sanduíche de wagyu, tábua de cecina.',
      porque: 'O bar mais bem executado a pé do Souq. Se a ideia for um drink sério em vez de vista, é aqui. O mesmo hotel tem o Aqua, no rooftop, mais leve.',
      destaque: true,
      u: 'https://www.mandarinoriental.com/en/doha/msheireb/dine/ambar'
    },
    {
      n: 'Vertigo', h: 'Banyan Tree Doha', b: 'Mushaireb',
      dist: '1,5 km · 6 min de carro', andar: '28º andar',
      hora: 'Verificar no hotel',
      d: 'Uma das lounges mais altas da região, com vista de 360° da Corniche e do skyline. Coquetéis de assinatura e petiscos asiáticos com sotaque mediterrâneo.',
      porque: 'A vista mais alta perto do centro. Teto retrátil.',
      u: 'https://www.banyantree.com/qatar/doha/dining/vertigo'
    },
    {
      n: 'Ned\'s Club (rooftop) e Nickel Lounge', h: 'The Ned Doha', b: 'Al Bida',
      dist: '~4 km · 10 min de carro', andar: 'rooftop',
      hora: 'Verificar no hotel',
      d: 'O Ned tem SETE restaurantes e bares: Nickel Lounge (coquetéis com música ao vivo), Cecconi\'s (italiano), Electric Diner, Millie\'s Lounge, Kaia (sushi), Malibu Kitchen e Hadika (mezze levantino). O rooftop olha para West Bay e o Amiri Diwan.',
      porque: 'A maior concentração de bons bares num prédio só em Doha. Vale a ida mesmo sem se hospedar — mas confirme o acesso, parte é clube de sócios.',
      u: 'https://www.thened.com/doha/restaurants'
    },
    {
      n: 'Pure (rooftop)', h: 'DoubleTree by Hilton Old Town', b: 'As Salatah',
      dist: '~2 km · 7 min de carro', andar: 'rooftop',
      hora: 'Happy hour diário',
      d: 'Rooftop com narguilé, DJ e noites temáticas. O hotel também tem o bar Open e o Claw BBQ.',
      porque: 'O drink mais barato perto do Souq. Sem sofisticação nenhuma — é rooftop de hotel movimentado, não bar de casal. Vá pelo preço, não pelo romance.',
      u: null
    },
    {
      n: 'La Vista 55', h: 'InterContinental Doha The City', b: 'West Bay',
      dist: '~8 km · 15 min de carro', andar: '55º andar',
      hora: 'Verificar no hotel',
      d: 'Um dos rooftops mais altos e mais citados da cidade. Coquetéis na faixa de QAR 75–120 (R$ 105–168).',
      porque: 'Se o critério for altura e skyline, é o topo da lista. Caro.',
      u: null
    },
    {
      n: 'Sky View', h: 'La Cigale Hotel', b: 'Al Sadd',
      dist: '~4 km · 10 min de carro', andar: '15º andar',
      hora: 'Verificar no hotel',
      d: 'Lounge de dois andares que abre para um terraço amplo, com vista panorâmica do skyline.',
      porque: 'Citado repetidamente como um dos melhores para casal.',
      u: null
    },
    {
      n: 'The Secret Garden', h: 'Marsa Malaz Kempinski', b: 'The Pearl',
      dist: '~17 km · 23 min de carro', andar: '6º andar',
      hora: 'Verificar no hotel',
      d: 'Rooftop escondido com vista de The Pearl e do skyline. Silencioso no pôr do sol, música sobe depois.',
      porque: 'O mais bonito de The Pearl — mas é longe para uma viagem de 2 noites centrada no Souq.',
      u: null
    },
    {
      n: 'La Mar — "Sunset Hours"', h: 'InterContinental Doha Beach', b: 'West Bay Lagoon',
      dist: '~12 km · 20 min de carro', andar: 'beira-mar',
      hora: 'Fim de tarde',
      d: 'Coquetéis a partir de QAR 35 e cebiche, empanada e maki do Gastón Acurio a partir de QAR 39, com o sol caindo sobre o Golfo.',
      porque: 'O melhor programa de fim de tarde a dois em Doha, e um dos mais baratos. É bar E comida de gente grande ao mesmo tempo.',
      destaque: true,
      u: 'https://doha.intercontinental.com/la-mar-doha/'
    },
    {
      n: 'Wahm', h: 'W Doha', b: 'West Bay',
      dist: '~7,5 km · 14 min de carro', andar: 'à beira da piscina',
      hora: 'Verificar no hotel',
      d: 'Lounge de piscina, o ponto de drink depois do jantar no COYA ou no Spice Market, que ficam no mesmo hotel.',
      porque: 'Conveniência: se jantarem no W, o bar está ali.',
      u: null
    },
    {
      n: 'Orion, The Library, Manhattan', h: 'Radisson Blu Doha', b: 'Salwa Rd / C-Ring',
      dist: '~6 km · 15 min de carro', andar: 'Orion no rooftop · Library no 11º',
      hora: 'Verificar no hotel',
      d: 'O hotel tem cinco bares: Orion (rooftop com vidro do chão ao teto), The Library (11º andar), Manhattan (couro preto, clima de bar americano), Shehrazad (lounge com terraço) e o bar da piscina.',
      porque: 'A maior densidade de bares por riyal da cidade. Mas fica fora do eixo turístico — é bar de morador, não de visitante com 2 noites.',
      u: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-doha/dining'
    }
  ],

  regras: [
    'Você NÃO precisa estar hospedado para entrar num bar de hotel.',
    'Leve o passaporte original — foto no celular não serve.',
    '21 anos, sem exceção.',
    'A licença é do venue, não do hotel: no mesmo prédio pode haver bar licenciado e restaurante seco. E não vale em piscina, praia nem lobby.',
    'Beber ou estar embriagado na rua é crime: até QAR 3.000 de multa e 6 meses de prisão. Do bar, vá direto para o táxi.'
  ]
};

const HERO_HOTEIS = {
  contexto: {
    datas: '28 a 30 de setembro de 2026 · 2 noites · 2 adultos',
    origem: 'Preços e notas da sua busca no hoteis.com em 14/09/2026. São cotações suas, com disponibilidade e desconto daquele momento — verifique antes de reservar.',
    pesquisei: 'O que eu pesquisei foi se cada hotel tem bar licenciado e o que existe em volta, com fonte do próprio hotel sempre que possível.'
  },

  /* seco: true | false | null(não confirmado) */
  lista: [
    { n: 'Souq Waqif Boutique Hotels by Tivoli', b: 'Al Jasra (dentro do Souq)', nota: 9.4, aval: 929,
      noite: 382, total: 764, dist: '0 — você está dentro', seco: true,
      bar: 'Nenhum. O Souq inteiro é área seca.',
      d: 'Melhor localização possível e o preço mais baixo entre os bons. Tem o Argan (Bib Gourmand MICHELIN) dentro. O preço da experiência é abrir mão de álcool no hotel.' },

    { n: 'Park Hyatt Doha', b: 'Msheireb', nota: 9.6, aval: 149,
      noite: 565, total: 1131, dist: '~1 km · 10 min a pé', seco: false,
      bar: 'Sora Rooftop (21º andar, japonês com bar e vista do Souq), Opus (francês-qatari), Anis e lounge bar.',
      d: 'O equilíbrio mais inteligente da lista: nota 9,6, a pé do Souq, e um rooftop no prédio que olha para o Souq Waqif, a Mesquita Verde e West Bay.',
      vencedor: '✅ RESERVADO', reservado: true },

    { n: 'DoubleTree by Hilton Old Town', b: 'As Salatah', nota: 9.0, aval: 1001,
      noite: 418, total: 836, dist: '~2 km · 7 min de carro', seco: false,
      bar: 'Rooftop Pure (narguilé, DJ, noites temáticas), bar Open com happy hour diário, Claw BBQ.',
      d: 'O jeito mais barato de ter bar no próprio hotel. Nota mais baixa da seleção (9,0) e clima de hotel movimentado, não de casal.',
      vencedor: 'MAIS BARATO COM BAR' },

    { n: 'Alwadi Hotel Doha — MGallery', b: 'Msheireb', nota: 9.6, aval: 405,
      noite: 632, total: 1264, dist: '0,5 km · 5–7 min a pé', seco: false,
      bar: 'Infinity Rooftop Lounge (20º andar, 42 coquetéis de 28 países, Golden Hours 16h–20h) e O\'Glacée, bar da piscina.',
      d: 'Tem o bar licenciado mais próximo do Souq Waqif. Nota 9,6. Se o drink com vista for prioridade e vocês quiserem tudo no mesmo prédio, é este.',
      vencedor: 'MELHOR BAR NO PRÓPRIO HOTEL' },

    { n: 'Al Najada Doha Hotel by Tivoli', b: 'Al Najada', nota: 9.4, aval: 619,
      noite: 450, total: 899, dist: '800 m · 5 min a pé', seco: true,
      bar: 'Nenhum. Confirmado: sem álcool no restaurante e sem bares.',
      d: 'Parece a escolha óbvia por preço e localização — e é SECO. Fica registrado para você não descobrir no check-in.' },

    { n: 'Shaza Doha', b: 'As Salatah', nota: 9.6, aval: 120,
      noite: 405, total: 809, dist: '~15 min a pé', seco: true,
      bar: 'Nenhum, por definição da marca.',
      d: 'A Shaza é uma rede que opera EXCLUSIVAMENTE hotéis sem álcool, com comida só halal. Nota 9,6 e preço ótimo — mas se bebida importa, está fora por construção.' },

    { n: 'Mandarin Oriental, Doha', b: 'Msheireb', nota: 9.8, aval: 315,
      noite: 1749, total: 3498, dist: '0,6 km · 10 min a pé', seco: false,
      bar: 'Ambar (coquetéis de assinatura e charutos) e Aqua (rooftop). Mais o Mandarin Lounge.',
      d: 'A melhor nota da lista entre os hotéis com volume real de avaliações, o melhor bar a pé do Souq, e vista para a Barahat Msheireb. Custa 3x o Park Hyatt.',
      vencedor: 'MELHOR SE O ORÇAMENTO ABRIR' },

    { n: 'The Ned Doha', b: 'Al Bida', nota: 9.8, aval: 73,
      noite: 1545, total: 3091, dist: '~4 km · 10 min de carro', seco: false,
      bar: 'Sete restaurantes e bares: Ned\'s Club no rooftop, Nickel Lounge com música ao vivo, Cecconi\'s, Electric Diner, Millie\'s Lounge, Kaia, Malibu Kitchen, Hadika.',
      d: 'Se a viagem fosse sobre beber e comer dentro do hotel, seria este. Mas vocês têm 2 noites e três jantares escolhidos fora — a maior parte disso ficaria sem uso.' },

    { n: 'Hyatt Regency Oryx Doha', b: 'perto do aeroporto', nota: 9.4, aval: 1005,
      noite: 416, total: 832, dist: '3,8 km · ~12 min de carro', seco: false,
      bar: 'Bar/lounge e bar de piscina.',
      d: 'Barato, bem avaliado, com bar — mas fora do eixo. Só faz sentido se o voo for muito cedo ou muito tarde.' },

    { n: 'Radisson Blu Hotel Doha', b: 'Salwa Rd / C-Ring', nota: 9.0, aval: 1003,
      noite: 291, total: 582, dist: '~6 km · 15 min de carro', seco: false,
      bar: 'CINCO bares: Orion (rooftop), The Library (11º), Manhattan, Shehrazad e o da piscina.',
      d: 'O mais barato da lista inteira e o que tem mais bares. Mas fica em avenida movimentada, longe do Souq e dos museus. É hotel de morador, não de quem tem 2 noites.',
      vencedor: 'MAIS BARATO DA LISTA' },

    { n: 'Millennium Place Doha', b: 'Rawdat Al Khail', nota: 9.4, aval: 298,
      noite: 315, total: 629, dist: '~5 km', seco: null, bar: 'Não confirmado.',
      d: 'Preço muito bom e nota alta, mas não consegui confirmar bar e a região não ajuda.' },

    { n: 'Riviera Rayhaan by Rotana', b: 'Doha', nota: 9.4, aval: 232,
      noite: 313, total: 626, dist: '~6 km', seco: null,
      bar: 'Não confirmado. Atenção: "Rayhaan" é a linha SEM ÁLCOOL da Rotana — trate como seco até confirmarem o contrário.',
      d: 'Barato e bem avaliado. Mas o nome da marca sugere hotel seco.' },

    { n: 'Steigenberger Hotel Doha', b: 'Doha', nota: 9.2, aval: 628,
      noite: 467, total: 933, dist: '~6 km', seco: false,
      bar: '4 restaurantes e bar de piscina.',
      d: 'Opção intermediária sem nada que a destaque para esta viagem.' },

    { n: 'Mondrian Doha', b: 'West Bay Lagoon', nota: 9.4, aval: 682,
      noite: 932, total: 1865, dist: '~14 km · 20 min', seco: false,
      bar: 'Bares do hotel e o Morimoto no prédio.',
      d: 'Só vale se vocês quiserem jantar no Morimoto — que, pela minha própria análise, é o japonês menos necessário dos três de Doha.' },

    { n: 'The St. Regis Doha', b: 'West Bay', nota: 9.4, aval: 604,
      noite: 1405, total: 2810, dist: '~13 km · 20 min', seco: false,
      bar: '16 endereços gastronômicos, incluindo o Hakkasan.',
      d: 'Bom hotel, longe do que interessa nesta viagem, e caro.' },

    { n: 'Raffles Doha', b: 'Lusail', nota: 9.4, aval: 149,
      noite: 2402, total: 4805, dist: '~20 km · 25 min', seco: false,
      bar: 'Bares do hotel e o Alba, estrela MICHELIN nova de 2026, licenciado.',
      d: 'O hotel do Alba. Se a noite de alta gastronomia COM vinho for o ponto da viagem, dormir aqui elimina o deslocamento — mas custa R$ 4.805 as duas noites.' },

    { n: 'Four Seasons Hotel Doha', b: 'Área Diplomática', nota: 9.4, aval: 394,
      noite: 2388, total: 4777, dist: '~8 km · 15 min', seco: false,
      bar: 'Nobu e seu rooftop, entre outros.',
      d: 'Caro e longe do eixo Souq/museus.' }
  ],

  decidido: {
    t: 'Decidido: Park Hyatt Doha',
    d: 'R$ 565 a diária, nota 9,6, em Msheireb. Fica a 10–12 minutos a pé do Souq Waqif e ' +
       'tem o Sora no 21º andar — bar e japonês com vista do próprio Souq, da Mesquita Verde e de West Bay. ' +
       'Ou seja: o problema do álcool no hotel deixou de existir, porque agora o bar está no prédio.',
    falta: 'Falta decidir o número de noites. A reserva atual cobre 28→30/09, mas o voo de volta ' +
           'sai 1º/10 às 00h05. Veja a aba "A escala".'
  },

  veredito: {
    titulo: 'Como eu cheguei nessa decisão',
    texto: [
      'A tensão real da sua lista é esta: **os três hotéis mais bem posicionados e mais baratos perto do Souq são secos.** Tivoli Souq Waqif (R$ 382), Al Najada Tivoli (R$ 450) e Shaza (R$ 405) — nenhum serve álcool, e o Shaza nem poderia, é uma rede que só opera hotéis sem álcool.',
      'Então a pergunta não é "qual o melhor custo-benefício", é **"beber no hotel vale R$ 183 por noite?"**',
      '**Se não vale:** fiquem no Souq Waqif Boutique Hotels by Tivoli, R$ 382. Melhor localização de Doha, nota 9,4 com 929 avaliações, o Argan (Bib Gourmand) dentro, e o Infinity Rooftop a 7 minutos a pé quando der vontade de um drink. É o que eu faria.',
      '**Se vale:** Park Hyatt Doha, R$ 565. Nota 9,6, ainda a pé do Souq, e o Sora no 21º andar com vista do Souq Waqif e de West Bay. São R$ 366 a mais no total das duas noites — menos que um jantar.',
      '**Se o orçamento abrir de vez:** Mandarin Oriental, R$ 1.749. Nota 9,8 com 315 avaliações, o Ambar é o melhor bar a pé do Souq, e o hotel olha para a Barahat Msheireb. Mas são R$ 3.498 nas duas noites — quase o custo do jantar no IDAM mais o do Jiwan somados.',
      'O que eu **não** faria: Radisson Blu por R$ 291 (cinco bares, mas 15 minutos de carro de tudo que importa nesta viagem) nem Al Najada (parece perfeito no papel e é seco).'
    ]
  },

  fontes: [
    { t: 'Park Hyatt Doha — oficial', u: 'https://www.hyatt.com/park-hyatt/en-US/dohph-park-hyatt-doha' },
    { t: 'Visit Qatar — Park Hyatt Doha', u: 'https://visitqatar.com/intl-en/plan-your-trip/accommodation/park-hyatt-doha' },
    { t: 'Alwadi Hotel Doha — bares (oficial)', u: 'https://www.alwadihoteldoha.com/restaurants-bars/' },
    { t: 'Mandarin Oriental Doha — Ambar (oficial)', u: 'https://www.mandarinoriental.com/en/doha/msheireb/dine/ambar' },
    { t: 'Tivoli — Al Najada Doha (oficial)', u: 'https://www.tivolihotels.com/en/al-najada-tivoli' },
    { t: 'Shaza Hotels — sobre a marca (oficial)', u: 'https://www.shazahotels.com/en/about/' },
    { t: 'The Ned Doha — restaurantes (oficial)', u: 'https://www.thened.com/doha/restaurants' },
    { t: 'Radisson Blu Doha — restaurantes e bares (oficial)', u: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-doha/dining' },
    { t: 'Banyan Tree Doha — Vertigo (oficial)', u: 'https://www.banyantree.com/qatar/doha/dining/vertigo' },
    { t: 'Time Out Doha — melhores bares', u: 'https://www.timeoutdoha.com/food-drink/best-bars-in-doha-qatar' },
    { t: 'Time Out Doha — happy hours 2026', u: 'https://www.timeoutdoha.com/food-drink/doha-happy-hours-bars-2026' }
  ]
};

/* Os quatro níveis do programa Stopover — pesquisados em 14/09/2026.
   A lista de hotéis de cada nível NÃO é pública: ela só aparece depois de
   entrar na Discover Qatar com o localizador do voo, e varia por data. */
const HERO_STOPOVER = {
  regras: [
    'Trânsito em Doha entre 12 e 96 horas. O de vocês tem 54 — está dentro.',
    'Até 4 noites por sentido. Ou seja: dá para fazer as TRÊS noites de Doha pelo programa, não só a terceira.',
    'Todos os hotéis do programa têm check-in 24 horas. Importa: vocês pousam às 17h45.',
    'Preço por PESSOA, por noite, em quarto duplo. Reserva em discoverqatar.qa com o localizador do voo.'
  ],
  niveis: [
    { n: 'Standard — 4 estrelas', usd: 14, casalNoite: 143, casal3: 428,
      marcas: 'IHG, Hilton, Marriott',
      exemplos: 'Marriott Courtyard, Holiday Inn',
      d: 'O piso do programa. Hotel correto de rede, sem charme.' },
    { n: 'Premium — 5 estrelas', usd: 24, casalNoite: 245, casal3: 734,
      marcas: 'IHG, Hyatt, Hilton, Marriott, Dusit, Accor, Tivoli',
      exemplos: 'Marriott Marquis City Center, Alwadi Hotel MGallery, dusitD2 Salwa, Grand Hyatt, Mondrian Doha',
      d: 'O nível interessante. Entre os exemplos citados pela imprensa de viagem está o ALWADI MGALLERY — nota 9,6, em Msheireb, e dono do Infinity Rooftop, que eu apontei como o melhor bar perto do Souq.',
      destaque: true },
    { n: 'Premium com praia — 5 estrelas', usd: 31, casalNoite: 316, casal3: 949,
      marcas: 'Marriott, Dusit, Le Méridien, IHG, Tivoli',
      exemplos: 'inclui acesso à Doha Sands Beach',
      d: 'Mesmo nível do Premium, com praia. Em setembro, com 40 °C, a praia é mais ideia do que uso.' },
    { n: 'Luxury — 5 estrelas com café', usd: 83, casalNoite: 847, casal3: 2540,
      marcas: 'Westin, Hyatt, Fairmont, Rixos, Hilton, Dusit, InterContinental',
      exemplos: 'os hotéis de topo, café da manhã incluído',
      d: 'ATENÇÃO: aqui o programa deixa de ser barganha. Três noites saem por R$ 2.540 — mais caro que reservar o Park Hyatt direto (R$ 1.695).' }
  ],
  comparativo: {
    t: 'Contra o Park Hyatt que você reservou',
    linhas: [
      { o: 'Park Hyatt, 3 noites, reserva direta', v: 'R$ 1.695', obs: 'o hotel que você escolheu, nota 9,6' },
      { o: 'Stopover Premium 5★, 3 noites', v: 'R$ 734', obs: 'mas você escolhe da lista deles' },
      { o: 'Stopover Standard 4★, 3 noites', v: 'R$ 428', obs: 'rede sem charme' },
      { o: 'Stopover Luxury 5★, 3 noites', v: 'R$ 2.540', obs: 'mais caro que o Park Hyatt direto' }
    ]
  },
  honestidade: 'Eu NÃO consigo te mostrar a lista de hotéis com fotos e descrição. O site da ' +
    'Discover Qatar está bloqueado neste ambiente, e mesmo aberto a lista só aparece depois de ' +
    'entrar com o localizador do voo — ela muda conforme as datas e a disponibilidade. Os preços ' +
    'e as marcas acima vêm da imprensa de viagem, não da página oficial. Tudo aqui é "a partir de".',
  comoVer: [
    'Entre em discoverqatar.qa e vá em Stopover. (O outro caminho é qatarairways.com → Stopover/Packages, mas como o voo já está comprado, a Discover Qatar é o atalho.)',
    'Informe o localizador do voo Qatar Airways e o sobrenome.',
    'Escolha o NÍVEL (Standard, Premium, Premium com praia, Luxury). Dentro do nível, você escolhe o hotel numa lista — não é sorteio nem atribuição.',
    'O site mostra o que está disponível PARA AS SUAS DATAS, com foto, descrição e preço final. É aí que se descobre se o Alwadi está lá.',
    'Compare com os R$ 565 por noite do Park Hyatt antes de mexer em qualquer coisa.'
  ],

  prazos: {
    t: 'Os prazos, que importam mais do que parece',
    itens: [
      { o: 'Até quando dá para reservar', d: 'Até 72 horas antes do check-in. Para vocês, isso é 25 de setembro.' },
      { o: 'Por que não esperar até lá', d: 'A própria Qatar Airways avisa que os melhores hotéis e as tarifas mais baixas esgotam rápido, sobretudo na alta temporada — que vai de OUTUBRO A ABRIL. As datas de vocês, 28/09 a 1º/10, caem exatamente na virada para a alta.' },
      { o: 'A ordem certa', d: 'Consulte o Stopover ANTES de cancelar qualquer coisa. Só cancele o Park Hyatt depois de ter a reserva do Stopover confirmada e o hotel escolhido.' }
    ]
  },

  cuidado: 'ANTES de tudo: confira a política de cancelamento da sua reserva do Park Hyatt. ' +
    'Na lista que você me mandou, vários hotéis apareciam com "totalmente reembolsável", mas o ' +
    'Park Hyatt não trazia essa marca. Se a tarifa dele não for reembolsável, o Stopover deixa de ' +
    'ser uma alternativa e vira só uma curiosidade — e aí a decisão é apenas quantas noites manter.',

  alwadiResposta: {
    t: 'Dá para ficar no Alwadi por US$ 24 por pessoa?',
    d: 'Resposta honesta: eu não sei, e ninguém sabe sem consultar as suas datas. Três coisas ' +
       'separam o que eu sei do que você quer saber. Primeiro: US$ 24 é "a partir de" — é o piso ' +
       'do nível Premium, e hotel melhor dentro do mesmo nível pode custar mais. Segundo: o Alwadi ' +
       'apareceu como EXEMPLO de hotel do nível Premium em veículos de viagem, não numa lista ' +
       'oficial, e a composição muda. Terceiro: disponibilidade em 28/09–01/10 é uma incógnita até ' +
       'você entrar com o localizador. O que dá para afirmar: se ele estiver lá, você escolhe — ' +
       'a mecânica é escolher o nível e depois o hotel dentro dele.'
  },
  veredito: 'Vale os 10 minutos de consulta, por um motivo específico: se o Alwadi MGallery estiver ' +
    'no nível Premium nas suas datas, você paga cerca de R$ 245 a noite em vez de R$ 632, num hotel ' +
    'nota 9,6 que tem o melhor rooftop perto do Souq. Se não estiver, mantenha o Park Hyatt — ele é ' +
    'a escolha certa e o Sora resolve a bebida no próprio prédio.'
};
