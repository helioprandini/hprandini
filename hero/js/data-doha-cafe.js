/* HeRo — café da manhã em Doha.
 *
 * Nasceu de uma busca no mapa feita em 29/09/2026, com o Helio já hospedado no
 * Park Hyatt. As notas e o número de avaliações vêm dali (Google). Os HORÁRIOS
 * eu confirmei um a um onde consegui — e onde não consegui está escrito.
 *
 * DISTÂNCIA: não está escrita à mão. O app calcula pela coordenada, a partir da
 * base (o Park Hyatt), com a mesma função das fichas de restaurante. Msheireb é
 * um bairro compacto e as coordenadas são de QUARTEIRÃO, não de porta — por isso
 * cada ficha tem o botão de rota, que é quem sabe o caminho real.
 */

const HERO_CAFE = {
  atualizado: '2026-09-29',
  nota: 'Ordenado pela distância a pé do Park Hyatt. Msheireb resolve quase tudo sem táxi.',

  lugares: [
    /* ---------- dentro do hotel ---------- */
    { n: 'Opus', casa: 'Park Hyatt Doha', bairro: 'Msheireb', lat: 25.2880, lng: 51.5245, prec: 'end',
      busca: 'Opus Park Hyatt Doha',
      hora: 'Café da manhã todos os dias', horaConf: 'parcial',
      horaNota: 'As fontes divergem: a Hyatt publica 7h–11h, uma resenha registra 6h30–10h30. Confirme na recepção — é no seu andar térreo, custa nada perguntar.',
      q: 'O restaurante do seu próprio hotel. Cozinha francesa e qatari assinada pelo chef do Park Hyatt Paris–Vendôme.',
      porque: 'Se o café estiver incluído na diária, esta é a resposta e acabou. Vale conferir antes de sair andando atrás de padaria.',
      voto: false },

    { n: 'Anis Cafe', casa: 'Park Hyatt Doha, térreo', bairro: 'Msheireb', lat: 25.2880, lng: 51.5245, prec: 'end',
      busca: 'Anis Cafe Msheireb Doha',
      hora: 'Abre 8h', horaConf: 'nao-confirmado',
      q: 'Café de rua no térreo do próprio Park Hyatt, aberto ao bairro. Café, bolo, smoothie, sanduíche e salada, tudo feito no dia, com opções orgânicas e sem glúten.',
      porque: 'Zero passos e não é buffet de hotel. É o meio-termo entre descer de pijama e sair para a rua.',
      tel: '+97440094344',
      voto: false },

    /* ---------- a pé, em Msheireb ---------- */
    { n: 'Rusk Artisanal Bakery', casa: null, bairro: 'Msheireb Downtown', lat: 25.2872, lng: 51.5262, prec: 'bairro',
      busca: 'Rusk Artisanal Bakery Msheireb Doha',
      hora: 'Dom–Qua 6h–22h30 · Qui–Sáb 6h–23h30', horaConf: 'confirmado',
      q: 'Padaria artesanal de verdade, num canto quieto de Msheireb. 4,6 com mais de 3 mil avaliações — os croissants são o que mais aparece nos comentários.',
      porque: 'ABRE ÀS 6H, a única da lista que abre cedo assim. E tem café da manhã completo o dia inteiro: french toast, shakshuka, focaccia de massa madre com burrata. Se for uma só, é esta.',
      voto: true },

    { n: 'Savant Cafe', casa: null, bairro: 'Msheireb', lat: 25.2878, lng: 51.5255, prec: 'bairro',
      busca: 'Savant Cafe Msheireb Doha',
      hora: 'Abre 7h', horaConf: 'nao-confirmado',
      q: 'Café no meio de Msheireb, 4,7 com mil avaliações. Brioche benedict com abacate e uma vitrine de patisserie séria.',
      porque: 'O melhor café da lista para tomar sentado sem pressa. Ambiente tranquilo é o que os comentários mais citam.',
      voto: false },

    { n: 'Era Restaurant & Cafe', casa: null, bairro: 'Msheireb', lat: 25.2884, lng: 51.5251, prec: 'bairro',
      busca: 'Era Restaurant Cafe Msheireb Doha',
      hora: 'Abre 8h', horaConf: 'nao-confirmado',
      q: 'Restaurante-café em Msheireb, 4,4 com 545 avaliações. O avocado toast é o que ficou famoso.',
      porque: 'Dois minutos do hotel. É a opção de café da manhã que também funciona como almoço cedo.',
      voto: false },

    { n: 'The Buttery Bakery', casa: 'Msheireb Galleria, Edifício 33', bairro: 'Msheireb', lat: 25.2866, lng: 51.5252, prec: 'bairro',
      busca: 'The Buttery Bakery Msheireb Galleria Doha',
      hora: 'Seg–Qua 8h–22h · Qui–Sáb 8h–23h · Dom 8h–22h', horaConf: 'confirmado',
      q: 'Padaria-café na galeria de Msheireb. Nota 4,2, a mais baixa da lista — e mesmo assim entra, por um motivo só.',
      porque: 'O cinnamon roll. É o carro-chefe e é o que leva as pessoas lá. Vá pelo doce, não pelo café da manhã completo.',
      voto: false },

    { n: 'The Mandarin Cake Shop', casa: 'Mandarin Oriental Doha', bairro: 'Msheireb', lat: 25.2857, lng: 51.5247, prec: 'bairro',
      busca: 'Mandarin Cake Shop Mandarin Oriental Doha',
      hora: 'Abre 9h', horaConf: 'nao-confirmado',
      q: 'Confeitaria do Mandarin Oriental, do outro lado de Msheireb.',
      porque: 'Só abre às 9h, então não serve para sair cedo. Vale se a manhã for preguiçosa e vocês quiserem doce bom.',
      voto: false },

    { n: 'Le Colonial', casa: 'Al Wadi Hotel — MGallery', bairro: 'Msheireb', lat: 25.2895, lng: 51.5268, prec: 'bairro',
      busca: 'Le Colonial Al Wadi Hotel MGallery Doha',
      hora: 'Buffet 6h–11h', horaConf: 'nao-confirmado',
      q: 'Buffet de café da manhã do hotel Al Wadi, a cinco minutos a pé.',
      porque: 'Se a vontade for buffet grande de hotel e o Opus não estiver incluído, é a alternativa mais perto. O Al Wadi é o hotel que apareceu na sua pesquisa de Doha com nota 9,6.',
      voto: false },

    { n: 'Maison Kayser', casa: null, bairro: 'Al Khaleej St', lat: 25.2940, lng: 51.5330, prec: 'bairro',
      busca: 'Maison Kayser Doha',
      hora: 'Abre 7h', horaConf: 'nao-confirmado',
      q: 'Boulangerie francesa da rede do Eric Kayser. Nota 4,9 — a mais alta da lista, ainda que com poucas avaliações (93).',
      porque: 'É pão de verdade, fermentação longa, do jeito francês. Uns 13 minutos a pé ou 4 de táxi. Vá se o assunto for PÃO, não café da manhã montado.',
      voto: true },

    /* ---------- de carro, fora de Msheireb ---------- */
    { n: 'La Parisienne', casa: 'InterContinental Doha The City', bairro: 'West Bay', lat: 25.3195, lng: 51.5310, prec: 'bairro',
      busca: 'La Parisienne Doha InterContinental The City',
      hora: 'Abre 7h', horaConf: 'nao-confirmado',
      q: 'Café francês no InterContinental, 4,8 com 1.250 avaliações. Tem combo de café da manhã fechado.',
      porque: 'O café da manhã francês mais completo de Doha. Uns 10 minutos de táxi.',
      voto: false },

    { n: 'Twisted Olive & Naama’s Garden', casa: 'Doha Tower', bairro: 'West Bay', lat: 25.3210, lng: 51.5305, prec: 'bairro',
      busca: 'Twisted Olive Naama Garden Doha Tower',
      hora: 'Abre 7h', horaConf: 'nao-confirmado',
      q: 'Jardim na base da Doha Tower. 4,8 com mais de 9 mil avaliações — de longe o mais popular da lista.',
      porque: 'É o lugar bonito. Se a ideia é café da manhã que rende foto para a Roberta, é este. Combina com a aba de fotos: West Bay de manhã.',
      voto: false },

    { n: 'The Camel Cafe', casa: null, bairro: 'West Bay', lat: 25.3200, lng: 51.5290, prec: 'bairro',
      busca: 'The Camel Cafe West Bay Doha',
      hora: 'Abre 7h · FECHA ÀS SEGUNDAS', horaConf: 'parcial',
      q: 'Cafeteria pequena em West Bay, 4,8 com 84 avaliações. Bagels.',
      porque: 'O único bagel decente da lista. Confira o dia: fecha às segundas.',
      voto: false },

    { n: 'The Kitchen', casa: 'Hilton The Pearl', bairro: 'The Pearl', lat: 25.3710, lng: 51.5490, prec: 'bairro',
      busca: 'The Kitchen Hilton The Pearl Doha',
      hora: 'Abre 7h', horaConf: 'nao-confirmado',
      q: 'Café da manhã completo no Hilton da Pearl. 4,7 com 1.523 avaliações.',
      porque: 'Só faz sentido se vocês já forem passar a manhã na Pearl. São uns 20 minutos de táxi.',
      voto: false },

    { n: 'Karak Mqanes Signature', casa: null, bairro: 'Porto Arabia, The Pearl', lat: 25.3690, lng: 51.5500, prec: 'bairro',
      busca: 'Karak Mqanes Signature Porto Arabia Doha',
      hora: 'Abre 7h', horaConf: 'nao-confirmado',
      q: 'Karak com halloumi, à beira da marina. 4,3 com 1.884 avaliações.',
      porque: 'É o café da manhã QATARI — karak é o chá com leite condensado que todo mundo toma aqui, e custa uma fração do resto da lista. Se quiserem comer como local uma vez, é aqui.',
      voto: true }
  ],

  fontes: [
    { t: 'Rusk — horários e menu de café da manhã', u: 'https://mp-mdd.com/poi-details/-/poi/20006' },
    { t: 'The Buttery Bakery — Msheireb Galleria', u: 'https://mp-mdd.com/poi-details/-/poi/84001' },
    { t: 'Park Hyatt Doha — restaurantes e café da manhã', u: 'https://www.hyatt.com/park-hyatt/en-US/dohph-park-hyatt-doha/dining' },
    { t: 'Anis Cafe — o que é e onde fica', u: 'https://www.tripadvisor.com/Restaurant_Review-g294009-d23133905-Reviews-Anis_Cafe-Doha.html' },
    { t: 'Time Out Doha — padarias da cidade', u: 'https://www.timeoutdoha.com/food-drink/bakeries-in-doha' }
  ]
};
