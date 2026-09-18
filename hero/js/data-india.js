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
    { d: '19/09', cidade: 'Delhi → Gurugram', arte: 'delhi', hotel: 'DoubleTree by Hilton Gurgaon',
      t: 'Chegada',
      alerta: 'Vocês devem chegar ao hotel por volta das 10h30 (imigração no T3 leva de 45 a 90 min) e o check-in padrão é às 14h. Peça early check-in na chegada, ou por mensagem antes — senão são horas de lobby com o corpo pedindo cama.',
      x: 'Pousa em Delhi às 8h45 depois de quase 22 horas de viagem contando a escala. Check-in e a tarde para se recuperar. Sem plano, sem pressão — só entrar na Índia antes do caos começar.',
      theo: 'Dia de fuso, não de turismo. O corpo vai achar que são 00h20 de Brasília quando vocês pousarem. Coma leve e durma cedo. ' +
            'O hotel fica em GURUGRAM, não em Delhi — 30 min do aeroporto, mas 45–60 min do centro de Delhi. ' +
            'Para um dia de recuperação isso é bom, e o hotel tem spa com sala de vapor se vocês quiserem tirar o voo do corpo.',
      passos: {
        t: 'Do T3 até o hotel — a sequência, sem pensar',
        p: [
          'Ligue o celular ainda na fila da imigração e veja o WhatsApp. Os anfitriões vêm buscar? Se sim, o resto não importa.',
          'Na saída do desembarque, procure placa com o nome de vocês por no máximo 15 minutos. Ninguém e ninguém responde: siga para o 3.',
          'Chame o Uber. Ponto de embarque: estacionamento coberto, atravessando as três pistas em frente aos PORTÕES 5 E 6. Só ali.',
          'Destino: DoubleTree by Hilton Gurgaon — New Delhi NCR, Sector 56, Golf Course Road, Gurugram 122011. Uns ₹400–700 mais ~₹150 de taxa do aeroporto. 30 a 40 min.',
          'Confira a placa do carro antes de entrar e compartilhe a corrida pelo app. Nunca aceite quem aborda você dentro do terminal.',
          'Se o motorista disser que o hotel fechou, pegou fogo ou que a rua está interditada: é golpe conhecido de Delhi. Não use o telefone dele. Ligue você, ou mande seguir assim mesmo.',
          'Alternativa oficial: Bharat Prepaid Taxi Counter — do lado de FORA, entre as pistas 2 e 3, depois dos portões 5 e 6. Os balcões de dentro do terminal cobram 2 a 3 vezes mais.'
        ]
      } },

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
    { n: 'DoubleTree by Hilton Gurgaon — New Delhi NCR', c: 'Gurugram', p: '19–20/09',
      obs: 'Chegada · Setor 56, Golf Course Road · 30 min do aeroporto · TEM SPA com sala de vapor, piscina e academia ' +
           '(confirmado no site da Hilton; nome, horário e tratamentos, não) · metrô Sector 55–56 a 2 min a pé · ' +
           'ATENÇÃO: é Gurugram, não Delhi — o centro de Delhi fica a 45–60 min com trânsito · reserva Hotels.com 73526996639812.' },
    { n: 'Tajview — IHCL SeleQtions', c: 'Agra', p: '20–21/09', obs: 'Café da manhã incluído · 25% de desconto em comida, bebida e spa ' +
           '(conf. 300083578359) · ⚠️ o desconto exige número Tata NeuPass, que está EM BRANCO na reserva.' },
    { n: 'Taj Palace', c: 'Delhi', p: '21–23/09', obs: 'Superior King, vista do Diplomatic Enclave · café incluído · 15% off em F&B e spa · happy hour 1+1 das 18h às 20h · check-in 2h antes e check-out 2h depois (conf. 300083578034) · ' +
           '⚠️ a própria reserva diz que os benefícios exigem número Tata NeuPass válido, conferido no check-in — e o campo está EM BRANCO.' },
    { n: 'Welcomhotel by ITC — Delhi-Gurugram Hwy', c: 'Gurugram', p: '23–24/09', obs: 'Deluxe, 1 noite. Perto do aeroporto, para a volta de Mumbai de madrugada.' },
    { n: 'Taj Amer', c: 'Jaipur', p: '24–26/09', obs: 'Duas noites na Cidade Rosa.' },
    { n: 'Taj Palace', c: 'Delhi', p: '26–28/09', obs: 'Mesmas condições da primeira estadia (conf. 300083578414) · mesmo alerta do NeuPass.' }
  ]
};
