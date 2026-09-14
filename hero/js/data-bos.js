/* HeRo — Boston 2024 e a estrada
 *
 * ORIGEM: o roteiro do Helio e da Roberta.
 *
 * O QUE ESTE ROTEIRO É: não é uma cidade, é uma ESTRADA. Boston, Providence,
 * a costa de Connecticut, uma base na Pensilvânia, cinco dias fatiados em
 * Nova York, esqui e a devolução do carro em Newark. Dezessete dias.
 *
 * O CRUZAMENTO QUE IMPORTA: a parte de Nova York deste roteiro conversa com o
 * guia de NY. Carmine's e HaSalon aparecem aqui com ✓ — ou seja, vocês
 * jantaram nos dois em janeiro de 2024. Isso é prova de primeira mão de que
 * existiam naquela data, e está anotado nas duas fichas do guia de NY.
 *
 * PRIVACIDADE: este repositório é público. O nome da terceira pessoa que
 * aparece no roteiro original (a aula de esqui) foi deixado de fora de
 * propósito — não é meu para publicar. Se o Helio quiser, entra num pedido.
 *
 * conf: 'aberto' | 'mudou' | 'nao-confirmado'
 * feito: true (✓) | false (◦ — estava no plano e não aconteceu)
 */

const HERO_BOS = {
  id: 'bos',
  cidade: 'Boston 2024',
  pais: 'Estados Unidos · Boston, Connecticut, Nova York',
  periodo: '16 de janeiro a 1º de fevereiro de 2024',
  rota: 'Boston → Providence → East Haven → Yardley → Nova York → esqui → Newark',
  conferidoEm: '2026-09-14',
  intro: 'Dezessete dias de carro pela Nova Inglaterra, com Nova York fatiada no meio e três dias de ' +
         'neve no fim. O roteiro anota até o look de cada dia — e essa parte fica, porque é dele.',

  paradas: [
    {
      id: 'boston1', nome: 'Boston — primeiro dia', datas: '16/01',
      hotel: { n: 'Fairmont Copley Plaza', conf: 'aberto',
        d: 'ABERTO. Back Bay, 383 quartos, a "Grand Dame" de Boston. O roteiro diz só "Fairmont", e em Boston ' +
           'houve dois — o Battery Wharf fechou. Pela posição de tudo o que vocês fizeram no dia seguinte ' +
           '(View Boston, Newbury Street, Eataly, todos em Back Bay), só pode ser o Copley Plaza.' },
      lugares: [
        { n: 'Tatte Bakery', lat: 42.3490, lng: -71.0810, prec: 'bairro', tipo: 'café da manhã', feito: true, nota: null, voce: '',
          conf: 'aberto', d: 'A rede nasceu de uma banca de feira em Brookline e hoje tem dezenas de cafés em Boston, ' +
          'Cambridge, Brookline e Newton. O roteiro não diz qual unidade.', f: [] },
        { n: 'Boston Common', lat: 42.3550, lng: -71.0656, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Boston Harbor e Aquário', lat: 42.3592, lng: -71.0499, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: 'New England Aquarium, no Central Wharf.', f: [] },
        { n: 'Quincy Market', lat: 42.3600, lng: -71.0545, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: '',
          conf: 'aberto',
          d: 'ABERTO e em alta. Faz 200 ANOS em 2026, e a ocupação das lojas do térreo subiu de 76% em 2024 ' +
             '(quando vocês passaram) para 85% agora. Mais de 25 casas de comida e 40 lojas. A cidade tem um ' +
             'plano de revitalização em curso, com foco em atrair morador e não só turista.',
          f: [{ t: 'PR Newswire — Quincy Market faz 200 anos', u: 'https://www.prnewswire.com/news-releases/faneuil-hall-marketplace-celebrates-200-years-of-quincy-market-302859704.html' },
               { t: 'Axios Boston — o plano de revitalização', u: 'https://www.axios.com/local/boston/2026/03/24/faneuil-hall-marketplace-revitalization-boston-wu-downtown-tourists-locals' }] },
        { n: 'Museum of Science', lat: 42.3675, lng: -71.0710, prec: 'end', tipo: 'museu', feito: true, nota: null, voce: 'entrada 15h', conf: 'aberto', d: '', f: [] }
      ]
    },
    {
      id: 'boston2', nome: 'Boston — segundo dia', datas: '17/01',
      hotel: { n: 'Fairmont Copley Plaza', conf: 'aberto', d: '' },
      lugares: [
        { n: 'View Boston (Prudential Center)', lat: 42.3473, lng: -71.0821, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '',
          conf: 'aberto',
          d: 'ABERTO. Ocupa os três últimos andares da Prudential Tower, 360 graus a 228 metros, com deck ' +
             'coberto e descoberto. O próprio Fairmont vende pacote com ingresso incluído.',
          f: [{ t: 'Fairmont Copley Plaza — pacote com o View Boston', u: 'https://www.fairmont.com/en/hotels/boston/fairmont-copley-plaza/offers/a-room-with-a-view-boston.html' }] },
        { n: 'Freedom Trail', lat: 42.3550, lng: -71.0656, prec: 'end', tipo: 'passeio', feito: true, nota: null,
          voce: 'Vai do Boston Common até a Old North Church, no North End, e o Bunker Hill Monument, em Charlestown',
          conf: 'aberto', d: 'Sua própria descrição da rota continua exata. São 4 km de linha vermelha no chão.', f: [] },
        { n: 'Old North Church', lat: 42.3663, lng: -71.0544, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Bunker Hill Monument', lat: 42.3764, lng: -71.0608, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Eataly Boston', lat: 42.3475, lng: -71.0820, prec: 'end', tipo: 'mercado', feito: true, nota: null, voce: '',
          conf: 'aberto',
          d: 'ABERTO: 800 Boylston St, dentro do Prudential Center. Quatro mil metros quadrados em três andares — ' +
             'quatro restaurantes, açougue, peixaria, massa fresca, confeitaria, queijos, dois cafés, padaria, ' +
             'laboratório de mussarela e gelateria. Ocupou o lugar da antiga praça de alimentação do shopping.',
          f: [{ t: 'Prudential Center — Eataly', u: 'https://www.prudentialcenter.com/eat/directory/eataly/' }] },
        { n: 'Newbury Street', lat: 42.3500, lng: -71.0850, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Harvard', lat: 42.3744, lng: -71.1169, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: 'Vocês voltaram lá no dia seguinte também.', f: [] },
        { n: 'Legal Sea Foods', lat: 42.3479, lng: -71.0820, prec: 'end', tipo: 'jantar', feito: true, nota: null, voce: '',
          conf: 'aberto',
          d: 'A marca está viva: foi vendida à PPX Hospitality em dezembro de 2020 e hoje opera 26 casas em cinco ' +
             'estados, a maioria na Grande Boston. ATENÇÃO para quem repetir: a unidade de Harvard Square FECHOU ' +
             'em 2020 e não voltou. O roteiro não diz qual vocês usaram.',
          f: [{ t: 'Legal Sea Foods — site', u: 'https://www.legalseafoods.com/' },
               { t: 'Nation’s Restaurant News — a venda para a PPX', u: 'https://www.nrn.com/casual-dining/boston-landmark-legal-sea-foods-sold-to-ppx-hospitality' }] }
      ]
    },
    {
      id: 'estrada', nome: 'A estrada: Providence e Connecticut', datas: '18 a 19/01',
      hotel: { n: 'Home2 Suites by Hilton, East Haven (CT)', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Providence', lat: 41.8240, lng: -71.4128, prec: 'cidade', tipo: 'almoço', feito: true, nota: null, voce: 'opções salvas',
          conf: 'aberto', d: 'A parada de almoço na saída de Boston. O roteiro não diz onde vocês comeram.', f: [] },
        { n: 'Narragansett', lat: 41.4501, lng: -71.4495, prec: 'cidade', tipo: 'passeio', feito: false, nota: null, voce: '',
          conf: 'aberto', d: 'Ficou de fora. Praia de Rhode Island — em janeiro, compreensível.', f: [] },
        { n: 'New Haven', lat: 41.3083, lng: -72.9279, prec: 'cidade', tipo: 'passeio', feito: false, nota: null, voce: '',
          conf: 'aberto', d: 'Ficou de fora — e é a cidade da Yale, e da pizza de New Haven, que tem fama própria.', f: [] }
      ]
    },
    {
      id: 'yardley', nome: 'Base em Yardley, Pensilvânia', datas: '19 a 23/01',
      hotel: { n: 'Base na Pensilvânia', conf: 'nao-confirmado', d: 'O ponto fixo da viagem, de onde saíram para Nova York e para o esqui.' },
      lugares: [
        { n: 'Retail 101 (o "outlet Anthropologie" de Shelton)', lat: 41.3100, lng: -73.1300, prec: 'end', tipo: 'compras', feito: true, nota: null,
          voce: 'Shelton. OUTLET ANTHROPOLOGIE',
          conf: 'mudou',
          d: 'CORREÇÃO DE NOME: não é outlet oficial da Anthropologie. Chama-se RETAIL 101, fica em 20 Constitution ' +
             'Blvd, Shelton (CT), e é um galpão que vende sobras, mostruário, devolução e excesso de estoque da ' +
             'Anthropologie, Urban Outfitters, Free People e Nuuly, com desconto grande. É o "outlet não oficial" ' +
             'dessas marcas em Connecticut. Se procurar "Anthropologie Outlet Shelton" no mapa, pode não achar.',
          f: [{ t: 'Yelp — Retail 101, Shelton CT', u: 'https://www.yelp.com/biz/retail-101-shelton-2' }] }
      ]
    },
    {
      id: 'nyc', nome: 'Nova York', datas: '23 a 25/01',
      hotel: { n: 'Hotel em Nova York', conf: 'nao-confirmado', d: 'Ida de trem desde a Pensilvânia — ambos marcados com ◦ no roteiro.' },
      lugares: [
        { n: 'Broadway — Harry Potter', lat: 40.7573, lng: -73.9878, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'sessão 18h30',
          conf: 'nao-confirmado', d: '"Harry Potter and the Cursed Child", no Lyric Theatre, na 43rd.', f: [] },
        { n: 'Carmine’s', lat: 40.7576, lng: -73.9873, prec: 'end', tipo: 'jantar', feito: true, nota: null, voce: 'jantar 22h',
          conf: 'nao-confirmado',
          d: 'PROVA DE PRIMEIRA MÃO: vocês jantaram aqui em 23/01/2024, depois do teatro. Existia com certeza ' +
             'naquela data. Não achei fonte de 2026 — por isso o carimbo continua "não confirmado", e não "aberto". ' +
             'No guia de Nova York ele aparece como recomendação sua; aqui aparece como fato vivido.', f: [] },
        { n: 'HaSalon', lat: 40.7620, lng: -73.9930, prec: 'bairro', tipo: 'jantar', feito: true, nota: null, voce: 'noite de 24/01, 21h',
          conf: 'nao-confirmado',
          d: 'PROVA DE PRIMEIRA MÃO: vocês foram em 24/01/2024, às 21h — exatamente o horário que você recomenda ' +
             'no guia de Nova York ("reserva para as 21h, por volta das 22:30 vira night"). A recomendação não é ' +
             'de ouvir falar: é de ter ido.', f: [] },
        { n: 'One World Observatory', lat: 40.7130, lng: -74.0134, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Financial District', lat: 40.7075, lng: -74.0110, prec: 'bairro', tipo: 'passeio', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Museu de História Natural', lat: 40.7813, lng: -73.9740, prec: 'end', tipo: 'museu', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Central Park', lat: 40.7700, lng: -73.9750, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Patinação no Rockefeller Center', lat: 40.7587, lng: -73.9787, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: 'marcar horário',
          conf: 'aberto', d: 'FICOU DE FORA — e era janeiro, a única época em que a pista existe. Vocês até anotaram que precisava marcar.', f: [] },
        { n: 'Summit One Vanderbilt', lat: 40.7527, lng: -73.9785, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: 'ou World Trade Center?',
          conf: 'aberto', d: 'Ficou de fora, e ficou até sem decisão: o roteiro tem a pergunta em aberto.', f: [] },
        { n: 'Mercer', lat: 40.7248, lng: -73.9985, prec: 'end', tipo: 'almoço', feito: false, nota: null, voce: '', conf: 'nao-confirmado', d: 'Ficou de fora. No SoHo.', f: [] }
      ]
    },
    {
      id: 'ski', nome: 'Esqui e volta', datas: '27/01 a 1º/02',
      hotel: { n: 'Hotel na montanha', conf: 'nao-confirmado', d: 'O roteiro não nomeia a estação.' },
      lugares: [
        { n: 'Aula de esqui', lat: null, lng: null, prec: null, tipo: 'passeio', feito: true, nota: null, voce: 'aula para dois, e lift',
          conf: 'nao-confirmado', d: 'O roteiro não diz onde. Se você lembrar a estação, eu completo a ficha e ponho no mapa.', f: [] },
        { n: 'Esquiar de fato', lat: null, lng: null, prec: null, tipo: 'passeio', feito: false, nota: null, voce: '',
          conf: 'nao-confirmado',
          d: 'Detalhe que vale um sorriso: "Hotel ✓, Aula ✓, Lift ✓, Ski ◦". Tudo pronto e a descida ficou sem ✓.', f: [] },
        { n: 'Devolução do carro — Newark', lat: 40.6895, lng: -74.1745, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '',
          conf: 'aberto', d: 'Último item do roteiro, sem ✓ — mas o carro certamente voltou.', f: [] }
      ]
    }
  ],

  reparos: [
    {
      t: 'Este roteiro prova duas recomendações do guia de Nova York',
      d: 'Carmine’s e HaSalon estão aqui com ✓, em 23 e 24 de janeiro de 2024. No guia de NY os dois ' +
         'estavam marcados como "não confirmados" porque eu não achei fonte de 2026. Continuam assim — ida em ' +
         '2024 não prova porta aberta em 2026 —, mas agora as duas fichas dizem que VOCÊS foram. ' +
         'E a sua dica do HaSalon ("reserve para as 21h") é literalmente o horário que vocês reservaram.'
    },
    {
      t: 'O "outlet Anthropologie" de Shelton tem outro nome',
      d: 'É a Retail 101, em 20 Constitution Blvd. Não é loja oficial da marca — é um galpão de sobras, ' +
         'mostruário e devolução da Anthropologie, Urban Outfitters, Free People e Nuuly. Procurar pelo nome ' +
         'errado no mapa não acha.'
    },
    {
      t: 'Quincy Market está melhor do que quando vocês foram',
      d: 'A ocupação das lojas do térreo era 76% em 2024 e hoje é 85%. O mercado faz 200 anos em 2026 e a ' +
         'prefeitura tem um plano de revitalização em andamento, com foco declarado em atrair morador de Boston, ' +
         'não só turista.'
    },
    {
      t: 'Nova York ficou pela metade',
      d: 'Dos onze itens planejados para os dois dias, seis ficaram de fora — incluindo a patinação no ' +
         'Rockefeller, que só existe no inverno, e o Summit One Vanderbilt, que nem chegou a ser decidido. ' +
         'O que aconteceu foi o essencial: o teatro e os dois jantares.'
    },
    {
      t: 'Um nome ficou de fora deste arquivo',
      d: 'O roteiro original cita uma terceira pessoa na aula de esqui. Este repositório é público, e nome de ' +
         'gente não é meu para publicar — deixei como "aula para dois". Se você quiser o nome no app, é um pedido só.'
    },
    {
      t: 'Os looks ficaram',
      d: 'Três dias do roteiro anotam a roupa escolhida: "calça jeans, malha canelada preta e sobretudo preto". ' +
         'Não tem nada para conferir nisso, e é exatamente por isso que fica — é a parte mais humana do arquivo.'
    }
  ],

  looks: [
    { d: '16/01', l: 'Calça jeans, malha canelada preta e sobretudo preto.' },
    { d: '17/01', l: 'Calça jeans preta, cinto, malha off, sobretudo preto.' },
    { d: '18/01', l: 'Calça jeans cinza, moletom e sobretudo preto.' }
  ]
};
