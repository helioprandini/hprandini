/* HeRo — Índia, setembro/2026
 *
 * PRIVACIDADE: este repositório é público. Números de reserva, códigos de
 * bilhete e sobrenomes completos NÃO entram aqui — com localizador e
 * sobrenome dá para mexer numa reserva alheia. Voo, horário e rota entram,
 * porque são úteis e não abrem nada.
 */

const HERO_INDIA = {
  id: 'india',
  cidade: 'Índia',
  pais: 'Índia',
  periodo: '18 de setembro a 1º de outubro de 2026',
  moeda: 'INR',
  viajam: 'Helio e Roberta',
  nota: 'Roteiro montado pelo anfitrião local. As reuniões (OVL, GIC, BPRL) são de trabalho da Roberta.',

  voos: [
    { d: '18/09', n: 'QR774', de: 'GRU · São Paulo', para: 'DOH · Doha', sai: '01:55', chega: '22:15', dur: '14h20', cia: 'Qatar Airways' },
    { d: '19/09', n: 'QR570', de: 'DOH · Doha', para: 'DEL · Delhi', sai: '02:25', chega: '08:45', dur: '3h50', cia: 'Qatar Airways' },
    { d: '23/09', n: 'AI2678', de: 'DEL · Delhi T3', para: 'BOM · Mumbai T2', sai: '08:30', chega: '10:45', dur: '2h15', cia: 'Air India' },
    { d: '23/09', n: 'AI2986', de: 'BOM · Mumbai T2', para: 'DEL · Delhi T3', sai: '22:35', chega: '01:00 (24/09)', dur: '2h25', cia: 'Air India' },
    { d: '28/09', n: '—', de: 'DEL · Delhi', para: 'DOH · Doha', sai: '16:10', chega: '17:45', dur: '4h05', cia: 'Qatar Airways' },
    { d: '01/10', n: '—', de: 'DOH · Doha', para: 'GRU · São Paulo', sai: '00:05', chega: '09:00', dur: '14h55', cia: 'Qatar Airways' }
  ],

  dias: [
    { d: '19/09', cidade: 'Delhi', arte: 'delhi', hotel: 'DoubleTree by Hilton',
      t: 'Chegada',
      x: 'Pousa em Delhi às 8h45 depois de quase 22 horas de viagem contando a escala. Check-in e a tarde para se recuperar. Sem plano, sem pressão — só entrar na Índia antes do caos começar.',
      theo: 'Dia de fuso, não de turismo. O corpo vai achar que são 00h20 de Brasília quando vocês pousarem. Coma leve e durma cedo.' },

    { d: '20/09', cidade: 'Agra', arte: 'agra', hotel: 'Tajview — IHCL SeleQtions',
      t: 'Taj Mahal e Forte de Agra',
      x: 'Viagem de carro de manhã até Agra com os pais. Check-in no Tajview, visita ao Taj Mahal e ao Forte de Agra. Jantar com a mãe e a tia dela, e uma noite tranquila no hotel.',
      theo: 'O Taj abre ao nascer do sol e é quando a luz e a temperatura prestam. Se der para ir cedo em vez de no meio do dia, vá — setembro em Agra passa de 35 °C. A tarifa do Tajview inclui 25% de desconto em comida e bebida no hotel.' },

    { d: '21/09', cidade: 'Delhi', arte: 'delhi', hotel: 'Taj Palace',
      t: 'Volta e respiro',
      x: 'Volta de carro para Delhi, check-in no Taj Palace e dia leve. Um pouco de descanso, um pouco de exploração e uma noite relaxada com boa comida e bebida.',
      theo: 'O Taj Palace tem happy hour 1+1 em bebidas das 18h às 20h em bar selecionado, e 15% de desconto em comida e bebida. Se a noite for "bebida e comida boa", é literalmente no prédio e sai pela metade.' },

    { d: '22/09', cidade: 'Delhi', arte: 'delhi', hotel: 'Taj Palace',
      t: 'Reunião OVL e a cidade',
      x: 'Reunião da OVL na primeira metade do dia. Depois, Delhi para descobrir: passear, comprar, achar coisas que você não sabia que precisava.',
      theo: 'Trabalho da Roberta de manhã. À tarde, Old Delhi e Chandni Chowk são o contraste que vale — e onde está a comida de rua de verdade.' },

    { d: '23/09', cidade: 'Mumbai', arte: 'mumbai', hotel: 'Welcomhotel by ITC — Delhi-Gurugram Hwy',
      t: 'Bate-volta de trabalho',
      x: 'Check-out do Taj Palace. Voo de manhã para Mumbai para reuniões com GIC e BPRL, e voo de volta à noite para Delhi. Check-in no Welcomhotel.',
      theo: 'Dia duro: decola 8h30, volta pousando 1h da manhã. O hotel da noite fica na rodovia Delhi-Gurugram, perto do aeroporto — escolha certa, é para dormir, não para passear.',
      alerta: 'Só 1 noite reservada aqui, e vocês chegam 1h da manhã do dia 24. Confirme que a diária cobre a madrugada da chegada, não a noite do dia 23.' },

    { d: '24/09', cidade: 'Jaipur', arte: 'jaipur', hotel: 'Taj Amer',
      t: 'A Cidade Rosa',
      x: 'Check-out e viagem de carro de manhã para Jaipur, com check-in no Taj Amer. O dia para explorar a Cidade Rosa, com tempo de sobra para tecidos, souvenires e joias.',
      theo: 'Jaipur é onde se compra. Tecido, bloco de madeira estampado, pedra. Pechinchar é esperado, não é ofensa.' },

    { d: '25/09', cidade: 'Jaipur', arte: 'jaipur', hotel: 'Taj Amer',
      t: 'Amer Fort e City Palace',
      x: 'Dia inteiro em Jaipur: Forte Amer e City Palace, e mais tempo para explorar e comprar. Tecidos bonitos, artesanato local, souvenires e provavelmente algumas coisas que não estavam no plano.',
      theo: 'O Forte Amer no fim da tarde, com a luz baixa sobre a pedra, é a foto da viagem inteira. Vá depois das 15h.' },

    { d: '26/09', cidade: 'Delhi', arte: 'delhi', hotel: 'Taj Palace',
      t: 'Últimos dias',
      x: 'Volta de carro para Delhi e check-in no Taj Palace para os dois dias finais.',
      theo: null },

    { d: '27/09', cidade: 'Delhi', arte: 'delhi', hotel: 'Taj Palace',
      t: 'Delhi final',
      x: 'Compras de última hora, explorar, relaxar e aproveitar as últimas noites em Delhi antes de voltar.',
      theo: 'Última chance de comprar. E a última noite em que a bebida sai 1+1 no hotel — em Doha isso não existe.' },

    { d: '28/09', cidade: 'Delhi → Doha', arte: 'doha', hotel: 'a definir em Doha',
      t: 'Adeus Índia, olá Doha',
      x: 'Voo de volta. Sai de Delhi às 16h10 e pousa em Doha às 17h45.',
      theo: 'Aqui o guia troca de aba: a escala em Doha são 54 horas, não um pernoite. Veja o destino Doha.',
      ponte: true }
  ],

  hoteis: [
    { n: 'DoubleTree by Hilton', c: 'Delhi', p: '19–20/09', obs: 'Chegada. Tem bar e rooftop.' },
    { n: 'Tajview — IHCL SeleQtions', c: 'Agra', p: '20–21/09', obs: 'Café da manhã incluído · 25% de desconto em comida, bebida e spa.' },
    { n: 'Taj Palace', c: 'Delhi', p: '21–23/09', obs: 'Superior King, vista do Diplomatic Enclave · café incluído · 15% off em F&B e spa · happy hour 1+1 das 18h às 20h · check-in 2h antes e check-out 2h depois.' },
    { n: 'Welcomhotel by ITC — Delhi-Gurugram Hwy', c: 'Gurugram', p: '23–24/09', obs: 'Deluxe, 1 noite. Perto do aeroporto, para a volta de Mumbai de madrugada.' },
    { n: 'Taj Amer', c: 'Jaipur', p: '24–26/09', obs: 'Duas noites na Cidade Rosa.' },
    { n: 'Taj Palace', c: 'Delhi', p: '26–28/09', obs: 'Mesmas condições da primeira estadia.' }
  ]
};
