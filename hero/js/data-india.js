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

  /* A CHEGADA — 19/09, pouso 8h45 no T3.
   * Existe porque a decisao acontece no aeroporto, depois de 22 horas de
   * viagem, e ninguem esta em condicoes de ler pesquisa nessa hora.
   * O que esta aqui foi conferido em 18/09/2026. */
  chegada: {
    voo: 'QR570 · pousa no Terminal 3 às 8h45 · sábado, 19 de setembro',
    destino: 'DoubleTree by Hilton Gurgaon — New Delhi NCR, Sector 56, Golf Course Road, Gurugram 122011',
    enderecoBusca: 'DoubleTree by Hilton Hotel Gurgaon New Delhi NCR, Sector 56, Golf Course Road, Gurugram 122011',
    pontoUber: 'Terminal 3 Arrival P6, Indira Gandhi International Airport, New Delhi',
    /* O QUE EU DEIXEI PASSAR (registrado em 19/09/2026, depois do Helio apontar).
     * Escrevi a secao da chegada inteira - imigracao, esteira, canal verde -
     * e nao coloquei o unico documento que hoje e OBRIGATORIO para embarcar.
     * Fica aqui no topo, antes de tudo, porque e o que vem antes de tudo. */
    eArrival: {
      t: '🔴 e-Arrival Card — obrigatório, ANTES de ir ao aeroporto',
      resumo: 'Desde 1º de abril de 2026 todo estrangeiro que entra na Índia precisa preencher o e-Arrival Card online. ' +
              'O cartão de desembarque de papel foi DESCONTINUADO — não existe alternativa na chegada.',
      itens: [
        { k: 'Quando', v: 'Na janela de 72 horas antes da chegada. Nem antes disso, nem depois do horário do pouso.' },
        { k: 'Onde', v: 'indianvisaonline.gov.in/earrival — ou o aplicativo Su-Swagatam. É grátis e não pede upload de documento.' },
        { k: 'O que pede', v: 'Dados do passaporte, data de chegada, contato e o ENDEREÇO DA HOSPEDAGEM na Índia. Tenha o endereço do primeiro hotel à mão.' },
        { k: 'O que devolve', v: 'Um QR Code por e-mail. Ele é pedido DUAS vezes: no check-in da companhia e na imigração.' },
        { k: 'Se não fizer', v: 'A companhia pode negar o embarque — a multa é de até ₹50.000 POR passageiro e quem paga é ela, então ela confere no balcão e no portão. Chegando sem, é quiosque na imigração, fila extra e perguntas.' }
      ],
      outro: 'NÃO confundir com a declaração de alfândega (app ATITHI 2.0), que é OPCIONAL: declara bagagem e moeda antecipadamente e só serve para acelerar a saída pelo canal verde. O e-Arrival Card é o obrigatório.'
    },

    doha: {
      t: '✅ E na entrada em Doha, dia 28/09: nada a preencher antes',
      p: [
        'Conferi para não errar duas vezes. Brasileiro entra no Catar com isenção de visto — a duração diverge entre as fontes (30 ou 90 dias) e não confirmei, mas para 3 noites não muda nada.',
        'O Ehteraz (pré-registro que já foi obrigatório) NÃO é mais exigido para entrar. Só para acessar unidade de saúde.',
        'O seguro-saúde obrigatório do Catar (cerca de QAR 50) ISENTA quem entra com visto na chegada nos primeiros 30 dias. Vocês ficam 3 — isentos.',
        'O que pedem no balcão: passaporte válido por 6 meses, passagem de volta e comprovante de hospedagem. Tenham a reserva do hotel de Doha no celular.'
      ]
    },

    primeiro: {
      t: 'Antes de tudo: os anfitriões vêm buscar?',
      p: 'Ligue o celular ainda na fila da imigração e veja o WhatsApp. Se vierem, nada mais aqui importa. ' +
         'Se não houver resposta, procure placa com o nome de vocês na saída por no máximo 15 minutos e siga para o carro.'
    },
    passos: [
      { t: 'Portões 5, 6 e 7', d: 'Voo internacional desembarca por aí. Escada rolante direto para a imigração.' },
      { t: 'Imigração', d: 'De 45 a 90 minutos na fila de estrangeiros. É o trecho mais longo do percurso — conte com isso.' },
      { t: 'Esteiras 7 a 12', d: 'Bagagem internacional. A tela informa a esteira. Bagagem fora de medida sai entre as esteiras 10 e 11.' },
      { t: 'Alfândega — canal verde', d: 'Nada a declarar. Lembre: até 2 litros de bebida por pessoa. Acima disso, canal vermelho.' },
      { t: 'A saída', d: 'Logo depois da alfândega: caixa eletrônico do SBI à direita (banco público — não cobra taxa de cartão estrangeiro, é o melhor lugar para o primeiro saque) e balcão da Airtel, se precisar de chip.' },
      { t: 'Portões 5 e 6, agora do lado de fora', d: 'Daqui a rota se divide. Uber para a esquerda, táxi oficial à frente.' },
      { t: 'Uber — passarela coberta até o MLCP', d: 'Siga as placas "Car Parking / MLCP". A passarela é fechada, com ar e passa carrinho de bagagem. Ponto de embarque: Arrival P6. São uns 6 minutos de caminhada.' },
      { t: 'Táxi oficial — balcão Bharat Prepaid', d: 'Do lado de FORA, entre as pistas 2 e 3, logo depois dos portões 5 e 6. Os balcões que ficam DENTRO do terminal cobram 2 a 3 vezes mais.' }
    ],
    comparativo: {
      t: 'Uber ou táxi oficial? No preço eles empatam',
      linhas: [
        { k: 'Custo', a: 'Uber: ₹550 a ₹850 (corrida + ~₹150 de taxa do aeroporto) · R$ 30 a 46',
          b: 'Táxi oficial: ₹580 a ₹660 (₹40 o 1º km + ₹20/km com ar, ~30 km) · R$ 31 a 36' },
        { k: 'Tempo', a: 'Uber: 30 a 40 min', b: 'Táxi: 35 a 45 min' },
        { k: 'Pagamento', a: 'Uber: cartão, automático, sem dinheiro na mão', b: 'Táxi: dinheiro, e o voucher só sai da sua mão NA CHEGADA' }
      ],
      veredito: 'NÃO são igualmente seguros. Os dois são canais legítimos e nenhum é perigoso — o perigo é o terceiro caminho, quem aborda você no saguão. Mas o Uber ganha no que importa se algo der errado: você vê nome, foto e PLACA antes de entrar; dá para compartilhar a viagem com a Roberta em tempo real; o PIN próprio impede que a corrida comece no carro errado; gravação de áudio e RideCheck podem ficar ligados por padrão em Preferências de Segurança; há linha de emergência 24h no app; e não há dinheiro trocando de mão. O táxi oficial ganha em uma coisa só, mas real: não depende de celular, bateria nem sinal. Como você tem dados: Uber, com o táxi oficial de plano B se o telefone morrer.',
      sobretaxa: 'A sobretaxa noturna de 25% do táxi oficial vale das 23h às 5h. Você chega às 8h45 — não pega.'
    },
    golpes: [
      { t: 'Quem aborda você é comissionado', d: '"Sir, taxi?" dentro do terminal é sempre tout. Nenhum serviço oficial aborda passageiro.' },
      { t: 'O motorista pede para você CANCELAR e pagar em dinheiro', d: 'Esse é O golpe do Uber na Índia. Ele liga dizendo que o app paga pouco. Se você aceitar, perde placa registrada, rota gravada, viagem compartilhada e o pagamento protegido — tudo de uma vez. Nunca cancele a pedido do motorista: cancele você e chame outro.' },
      { t: '"Seu hotel fechou / pegou fogo / a rua está interditada"', d: 'Clássico de Delhi, e mais plausível no seu caso porque o hotel não é em Delhi, é em Gurugram. Ele oferece ligar para confirmar — quem atende é amigo dele. Nunca use o telefone do motorista. Ligue você, ou mande seguir assim mesmo.' },
      { t: 'Balcão "prepaid" dentro do terminal', d: 'O oficial é do lado de fora, entre as pistas 2 e 3. Os de dentro cobram 2 a 3 vezes a tarifa.' }
    ],
    fontes: [
      { t: 'Golpes no aeroporto de Delhi — balcões e tarifas', u: 'https://www.hotelaerocitypurpleorchid.com/Blog/delhi-airport-taxi-scams-part-1.html' },
      { t: 'Motoristas falsos no T3', u: 'https://www.hotelaerocitypurpleorchid.com/Blog/delhi-airport-taxi-scams-part-2.html' },
      { t: 'Uber Índia — recursos de segurança 2026', u: 'https://www.uber.com/in/en/newsroom/uber-introduces-new-features-to-elevate-safety/' },
      { t: 'Guia do T3 — portões, MLCP e passarela', u: 'https://airportandme.com/delhi-airport-t3-terminal-guide-2026-entry-gates-lounges-metro-hacks/' },
      { t: 'Tarifas aeroporto → Gurgaon', u: 'https://delhiairporttransfer.com/delhi-airport-cab-fare-noida-gurgaon/' }
    ]
  },

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
