/* HeRo — Nova York
 *
 * ORIGEM: roteiro escrito pelo Helio, para quem ia viajar. A voz dele fica
 * inteira — "diquinha valiosa", "eveeeeer", "a mamãe" — porque é ela que faz
 * esse texto valer mais que qualquer guia.
 *
 * O QUE EU FIZ: conferi cada lugar em setembro de 2026. O roteiro tem alguns
 * anos e Nova York fechou muita casa desde a pandemia.
 *
 * REGRA DESTE ARQUIVO, a mesma de Doha: nada de status inventado.
 *   conf: 'aberto'         -> confirmado em fonte citada
 *   conf: 'fechado'        -> confirmado fechado, em fonte citada
 *   conf: 'mudou'          -> existe, mas o endereço ou o formato mudou
 *   conf: 'nao-confirmado' -> NÃO consegui confirmar. Pode estar aberto.
 *                             Nunca apresentar como verificado.
 */

const HERO_NY = {
  id: 'ny',
  cidade: 'Nova York',
  pais: 'Estados Unidos',
  conferidoEm: '2026-09-14',
  autoria: 'Roteiro escrito pelo Helio. A conferência de setembro/2026 é minha \u2014 o texto e o julgamento continuam sendo dele.',

  /* ---------------- o que mudou desde que o roteiro foi escrito ------------- */
  mudou: [
    {
      t: 'Plaza Food Hall',
      antes: 'O roteiro diz "fechado desde a pandemia, com planos de reabertura, sem data".',
      agora: 'Fechado EM DEFINITIVO. Não é mais uma questão de data — o food hall do Todd English não vai voltar naquele formato. Tire do plano de almoço.',
      grau: 'fechado',
      fontes: [{ t: 'Yelp — The Plaza Food Hall, CLOSED', u: 'https://www.yelp.com/biz/the-plaza-food-hall-new-york' }]
    },
    {
      t: 'LAVO',
      antes: '"Vira balada, bacana pro jantar."',
      agora: 'FECHOU a casa da 58th Street depois de 13 anos. O grupo TAO diz que procura novo endereço em Manhattan; por enquanto só entrega e catering. Não conte com ela.',
      grau: 'fechado',
      fontes: [{ t: 'TAO Group — LAVO New York', u: 'https://taogroup.com/venues/lavo-italian-restaurant-new-york/' }]
    },
    {
      t: 'Fig & Olive (Meatpacking)',
      antes: '"Mediterrâneo com bom custo-benefício. Nota 7."',
      agora: 'FECHADO. A casa da 420 W 13th St não existe mais; o grupo passou por recuperação judicial.',
      grau: 'fechado',
      fontes: [{ t: 'Yelp — Fig & Olive, CLOSED', u: 'https://www.yelp.com/biz/fig-and-olive-new-york-12' }]
    },
    {
      t: 'Bed Bath & Beyond',
      antes: 'Está na lista das "melhores lojas para bater perna".',
      agora: 'FECHOU AS 360 LOJAS em 2023, na falência. A marca voltou em 2026, mas de carona na Container Store e só em Massachusetts. Em Nova York não existe mais. Risque da lista.',
      grau: 'fechado',
      fontes: [
        { t: 'Retail Dive — Bed Bath & Beyond compra a Container Store', u: 'https://www.retaildive.com/news/bed-bath-beyond-agrees-acquire-container-store-150m/816448/' },
        { t: 'Boston.com — a volta às lojas físicas, 3 no estado', u: 'https://www.boston.com/news/business/2026/05/01/bed-bath-beyond-returns-to-stores-with-3-mass-locations/' }
      ]
    },
    {
      t: 'Momofuku',
      antes: 'Está na lista solta do fim ("zero ordem específica").',
      agora: 'O império encolheu. O Ssäm Bar — o que valia a viagem — fechou em 2023, o Nishi e o Kawi também. Sobrou o Noodle Bar, em dois endereços: East Village (171 1st Ave) e Columbus Circle (10 Columbus Cir). É ramen honesto, não é mais o destino que já foi.',
      grau: 'mudou',
      fontes: [
        { t: 'Robb Report — o fim do Ssäm Bar', u: 'https://robbreport.com/food-drink/dining/david-chang-momofuku-ssam-bar-closing-permanently-1234894804/' },
        { t: 'Momofuku — Noodle Bar East Village', u: 'https://www.momofuku.com/restaurants/noodle-bar-east-village' }
      ]
    },
    {
      t: 'MacKenzie-Childs',
      antes: 'Está na lista de lojas, sem endereço.',
      agora: 'MUDOU DE BAIRRO. Era um ícone da Madison Avenue nos anos 90; hoje a loja de Nova York fica no SoHo, na 410 West Broadway. Se alguém te mandar para a Madison, vai andar à toa.',
      grau: 'mudou',
      fontes: [{ t: 'MacKenzie-Childs — loja de Nova York', u: 'https://www.mackenzie-childs.com/on/demandware.store/Sites-MacKenzie-Childs-Site/en_US/Stores-Details?StoreID=newyork-ny' }]
    },
    {
      t: 'The Container Store',
      antes: 'Última da lista de lojas.',
      agora: 'Viva, na 629 Sixth Avenue. Mas passou por recuperação judicial em 2024 e foi comprada pela Bed Bath & Beyond em 2026 — as lojas estão sendo rebatizadas para "The Container Store / Bed Bath & Beyond". Se você procurar a placa antiga, pode estranhar.',
      grau: 'mudou',
      fontes: [{ t: 'The Container Store — Sixth Avenue Manhattan', u: 'https://www.containerstore.com/stores/ny/new-york/629-sixth-avenue' }]
    },
    {
      t: 'Reservas: só OpenTable não basta mais',
      antes: '"NAO DEIXE DE BAIXAR UM APP QUE CHAMA OPEN TABLE."',
      agora: 'O conselho continua certo — e ficou incompleto. O OpenTable ainda lidera (46% do mercado americano), mas em Nova York o RESY virou essencial: é onde estão as casas de chef, e ele domina o Brooklyn com 53%. Baixe os DOIS. Os dois são de graça para quem janta.',
      grau: 'mudou',
      fontes: [{ t: 'Comparativo Resy × OpenTable, 2026', u: 'https://www.perfectvenue.com/post/resy-vs-opentable' }]
    }
  ],

  /* ---------------- correções de fato (não é fechamento, é erro) ----------- */
  correcoes: [
    {
      t: 'O Chrysler Building não é o terceiro mais alto de Nova York',
      d: 'É o 13º, empatado com o New York Times Building. Foi ultrapassado por One World Trade Center, Central Park Tower, 111 West 57th, One Vanderbilt, 432 Park, Empire State e outros. O que ele foi de verdade, e isso é mais bonito: o prédio mais alto DO MUNDO entre 1930 e 1931 — perdeu o posto para o Empire State em pouco mais de um ano.',
      fontes: [{ t: 'Wikipedia — prédios mais altos de Nova York', u: 'https://en.wikipedia.org/wiki/List_of_tallest_buildings_in_New_York_City' }]
    },
    {
      t: 'O Whole Foods não é 100% orgânico',
      d: 'Ele tem padrões de qualidade acima da média e uma seção orgânica grande, mas vende bastante produto convencional. Continua valendo o passeio e a parada para o almoço — só não é o que a frase promete.',
      fontes: []
    },
    {
      t: '"Little Eataly" é Little Italy',
      d: 'O roteiro escreve "bairro Little Eataly, colado com Chinatown". O bairro é LITTLE ITALY. O Eataly é outra coisa — a loja-mercado italiana, que fica no Flatiron (perto do Madison Square Park) e no World Trade Center. Os dois estão no roteiro e são lugares diferentes.',
      fontes: []
    },
    {
      t: 'Ellis Island, com dois L',
      d: 'Detalhe bobo, mas na hora de comprar o ingresso do ferry você vai digitar. "Elis" não acha.',
      fontes: []
    }
  ],

  /* ---------------- os dias, como voce escreveu, com os reparos ------------- */
  dias: [
    {
      id: 'midtown', nome: 'Midtown', cor: 0,
      manha: 'Começar pela Times Square e subir a 5th Avenue vendo as lojas (Saks, Uniqlo, Abercrombie e uma dezena de outras). Chrysler Building, St. Patrick’s Cathedral, os Correios, Radio City Music Hall, Rockefeller e Top of the Rock.',
      tarde: 'Almoço; depois MoMA — ou Central Park, se o dia estiver bonito demais para museu.',
      noite: 'Voltar caminhando por uma paralela, ou pelo outro lado da 5th Avenue, até a Times Square. PRECISA ser vista depois de anoitecer.',
      voce: [
        'No Top of the Rock a mamãe propôs o drink pela vista — mas depende do horário e do ânimo de vocês. Costuma ter filas enoooooormes; se estiver assim, não vale perder tempo.',
        'Diquinha valiosa: no pé do Rockefeller tem a melhor Banana Republic eveeeeer. Muita coisa bacana e bons preços.',
        'Se não estiverem mortos de fome, sigam até Columbus Circle: no subsolo do shoppingzinho tem o WHOLE FOODS MARKET. No mesmo mall, a Williams Sonoma — uma das minhas lojas preferidas de casa.'
      ],
      meus: [
        { t: 'O almoço do Plaza saiu do mapa', d: 'Você sugeria o Plaza Food Hall. Fechado em definitivo. As alternativas na mesma caminhada: o Whole Foods de Columbus Circle (que você já indica), ou o Grand Central.' },
        { t: 'Chrysler: veja o saguão', d: 'O mirante nunca foi aberto ao público. O que vale é entrar no lobby art déco — é gratuito e é a melhor parte.' }
      ]
    },
    {
      id: 'lower-midtown', nome: 'Lower Midtown', cor: 1,
      manha: 'Bryant Park, New York Public Library, Grand Central Station, Macy’s.',
      tarde: 'Madison Square Garden, Hudson Yards, The High Line, Chelsea Market.',
      noite: 'Musical da Broadway + jantar no Carmine’s.',
      voce: [
        'A manhã parece corrida mas não é: a Public Library fica encostada no Bryant Park, e a Grand Central é perto e rápida de visitar. Na Macy’s você gasta o tempo que quiser.',
        'Feche a tarde com um chopp ou uma taça de vinho no Chelsea Market, com um petisco para enganar a fome antes do jantar.',
        'Entre o Madison Square Garden e a High Line dá para fazer mais comprinhas pela Union Square. No Hudson Yards, coma um cacareco no Mercado Little Spain, no subsolo.'
      ],
      meus: [
        { t: 'Carmine’s exige reserva — e agora com dois apps', d: 'Você já avisa. Some a isso: procure no OpenTable E no Resy, porque nem toda casa está nos dois.' }
      ]
    },
    {
      id: 'harlem', nome: 'Harlem', cor: 2,
      manha: 'Missa gospel no Harlem. BEM VESTIDOS, senão não entram.',
      tarde: '', noite: '',
      voce: ['(Você escreveu "já te passei as dicas das igrejas, né?" — elas ficaram fora deste texto. Se você ainda tiver a lista, me mande que eu confiro uma a uma.)'],
      meus: [
        { t: 'Isso mudou muito e eu não consegui confirmar', d: 'Várias igrejas do Harlem restringiram ou acabaram com a entrada de turistas depois da pandemia, e as que recebem costumam exigir agendamento. NÃO chegue sem checar no site da igreja na semana da viagem. Não encontrei fonte confiável e atual para indicar uma igreja específica — prefiro dizer isso a te mandar para uma porta fechada.' }
      ]
    },
    {
      id: 'upper', nome: 'Upper Manhattan', cor: 3,
      manha: 'Manhã preguiçosa: piquenique no Central Park. Mais uma parada no Whole Foods, encham a mochila de snacks e sigam para uma longa caminhada.',
      tarde: 'Museu Americano de História Natural.',
      noite: 'Rooftop para drinks.',
      voce: [
        'Faça o Central Park de baixo para cima: Central Zoo, Strawberry Fields, Bow Bridge, até o Museu de História Natural. Depois volte para dentro do parque e cruze até o Met e o Guggenheim. Qualquer um dos três é imperdível.',
        'Bom dia para incluir mais compras à tarde e um rooftop à noite. Nova York está repleta de bares no alto de hotéis com vistas belíssimas.'
      ],
      meus: [
        { t: 'Compre o ingresso do Met e do História Natural antes', d: 'O "pague quanto quiser" do Met vale só para quem mora em NY, Nova Jersey ou Connecticut — turista paga tabela. Filas grandes nos dois.' }
      ]
    },
    {
      id: 'lower', nome: 'Lower Manhattan', cor: 4,
      manha: 'Estátua da Liberdade, Battery Park, Distrito Financeiro, Memorial do 11 de setembro, One World Trade Center e Century 21.',
      tarde: 'ALMOÇO TARDE NO EATALY — vale pelo passeio também.',
      noite: 'Seguir o passeio pelo SoHo e jantar na região. Uma das minhas áreas preferidas!',
      voce: [
        'Chegue super cedo no Battery Park, de onde saem os ferries para Liberty Island (tem opções: até Ellis Island, ou só rodeando. Ou nenhum passeio de barco, e sigam o roteiro).',
        'Depois: caminhar pelo distrito financeiro, passar pelo touro de Wall Street e chegar ao World Trade Center — a praça, o memorial, o museu do 11 de setembro e o One World Observatory.'
      ],
      meus: [
        { t: 'Century 21 REABRIU — a dica está de pé', d: 'A loja fechou na falência em 2020 e muita gente ainda acha que acabou. Reabriu em 2023 na 22 Cortlandt St, quatro andares, 100 mil pés quadrados, foco em moda. Seg–Sáb 9h–21h, Dom 11h–20h.' },
        { t: 'O ferry tem um operador só', d: 'Statue City Cruises, saindo do Battery Park. Qualquer outro "barco para a Estátua" é passeio de rodeio — não desembarca na ilha.' }
      ]
    },
    {
      id: 'brooklyn', nome: 'Brooklyn, Little Italy e Chinatown', cor: 5,
      manha: 'Brooklyn e Dumbo.',
      tarde: 'Little Italy, Chinatown e o melhor cheesecake do mundo.',
      noite: 'Chelsea e Meatpacking District.',
      voce: [
        'Acordar bem cedo para estar no metrô rumo ao Brooklyn por volta das 8h. É a única maneira de pegar a ponte quase vazia e tirar fotos legais.',
        'Você pode cruzar a ponte e caminhar um pouco pelo Brooklyn (super recomendo!), mas voltem para Manhattan para almoçar em Little Italy, colada com a Chinatown. Não coma a sobremesa: deixe para o melhor cheesecake do mundo, na Eileen’s.',
        'Uma alternativa que me agrada menos: The River Cafe para drinks e jantar em outro lugar. Achei caro e turístico, mas a mamãe amou. Vocês decidem!'
      ],
      meus: [
        { t: 'Eileen’s está de pé, e no mesmo lugar', d: '17 Cleveland Place. Seg–Qui 11h–19h, Sex–Sáb 11h–20h, Dom 11h–19h. Tem funcionário lá há mais de 40 anos. Sua dica envelheceu bem.' }
      ]
    }
  ],

  /* ---------------- os lugares, um a um, com carimbo ---------------------- */
  lugares: [
    /* --- Midtown --- */
    { n: 'Plaza Food Hall', lat: 40.7645, lng: -73.9744, prec: 'end', z: 'Midtown', tipo: 'restaurante', conf: 'fechado',
      d: 'Fechado em definitivo desde a pandemia.',
      f: [{ t: 'Yelp', u: 'https://www.yelp.com/biz/the-plaza-food-hall-new-york' }] },
    { n: 'LAVO', lat: 40.7628, lng: -73.9705, prec: 'end', z: 'Midtown', tipo: 'restaurante', conf: 'fechado',
      d: 'A casa da 58th Street fechou após 13 anos. O grupo procura novo endereço em Manhattan.',
      f: [{ t: 'TAO Group', u: 'https://taogroup.com/venues/lavo-italian-restaurant-new-york/' }] },
    { n: 'Del Frisco’s Double Eagle', lat: 40.7593, lng: -73.9812, prec: 'end', z: 'Midtown', tipo: 'restaurante', conf: 'aberto',
      d: 'Vivo e firme: 1221 Avenue of the Americas, no Rockefeller Center. Renovou o contrato por 20 anos em 2024 — fica até por volta de 2045. É a única casa Double Eagle de Nova York. Carne, chiquérrimo e caro, como você escreveu.',
      f: [{ t: 'Commercial Observer — renovação do contrato', u: 'https://commercialobserver.com/2024/01/del-friscos-renews-double-eagle-lease-at-1221-avenue-of-the-americas/' },
           { t: 'Rockefeller Center', u: 'https://www.rockefellercenter.com/dine/del-friscos-double-eagle-steak-house' }] },
    { n: 'Carmine’s', lat: 40.7576, lng: -73.9873, prec: 'end', z: 'Midtown / Broadway', tipo: 'restaurante', conf: 'nao-confirmado',
      d: 'Não consegui confirmar em fonte primária de 2026. MAS: VOCÊS JANTARAM AQUI em 23/01/2024, depois do Harry Potter na Broadway (está no roteiro de Boston). Existia com certeza naquela data. Italiano tradicional, porções family style, perto da Broadway — precisa reservar. Checar no OpenTable ou no Resy antes de contar com ele.', f: [] },
    { n: 'Smith & Wollensky', lat: 40.7562, lng: -73.97, prec: 'end', z: 'Midtown', tipo: 'restaurante', conf: 'nao-confirmado',
      d: 'Não confirmado em fonte primária. Steakhouse tradicional e formal.', f: [] },
    { n: 'Serafina', lat: 40.7645, lng: -73.972, prec: 'bairro', z: 'vários', tipo: 'restaurante', conf: 'nao-confirmado',
      d: 'Não confirmado. A rede teve várias casas em Nova York e fechou algumas; confira qual unidade está aberta antes de ir.', f: [] },
    { n: 'Oyster Bar (Grand Central)', lat: 40.7527, lng: -73.9772, prec: 'end', z: 'Grand Central', tipo: 'restaurante', conf: 'nao-confirmado',
      d: 'Não confirmado em fonte primária. Você chama de "melhor de TODOS" da estação.', f: [] },
    { n: 'Shake Shack', lat: 40.7414, lng: -73.988, prec: 'bairro', z: 'vários', tipo: 'lanchonete', conf: 'nao-confirmado',
      d: 'Rede grande, com dezenas de casas. Não há risco real de não achar uma.', f: [] },

    /* --- Meatpacking / Chelsea --- */
    { n: 'TAO Downtown', lat: 40.743, lng: -74.0052, prec: 'end', z: 'Meatpacking', tipo: 'restaurante', conf: 'aberto',
      d: 'Aberto, embaixo do Maritime Hotel. Asiático. Você diz que vale nem que seja só pelo drink — e o argumento (é lindo de morrer) continua de pé.',
      f: [{ t: 'TAO Group — TAO Downtown', u: 'https://taogroup.com/venues/tao-downtown-new-york/' }] },
    { n: 'Catch NYC', lat: 40.7404, lng: -74.0077, prec: 'end', z: 'Meatpacking', tipo: 'restaurante', conf: 'aberto',
      d: 'Aberto. Cheio e bonito; o rooftop no fim de tarde é a boa pedida, como você sugere.', f: [] },
    { n: 'Fig & Olive', lat: 40.7414, lng: -74.0071, prec: 'end', z: 'Meatpacking', tipo: 'restaurante', conf: 'fechado',
      d: 'Fechado. A casa da 420 W 13th St não existe mais.',
      f: [{ t: 'Yelp', u: 'https://www.yelp.com/biz/fig-and-olive-new-york-12' }] },
    { n: 'RH Rooftop Restaurant', lat: 40.7408, lng: -74.0079, prec: 'end', z: 'Meatpacking', tipo: 'rooftop', conf: 'aberto',
      d: 'Aberto: 9 Ninth Avenue, 5º andar da galeria da RH. Aceita reserva.',
      f: [{ t: 'RH — o restaurante no terraço', u: 'https://rh.com/us/en/newyork/restaurant' }] },
    { n: 'PHD Rooftop (Dream Downtown)', lat: 40.742, lng: -74.0043, prec: 'end', z: 'Chelsea', tipo: 'rooftop', conf: 'mudou',
      d: 'Aberto, 12º andar do Dream Downtown (355 W 16th St) — mas virou coisa de MADRUGADA: quinta a sábado, 22h às 4h. Não serve mais como "drink no fim de tarde". Se a ideia for dançar, é exatamente isso.',
      f: [{ t: 'TAO Group — PHD Rooftop', u: 'https://taogroup.com/venues/phd-lounge-new-york/' }] },
    { n: 'Chelsea Market', lat: 40.7424, lng: -74.0061, prec: 'end', z: 'Chelsea', tipo: 'mercado', conf: 'nao-confirmado',
      d: 'Não confirmei a lista de lojistas, que gira bastante. O mercado em si opera. Você ama o sanduíche de pastrami e o hot dog do subsolo.', f: [] },
    { n: 'Pier 57 / Market 57', lat: 40.7448, lng: -74.0086, prec: 'end', z: 'Chelsea (Hudson River Park)', tipo: 'mercado', conf: 'aberto',
      d: '25 11th Avenue. 15 operações de comida, curadoria da James Beard Foundation. ATENÇÃO AO HORÁRIO: o mercado é 11h30 às 19h, todos os dias — não é jantar. O parque no telhado (quase 2 hectares) abre das 6h à 1h e a vista é o motivo de ir.',
      f: [{ t: 'Hudson River Park — Market 57', u: 'https://hudsonriverpark.org/activities/market-57/' }] },
    { n: 'Estiatorio Milos', lat: 40.754, lng: -74.0021, prec: 'end', z: 'Hudson Yards e Midtown', tipo: 'restaurante', conf: 'aberto',
      d: 'Os dois estão de pé, como você escreveu: Hudson Yards (20 Hudson Yards) e Midtown (W 55th). Grego, peixe, reserva necessária — está no OpenTable e no Resy.',
      f: [{ t: 'Resy — Milos Hudson Yards', u: 'https://resy.com/cities/new-york-ny/venues/estiatorio-milos-hudson-yards' },
           { t: 'Resy — Milos Midtown', u: 'https://resy.com/cities/new-york-ny/venues/estiatorio-milos-midtown' }] },
    { n: 'Mercado Little Spain', lat: 40.754, lng: -74.0014, prec: 'end', z: 'Hudson Yards', tipo: 'mercado', conf: 'nao-confirmado',
      d: 'Não consegui confirmar em fonte primária. Fica no subsolo do Hudson Yards, do José Andrés.', f: [] },

    /* --- SoHo / Downtown --- */
    { n: 'Balthazar', lat: 40.7225, lng: -73.9982, prec: 'end', z: 'SoHo', tipo: 'restaurante', conf: 'aberto',
      d: 'Aberto: 80 Spring Street. Seg–Sex 8h à meia-noite, Sáb e Dom das 9h. Brasserie do Keith McNally. Você chama de um dos seus preferidos em NY e em Londres — e o custo-benefício segue sendo o argumento.',
      f: [{ t: 'Balthazar — endereço e horários', u: 'https://balthazarny.com/contact-us/' }] },
    { n: 'Pastis', lat: 40.7404, lng: -74.0062, prec: 'end', z: 'Meatpacking', tipo: 'restaurante', conf: 'nao-confirmado',
      d: 'Não consegui confirmar o funcionamento em fonte primária. Reabriu em 2019 e a sua dica (brunch) é recente. Cheque no Resy.', f: [] },
    { n: 'Eataly', lat: 40.7418, lng: -73.9896, prec: 'end', z: 'Flatiron e World Trade Center', tipo: 'mercado', conf: 'nao-confirmado',
      d: 'Não confirmado em fonte primária. Cuidado com a confusão do roteiro: Eataly é a loja-mercado italiana; "Little Eataly" no seu texto é o bairro LITTLE ITALY, outra coisa.', f: [] },
    { n: 'Eileen’s Special Cheesecake', lat: 40.7215, lng: -73.9968, prec: 'end', z: 'Nolita', tipo: 'doce', conf: 'aberto',
      d: '17 Cleveland Place. Seg–Qui 11h–19h, Sex–Sáb 11h–20h, Dom 11h–19h. Feito à mão na padaria original, com gente que trabalha lá há mais de 40 anos. Sua dica envelheceu bem.',
      f: [{ t: 'Eileen’s — sobre', u: 'https://www.eileenscheesecake.com/about' }] },
    { n: 'Century 21', lat: 40.7101, lng: -74.0105, prec: 'end', z: 'Financial District', tipo: 'loja', conf: 'aberto',
      d: 'REABRIU. 22 Cortlandt Street, desde 2023. Quatro andares, 100 mil pés quadrados, foco em moda: masculino, feminino, infantil, calçados, bolsas, perfumaria. Seg–Sáb 9h–21h, Dom 11h–20h.',
      f: [{ t: 'Century 21 — loja e horários', u: 'https://c21stores.com/pages/contact' }] },
    { n: 'Momofuku Noodle Bar', lat: 40.7284, lng: -73.9857, prec: 'end', z: 'East Village e Columbus Circle', tipo: 'restaurante', conf: 'mudou',
      d: 'O que sobrou do Momofuku em Nova York: 171 1st Ave (East Village) e 10 Columbus Circle. O Ssäm Bar, o Nishi e o Kawi fecharam.',
      f: [{ t: 'Momofuku — Noodle Bar East Village', u: 'https://www.momofuku.com/restaurants/noodle-bar-east-village' }] },
    { n: 'HaSalon', lat: 40.762, lng: -73.993, prec: 'bairro', z: 'Hell’s Kitchen', tipo: 'restaurante', conf: 'nao-confirmado',
      d: 'Não consegui confirmar em fonte primária de 2026. MAS a sua dica não é de ouvir falar: VOCÊS FORAM em 24/01/2024, às 21h — exatamente o horário que você recomenda ("reserva para as 21h, por volta das 22:30 vira night"). Está no roteiro de Boston. Ainda assim, casa de reserva difícil também fecha: cheque no Resy antes de contar com ela.', f: [] },
    { n: 'The River Cafe', lat: 40.7036, lng: -73.9934, prec: 'end', z: 'Brooklyn (Dumbo)', tipo: 'restaurante', conf: 'nao-confirmado',
      d: 'Não confirmado. Vale lembrar sua ressalva: você achou caro e turístico, e a mamãe amou.', f: [] },

    /* --- lojas --- */
    { n: 'Anthropologie', lat: 40.7395, lng: -73.993, prec: 'bairro', z: 'vários', tipo: 'loja', conf: 'nao-confirmado', d: 'Primeira da sua lista por ordem de necessidade. Rede grande.', f: [] },
    { n: 'Williams Sonoma', lat: 40.7681, lng: -73.9827, prec: 'end', z: 'Columbus Circle e outros', tipo: 'loja', conf: 'nao-confirmado', d: 'Uma das suas preferidas; a do mall de Columbus Circle é a que você cita.', f: [] },
    { n: 'Pottery Barn', lat: 40.7395, lng: -73.994, prec: 'bairro', z: 'vários', tipo: 'loja', conf: 'nao-confirmado', d: '', f: [] },
    { n: 'Urban Outfitters', lat: 40.735, lng: -73.992, prec: 'bairro', z: 'vários', tipo: 'loja', conf: 'nao-confirmado', d: '', f: [] },
    { n: 'Crate & Barrel', lat: 40.741, lng: -73.993, prec: 'bairro', z: 'vários', tipo: 'loja', conf: 'nao-confirmado', d: '', f: [] },
    { n: 'MacKenzie-Childs', lat: 40.7256, lng: -74.0021, prec: 'end', z: 'SoHo', tipo: 'loja', conf: 'mudou',
      d: 'MUDOU DE ENDEREÇO: hoje é 410 West Broadway, no SoHo. Não é mais na Madison Avenue.',
      f: [{ t: 'MacKenzie-Childs — loja de NY', u: 'https://www.mackenzie-childs.com/on/demandware.store/Sites-MacKenzie-Childs-Site/en_US/Stores-Details?StoreID=newyork-ny' }] },
    { n: 'Bed Bath & Beyond', z: '—', tipo: 'loja', conf: 'fechado',
      d: 'Não existe mais em Nova York. As 360 lojas fecharam em 2023.',
      f: [{ t: 'Retail Dive', u: 'https://www.retaildive.com/news/bed-bath-beyond-agrees-acquire-container-store-150m/816448/' }] },
    { n: 'The Container Store', lat: 40.7413, lng: -73.9944, prec: 'end', z: 'Chelsea (629 Sixth Ave)', tipo: 'loja', conf: 'mudou',
      d: 'Aberta, mas em transição: comprada pela Bed Bath & Beyond em 2026, as lojas estão sendo rebatizadas para "The Container Store / Bed Bath & Beyond".',
      f: [{ t: 'The Container Store — Sixth Avenue', u: 'https://www.containerstore.com/stores/ny/new-york/629-sixth-avenue' }] },
    { n: 'deVOL Kitchens', lat: 40.7263, lng: -73.993, prec: 'end', z: 'NoHo', tipo: 'loja', conf: 'aberto',
      d: '28 Bond Street. O showroom inglês que você chama de "o mais lindo do mundo certeza". Está lá.',
      f: [{ t: 'deVOL — 28 Bond Street', u: 'https://www.devolkitchens.com/contact/new-york' }] },
    { n: 'Banana Republic (pé do Rockefeller)', lat: 40.7587, lng: -73.9787, prec: 'end', z: 'Midtown', tipo: 'loja', conf: 'nao-confirmado',
      d: 'A sua "melhor Banana Republic eveeeeer". Não confirmei se a unidade específica segue lá.', f: [] },
    { n: 'Whole Foods Market (Columbus Circle)', lat: 40.7681, lng: -73.9819, prec: 'end', z: 'Columbus Circle', tipo: 'mercado', conf: 'nao-confirmado',
      d: 'No subsolo do mall. Lembrete: não é 100% orgânico, ao contrário do que o roteiro diz — mas continua ótimo para montar um piquenique.', f: [] }
  ],

  /* ---------------- o que você escreveu e continua valendo inteiro ------------- */
  ouro: [
    'Reserve o jantar. Suas palavras: "MUITO ARRISCADO sair andando e escolher onde comer no jantar em NY, corre sérios riscos de voltar pro hotel e comer no frigobar." Continua sendo o melhor conselho do roteiro — só que agora com OpenTable E Resy.',
    'Reserve o almoço também, mesmo que depois vocês desistam ou mudem de ideia. Não tem problema.',
    'Olhar o cardápio na porta é normal em Nova York. Não fique constrangida — olhe à vontade, é assim que se faz.',
    'A Times Square precisa ser vista depois de anoitecer.',
    'Ponte do Brooklyn às 8h da manhã. É a única forma de pegá-la quase vazia.',
    'Andando pelo SoHo você cruza com zilhões de restaurantes, todos deliciosos. Escolha o que te agradar e divirta-se.'
  ]
};
