/* HeRo — os "perfect spots" de foto, para a Roberta.
 *
 * Pesquisado em 18/09/2026. Regra da casa vale aqui também: onde eu não
 * confirmei, está escrito que não confirmei.
 *
 * COORDENADAS: servem para medir distância e ordenar o radar. Elas são boas
 * para isso e NÃO são boas para navegar até a porta — por isso cada ficha tem
 * o botão que abre o Google Maps pelo NOME do lugar, que é quem sabe o
 * endereço exato. `prec` diz o que a coordenada realmente é.
 *
 * `obvio: false` é o que o Helio pediu de verdade: o que ninguém posta.
 */

const HERO_FOTOS = {
  atualizado: '2026-09-18',

  regras: [
    { t: 'Taj Mahal: tripé e drone PROIBIDOS', d: 'Celular e câmera de mão entram. Tripé, monopé, iluminação e drone, não — drone é proibido inclusive no entorno. E dentro do mausoléu principal NÃO se fotografa: o guarda manda guardar. Jardim, portal e espelho d’água são liberados. Fecha às sextas; vocês vão domingo, está aberto.' },
    { t: 'No Catar, pessoa não se fotografa sem permissão', d: 'Especialmente mulheres, e especialmente famílias locais. Não é etiqueta, é regra séria — pode dar problema real. Prédio, comida, paisagem e vocês dois: à vontade.' },
    { t: 'Panna Meena ka Kund: não se pisa na escada', d: 'A foto é de cima, da borda. Turista não sobe nos degraus; tem quem suborne o guarda, e isso danifica a estrutura. A imagem boa é a diagonal vista de cima, e não precisa descer.' },
    { t: 'Monumento na Índia costuma cobrar taxa de câmera', d: 'Celular em geral é livre; câmera "profissional" às vezes paga à parte na bilheteria. Pergunte antes de entrar em vez de discutir depois.' }
  ],

  spots: [
    /* ---------------- DELHI ---------------- */
    { n: 'Humayun’s Tomb', c: 'Delhi', obvio: true, lat: 28.5933, lng: 77.2507, prec: 'end',
      busca: 'Humayun’s Tomb, New Delhi',
      q: 'O ensaio do Taj Mahal, 60 anos antes. Arenito vermelho, simetria total, e muito menos gente.',
      a: 'Não fotografe o túmulo de frente do meio do gramado — é a foto de todo mundo. Entre pelo portão oeste e use o ARCO DO PORTAL como moldura: a Roberta parada no vão escuro, o mausoléu nítido ao fundo. O contraste entre a sombra do arco e o vermelho ao sol é o que faz a imagem.',
      h: 'Fim de tarde. O sol bate de frente no arenito e ele fica laranja.' },

    { n: 'Agrasen ki Baoli', c: 'Delhi', obvio: false, lat: 28.6266, lng: 77.2250, prec: 'end',
      busca: 'Agrasen ki Baoli, New Delhi',
      q: 'Poço-escada do século 14 escondido entre arranha-céus, a cinco minutos de Connaught Place. 108 degraus descendo no escuro. Quase ninguém que vai a Delhi sabe que existe.',
      a: 'A foto é DE BAIXO PARA CIMA. Desça uns dois terços, vire para a entrada e enquadre as escadas fugindo para o alto com a Roberta pequena no meio do quadro. As linhas convergem sozinhas. A segunda foto boa é da borda de cima, na diagonal, pegando as arcadas laterais em repetição.',
      h: 'Meio-dia, ao contrário de tudo o mais. É a única hora em que a luz chega ao fundo do poço.' },

    { n: 'Lodhi Art District', c: 'Delhi', obvio: false, lat: 28.5828, lng: 77.2261, prec: 'bairro',
      busca: 'Lodhi Art District, Lodhi Colony, New Delhi',
      q: 'O primeiro bairro-galeria a céu aberto da Índia. Murais enormes nos blocos residenciais de Lodhi Colony — cor saturada, zero turista.',
      a: 'Erro clássico: chegar perto do mural. Afaste-se e deixe a Roberta PEQUENA contra a parede inteira — a escala é a graça. Roupa lisa de cor contrastante com o mural. Ande pelos blocos: cada esquina tem um artista diferente.',
      h: 'Manhã. Depois das 11h o sol estoura as cores e cria sombra dura de poste no meio da parede.' },

    { n: 'Jama Masjid e Chandni Chowk', c: 'Delhi', obvio: true, lat: 28.6507, lng: 77.2334, prec: 'end',
      busca: 'Jama Masjid, Old Delhi',
      q: 'A maior mesquita da Índia e o caos fotogênico da Velha Delhi ao redor.',
      a: 'Suba o MINARETE SUL (taxa à parte). De lá sai a única foto que mostra o pátio inteiro com a cidade atrás — e é uma vista que quase ninguém sobe para ver. No pátio, fotografe de baixo pegando as três cúpulas alinhadas com a escadaria.',
      h: 'Fim de tarde, antes da oração do pôr do sol.',
      r: 'Ombros e joelhos cobertos. Emprestam capa na entrada. Descalço no pátio.' },

    { n: 'Lodhi Garden', c: 'Delhi', obvio: false, lat: 28.5933, lng: 77.2197, prec: 'end',
      busca: 'Lodhi Gardens, New Delhi',
      q: 'Túmulos do século 15 espalhados num parque onde Delhi vai correr. Verde, neblina de manhã, e ninguém pagando ingresso.',
      a: 'O Bara Gumbad visto por entre os troncos, com névoa baixa. Setembro ainda tem umidade de manhã cedo, e é isso que dá a camada de atmosfera que a foto de monumento seco não tem.',
      h: 'Entre 6h30 e 8h. Depois disso vira parque comum.' },

    /* ---------------- AGRA ---------------- */
    { n: 'Taj Mahal — o banco da Diana', c: 'Agra', obvio: true, lat: 27.1751, lng: 78.0421, prec: 'end',
      busca: 'Taj Mahal, Agra',
      q: 'O banco de mármore onde a princesa Diana posou em 1992. É A foto, e por isso tem fila.',
      a: 'Chegue no PORTÃO ANTES DE ABRIR. Quem entra primeiro tem o banco vazio por uns 10 minutos, e só. Câmera baixa, na altura do banco, para o espelho d’água entrar inteiro e duplicar a cúpula. Sem vento a água fica de espelho.',
      h: 'Nascer do sol. O Taj é voltado para o leste: a primeira luz bate de frente e o mármore acende por dentro.',
      r: 'Sem tripé. Domingo (20/09) está aberto — fecha só às sextas.' },

    { n: 'Taj Mahal — os arcos da mesquita', c: 'Agra', obvio: false, lat: 27.1747, lng: 78.0408, prec: 'end',
      busca: 'Kau Ban Mosque, Taj Mahal, Agra',
      q: 'As duas construções de arenito vermelho dos lados do Taj. Quase todo mundo passa reto — e é onde está a melhor foto do lugar.',
      a: 'Entre na mesquita a OESTE e ande até os corredores laterais. Cada arco é uma moldura pronta: o vermelho escuro emoldurando o branco lá fora. Posicione a Roberta na sombra do arco, exponha pelo Taj, e ela vira silhueta contra o mármore. É a foto que ninguém do grupo vai ter.',
      h: 'Meia hora depois do nascer do sol, quando a luz já entra nos corredores.' },

    { n: 'Mehtab Bagh — o Taj do outro lado do rio', c: 'Agra', obvio: false, lat: 27.1795, lng: 78.0422, prec: 'end',
      busca: 'Mehtab Bagh, Agra',
      q: 'O jardim ao norte, atravessando o Yamuna. O Taj inteiro, de trás, sem multidão nenhuma, com o rio no primeiro plano.',
      a: 'É a foto de PÔR DO SOL do Taj — impossível de conseguir de dentro, porque lá dentro o sol está atrás dele. Daqui ele fica iluminado de frente e alaranjado. Enquadre com o rio embaixo; se a água estiver parada, sai reflexo.',
      h: 'Última hora antes do pôr do sol.',
      r: 'Ingresso próprio, separado do Taj. Vale a corrida de carro.' },

    { n: 'Forte de Agra — Musamman Burj', c: 'Agra', obvio: false, lat: 27.1795, lng: 78.0211, prec: 'end',
      busca: 'Musamman Burj, Agra Fort',
      q: 'A torre de mármore onde Shah Jahan foi preso pelo filho e passou os últimos anos olhando o Taj que construiu para a mulher. A vista é essa.',
      a: 'Fotografe o Taj ao longe EMOLDURADO pelo arco recortado da torre — o mármore branco trabalhado em primeiro plano, desfocado, e o Taj minúsculo e nítido ao fundo. É a foto mais carregada de história da viagem inteira, e quase ninguém sabe a história.',
      h: 'Meio da tarde, com bruma. A distância dá camadas.' },

    /* ---------------- JAIPUR ---------------- */
    { n: 'Patrika Gate', c: 'Jaipur', obvio: false, lat: 26.8362, lng: 75.8055, prec: 'end',
      busca: 'Patrika Gate, Jawahar Circle, Jaipur',
      q: 'Oito arcos, cada um pintado de uma cor e de um tema diferente, do chão ao teto. Construído em 2016, fica longe do centro e por isso a maioria dos roteiros pula.',
      a: 'Fique no EIXO CENTRAL do corredor e fotografe de frente: os arcos se repetem em perspectiva e a simetria é perfeita. A Roberta no meio, de costas ou andando, roupa lisa e forte. Depois faça uma fechada num arco só, com ela encostada na parede pintada — a cor invade o retrato inteiro.',
      h: 'Logo ao amanhecer. Depois das 9h aparece fila de gente fazendo exatamente essa foto.',
      r: 'Entrada gratuita. Fica no Jawahar Circle, uns 20 min do centro.' },

    { n: 'Panna Meena ka Kund', c: 'Jaipur', obvio: false, lat: 26.9971, lng: 75.8508, prec: 'end',
      busca: 'Panna Meena ka Kund, Amer, Jaipur',
      q: 'Poço-escada do século 16 com escadas em zigue-zague que se cruzam nos quatro lados. Geometria pura, a 5 minutos do Forte Amer.',
      a: 'De cima, da borda, na DIAGONAL — nunca de frente. Na diagonal o padrão em ziguezague vira gráfico abstrato e preenche o quadro inteiro. A Roberta fica na borda de cima, não nos degraus.',
      h: 'Manhã cedo, antes de ir ao Forte Amer. Aproveita que já está no caminho.',
      r: 'NÃO se pisa nas escadas. Sério.' },

    { n: 'Hawa Mahal — do café em frente', c: 'Jaipur', obvio: true, lat: 26.9239, lng: 75.8267, prec: 'end',
      busca: 'Wind View Cafe, Hawa Mahal, Jaipur',
      q: 'A fachada rosa de 953 janelinhas. A foto da rua tem fio elétrico, tuk-tuk e trânsito atravessando.',
      a: 'ATRAVESSE A RUA e suba no Wind View Cafe ou no Tattoo Cafe, no terraço do prédio da frente. Dali você fica na altura da fachada, acima dos fios e do trânsito, e sai a foto limpa — com um chai na mão, que é o enquadramento que funciona no Instagram.',
      h: 'Entre 7h e 9h: o sol nasce de frente para a fachada e o rosa fica intenso. Wind View fecha às 20h, Tattoo Cafe às 23h.' },

    { n: 'City Palace — Pritam Niwas Chowk', c: 'Jaipur', obvio: true, lat: 26.9255, lng: 75.8236, prec: 'end',
      busca: 'Pritam Niwas Chowk, City Palace, Jaipur',
      q: 'O pátio das quatro portas, uma para cada estação. A do Pavão é a mais fotografada da Índia depois do Taj.',
      a: 'A Porta do Pavão é a óbvia e vai ter fila. A jogada é a PORTA VERDE (Leheriya, a da primavera) e a PORTA ROSA (Lótus): quase vazias, e a cor é mais fotogênica que a do pavão. Fique centralizado, enquadre só o vão da porta, sem chão nem céu.',
      h: 'Logo na abertura. O pátio enche rápido.' },

    { n: 'Forte Amer — Ganesh Pol e Sheesh Mahal', c: 'Jaipur', obvio: true, lat: 26.9855, lng: 75.8513, prec: 'end',
      busca: 'Amer Fort, Jaipur',
      q: 'Fortaleza de arenito e mármore na montanha. O Sheesh Mahal é coberto de milhares de espelhinhos.',
      a: 'No Ganesh Pol, afaste-se e enquadre o portão inteiro com a Roberta minúscula na base — o portão tem três andares e a escala é o assunto. No Sheesh Mahal, encoste o celular quase na parede de espelhos e fotografe o REFLEXO dela fragmentado em centenas de pedaços.',
      h: 'Abertura, às 8h. Às 10h chegam os ônibus.' },

    { n: 'Forte Nahargarh no pôr do sol', c: 'Jaipur', obvio: false, lat: 26.9374, lng: 75.8153, prec: 'end',
      busca: 'Nahargarh Fort, Jaipur',
      q: 'O forte na crista da montanha, de onde se vê Jaipur inteira. É para onde os moradores vão ver o sol cair — não os turistas.',
      a: 'Não fotografe o forte: fotografe DE DENTRO DELE para fora. Roberta sentada na muralha, de costas, a cidade rosa inteira embaixo e o sol descendo atrás. É a foto de fim de dia da viagem.',
      h: 'Chegue uma hora antes do pôr do sol. A subida é de carro.' },

    { n: 'Jal Mahal', c: 'Jaipur', obvio: true, lat: 26.9535, lng: 75.8463, prec: 'end',
      busca: 'Jal Mahal, Jaipur',
      q: 'O palácio no meio do lago. Não se visita por dentro — é só para olhar, e é o que basta.',
      a: 'Da margem, ao amanhecer, com o lago liso: sai o reflexo completo e a foto fica espelhada. Se houver bruma, melhor ainda — o palácio parece flutuar no nada. Está na estrada para Amer, dá para parar no caminho.',
      h: 'Nascer do sol, antes do vento levantar.' },

    /* ---------------- MUMBAI ---------------- */
    { n: 'Gateway of India e Taj Mahal Palace', c: 'Mumbai', obvio: true, lat: 18.9220, lng: 72.8347, prec: 'end',
      busca: 'Gateway of India, Mumbai',
      q: 'O arco de 1924 de frente para o mar árabe, com o hotel Taj do lado. É o cartão-postal de Mumbai.',
      a: 'Você tem pouco tempo entre reuniões, então: um enquadramento só, de longe, com o arco e a cúpula do Taj JUNTOS no mesmo quadro. Separados, viram foto de cartão-postal; juntos, viram Mumbai.',
      h: 'Você chega 10h45 e sai 22h35 — se sobrar uma janela, o fim de tarde vale muito mais que o meio-dia.' },

    /* ---------------- DOHA ---------------- */
    { n: 'Museu de Arte Islâmica — a escadaria', c: 'Doha', obvio: true, lat: 25.2952, lng: 51.5392, prec: 'end',
      busca: 'Museum of Islamic Art, Doha',
      q: 'O prédio do I. M. Pei numa ilha artificial. O átrio central tem uma escadaria dupla sob um óculo geométrico.',
      a: 'Suba ao último andar e fotografe a escadaria DE CIMA, olhando para baixo: a curva dupla vira espiral e o padrão do óculo fecha o quadro. Depois vá à janela do 5º andar — ela emoldura West Bay inteira como se fosse um quadro pendurado na parede.',
      h: 'Abertura, para o átrio vazio. A janela de West Bay é melhor no fim da tarde.' },

    { n: 'A escultura "7", de Richard Serra', c: 'Doha', obvio: false, lat: 25.2913, lng: 51.5433, prec: 'end',
      busca: '7 by Richard Serra, MIA Park, Doha',
      q: 'Sete chapas de aço de 24 metros no parque do museu, à beira d’água. A obra pública mais alta do Catar, e a mais alta que Serra já fez. Fica a 5 minutos do museu e quase ninguém do circuito turístico vai.',
      a: 'Entre DENTRO da escultura (ela é oca) e fotografe para cima: as sete chapas convergem e recortam um heptágono de céu. É uma imagem que não parece uma foto de viagem. A segunda: de longe, com a Roberta na base, mostrando os 24 metros contra o skyline.',
      h: 'Fim de tarde — o aço enferrujado fica cor de laranja queimado com o sol baixo.' },

    { n: 'Museu Nacional do Catar — a rosa do deserto', c: 'Doha', obvio: true, lat: 25.2867, lng: 51.5510, prec: 'end',
      busca: 'National Museum of Qatar, Doha',
      q: 'O prédio do Jean Nouvel: 316 discos de concreto que se cruzam, imitando a cristalização da rosa do deserto.',
      a: 'Nunca de frente — de frente vira uma massa branca sem leitura. Vá para uma QUINA e fotografe na diagonal, onde os discos se atravessam: aparecem as sombras entre as placas e a forma fica legível. Fotografe também de baixo, encostado, com um disco cortando o quadro inteiro.',
      h: 'Meio da tarde, para sombra marcada entre os discos. E logo depois do pôr do sol, quando acende a iluminação.' },

    { n: 'Msheireb Downtown', c: 'Doha', obvio: false, lat: 25.2870, lng: 51.5250, prec: 'bairro',
      busca: 'Msheireb Downtown Doha',
      q: 'Um bairro inteiro reconstruído em pedra bege, com torres de vento e vielas sombreadas. É o contrário absoluto do vidro de West Bay — e está a 10 minutos do Souq.',
      a: 'O assunto aqui é GEOMETRIA E SOMBRA, não monumento. Procure as vielas onde a treliça do teto risca o chão e a parede: coloque a Roberta na faixa de sol entre duas sombras. Roupa clara contra pedra bege, tudo num tom só. É a foto mais "editorial" que vocês vão tirar na viagem.',
      h: 'Golden hour, meia hora antes do pôr do sol. As sombras ficam compridas e a pedra vira dourada.' },

    { n: 'Souq Waqif — o beco das lanternas', c: 'Doha', obvio: true, lat: 25.2875, lng: 51.5333, prec: 'end',
      busca: 'Souq Waqif, Doha',
      q: 'O mercado antigo. De dia é comércio; de noite é cenário.',
      a: 'Vá DEPOIS DAS 20h. Procure os becos das lanternas e o corredor das especiarias — a luz quente vem das próprias lojas e não precisa de flash (flash mata essa foto). Enquadre o beco em fuga, com a Roberta andando de costas. O souq dos falcões é o assunto que ninguém tem no feed.',
      h: 'A partir das 20h, quando acende tudo e a temperatura cai.',
      r: 'Não fotografe pessoas sem pedir. Vale o dobro aqui.' },

    { n: 'Corniche — o skyline de West Bay', c: 'Doha', obvio: true, lat: 25.2970, lng: 51.5310, prec: 'bairro',
      busca: 'Doha Corniche',
      q: 'Os 7 km de calçadão curvo em frente à baía, olhando para as torres.',
      a: 'A foto é na HORA AZUL — aqueles 20 minutos depois do pôr do sol em que o céu fica azul-cobalto e as torres já estão acesas. Antes disso o céu queima; depois fica preto. Se houver um dhow de madeira ancorado no primeiro plano, é ele que faz a foto: tradicional na frente, futurista atrás.',
      h: '20 a 30 minutos DEPOIS do pôr do sol. Marque no relógio.' },

    { n: 'Katara — as torres de pombos', c: 'Doha', obvio: false, lat: 25.3594, lng: 51.5252, prec: 'end',
      busca: 'Katara Cultural Village, Doha',
      q: 'Vila cultural com anfiteatro grego à beira-mar, uma mesquita dourada e as torres de pombos em barro — que é o que ninguém fotografa.',
      a: 'As TORRES DE POMBOS, de baixo para cima contra o céu: as varetas de madeira saindo do barro criam um padrão que parece escultura contemporânea. E o anfiteatro vazio, do palco olhando para as arquibancadas com o mar atrás.',
      h: 'Fim de tarde. O barro fica cor de mel.' }
  ]
};
