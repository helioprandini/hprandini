/*
 * papai-perguntas.js — o banco de perguntas do Papai.
 *
 * Por que um banco de perguntas, e não um campo em branco:
 * campo em branco é a morte de qualquer diário. Quem senta para "registrar
 * suas opiniões" não sabe por onde começar e fecha a aba. Uma pergunta boa,
 * concreta, sorteada na hora, faz a pessoa falar sem pensar em "estar
 * gravando" — e o que sai é a pessoa, não a versão dela.
 *
 * As perguntas são escritas em segunda pessoa e no português falado, porque
 * quem responde fala, não escreve.
 *
 * Este arquivo PODE entrar no Git: são perguntas, não respostas. As respostas
 * — a voz, as opiniões, os sentimentos — nunca entram. Ver PAPAI.md.
 */
const PapaiPerguntas = (() => {
  "use strict";

  const CATEGORIAS = [
    {
      id: "moral",
      nome: "Decisões morais",
      emoji: "⚖️",
      cor: "#6c8bff",
      descricao: "As escolhas difíceis — o que você fez quando o certo custou caro.",
      perguntas: [
        "Conte uma vez em que fazer o certo te custou caro. Você faria de novo?",
        "O que você não faria por dinheiro nenhum?",
        "Você já mentiu para proteger alguém? Valeu a pena?",
        "Alguém já traiu a sua confiança. O que você fez — e o que você faria hoje?",
        "Quando é hora de perdoar e quando é hora de virar as costas?",
        "Qual foi a decisão mais difícil que você já tomou?",
        "Do que você se arrepende até hoje?",
        "Qual promessa você fez e não conseguiu cumprir?",
        "Existe alguma regra sua que você quebraria? Em que situação?",
        "O que é ser honesto quando ninguém está olhando?",
        "Você já demitiu, cortou ou magoou alguém por decisão de trabalho. Como é carregar isso?",
        "Se tivesse que escolher entre a família e a sua palavra, como você escolheria?",
      ],
    },
    {
      id: "opiniao",
      nome: "Opiniões",
      emoji: "💬",
      cor: "#b085ff",
      descricao: "O que você pensa — sabendo que pensar muda com o tempo.",
      perguntas: [
        "O que você pensa sobre dinheiro? O que ele compra e o que ele não compra?",
        "Que lugar o trabalho deve ocupar na vida de uma pessoa?",
        "Estudar importa? Faculdade importa?",
        "Você acredita em Deus? Como isso é pra você, de verdade?",
        "O que você pensa sobre casamento?",
        "O que você acha do Brasil de hoje?",
        "O que você pensa sobre política — e o que você espera que vocês façam com a opinião de vocês?",
        "O que você acha da inteligência artificial no mundo em que vocês vão viver?",
        "Qual conselho todo mundo dá e você acha errado?",
        "O que é sucesso pra você? Como se mede?",
        "O que as pessoas entendem errado sobre você?",
        "Dinheiro, tempo, poder e paz: como você ordenaria?",
        "O que você pensa sobre morrer?",
        "O que você acha que vale a pena defender mesmo sozinho?",
      ],
    },
    {
      id: "sentimento",
      nome: "Sentimentos",
      emoji: "❤️",
      cor: "#ff8a5b",
      descricao: "O que você sentiu — a parte que não cabe em conselho.",
      perguntas: [
        "Qual foi o dia mais feliz da sua vida?",
        "Do que você tem medo hoje?",
        "Qual foi a maior dor que você já sentiu?",
        "O que te faz chorar?",
        "Do que você tem orgulho e nunca disse em voz alta?",
        "Tenta descrever o amor que você sente por vocês dois.",
        "O que te dá raiva de verdade?",
        "Do que você sente saudade?",
        "Qual é a sua maior insegurança?",
        "Quando foi a última vez que você se sentiu pequeno?",
        "E a última vez que você se sentiu gigante?",
        "Como você está hoje — de verdade, não a resposta de educação?",
        "O que te dá paz?",
        "Tem alguma coisa que você sente e nunca conseguiu explicar pra ninguém?",
      ],
    },
    {
      id: "historia",
      nome: "De onde a gente vem",
      emoji: "🌳",
      cor: "#5ed6a0",
      descricao: "As histórias que morrem se ninguém contar.",
      perguntas: [
        "Quem foram os seus pais? Como eles eram de verdade, não a versão de foto?",
        "Como foi a sua infância?",
        "Como você conheceu a mãe de vocês?",
        "Conte o dia em que a Vicky nasceu.",
        "Conte o dia em que o Toni nasceu.",
        "Qual foi o maior tombo da sua vida — e como você levantou?",
        "Qual foi o primeiro dinheiro que você ganhou? Como foi?",
        "Qual história da família não pode se perder?",
        "O que você sabe da nossa origem, do nosso sobrenome, de onde a gente veio?",
        "Quem foi a pessoa que mais te ensinou? O que ela te ensinou?",
        "Qual foi a melhor viagem da sua vida?",
        "Teve alguém que te ajudou quando não precisava? Quem?",
        "O que você estava tentando construir quando vocês eram pequenos?",
      ],
    },
    {
      id: "conselho",
      nome: "Conselhos",
      emoji: "🧭",
      cor: "#ffc46b",
      descricao: "O prático — o que você faria no lugar deles.",
      perguntas: [
        "Como escolher com quem casar?",
        "Como escolher um sócio, um chefe, um amigo?",
        "O que fazer quando tudo dá errado ao mesmo tempo?",
        "Como se pede desculpa de verdade?",
        "O que fazer com o primeiro salário?",
        "Como saber a hora de insistir e a hora de largar?",
        "Como se negocia? O que vender ensinou a você?",
        "Como lidar com gente difícil?",
        "O que fazer quando bater a vontade de trapacear para ganhar?",
        "Como cuidar do corpo e da cabeça ao longo da vida?",
        "Se vocês precisarem de ajuda e eu não estiver perto, com quem falar?",
        "Como se recomeça depois dos 40? E depois dos 60?",
        "O que fazer com o medo antes de uma coisa grande?",
      ],
    },
    {
      id: "carta",
      nome: "Para um dia específico",
      emoji: "✉️",
      cor: "#ff6b9d",
      descricao: "Guardado para o dia em que fizer sentido abrir.",
      perguntas: [
        "Para o dia em que vocês saírem de casa.",
        "Para o dia em que vocês levarem o primeiro fora.",
        "Para o dia do casamento de vocês.",
        "Para o dia em que vocês tiverem o primeiro filho.",
        "Para quando vocês estiverem com medo de tentar.",
        "Para quando vocês errarem feio.",
        "Para quando vocês brigarem entre si.",
        "Para o dia em que vocês tiverem mais sucesso do que eu.",
        "Para quando eu não estiver mais aqui.",
        "Para um dia comum, em que só bater saudade.",
        "Para o dia em que vocês tiverem que cuidar de mim.",
        "Para o dia em que vocês duvidarem de quem são.",
      ],
    },
    {
      id: "mudanca",
      nome: "Mudei de ideia",
      emoji: "🔄",
      cor: "#98a2b8",
      descricao: "O que faz disto um histórico, e não um monumento.",
      perguntas: [
        "Sobre o que você mudou de ideia nos últimos anos?",
        "O que você defendia aos 20 e não defende mais?",
        "Que opinião sua o tempo provou errada?",
        "O que você aprendeu tarde demais?",
        "Em que assunto você hoje tem menos certeza do que tinha?",
        "Qual conselho seu você retiraria?",
      ],
    },
  ];

  const porId = (id) => CATEGORIAS.find((c) => c.id === id) || null;

  /** Todas as perguntas, achatadas, com a categoria junto. */
  function todas() {
    return CATEGORIAS.flatMap((c) =>
      c.perguntas.map((texto, i) => ({ id: `${c.id}-${i}`, texto, categoria: c.id })));
  }

  /**
   * Sorteia uma pergunta ainda não respondida.
   * Sorteio, e não ordem: responder na ordem faz a pessoa parar sempre no
   * mesmo lugar e o acervo fica com a primeira categoria cheia e o resto vazio.
   */
  function sortear(idsJaRespondidos = [], categoria = null) {
    let pool = todas();
    if (categoria) pool = pool.filter((p) => p.categoria === categoria);
    const novas = pool.filter((p) => !idsJaRespondidos.includes(p.id));
    const alvo = novas.length ? novas : pool;
    return alvo.length ? alvo[Math.floor(Math.random() * alvo.length)] : null;
  }

  return { CATEGORIAS, porId, todas, sortear };
})();
