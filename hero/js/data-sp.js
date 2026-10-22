/* HeRo — São Paulo
 *
 * ORIGEM: as respostas do Helio, em 22/10/2026, a dez perguntas por OCASIÃO.
 * Ele não tinha lista pronta, e lista era a forma errada de pedir: exige que
 * a pessoa se organize antes de escrever. Perguntar por ocasião tirou dez
 * nomes em dois minutos de digitação.
 *
 * POR QUE SÃO PAULO É DIFERENTE DOS OUTROS DESTINOS DAQUI:
 * os outros são viagens que ele fez. São Paulo é onde ele mora — então não
 * se organiza por dia, e sim por OCASIÃO. "Jantar para impressionar" não é
 * um ponto no mapa, é uma pergunta que o amigo visitante faz.
 *
 * O QUE É DELE E O QUE É MEU:
 *   - o nome do lugar e a ocasião: DELE. É o que nenhum guia tem.
 *   - endereço, bairro, horário, preço: MEU, pesquisado em 22/10/2026.
 *
 * REGRA DESTE ARQUIVO, a mesma de Doha e de Nova York: nada inventado.
 *   conf: 'aberto'         -> confirmado em fonte citada
 *   conf: 'mudou'          -> existe, mas endereço/formato mudou
 *   conf: 'nao-confirmado' -> NÃO confirmei. Pode estar certo. Nunca
 *                             apresentar como verificado.
 *
 * SOBRE PREÇO: nenhum preço foi confirmado em fonte primária nesta rodada.
 * Por isso TODOS estão como 'nao-confirmado'. Não há faixa de preço
 * chutada neste arquivo — a regra da casa é que preço inventado é pior
 * que preço ausente.
 *
 * SOBRE AS COORDENADAS: os sites oficiais estão bloqueados pelo proxy deste
 * ambiente, então não houve geocodificação. As coordenadas vêm do bairro e
 * da rua, e estão TODAS carimbadas prec:'bairro' — servem para ordenar por
 * proximidade, nunca para navegar. A navegação sai pelo nome, no Google Maps.
 */

const HERO_SP = {
  id: 'sp',
  cidade: 'São Paulo',
  pais: 'Brasil',
  conferidoEm: '2026-10-22',
  autoria: 'As escolhas e o julgamento são do Helio. A conferência de endereço e horário é minha.',

  /* A base das distâncias é um ponto PÚBLICO, de propósito: este repositório
     é público, e a casa dele não entra no GitHub. O MASP, na Paulista, fica
     a poucos minutos dos Jardins e serve de régua honesta. */
  base: {
    nome: 'Av. Paulista, altura do MASP',
    lat: -23.5614,
    lng: -46.6559,
    nota: 'Ponto público de referência, não é endereço de ninguém. As distâncias do app são medidas daqui.'
  },

  /* ---------------------------------------------------------------
     O FILTRO — a resposta 9, que não é um lugar e por isso vale mais
     --------------------------------------------------------------- */
  filtro: {
    t: 'O filtro do Helio',
    chamada: 'Perguntei o que ele evita. A resposta não foi um restaurante — foram três critérios. Isso filtra o app inteiro.',
    criterios: [
      { n: 'Comida sem tempero', d: 'O erro mais comum de casa caríssima: ingrediente bonito, prato sem sal. Preço alto não compra sabor.' },
      { n: 'Serviço ruim', d: 'Não é formalidade, é atenção. Casa que esquece a mesa perde, mesmo acertando o prato.' },
      { n: 'Gente chata', d: 'Isto é sobre o PÚBLICO, não sobre quem atende. Casa onde o salão é desfile não entra.' }
    ],
    consequencia: 'Reparem no que os dez nomes têm em comum: nenhum é casa de ver e ser visto. É um padrão, não coincidência — e é por isso que esta lista não se parece com ranking de revista.'
  },

  /* ---------------------------------------------------------------
     AS OCASIÕES — a espinha do destino
     --------------------------------------------------------------- */
  ocasioes: [
    { id: 'impressionar', q: 'Jantar para impressionar alguém', lugar: 'ping-yang', emoji: '🪷',
      d: 'Tailandês do chef Maurício Santi, nos Jardins. Escolha interessante para "impressionar": não é a steakhouse nem o italiano óbvio — é comida de tempero forte, que é justamente o oposto do primeiro critério do filtro dele.' },
    { id: 'negocio', q: 'Almoço de negócio, perto de casa', lugar: 'santino', emoji: '🍝',
      d: 'Trattoria do chef Rodolfo de Santis, no Itaim. Casa nova (abriu em julho de 2026) e descrita como italiano arrumado de preço amigável — o que é exatamente o perfil de almoço de trabalho.' },
    { id: 'sempre', q: 'O de sempre, ele e a Roberta, sem pensar', lugar: 'zdeli-lorena', emoji: '🥪',
      d: 'O voto de confiança do casal. Deli nova-iorquina nos Jardins. Vale saber que tem DUAS caras: a casa da Alameda Lorena é restaurante, e as outras unidades são sanduíche de balcão.' },
    { id: 'carne', q: 'Carne', lugar: 'ntmu', emoji: '🥩',
      d: 'NTMU é "Nice to Meat U", no Jardim Europa. Steakhouse de corte na brasa, não é rodízio.' },
    { id: 'japones', q: 'Japonês', lugar: 'nori-vaz', emoji: '🍣',
      d: 'Casa de temaki do chef Wdson Vaz, na Augusta. Daí o "Vaz" do nome — não é rua, é o sobrenome do chef.' },
    { id: 'padaria', q: 'Padaria e café da manhã', lugar: 'fabrique', emoji: '🥐',
      d: 'Padaria de fermentação natural. A matriz é em Higienópolis. Atenção: não encontrei unidade nos Jardins nem em Pinheiros — está na lista de pendências.' },
    { id: 'bar', q: 'Bar para tomar uma', lugar: 'vaca-veia-itaim', emoji: '🍺',
      d: 'Boteco de esquina no Itaim. Tem uma segunda unidade em Pinheiros, com avaliação bem pior de atendimento — importa saber qual é a dele.' },
    { id: 'cantina', q: 'Cantina, comfort food', lugar: 'jardim-di-napoli', emoji: '🧆',
      d: 'Aberta desde 1949, em Higienópolis. É A casa do polpettone à parmegiana de São Paulo — tem fila na porta por causa de um prato só.' },
    { id: 'passeio', q: 'O passeio que ele leva visitante', lugar: 'casa-do-porco', emoji: '🐖',
      d: 'E repare que a resposta dele não foi um ponto turístico: foi ALMOÇAR na Casa do Porco. Para quem vem de fora, a cidade se explica melhor na mesa que no mirante — e esse é o jeito mais paulistano possível de receber alguém.' }
  ],

  /* ---------------------------------------------------------------
     OS LUGARES, um a um
     --------------------------------------------------------------- */
  lugares: [
    {
      id: 'ping-yang', n: 'Ping Yang Thai Bar & Food',
      lat: -23.5578, lng: -46.6672, prec: 'bairro', z: 'Jardins (Cerqueira César)',
      tipo: 'tailandês', conf: 'aberto', ocasiao: 'Jantar para impressionar',
      end: 'R. Dr. Melo Alves, 767',
      hora: 'As fontes divergem. Uma diz segunda a sábado, 19h às 23h; outra separa os dias (quinta e sexta até 23h45, sábado também almoça 12h30–16h).',
      horaConf: 'parcial',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Cozinha tailandesa do chef Maurício Santi. Aparece na lista 50Best Discovery, o que é um sinal razoável de que a casa está viva e relevante.',
      atencao: 'A grafia é PING Yang, com i. Você escreveu "Pyng" — se procurar assim no mapa, pode não achar.',
      f: [
        { t: 'CNN Brasil — Ping Yang, a viciante culinária tailandesa do chef Maurício Santi', u: 'https://www.cnnbrasil.com.br/viagemegastronomia/gastronomia/ping-yang-a-viciante-culinaria-tailandesa-do-chef-mauricio-santi-em-sao-paulo/' },
        { t: '50Best Discovery — Ping Yang Thai Bar & Food', u: 'https://www.theworlds50best.com/discovery/Establishments/Brazil/S%C3%A3o-Paulo/Ping-Yang-Thai-Bar-and-Food.html' }
      ]
    },
    {
      id: 'santino', n: 'Santino Trattoria',
      lat: -23.5855, lng: -46.6805, prec: 'bairro', z: 'Itaim Bibi',
      tipo: 'italiano', conf: 'aberto', ocasiao: 'Almoço de negócio',
      end: 'R. Adolfo Tabacow, 173 — esquina perto da Faria Lima',
      hora: 'Abre para almoço e jantar. As fontes divergem no detalhe: uma dá almoço de terça a quinta começando 11h45, outra diz segunda a sábado almoço e jantar, domingo só de dia.',
      horaConf: 'parcial',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Do chef Rodolfo de Santis, que voltou ao Itaim depois de mais de dois anos fora de cozinha. Casa nova: abriu em julho de 2026. A imprensa descreve como "italiano classudo de preços amigáveis" — o perfil certo para almoço de trabalho.',
      atencao: 'É no ITAIM, não nos Jardins. Se o seu almoço de negócio é na região da Paulista, são uns 15 minutos de carro, não é na esquina.',
      f: [
        { t: 'Taste and Fly — Rodolfo de Santis inaugura o Santino no Itaim', u: 'https://www.tasteandfly.com.br/chef-rodolfo-de-santis-inaugura-o-santino-no-itaim-italiano-classudo-de-precos-amigaveis/' },
        { t: 'Espaces — Santino Trattoria (Itaim Bibi)', u: 'https://espaces.com.br/santino-trattoria' }
      ]
    },
    {
      id: 'zdeli-lorena', n: 'Z Deli — Restaurante & Delicatessen',
      lat: -23.5646, lng: -46.6690, prec: 'bairro', z: 'Jardim Paulista',
      tipo: 'deli / restaurante', conf: 'aberto', ocasiao: 'O de sempre',
      end: 'Al. Lorena, 1689',
      hora: 'Seg a qui 12h à 0h · sex e sáb 8h–11h e 12h à 1h · dom 8h–11h e 12h à 0h',
      horaConf: 'parcial',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Esta é a unidade RESTAURANTE, a que aceita reserva. Café da manhã judaico-nova-iorquino de sexta a domingo, 8h às 11h — e isso é só aqui, não existe nas unidades de sanduíche.',
      atencao: 'Se "o de sempre" para vocês é o sanduíche de balcão, então o lugar é outro: a unidade da Oscar Freire. Vale me dizer qual.',
      f: [
        { t: 'CNN Brasil — Z Deli Restaurante, uma deli nova-iorquina reinventada', u: 'https://www.cnnbrasil.com.br/viagemegastronomia/gastronomia/z-deli-restaurante-uma-deli-nova-iorquina-reinventada-em-sao-paulo/' },
        { t: 'Gastronominho — o café da manhã judaico-nova-iorquino nos Jardins', u: 'https://gastronominho.com.br/comidas/2026/10/z-deli-cafe-da-manha-judaico-jardins/' }
      ]
    },
    {
      id: 'zdeli-oscar', n: 'Z Deli Sandwiches — Jardins',
      lat: -23.5600, lng: -46.6625, prec: 'bairro', z: 'Jardins',
      tipo: 'sanduíche', conf: 'mudou', ocasiao: 'O de sempre (versão balcão)',
      end: 'R. Oscar Freire, 164',
      hora: 'Não confirmado.',
      horaConf: 'nao-confirmado',
      preco: null, precoNota: 'nao-confirmado',
      d: 'A casa de sanduíche. Carimbei como "mudou" por um motivo concreto: matérias e diretórios ainda mandam para a Rua Haddock Lobo, 1386, que é endereço ANTIGO e não aparece mais na listagem oficial. Se alguém te indicar a Haddock Lobo, vai andar à toa.',
      atencao: 'Sem café da manhã — esse é só na Alameda Lorena.',
      f: [
        { t: 'Apple Maps — Z DELI Sandwiches, Jardins', u: 'https://maps.apple.com/place?place-id=I3E5FB8871C780F7A' },
        { t: 'CNN Brasil — Z Deli Sandwich Shop (cita o endereço antigo)', u: 'https://www.cnnbrasil.com.br/viagemegastronomia/gastronomia/z-deli-sanduiche/' }
      ]
    },
    {
      id: 'ntmu', n: 'NTMU Steakhouse (Nice to Meat U)',
      lat: -23.5767, lng: -46.6796, prec: 'bairro', z: 'Jardim Europa',
      tipo: 'carne', conf: 'aberto', ocasiao: 'Carne',
      end: 'R. Amauri, 40',
      hora: 'O horário que achei é da abertura, em 2018: ter a sex 12h–15h30 e 19h–0h30 · sáb 12h à 0h · dom 12h–19h. Oito anos é tempo demais para confiar — confirme.',
      horaConf: 'nao-confirmado',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Steakhouse de corte na brasa, feito na hora: assado de tira, bife de chorizo, entrecôte e chorizo wagyu nos cortes especiais. Não é rodízio.',
      atencao: 'Dois telefones circulam nos diretórios — (11) 2737-9007 é o que mais aparece. Confirme antes de ligar para reservar.',
      f: [
        { t: 'Sabor à Vida — Nice to Meat U abre em São Paulo com churrasco como protagonista', u: 'https://www.saboravida.com.br/gastronomia/2018/10/17/nice-to-meat-u-abre-em-sao-paulo-com-churrasco-como-protagonista/' },
        { t: 'BaresSP — Nice To Meat U (NTMU) Steakhouse', u: 'https://www.baressp.com.br/restaurantes/churrascarias/nice-to-meat-u-ntmu-steakhouse' }
      ]
    },
    {
      id: 'nori-vaz', n: 'Nori Vaz',
      lat: -23.5597, lng: -46.6672, prec: 'bairro', z: 'Cerqueira César (Augusta)',
      tipo: 'japonês · temaki', conf: 'aberto', ocasiao: 'Japonês',
      end: 'R. Augusta, 2542, loja 04',
      hora: 'Ter a sex 12h–14h30 e 19h–23h · sáb 12h–15h e 19h–23h · dom 12h–16h30. Dado de matéria com cerca de 9 meses.',
      horaConf: 'parcial',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Casa de hand roll do chef Wdson Vaz. O "Vaz" do nome é o sobrenome do chef, não o nome de uma rua — procurar "rua Vaz" não leva a lugar nenhum.',
      atencao: 'Existem outros "Nori" em São Paulo, no Vila Carrão e na Rua Juno. São casas diferentes, sem relação.',
      f: [
        { t: 'Get In — Nori Vaz (reservas)', u: 'https://www.getin.app/sao-paulo/nori-vaz' },
        { t: 'CNPJ.biz — Nori Vaz Participações (endereço registrado)', u: 'https://cnpj.biz/61584740000107' }
      ]
    },
    {
      id: 'fabrique', n: 'Fabrique Pão e Café — Higienópolis',
      lat: -23.5425, lng: -46.6565, prec: 'bairro', z: 'Higienópolis',
      tipo: 'padaria', conf: 'aberto', ocasiao: 'Padaria e café da manhã',
      end: 'R. Itacolomi, 612 (matriz)',
      hora: 'Um guia dá todos os dias, 7h às 21h. Uma fonte só — trate como indício.',
      horaConf: 'nao-confirmado',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Padaria artesanal de fermentação natural. Esta é a matriz. Há unidade confirmada na Vila Romana (R. Faustolo, 553) e uma na Santa Cecília (R. Conselheiro Brotero, 860) que aparece só em diretório antigo.',
      atencao: 'PENDÊNCIA REAL: procurei e NÃO existe Fabrique nos Jardins, em Pinheiros nem na Oscar Freire. Ou a sua é a de Higienópolis, ou é outra padaria com nome parecido. Preciso que você me diga.',
      f: [
        { t: 'Guia da Semana — padarias artesanais em São Paulo', u: 'https://www.guiadasemana.com.br/restaurantes/noticia/padarias-artesanais-em-sao-paulo' },
        { t: 'Giraí — Padaria Fabrique Pão e Café', u: 'https://www.girai.com.br/restaurantes/fabrique-pao-e-cafe/' }
      ]
    },
    {
      id: 'vaca-veia-itaim', n: 'Vaca Véia — Itaim',
      lat: -23.5866, lng: -46.6760, prec: 'bairro', z: 'Itaim Bibi',
      tipo: 'bar', conf: 'aberto', ocasiao: 'Bar para tomar uma',
      end: 'R. Manuel Guedes, 199 — esquina com a Pedroso Alvarenga',
      hora: 'Não confirmado.',
      horaConf: 'nao-confirmado',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Boteco de esquina, casa de happy hour. É o endereço principal da marca.',
      atencao: 'Existe uma segunda unidade, em Pinheiros (R. Ferreira de Araújo, 271), e ela tem reclamação recorrente de atendimento. Como "serviço ruim" é um dos seus três critérios, importa saber qual das duas é a sua.',
      f: [
        { t: 'Giraí — Bar Vaca Véia', u: 'https://www.girai.com.br/bares/vaca-veia/' },
        { t: 'BaresSP — Vaca Véia, Itaim Bibi', u: 'https://www.baressp.com.br/bares/vaca-veia' }
      ]
    },
    {
      id: 'vaca-veia-pinheiros', n: 'Vaca Véia — Pinheiros',
      lat: -23.5676, lng: -46.6945, prec: 'bairro', z: 'Pinheiros',
      tipo: 'bar', conf: 'nao-confirmado', ocasiao: 'Bar (a outra unidade)',
      end: 'R. Ferreira de Araújo, 271',
      hora: 'Não confirmado.',
      horaConf: 'nao-confirmado',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Está aqui só para você não cair nela por engano achando que é a do Itaim. As avaliações públicas desta unidade são ruins, com reclamação de atendimento.',
      atencao: 'Não é recomendação. É aviso de homônimo.',
      f: [
        { t: 'Apple Maps — Vaca Véia Pinheiros', u: 'https://maps.apple.com/place?place-id=ID3A3738F4DB7354B' }
      ]
    },
    {
      id: 'jardim-di-napoli', n: 'Jardim di Napoli',
      lat: -23.5425, lng: -46.6525, prec: 'bairro', z: 'Higienópolis',
      tipo: 'cantina italiana', conf: 'aberto', ocasiao: 'Cantina, comfort food',
      end: 'R. Dr. Martinico Prado, 463',
      hora: 'Não confirmado. O único horário que apareceu na busca vinha com endereço diferente, então descartei em vez de passar errado.',
      horaConf: 'nao-confirmado',
      preco: null, precoNota: 'nao-confirmado',
      d: 'Aberta desde 1949, em Higienópolis desde 1968. O polpettone à parmegiana virou símbolo da cantina paulistana — e é por causa de UM prato que existe fila na porta.',
      atencao: 'Alguns guias dizem Vila Buarque em vez de Higienópolis: é a mesma casa, a fronteira dos bairros passa ali. E não achei confirmação de que aceite reserva — conte com fila.',
      f: [
        { t: 'Gazeta SP — Jardim de Napoli e o polpettone que se tornou símbolo', u: 'https://www.gazetasp.com.br/entretenimento/polpettone-jardim-de-napoli/' },
        { t: 'BaresSP — Jardim de Napoli', u: 'https://www.baressp.com.br/restaurantes/italianos/jardim-de-napoli' }
      ]
    },
    {
      id: 'casa-do-porco', n: 'A Casa do Porco',
      lat: -23.5455, lng: -46.6425, prec: 'bairro', z: 'Centro (República)',
      tipo: 'brasileiro', conf: 'aberto', ocasiao: 'O passeio com visitante',
      end: 'R. Araújo, 124',
      hora: 'Guia Michelin: seg a sáb 12h às 23h · dom 12h às 17h.',
      horaConf: 'parcial',
      preco: null, precoNota: 'nao-confirmado',
      d: 'A casa de Jefferson e Janaína Rueda. Está no Michelin e é o restaurante mais disputado do Brasil — e a sua resposta para "o que levar visitante" foi almoçar aqui, não um mirante.',
      atencao: 'A REGRA DE ENTRADA É O PONTO CRÍTICO, e ela muda. Veja o bloco "Como entrar" abaixo.',
      f: [
        { t: 'Guia Michelin — A Casa do Porco', u: 'https://guide.michelin.com/br/pt_BR/sao-paulo-region/sao-paulo/restaurant/a-casa-do-porco' },
        { t: 'Mundo Viajar — como fazer reserva na Casa do Porco', u: 'https://mundoviajar.com.br/como-fazer-reserva-no-restaurante-a-casa-do-porco/' }
      ]
    }
  ],

  /* ---------------------------------------------------------------
     COMO ENTRAR NA CASA DO PORCO — o único lugar da lista onde a
     logística decide se você come ou não
     --------------------------------------------------------------- */
  porco: {
    t: 'Casa do Porco: como entrar',
    chamada: 'Levar visitante aqui só dá certo se você resolver a entrada ANTES. Não é restaurante de aparecer e sentar.',
    aviso: 'Não consegui abrir o site oficial daqui (o proxy deste ambiente bloqueia), então tudo abaixo vem de fontes de terceiros, de datas diferentes, e ELAS DIVERGEM. Confirme em acasadoporco.com.br antes de prometer a mesa para alguém.',
    caminhos: [
      {
        n: 'Reserva pelo site',
        d: 'O relato mais consistente é que as mesas do mês seguinte abrem no começo de cada mês, pelo site oficial, e que fim de semana esgota em minutos. Entrar no site no dia da abertura, ao meio-dia, é a recomendação que mais aparece.',
        conf: 'nao-confirmado'
      },
      {
        n: 'Lista de desistência',
        d: 'Perdeu a abertura: há relato de lista de espera por e-mail para mesas liberadas. Vale entrar e monitorar a caixa.',
        conf: 'nao-confirmado'
      },
      {
        n: 'Fila por ordem de chegada',
        d: 'A fila continua existindo. Relatos convergem em chegar por volta de 11h30, antes de abrir. Em fim de semana há relato de espera passando de 3 horas.',
        conf: 'nao-confirmado'
      },
      {
        n: 'O balcão, se o objetivo é só provar',
        d: 'Para quem não quer encarar o salão, há a opção de pegar sanduíche no balcão de comida rápida da casa. Não é a mesma experiência, mas resolve a curiosidade.',
        conf: 'nao-confirmado'
      }
    ],
    taxa: 'Uma fonte de cerca de dois anos menciona taxa de R$ 100 na reserva, devolvida no dia. NÃO confirmei que isso ainda valha — trate como dúvida, não como fato.',
    voto: 'Se for levar visitante: dia de semana, reserva aberta no primeiro dia do mês. Fila de sábado com alguém que veio de fora é o jeito mais rápido de transformar o seu melhor programa em três horas de pé.'
  },

  /* ---------------------------------------------------------------
     PENDÊNCIAS — o que só o Helio resolve. Ficam na tela de propósito:
     pendência escondida vira dado errado no mês seguinte.
     --------------------------------------------------------------- */
  pendencias: [
    { q: 'Fabrique: qual é a sua?', d: 'Não existe unidade nos Jardins nem em Pinheiros. A matriz é em Higienópolis (R. Itacolomi, 612). É essa, é a da Vila Romana, ou é outra padaria?' },
    { q: 'Vaca Véia: Itaim ou Pinheiros?', d: 'Registrei o Itaim como a principal. A de Pinheiros tem reclamação de atendimento — e serviço ruim é um dos seus três critérios.' },
    { q: 'Z Deli: restaurante ou balcão?', d: 'O "de sempre" é a casa da Alameda Lorena (restaurante, com café da manhã no fim de semana) ou o sanduíche da Oscar Freire?' },
    { q: 'Santino é o Trattoria do Itaim?', d: 'É o único Santino que achei em São Paulo, e abriu em julho de 2026. Se o seu é mais antigo, é outra casa e eu errei o lugar.' },
    { q: 'Falta a Roberta nesta lista', d: 'As dez respostas são suas. Os lugares dela podem ser outros — e o app ganha se as duas curadorias estiverem separadas, não misturadas.' },
    { q: 'Preço: nenhum confirmado', d: 'Nesta rodada não pesquisei faixa de preço em fonte primária, então não há nenhuma neste arquivo. Posso fazer essa passada separada.' }
  ]
};
