/* HeRo — Europa 2025 (Espanha, Andorra, Portugal e França)
 *
 * ORIGEM: o roteiro do Helio e da Roberta, com as notas dadas na hora.
 *
 * A DATA: o roteiro se chama "Europa 2025", mas os dias da semana anotados
 * ("15/01 - Quinta", "16/01 - Sexta") batem com JANEIRO DE 2026. Ou seja:
 * 30/12/2025 a 21/01/2026. É uma viagem de oito meses atrás, não de dois anos.
 * Consequência prática: quase nada teve tempo de fechar — o valor aqui é a
 * organização e os avisos práticos, não a caça a casa morta.
 *
 * conf: 'aberto' | 'mudou' | 'nao-confirmado'   (mesma régua dos outros)
 * feito: true (✓ no original) | false (◦ — estava no plano e não aconteceu)
 */

const HERO_EU25 = {
  id: 'eu25',
  cidade: 'Europa 2025',
  pais: 'Espanha · Andorra · Portugal · França',
  periodo: '30/12/2025 a 21/01/2026',
  rota: 'Madri → Zaragoza → Lleida → Andorra → Barcelona → Lisboa → Paris → Londres',
  conferidoEm: '2026-09-14',
  intro: 'Réveillon em Madri, três dias de esqui em Andorra, Barcelona, Lisboa e uma semana em Paris ' +
         'que é quase um roteiro à parte. Vinte e três dias, quatro países e um dia perdido de cama.',

  paradas: [
    {
      id: 'madri', nome: 'Madri', datas: '31/12 a 03/01',
      hotel: { n: 'Airbnb (malas às 14h no dia 31)', conf: 'nao-confirmado', d: 'Ceia de Ano Novo preparada em casa.' },
      lugares: [
        { n: 'Gran Vía', lat: 40.4200, lng: -3.7025, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Puerta de Alcalá', lat: 40.4199, lng: -3.6889, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Puerta del Sol', lat: 40.4168, lng: -3.7038, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Mercado de San Miguel', lat: 40.4155, lng: -3.7090, prec: 'end', tipo: 'mercado', feito: true, nota: 10, voce: '10/10',
          conf: 'aberto',
          d: 'ABERTO — e vocês pegaram os últimos dias por um triz. O mercado FECHOU em 7 de janeiro de 2026, ' +
             'poucos dias depois de vocês passarem, para reforço estrutural da fundação, e só reabriu em 26 de ' +
             'fevereiro. Está de volta, com mais de 30 bancas, todos os dias do ano, entrada franca.',
          f: [{ t: 'El Español — a reabertura após as obras', u: 'https://www.elespanol.com/madrid/ocio/20260226/central-valencia-boqueria-barcelona-mercado-espectacular-espana-reabre-madrid-trt/1003744147104_0.html' },
               { t: 'esMadrid — Mercado de San Miguel', u: 'https://www.esmadrid.com/en/shopping/mercado-de-san-miguel' }] },
        { n: 'Plaza Mayor', lat: 40.4155, lng: -3.7074, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Bernabéu Market', lat: 40.4531, lng: -3.6883, prec: 'end', tipo: 'almoço', feito: true, nota: 6, voce: '6/10',
          conf: 'nao-confirmado', d: 'A nota mais baixa de Madri. No estádio Santiago Bernabéu.', f: [] },
        { n: 'Bairro de Salamanca', lat: 40.4290, lng: -3.6830, prec: 'bairro', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Parque del Retiro', lat: 40.4153, lng: -3.6844, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Mercado de la Paz', lat: 40.4265, lng: -3.6845, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: 'almoço (com interrogação no roteiro)', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Primark Gran Vía', lat: 40.4200, lng: -3.7050, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Casa Juan', lat: 40.4240, lng: -3.7020, prec: 'cidade', tipo: 'jantar', feito: true, nota: 9, voce: '9/10 — jantar 20:30',
          conf: 'nao-confirmado', d: 'A melhor nota de Madri. Não achei fonte primária; se você lembrar do endereço, eu completo.', f: [] },
        { n: 'Palacio Real de Madrid', lat: 40.4180, lng: -3.7143, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Templo de Debod', lat: 40.4240, lng: -3.7178, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: 'para o pôr do sol', conf: 'aberto', d: 'Ficou de fora — e era o pôr do sol de Madri.', f: [] },
        { n: 'Museo del Prado', lat: 40.4138, lng: -3.6921, prec: 'end', tipo: 'museu', feito: false, nota: null, voce: 'chegar 17:30, entrada Puerta de los Jerónimos ou Puerta de Goya',
          conf: 'aberto', d: 'FICOU DE FORA. Vocês tinham até escolhido a porta de entrada.', f: [] },
        { n: 'Lumiers Chimney Cake', lat: 40.4170, lng: -3.7060, prec: 'cidade', tipo: 'doce', feito: false, nota: null, voce: '', conf: 'nao-confirmado', d: 'Ficou de fora.', f: [] }
      ]
    },
    {
      id: 'zaragoza', nome: 'Zaragoza e Lleida', datas: '03/01 · carro pego na cidade',
      hotel: { n: 'Hotel em Lleida (Hotéis.com)', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'El Corte Inglés (Zaragoza)', lat: 41.6420, lng: -0.8880, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Mercado Central de Zaragoza', lat: 41.6570, lng: -0.8800, prec: 'end', tipo: 'mercado', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Crudo Taberna Gastronómica', lat: 41.6560, lng: -0.8790, prec: 'cidade', tipo: 'almoço', feito: false, nota: null, voce: '', conf: 'nao-confirmado', d: 'Ficou de fora.', f: [] },
        { n: 'Basílica del Pilar', lat: 41.6563, lng: -0.8783, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Catedral de San Salvador (La Seo)', lat: 41.6560, lng: -0.8760, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Palacio de la Aljafería', lat: 41.6563, lng: -0.8960, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] },
        { n: 'Puente de Piedra e rio Ebro', lat: 41.6580, lng: -0.8790, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '', conf: 'aberto', d: 'Ficou de fora.', f: [] }
      ]
    },
    {
      id: 'andorra', nome: 'Andorra', datas: '04 a 07/01 · três dias de esqui',
      hotel: { n: 'Hotel em Andorra (Hotéis.com)', conf: 'nao-confirmado', d: 'Aluguel de roupa e de esqui na chegada.' },
      lugares: [
        { n: 'Demasie', lat: 42.5075, lng: 1.5210, prec: 'cidade', tipo: 'doce', feito: true, nota: null, voce: '',
          conf: 'nao-confirmado', d: 'A única parada de comida anotada em Andorra — o resto foi pista.', f: [] }
      ]
    },
    {
      id: 'barcelona', nome: 'Barcelona', datas: '07 a 11/01',
      hotel: { n: 'Apartamento (reserva Verbo)', conf: 'nao-confirmado', d: 'Com cozinha — dois dos jantares foram em casa.' },
      lugares: [
        { n: 'Las Ramblas', lat: 41.3809, lng: 2.1730, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Mercado de la Boqueria', lat: 41.3818, lng: 2.1717, prec: 'end', tipo: 'mercado', feito: true, nota: 10, voce: '10/10',
          conf: 'nao-confirmado', d: 'Nota máxima. Não confirmei em fonte primária, mas é um dos mercados mais conhecidos da Europa.', f: [] },
        { n: 'Bairro Gòtic', lat: 41.3833, lng: 2.1770, prec: 'bairro', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Catedral de Barcelona', lat: 41.3840, lng: 2.1762, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Basílica de Santa Maria del Mar', lat: 41.3839, lng: 2.1819, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'El Born', lat: 41.3850, lng: 2.1820, prec: 'bairro', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'El Glop', lat: 41.4030, lng: 2.1560, prec: 'cidade', tipo: 'jantar', feito: true, nota: 5, voce: '5/10',
          conf: 'nao-confirmado', d: 'A pior nota da Espanha inteira.', f: [] },
        { n: 'Sagrada Família', lat: 41.4036, lng: 2.1744, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'entrada 10h', conf: 'aberto', d: '', f: [] },
        { n: 'Park Güell', lat: 41.4145, lng: 2.1527, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'comprar ingresso antes',
          conf: 'aberto', d: 'Sua anotação continua valendo: ingresso com hora marcada, compre antes.', f: [] },
        { n: 'Mercat de Sant Antoni', lat: 41.3792, lng: 2.1621, prec: 'end', tipo: 'mercado', feito: true, nota: 10, voce: '10/10',
          conf: 'nao-confirmado', d: 'A outra nota 10 de Barcelona — e essa é a do bairro, não a dos turistas.', f: [] },
        { n: 'Bodega La Puntual', lat: 41.3855, lng: 2.1810, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Casa Batlló', lat: 41.3917, lng: 2.1650, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Casa Milà (La Pedrera)', lat: 41.3954, lng: 2.1619, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Passeig de Gràcia', lat: 41.3930, lng: 2.1650, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Barceloneta e Port Vell', lat: 41.3790, lng: 2.1870, prec: 'bairro', tipo: 'passeio', feito: true, nota: null, voce: 'caminhada pela orla', conf: 'aberto', d: '', f: [] },
        { n: 'El Corte Inglés (Plaça Catalunya)', lat: 41.3874, lng: 2.1700, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: 'supermercado', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'El Nacional', lat: 41.3907, lng: 2.1690, prec: 'end', tipo: 'jantar', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: 'Jantar do último dia.', f: [] },
        { n: 'Teleférico e Castelo de Montjuïc', lat: 41.3634, lng: 2.1659, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: 'vista panorâmica', conf: 'aberto', d: 'Ficou de fora.', f: [] }
      ]
    },
    {
      id: 'lisboa', nome: 'Lisboa', datas: '11 a 14/01 · voo às 14:35 desde Barcelona',
      hotel: { n: 'Hotel em Lisboa (Hotéis.com)', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Praça do Comércio', lat: 38.7075, lng: -9.1364, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Sé de Lisboa', lat: 38.7098, lng: -9.1330, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Igreja de Santo António', lat: 38.7100, lng: -9.1335, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Maria Catita', lat: 38.7110, lng: -9.1310, prec: 'bairro', tipo: 'almoço', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: 'Almoço em Alfama.', f: [] },
        { n: 'Alfama', lat: 38.7120, lng: -9.1300, prec: 'bairro', tipo: 'passeio', feito: true, nota: null, voce: 'subida pelas ruas', conf: 'aberto', d: '', f: [] },
        { n: 'Miradouro de Santa Luzia', lat: 38.7118, lng: -9.1305, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'imperdível', conf: 'aberto', d: '', f: [] },
        { n: 'Miradouro das Portas do Sol', lat: 38.7120, lng: -9.1300, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'imperdível', conf: 'aberto', d: '', f: [] },
        { n: 'Zara (a que você chamou de maior do mundo)', lat: 38.7105, lng: -9.1400, prec: 'cidade', tipo: 'compras', feito: true, nota: null, voce: 'MAIOR ZARA DO MUNDO',
          conf: 'nao-confirmado',
          d: 'RESSALVA HONESTA: o título de maior Zara do mundo é normalmente atribuído à loja de MADRI, na Plaza de España. ' +
             'Não consegui confirmar qual loja de Lisboa você visitou nem se ela detém algum recorde. Grande ela é; ' +
             'a maior do mundo, eu não afirmo. Se você lembrar a rua, eu confiro.', f: [] },
        { n: 'Pastéis de Belém', lat: 38.6975, lng: -9.2036, prec: 'end', tipo: 'café da manhã', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: 'Café da manhã do dia 13.', f: [] },
        { n: 'Mosteiro dos Jerónimos', lat: 38.6979, lng: -9.2065, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Torre de Belém', lat: 38.6916, lng: -9.2160, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Monumento dos Descobrimentos', lat: 38.6936, lng: -9.2058, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Lisboa Story Centre', lat: 38.7077, lng: -9.1360, prec: 'end', tipo: 'museu', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'LX Factory', lat: 38.7026, lng: -9.1786, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'Alcântara', conf: 'aberto', d: '', f: [] },
        { n: 'Bifanas do Afonso', lat: 38.7105, lng: -9.1395, prec: 'bairro', tipo: 'almoço', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Castelo de São Jorge', lat: 38.7139, lng: -9.1335, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Solar dos Presuntos', lat: 38.7175, lng: -9.1435, prec: 'end', tipo: 'jantar', feito: true, nota: null, voce: '',
          conf: 'nao-confirmado', d: 'Jantar da última noite em Lisboa. Não confirmei em fonte primária.', f: [] }
      ]
    },
    {
      id: 'paris', nome: 'Paris', datas: '14 a 21/01 · uma semana, quase um roteiro à parte',
      hotel: { n: 'Hotel em Paris', conf: 'nao-confirmado', d: '' },
      lugares: [
        { n: 'Notre-Dame (exterior)', lat: 48.8530, lng: 2.3499, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Sainte-Chapelle', lat: 48.8554, lng: 2.3450, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'reservar', conf: 'aberto', d: 'Sua nota "reservar" continua valendo: entrada com hora marcada.', f: [] },
        { n: 'Shakespeare and Company', lat: 48.8526, lng: 2.3470, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Marché des Enfants Rouges', lat: 48.8626, lng: 2.3634, prec: 'end', tipo: 'mercado', feito: true, nota: null, voce: '', conf: 'aberto', d: 'O mercado coberto mais antigo de Paris (1615).', f: [] },
        { n: 'Chez Alain Miam Miam', lat: 48.8628, lng: 2.3632, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: 'sanduíche', conf: 'nao-confirmado', d: 'Dentro do Marché des Enfants Rouges.', f: [] },
        { n: 'Homer Lobster', lat: 48.8580, lng: 2.3590, prec: 'bairro', tipo: 'almoço', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: 'Aparece duas vezes no roteiro — dia 15 e dia 17.', f: [] },
        { n: 'Fromagerie Jouannault', lat: 48.8600, lng: 2.3640, prec: 'bairro', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'L’Épicerie Breizh Café', lat: 48.8608, lng: 2.3620, prec: 'bairro', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Maison Plisson', lat: 48.8608, lng: 2.3675, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Place des Vosges', lat: 48.8555, lng: 2.3655, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Merci Concept Store', lat: 48.8614, lng: 2.3674, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Diptyque (Marais)', lat: 48.8570, lng: 2.3620, prec: 'bairro', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Rue Saint-Honoré', lat: 48.8655, lng: 2.3350, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'La Jacobine', lat: 48.8530, lng: 2.3400, prec: 'end', tipo: 'jantar', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: 'Jantar do dia 15.', f: [] },
        { n: 'Torre Eiffel (do Trocadéro)', lat: 48.8620, lng: 2.2880, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: 'Trocadéro para as fotos', conf: 'aberto', d: '', f: [] },
        { n: 'Place de la Concorde', lat: 48.8656, lng: 2.3212, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Arnaud Nicolas', lat: 48.8570, lng: 2.3020, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: 'pré-almoço', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Maison du Maille', lat: 48.8690, lng: 2.3270, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: 'A loja das mostardas.', f: [] },
        { n: 'Le Petit Vendôme', lat: 48.8690, lng: 2.3290, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'E. Dehillerin', lat: 48.8635, lng: 2.3435, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '',
          conf: 'aberto',
          d: 'ABERTA: 18-20 rue Coquillière, no 1er. A loja de utensílios de cozinha desde 1820, no mesmo endereço desde 1890. ' +
             'Cobre, ferro fundido, formas de confeitaria. É a loja onde a Julia Child comprava.',
          f: [{ t: 'Atlas Obscura — E. Dehillerin', u: 'https://www.atlasobscura.com/places/e-dehillerin-paris' }] },
        { n: 'La Grande Épicerie de Paris', lat: 48.8515, lng: 2.3245, prec: 'end', tipo: 'compras', feito: true, nota: null, voce: '', conf: 'aberto', d: 'Aparece duas vezes no roteiro — dia 17 e dia 20.', f: [] },
        { n: 'Pont Alexandre III', lat: 48.8639, lng: 2.3136, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Les Invalides', lat: 48.8566, lng: 2.3126, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Rue Cler', lat: 48.8570, lng: 2.3050, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Matignon', lat: 48.8690, lng: 2.3080, prec: 'bairro', tipo: 'jantar', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: 'Jantar do dia 17.', f: [] },
        { n: 'Marché aux Puces de Saint-Ouen', lat: 48.9019, lng: 2.3417, prec: 'end', tipo: 'mercado', feito: true, nota: null, voce: 'domingo, 10h — Paul Bert Serpette, Dauphine e Vernaison',
          conf: 'aberto',
          d: 'AVISO QUE SALVA UM DIA: as Puces só abrem de SÁBADO A SEGUNDA. Dauphine: sáb–seg, 9h30–18h. ' +
             'Vernaison: sáb e dom 9h–18h, seg 10h–18h. Paul Bert Serpette também abre sexta, para profissionais. ' +
             'De terça a quinta está tudo fechado. Vocês foram num domingo — acertaram sem saber, ou sabendo.',
          f: [{ t: 'Paul Bert Serpette — informações práticas', u: 'https://www.paulbert-serpette.com/en/practical-information' },
               { t: 'Les Puces de Paris Saint-Ouen', u: 'https://www.pucesdeparissaintouen.com/en/les-puces/' }] },
        { n: 'La Rotonde Montparnasse', lat: 48.8425, lng: 2.3300, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Jardin du Luxembourg', lat: 48.8462, lng: 2.3372, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Igreja de Saint-Sulpice', lat: 48.8510, lng: 2.3325, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Saint-Germain-des-Prés', lat: 48.8540, lng: 2.3336, prec: 'bairro', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Arc de Triomphe', lat: 48.8738, lng: 2.2950, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Champs-Élysées', lat: 48.8698, lng: 2.3075, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Kodawari Ramen', lat: 48.8520, lng: 2.3390, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: '', f: [] },
        { n: 'Che Janeu', lat: 48.8600, lng: 2.3400, prec: 'cidade', tipo: 'jantar', feito: true, nota: null, voce: '', conf: 'nao-confirmado', d: 'Jantar do dia 19. Não achei o endereço.', f: [] },
        { n: 'Montmartre e Sacré-Cœur', lat: 48.8867, lng: 2.3431, prec: 'end', tipo: 'passeio', feito: true, nota: null, voce: '', conf: 'aberto', d: '', f: [] },
        { n: 'Les Arlots', lat: 48.8790, lng: 2.3510, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: 'reserva 13:30',
          conf: 'aberto',
          d: 'ABERTO: 136 rue du Faubourg-Poissonnière, no 10e. Bistrô, recomendado pelo Gault & Millau, ' +
             'famoso pela salsicha-purê e pelos vinhos naturais.',
          f: [{ t: 'Le Fooding — Les Arlots', u: 'https://lefooding.com/en/restaurants/restaurant-les-arlots-paris-3' }] },
        { n: 'Musée d’Orsay', lat: 48.8600, lng: 2.3266, prec: 'end', tipo: 'museu', feito: false, nota: null, voce: 'manhã, 2h30 a 3h',
          conf: 'aberto', d: 'FICOU DE FORA — e vocês já tinham calculado o tempo de visita.', f: [] },
        { n: 'Le Bon Georges', lat: 48.8770, lng: 2.3380, prec: 'end', tipo: 'jantar', feito: false, nota: null, voce: 'jantar 21:15',
          conf: 'aberto',
          d: 'FICOU DE FORA, com reserva marcada. Está aberto os 7 dias, 12h–14h30 e 19h–22h30, com carta de ' +
             'cerca de 2.000 vinhos. Reserva online até 6 pessoas.',
          f: [{ t: 'Le Bon Georges — site', u: 'https://www.lebongeorges.paris/' }] },
        { n: 'Fromagerie Barthélemy', lat: 48.8555, lng: 2.3230, prec: 'end', tipo: 'compras', feito: false, nota: null, voce: '', conf: 'nao-confirmado', d: 'Ficou de fora.', f: [] },
        { n: 'Concerto na Igreja de Saint-Germain-des-Prés', lat: 48.8540, lng: 2.3336, prec: 'end', tipo: 'passeio', feito: false, nota: null, voce: '20:30 às 22h, comprar antecipado',
          conf: 'aberto', d: 'Ficou de fora.', f: [] }
      ]
    },
    {
      id: 'londres', nome: 'Londres (escala)', datas: '21/01',
      hotel: { n: '—', conf: 'nao-confirmado', d: 'Só a escala, entre um voo e outro.' },
      lugares: [
        { n: 'Covent Garden', lat: 51.5117, lng: -0.1240, prec: 'end', tipo: 'almoço', feito: true, nota: null, voce: 'almoço na escala',
          conf: 'aberto',
          d: 'Lembrete que vocês anotaram em letras garrafais e vale repetir: LONDRES EXIGE AUTORIZAÇÃO DE ENTRADA ' +
             '(ETA) para brasileiros, mesmo em escala com saída do aeroporto. Sem ela, o almoço em Covent Garden não acontece.', f: [] }
      ]
    }
  ],

  reparos: [
    {
      t: 'O ano do roteiro é 2026, não 2025',
      d: 'O arquivo se chama "Europa 2025" e os dias da semana que você anotou (15/01 quinta, 16/01 sexta, ' +
         '17/01 sábado) só batem com janeiro de 2026. A viagem foi de 30/12/2025 a 21/01/2026 — oito meses atrás. ' +
         'Mantive o nome que você deu, mas as datas aqui são as reais.'
    },
    {
      t: 'O Mercado de San Miguel fechou dias depois de vocês',
      d: 'Vocês deram 10/10 nele no dia 1º de janeiro. Em 7 de janeiro ele fechou para reforço estrutural da ' +
         'fundação e só reabriu em 26 de fevereiro. Reabriu inteiro, com mais de 30 bancas. Foi por pouco.'
    },
    {
      t: 'As Puces de Saint-Ouen só abrem de sábado a segunda',
      d: 'É a armadilha mais cara deste roteiro para quem for repetir. De terça a quinta está tudo fechado — ' +
         'Dauphine, Vernaison e Paul Bert Serpette. Vocês foram num domingo e deu certo; um roteiro montado ' +
         'numa quarta perde o dia inteiro.'
    },
    {
      t: 'Zaragoza foi só passagem',
      d: 'Dos sete itens planejados para Zaragoza, seis ficaram de fora — Basílica del Pilar, La Seo, Aljafería, ' +
         'Mercado Central, o almoço. Só o El Corte Inglés aconteceu. Se um dia voltarem à rota Madri–Barcelona ' +
         'de carro, Zaragoza está inteira à espera.'
    },
    {
      t: 'A "maior Zara do mundo" eu não confirmo',
      d: 'Esse título costuma ser atribuído à loja de Madri, na Plaza de España. Não consegui confirmar qual ' +
         'loja de Lisboa você visitou nem se ela tem algum recorde. Deixei a sua anotação na ficha, com a ressalva ' +
         'do lado — porque inventar recorde é exatamente o que este app não faz.'
    },
    {
      t: 'O dia 16 de janeiro',
      d: 'Está no roteiro com um ✓ e três palavras: "PASSEI MAL". Um dia inteiro de Paris perdido. ' +
         'Fica registrado porque faz parte da viagem — e porque nenhum guia conta essa parte.'
    }
  ]
};
