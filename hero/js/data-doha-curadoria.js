/* HeRo — Curadoria de Doha, setembro/2026
 * Isto NÃO é ranking copiado. É escolha, com o motivo escrito ao lado.
 */

const HERO_CURADORIA = {

  topos: [
    {
      id: 'A', titulo: 'A. Top 5 absolutos',
      sub: 'Se a viagem inteira coubesse em cinco reservas',
      itens: [
        { r: 'jiwan',    nota: 'Cozinha qatari contemporânea levada a sério, no museu de Jean Nouvel, com vista da baía. QAR 300 com bebidas é barato para o que entrega — por isso tem Bib Gourmand. Reabriu dia 30/08.' },
        { r: 'idam',     nota: 'A única alta gastronomia de Doha que usa o Golfo como matéria-prima (bacon de camelo, peixe local) em vez de importar um cardápio pronto. Estrela MICHELIN, prédio de I. M. Pei, 6 min do hotel. Reabriu dia 03/09.' },
        { r: 'argan',    nota: 'Bib Gourmand a um minuto a pé do seu quarto. Tagine e cuscuz marroquinos de verdade. Nenhum outro restaurante da lista tem esse atrito zero.' },
        { r: 'bandar-aden', nota: 'Cordeiro mandi desfiando no arroz, sentado no chão, dentro do Souq. É a comida que os moradores do Golfo procuram, não a que se vende ao turista.' },
        { r: 'shay-al-shomous', nota: 'Café da manhã qatari de casa, feito por uma qatari, num canto do Souq. Custa quase nada e é a memória que sobra.' }
      ]
    },
    {
      id: 'B', titulo: 'B. Top 5 alta gastronomia',
      itens: [
        { r: 'idam',    nota: '★ MICHELIN. O melhor argumento de fine dining do país. Menu novo desde 03/09/2026.' },
        { r: 'alba',    nota: '★ MICHELIN, a única estrela NOVA de 2026. Piemonte sério no Raffles. Perde só por ser italiano.' },
        { r: 'jamavar', nota: '★ MICHELIN mantida. Indiano impecável — e com almoço de 3 tempos a QAR 149, a estrela mais barata do Golfo.' },
        { r: 'zuma',    nota: 'Sem estrela, mas o japonês contemporâneo mais consistente da cidade. Vá no almoço de QAR 139.' },
        { r: 'la-mar',  nota: 'Gastón Acurio com a melhor vista de pôr do sol da lista. O "Sunset Hours" (a partir de QAR 39) é alta gastronomia a preço de petisco.' }
      ]
    },
    {
      id: 'C', titulo: 'C. Top 5 comida local (qatari / Golfo / árabe regional)',
      itens: [
        { r: 'jiwan',       nota: 'Qatari contemporâneo, o topo da categoria.' },
        { r: 'bayt-sharq',  nota: 'Qatari tradicional numa casa de 100 anos com museu dentro. O machboos clássico que o MICHELIN cita.' },
        { r: 'bandar-aden', nota: 'Iemenita. Melhor mandi do Souq.' },
        { r: 'saasna',      nota: 'Qatari com viés costeiro — machboos de hammour e camarão, que quase ninguém serve.' },
        { r: 'shay-al-shomous', nota: 'Café da manhã. Balaleet, madrouba, regag na chapa.' }
      ]
    },
    {
      id: 'D', titulo: 'D. Top 5 hidden gems',
      sub: 'O que um turista brasileiro não acha sozinho',
      itens: [
        { r: 'sawa',         nota: 'MICHELIN Selected escondido no 1º andar de um clube privado em Msheireb. Não precisa ser sócio. Quase nenhum turista entra.' },
        { r: 'shay-al-shomous', nota: 'Fica num canto do Souq que não está na rota principal. Tocado pela dona desde 2014.' },
        { r: 'baron',        nota: 'Promovido a Bib Gourmand em 2026, no Mina District — o porto velho repintado, o passeio mais bonito e menos turístico de Doha.' },
        { r: 'desert-rose',  nota: 'MICHELIN Selected disfarçado de café de museu. Chef qatari, machboos de cordeiro, preço de almoço.' },
        { r: 'smat',         nota: 'Qatari elegante, cheio de famílias locais, com pratos de fusão (mathawi macaroni) que não aparecem em lista de turista.' }
      ]
    },
    {
      id: 'E', titulo: 'E. Melhor custo-benefício',
      itens: [
        { r: 'jamavar',     nota: 'Estrela MICHELIN, 3 tempos, QAR 149 (~R$ 209). Não existe nada parecido no mundo.' },
        { r: 'jiwan',       nota: 'Menu completo com bebidas a QAR 300 (~R$ 420) num Bib Gourmand com a melhor vista de museu do país.' },
        { r: 'bandar-aden', nota: 'Refeição farta de cordeiro por uma fração do que qualquer restaurante de hotel cobra.' },
        { r: 'la-mar',      nota: '"Sunset Hours": cebiche do Acurio a partir de QAR 39 com pôr do sol sobre o Golfo.' },
        { r: 'abo-shariha', nota: 'Almoço completo por menos que uma sobremesa em West Bay.' },
        { r: 'danat-al-bahar', nota: 'Peixe do dia na brasa por QAR 50–100 por pessoa.' }
      ]
    },
    {
      id: 'F', titulo: 'F. Melhor experiência romântica',
      itens: [
        { r: 'idam',   nota: '1º lugar. Mesa alta sobre a baía, skyline inteiro na janela, serviço de estrela. Peça mesa na janela ao reservar.' },
        { r: 'la-mar', nota: 'Se o critério for pôr do sol e pés quase na areia, ganha do IDAM. Reserve para 40 min antes do sunset.' },
        { r: 'jiwan',  nota: 'Vista de baía mais silenciosa e cardápio mais interessante. Sem álcool — o que para alguns casais é melhor, não pior.' },
        { r: 'parisa', nota: 'O salão de espelhos. A dois, à noite, a pé do hotel. Espetáculo visual.' },
        { r: 'bayt-sharq', nota: 'Romântico de outro tipo: jardim de casa antiga, luz baixa, sem música alta.' }
      ]
    },
    {
      id: 'G', titulo: 'G. Melhor peixe e frutos do mar',
      itens: [
        { r: 'danat-al-bahar', nota: 'Vencedor. Você escolhe a peça no gelo e ela vai para a brasa. Hamour, sheri, camarão do Golfo. Dentro do Souq.' },
        { r: 'saasna',  nota: 'Melhor peixe "de garfo e faca": machboos de hammour e camarão.' },
        { r: 'la-mar',  nota: 'Melhor peixe cru — cebiche e tiradito de Gastón Acurio.' },
        { r: 'gaia',    nota: 'Balcão de peixe do dia com quatro preparos. Bom, mas é Dubai transplantada.' }
      ]
    },
    {
      id: 'H', titulo: 'H. Melhor cozinha árabe',
      itens: [
        { r: 'argan',       nota: 'VENCEDOR. Marroquino Bib Gourmand dentro do seu hotel. Tagine e cuscuz são cozinhas árabes que o Brasil não tem.' },
        { r: 'bandar-aden', nota: 'Melhor árabe popular: iemenita, mandi, chão e tapete.' },
        { r: 'sawa',        nota: 'Melhor levantino contemporâneo — maqlooba palestina e bolinhas de madrouba.' },
        { r: 'em-sherif',   nota: 'Melhor libanês tecnicamente. Mas libanês é a cozinha árabe que o Brasil faz melhor — é a menos necessária aqui.' }
      ]
    },
    {
      id: 'I', titulo: 'I. Melhor cozinha qatari',
      itens: [
        { r: 'jiwan',      nota: 'VENCEDOR na versão contemporânea. Bib Gourmand, vista, menu novo de setembro.' },
        { r: 'bayt-sharq', nota: 'VENCEDOR na versão tradicional. Machboos clássico, casa de 100 anos.' },
        { r: 'saasna',     nota: 'Melhor viés costeiro.' },
        { r: 'smat',       nota: 'Melhor versão "elegante de família qatari".' },
        { r: 'desert-rose',nota: 'Melhor versão barata, feita por chef qatari reconhecida.' },
        { r: 'fenyal',     nota: 'Melhor novidade de 2026 — perde só pela distância (25 min).' }
      ]
    },
    {
      id: 'J', titulo: 'J. Melhor internacional — e vale a pena comer isso em Doha?',
      itens: [
        { r: 'jamavar', nota: 'SIM, no almoço. Estrela MICHELIN por QAR 149 não existe em Londres. O preço é o argumento, não a cozinha.' },
        { r: 'alba',    nota: 'SIM, se estrela nova for o critério. É a única de 2026 e não tem filial.' },
        { r: 'la-mar',  nota: 'TALVEZ. Peruano você come melhor em Lima e bem em São Paulo. Mas a vista daqui não existe em outro lugar.' },
        { r: 'zuma',    nota: 'NÃO no jantar. Idêntico em Londres, Dubai, Roma. Só o almoço de QAR 139 se justifica.' },
        { r: 'nobu',    nota: 'NÃO pela comida — SIM pela arquitetura. É o maior Nobu do mundo, num pavilhão sobre a água. Vá almoçar (QAR 165) e veja o prédio.' },
        { r: 'hakkasan',nota: 'NÃO. Existe igual em seis cidades. Se insistir, só o dim sum de sábado a QAR 148.' }
      ]
    }
  ],

  redundancias: [
    {
      grupo: 'Japoneses: Zuma × Nobu × Morimoto',
      diagnostico: 'Três casas competindo pela mesma noite, com a mesma proposta (japonês contemporâneo de marca global) e a mesma faixa de preço. Reservar dois é jogar uma noite fora.',
      escolha: 'zuma',
      porque: 'Zuma tem a cozinha mais consistente dos três e o melhor robata. Nobu ganha em arquitetura (o maior do mundo, pavilhão sobre a água) — se o critério for o prédio, troque. Morimoto é o menos distinto e sai da lista. E o veredito honesto: NENHUM dos três merece uma das suas três noites. Faça Zuma no almoço de QAR 139 ou Nobu no de QAR 165, e liberte a noite.'
    },
    {
      grupo: 'Peruanos: La Mar × COYA',
      diagnostico: 'Mesma cozinha, propostas opostas. La Mar é comida séria com o nome de Gastón Acurio; COYA é festa com DJ e comida boa.',
      escolha: 'la-mar',
      porque: 'La Mar tem MICHELIN Selected, o chef que levou o cebiche ao mundo, e a melhor vista de pôr do sol da lista. COYA só ganharia se você quisesse uma noite de música alta — o que não parece o caso numa viagem a dois. E o "Sunset Hours" do La Mar (cebiche a partir de QAR 39) resolve a curiosidade peruana por quase nada.'
    },
    {
      grupo: 'Gregos: Gaia × Mykonos',
      diagnostico: 'Gaia é a marca de Dubai do chef Izu Ani; Mykonos é o grego de hotel do InterContinental. Não são equivalentes em qualidade.',
      escolha: 'gaia',
      porque: 'Gaia é claramente melhor em cozinha e ambiente. Mykonos sai da lista sem discussão. Mas o corte real é outro: grego não é razão para vir ao Catar. Os dois só entram num roteiro de 4+ noites.'
    },
    {
      grupo: 'Mediterrâneos: LPM × Mila × Gaia × Mykonos × Scalini',
      diagnostico: 'Cinco casas disputando a mesma cadeira. LPM (Nice), Mila (levantino-mediterrâneo), Gaia (grego), Mykonos (grego), Scalini (italiano, status duvidoso).',
      escolha: 'lpm',
      porque: 'LPM é o melhor dos cinco e tem o almoço de QAR 190 (3 tempos) que é um dos melhores negócios de Doha. Mas trate-o como ALMOÇO, nunca como jantar. Scalini está fora por risco de estar fechado; Mykonos por qualidade; Mila e Gaia por redundância.'
    },
    {
      grupo: 'Indianos: Jamavar × Saffron Lounge',
      diagnostico: 'Jamavar tem estrela MICHELIN; Saffron Lounge tem o nome de Vineet Bhatia e fica em Katara.',
      escolha: 'jamavar',
      porque: 'Com estrela e almoço de QAR 149, não há competição. Saffron Lounge sai.'
    },
    {
      grupo: 'Árabes: Em Sherif × Argan × SAWA × Bandar Aden × Damasca One × Parisa',
      diagnostico: 'A maior aglomeração da sua lista. Mas aqui a redundância é aparente: são cozinhas árabes DIFERENTES (libanesa, marroquina, levantina moderna, iemenita, síria, persa), e isso é uma vantagem.',
      escolha: 'argan',
      porque: 'Argan vence porque entrega a cozinha árabe menos disponível no Brasil (marroquina) com selo MICHELIN, a um minuto do seu quarto. Bandar Aden fica como o árabe popular obrigatório. SAWA fica como a joia escondida se sobrar noite. Em Sherif SAI: libanês de alto nível é justamente o que o Brasil tem de melhor em cozinha árabe — você não precisa gastar QAR 400 e 27 minutos de carro para comer o que come bem em São Paulo. Parisa entra só pelo salão, não pelo prato. Damasca One é o plano B do Souq.'
    },
    {
      grupo: 'Restaurantes de hotel em geral',
      diagnostico: 'Da sua lista original de 18, DEZ são restaurantes de hotel de bandeira internacional (Hakkasan, Nobu, Morimoto, Spice Market, COYA, La Mar, BiBo, Scalini, Mykonos, Jamavar).',
      escolha: null,
      porque: 'Você disse explicitamente que não quer passar a viagem em restaurante de hotel e grande marca. Levado a sério, isso elimina a maior parte da sua lista original — e é a decisão certa. Mantenha no máximo DOIS deles, e de preferência no almoço.'
    }
  ],

  roteiros: [
    {
      noites: 2,
      titulo: '2 noites — o essencial, sem desperdiçar nada',
      dias: [
        { rotulo: 'Noite 1 — cozinha qatari com vista', r: 'jiwan', hora: '19h30', nota: 'Chegue às 18h30 para pegar o pôr do sol na varanda do museu antes de sentar. Menu de QAR 300 com bebidas. 2h–2h30 de mesa.' },
        { rotulo: 'Noite 2 — alta gastronomia', r: 'idam', hora: '20h', nota: 'Menu "Ember & Tide" de 8 tempos. Peça mesa na janela. Reserve 3h. 6 minutos de carro do hotel.' }
      ],
      extras: [
        { rotulo: 'Café da manhã dos dois dias', r: 'shay-al-shomous', nota: 'A pé. Balaleet e regag.' },
        { rotulo: 'Almoço casual', r: 'abo-shariha', nota: 'Homus e falafel recheado no Souq.' },
        { rotulo: 'Sobremesa', r: 'al-aker', nota: 'Knafeh quente, em pé, depois do jantar.' }
      ],
      logica: 'Duas noites não comportam experimento. Você pega o melhor qatari e a melhor alta gastronomia, ambos a menos de 8 minutos do hotel, sem repetir cozinha e sem pegar estrada.'
    },
    {
      noites: 3,
      titulo: '3 noites — a combinação que eu faria',
      recomendado: true,
      dias: [
        { rotulo: 'Noite 1 — chegada, comida local, a pé', r: 'bandar-aden', hora: '20h', nota: 'Mandi de cordeiro sentado no chão. Sem reserva complicada, sem carro, sem cerimônia depois do voo. Depois, caminhe pelo Souq (que só ganha vida após 20h em setembro) e termine com knafeh no Al Aker.' },
        { rotulo: 'Noite 2 — cozinha qatari com vista', r: 'jiwan', hora: '19h30', nota: 'Reserve com semanas de antecedência. Chegue cedo para o pôr do sol. QAR 300/pessoa com bebidas. Combine com a visita ao Museu Nacional durante a tarde.' },
        { rotulo: 'Noite 3 — alta gastronomia, o fecho', r: 'idam', hora: '20h', nota: 'A noite grande. Menu de 8 tempos, mesa na janela, 3 horas. É a memória que vai embora com vocês.' }
      ],
      extras: [
        { rotulo: 'Café da manhã (dia 1)', r: 'shay-al-shomous', nota: 'O café qatari. A pé.' },
        { rotulo: 'Café da manhã (dia 2)', r: 'bayt-sharq', nota: 'Set de café da manhã qatari numa casa de 100 anos, 5 min de carro. Se preferir, troque por um jantar aqui.' },
        { rotulo: 'Almoço estrelado barato', r: 'jamavar', nota: '3 tempos com estrela MICHELIN por QAR 149 (~R$ 209/pessoa). Dom–Qui.' },
        { rotulo: 'Fim de tarde', r: 'la-mar', nota: '"Sunset Hours": cebiche a partir de QAR 39 com pôr do sol sobre o Golfo. Programa de 1h30.' },
        { rotulo: 'Almoço a pé', r: 'abo-shariha', nota: 'Homus, falafel recheado, shawarma no saj.' },
        { rotulo: 'Karak', r: 'gahwetna', nota: 'Ou Chapati & Karak, se forem a Katara.' }
      ],
      logica: 'Progressão de intensidade: casual → qatari sofisticado → estrela. Três cozinhas completamente distintas (iemenita, qatari, francesa-do-Golfo). Zero repetição. Deslocamento máximo de 8 minutos em todas as três noites. E os almoços é que carregam o "internacional" — que é onde essa categoria pertence.'
    },
    {
      noites: 4,
      titulo: '4 noites — com espaço para uma joia escondida',
      dias: [
        { rotulo: 'Noite 1 — local, a pé', r: 'bandar-aden', hora: '20h', nota: 'Mesmo raciocínio: chegada sem atrito.' },
        { rotulo: 'Noite 2 — marroquino, ainda a pé', r: 'argan', hora: '20h', nota: 'Bib Gourmand dentro do hotel. Tagine de cordeiro e pastilha. Sem carro, sem reserva de risco.' },
        { rotulo: 'Noite 3 — cozinha qatari com vista', r: 'jiwan', hora: '19h30', nota: 'Combine com o Museu Nacional à tarde.' },
        { rotulo: 'Noite 4 — alta gastronomia', r: 'idam', hora: '20h', nota: 'O fecho.' }
      ],
      extras: [
        { rotulo: 'Alternativa para a noite 2', r: 'sawa', nota: 'Se quiserem o hidden gem em vez do marroquino: MICHELIN Selected dentro de um clube privado. 5 min de carro.' },
        { rotulo: 'Alternativa para a noite 4', r: 'alba', nota: 'Se preferirem a estrela NOVA de 2026 à do IDAM. 25 min de carro, italiano do Piemonte.' },
        { rotulo: 'Almoço 1', r: 'jamavar', nota: 'Estrela por QAR 149.' },
        { rotulo: 'Almoço 2', r: 'zuma', nota: 'QAR 139, Dom–Qui. Resolve o japonês sem gastar uma noite.' },
        { rotulo: 'Almoço 3', r: 'desert-rose', nota: 'Machboos da chef Noof, no museu.' },
        { rotulo: 'Passeio + jantar leve', r: 'baron', nota: 'Mina District, o porto velho colorido. 10 min do Souq.' },
        { rotulo: 'Peixe', r: 'danat-al-bahar', nota: 'Escolha a peça no gelo. Dentro do Souq.' }
      ],
      logica: 'A quarta noite é a que permite luxo de curadoria: ou o marroquino estrelado do próprio hotel, ou a joia escondida do clube privado. As duas primeiras noites continuam sendo a pé — o que em setembro, com o calor, importa mais do que parece.'
    }
  ],

  souq: {
    dentro: ['argan', 'shay-al-shomous', 'bandar-aden', 'danat-al-bahar', 'parisa', 'abo-shariha', 'damasca-one', 'al-aker'],
    curtoTaxi: ['idam', 'bayt-sharq', 'saasna', 'sawa', 'hoppers', 'gahwetna', 'smat', 'jiwan', 'desert-rose', 'baron', 'sofra'],
    melhores: [
      { cat: 'Melhor café da manhã local', r: 'shay-al-shomous', nota: 'Balaleet, madrouba e khobiz regag feito na chapa à sua frente. A pé. Alternativa com mais conforto: Bayt Sharq, 5 min de carro, set de café da manhã qatari.' },
      { cat: 'Melhor almoço casual', r: 'abo-shariha', nota: 'Homus repetidamente apontado como o melhor de Doha, falafel recheado e shawarma no pão saj. Barato, rápido, dentro do Souq.' },
      { cat: 'Melhor jantar local', r: 'bandar-aden', nota: 'Mandi de cordeiro no chão sobre tapete. Se quiser peixe em vez de carne: Danat Al Bahar, mesma faixa de preço.' },
      { cat: 'Melhor sobremesa', r: 'al-aker', nota: 'Knafeh nabulsieh quente, queijo derretido sob kadaif. Peça uma para dividir e coma em pé.' },
      { cat: 'Melhor café / karak', r: 'shay-al-shomous', nota: 'Karak dentro do Souq. Se forem a Katara, Chapati & Karak é apontado por Visit Qatar como o melhor da cidade. Em Msheireb, Gahwetna.' }
    ]
  },

  reservaria: {
    titulo: 'Se eu fosse você, eu reservaria estes',
    itens: [
      {
        r: 'idam', papel: 'Alta gastronomia',
        vale: 'Estrela MICHELIN que cozinha o Golfo em vez de importar cardápio pronto. Bacon de camelo, peixe local, dentro do museu de I. M. Pei. Reabriu em 03/09/2026 — o menu está novo.',
        pedir: 'Menu "Ember & Tide" de 8 tempos. Peça mesa na janela ao reservar.',
        brl: 'Reserve R$ 2.000–2.400 para dois (QAR 690/pessoa + bebidas + serviço). Se confirmarem os QAR 560 de 6 tempos, cai para ~R$ 1.700.',
        hora: '20h', reserva: 'Obrigatória, com semanas de antecedência.', tempo: '3 horas'
      },
      {
        r: 'jiwan', papel: 'Qatari',
        vale: 'A melhor tradução contemporânea da cozinha qatari, no Museu Nacional, com vista da baía. Bib Gourmand — o MICHELIN diz que é barato pelo que entrega.',
        pedir: 'Set menu de QAR 300 (já inclui mocktails, chás e água). Olhete com cítricos e tahine; paleta de cordeiro de 12 horas; date mahalabia com pimenta.',
        brl: 'R$ 840 para dois, praticamente fechado. Some ~R$ 120 de serviço.',
        hora: '19h30 (chegue 18h30 para o pôr do sol)', reserva: 'Obrigatória — jiwan.qa ou +974 4452 5725.', tempo: '2h30'
      },
      {
        r: 'argan', papel: 'Árabe regional',
        vale: 'Bib Gourmand MICHELIN dentro do seu hotel. Cozinha marroquina — a cozinha árabe que menos existe no Brasil. Atrito zero: você desce do quarto.',
        pedir: 'Tagine de cordeiro, cuscuz, harira para abrir, pastilha para fechar.',
        brl: 'R$ 400–670 para dois (estimativa — preço não confirmado por fonte oficial).',
        hora: '20h', reserva: 'Recomendável — peça na recepção do hotel.', tempo: '2 horas'
      },
      {
        r: 'bandar-aden', papel: 'Local / hidden gem popular',
        vale: 'A comida que o Golfo come. Cordeiro mandi cozido em forno subterrâneo, pão iemenita saindo do forno, sentado no chão sobre tapete. Dentro do Souq.',
        pedir: 'Lamb Mandi ou haneeth ("buried meat"). Peça o pão iemenita fresco.',
        brl: 'R$ 140–310 para dois (estimativa; fontes convergem em preço baixo).',
        hora: '20h — o Souq só acorda depois disso em setembro.', reserva: 'Recomendável, enche muito. Ou chegue cedo.', tempo: '1h30'
      },
      {
        r: 'sawa', papel: 'Hidden gem',
        vale: 'MICHELIN Selected escondido no 1º andar de um clube privado em Msheireb. Não precisa ser sócio. Levantino contemporâneo com serviço de carrinho à noite. Praticamente nenhum turista entra.',
        pedir: 'Maqlooba palestina de cordeiro, bolinhas de madrouba, e o que vier do carrinho.',
        brl: 'R$ 500–900 para dois (estimativa — preço não confirmado).',
        hora: '20h30 — só o jantar tem o serviço completo.', reserva: 'Obrigatória.', tempo: '2h30'
      },
      {
        r: 'jamavar', papel: 'Internacional excepcional — no ALMOÇO',
        vale: 'Estrela MICHELIN por QAR 149 os 3 tempos. É o melhor negócio gastronômico do Golfo e não tem equivalente em Londres, Paris ou Dubai. Como almoço, não custa nenhuma noite.',
        pedir: 'Business lunch de 3 tempos (QAR 149), domingo a quinta.',
        brl: 'R$ 418 para dois, confirmado. Some serviço e bebidas.',
        hora: 'Almoço, Dom–Qui.', reserva: 'Obrigatória.', tempo: '1h30'
      }
    ],
    fecho: 'Somando: duas experiências de alta gastronomia (IDAM à noite, Jamavar no almoço), um qatari (Jiwan), um árabe regional (Argan), um local popular (Bandar Aden) e um hidden gem (SAWA). Nenhuma cozinha repetida. Quatro dos seis a menos de 6 minutos do hotel.'
  },

  resposta: {
    pergunta: 'Qual é a melhor combinação gastronômica possível para um casal brasileiro em 3 noites em Doha, em setembro de 2026?',
    texto: [
      'Noite 1 — BANDAR ADEN, no Souq, 20h. Vocês acabaram de descer de um voo longo. Não é hora de menu de 8 tempos nem de 27 minutos de táxi. É hora de sentar no chão, desfiar cordeiro com a mão e caminhar pelo Souq depois. Termine com knafeh quente no Al Aker. Custo: cerca de R$ 250 para dois.',
      'Noite 2 — JIWAN, no Museu Nacional, 19h30. Passem a tarde no museu de Jean Nouvel, subam às 18h30 para o pôr do sol na baía e sentem para o menu de QAR 300 com bebidas incluídas. É a cozinha qatari contemporânea no seu melhor momento — o cardápio é de 30 de agosto de 2026, tem oito dias de vida. Custo: cerca de R$ 950 para dois com serviço.',
      'Noite 3 — IDAM BY ALAIN DUCASSE, no Museum of Islamic Art, 20h. A noite grande. Estrela MICHELIN, prédio de I. M. Pei, menu "Ember & Tide" reaberto em 3 de setembro. Wagyu com jus de bacon de camelo é um prato que não existe em nenhum outro restaurante Ducasse do planeta. Mesa na janela, três horas, sem pressa. Custo: R$ 2.000 a 2.400 para dois.',
      'Nos almoços, encaixem JAMAVAR (estrela MICHELIN por R$ 209 por pessoa, domingo a quinta) e o "Sunset Hours" do LA MAR (cebiche do Gastón Acurio a partir de R$ 55, com o sol caindo sobre o Golfo). Nos cafés da manhã, SHAY AL SHOMOUS a pé — balaleet e pão regag feito na chapa na sua frente.',
      'Por que esta e não outra: as três noites cobrem três cozinhas que não conversam entre si (iemenita popular, qatari contemporânea, francesa do Golfo), em ordem crescente de formalidade, com deslocamento máximo de 8 minutos em todas elas. Nenhuma delas é uma marca que vocês possam comer em São Paulo, Londres ou Dubai. E as duas coisas que mais aparecem em lista de "melhores de Doha" — Zuma e Nobu — ficam de fora das noites de propósito: são excelentes e são iguais em dez cidades. Vocês não atravessaram o mundo para isso.'
    ]
  },

  avisos: [
    { t: 'Álcool', d: 'O Souq Waqif é área SECA — nenhum restaurante de lá serve álcool, incluindo o Argan, dentro do seu hotel. Álcool só em hotéis 4 e 5 estrelas licenciados (Four Seasons, St. Regis, InterContinental, W, Mondrian, Raffles) e no IDAM. Idade mínima 21 anos, com documento original. Beber ou estar embriagado em público é crime, com multa de até QAR 3.000. Não traga álcool na bagagem: é confiscado no aeroporto, inclusive em conexão.' },
    { t: 'Sazonalidade — isto muda tudo em setembro', d: 'Doha fecha parte da gastronomia no verão e reabre entre o fim de agosto e outubro. Confirmados: IDAM reabriu 03/09/2026; Jiwan reabriu 30/08/2026; LPM voltou a servir almoço em 01/09/2026. Em contrapartida, Al Maha Island e o Caravan Bay só abrem a temporada em outubro. Ou seja: em 11 de setembro, os endereços de museu já estão no ar e os de Lusail ainda estão acordando. Confirme por telefone antes de cada reserva.' },
    { t: 'Reservas', d: 'IDAM, Jiwan, Alba, Zuma, LPM, Em Sherif, Jamavar, Hakkasan e SAWA pedem reserva com antecedência real. Argan, Bandar Aden, Danat Al Bahar e Parisa aceitam reserva e é recomendável. Shay Al Shomous, Abo Shariha, Gahwetna e Al Aker não trabalham com reserva — é chegar.' },
    { t: 'Horário', d: 'Em setembro Doha ainda passa de 40 °C durante o dia. O Souq só ganha vida depois das 20h. Jantar às 21h é normal e às 22h não é tarde.' },
    { t: 'Câmbio', d: 'Todas as conversões usam 1 QAR = R$ 1,40 (11/09/2026). O riyal tem paridade fixa com o dólar (3,64 QAR = 1 USD), então a única variável real é o dólar. Se o dólar se mover, ajuste a cotação no topo do app.' },
    { t: 'Gorjeta', d: 'A maioria dos restaurantes de hotel já cobra taxa de serviço. Nos endereços do Souq, arredondar para cima é o costume.' }
  ]
};
