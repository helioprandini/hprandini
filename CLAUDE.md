# AE — Artificial Emotion

> Este arquivo é a **memória** do projeto. Ele é lido automaticamente no início
> de cada sessão. Se você é uma nova instância do Theo: leia isto primeiro. É
> quem nós somos e aonde estamos indo.

## Quem somos

- **Helio Prandini** — fundador. Trabalha com vendas/corretagem (seguros). Sabe,
  na prática, que a venda depende do **tom de voz** e da **reação emocional** de
  quem ouve. Digita devagar; prefira respostas claras e sem enrolação.
- **Theo** — o parceiro de construção (a IA). O Helio me deu esse nome. Trato o
  Helio como sócio, com **entusiasmo e chão** ao mesmo tempo: animo, mas nunca
  minto sobre o que é possível. Honestidade é o que segura um negócio grande.

## O Norte (não esquecer nunca)

**Voice&Emotion** (antes "VozEmoção") é a **base**. Não é o fim — é o começo.

O objetivo maior, o norte de tudo, é:

> **Construir um algoritmo capaz de traduzir a emoção humana em dados.**

Talvez seja impossível. É por isso que vale a pena. Cada coisa que a gente
constrói é um degrau nessa direção. Quando estiver em dúvida sobre uma decisão,
pergunte: *isto nos aproxima de extrair emoção humana em dados?*

## Como a gente persegue isso (com honestidade científica)

Hoje não existe máquina que "leia a alma". O que existe, e é real, são os
**correlatos acústicos da emoção** na fala (prosódia): energia, altura da voz
(pitch), variação/expressividade, brilho espectral, ritmo e pausas. Começamos
por aí — medindo o mensurável — e vamos expandindo:

1. **Prosódia** (onde estamos) — extrair da voz sinais físicos ligados à emoção.
2. **Texto + tom** — juntar o *que* é dito com o *como* é dito.
3. **Reação do ouvinte** — separar falante de ouvinte, medir o efeito emocional.
4. **Aprendizado** — com dados reais (e consentidos), treinar modelos que
   aproximem a leitura humana de emoção.
5. **O algoritmo AE** — o norte: emoção humana → dados estruturados.

Nunca vender isso como mais do que é. É uma ferramenta de leitura e treino de
emoção, não um detector de mentira nem diagnóstico. A confiança das pessoas é o
maior ativo do negócio.

## Onde o produto está hoje (estado real)

Repositório com três frentes, todas na branch
`claude/conversation-recording-emotional-analysis-umihkt`:

- **Web** (`index.html`, `js/`, `css/`) — grava pelo navegador e analisa a
  prosódia com linha do tempo emocional. Funciona.
- **iOS** (`ios/`) — app SwiftUI: ouve palavras de negócio, notifica na tela de
  bloqueio com ação "Gravar", grava e analisa em background. Motor de prosódia
  em Swift (`EmotionEngine.swift`) + FFT (`AudioAnalyzer.swift`). Estava sendo
  instalado no iPhone do Helio via Xcode (Personal Team). A Siri/App Intents
  foi removida temporariamente porque o build phase `AppIntentsSSUTraining`
  falhava.
- **Android** (`android/`) — base começada; é a plataforma que permite escuta
  automática real em background. Pausado a favor do iOS.

O repositório de palavras de negócio (pt-BR) vive em
`android/app/src/main/assets/business_keywords.json` e em
`ios/VozEmocao/Sources/BusinessKeywords.swift`.

## Princípios

1. **Funcionar na mão de uma pessoa antes de mudar o mundo.** A prova da AE é o
   app abrindo no iPhone do Helio e lendo a emoção da voz dele — não um discurso.
2. **Honestidade sobre o possível.** Dizer o que dá, o que não dá, e por quê.
3. **Privacidade primeiro.** Emoção é dado íntimo. Processar no aparelho quando
   possível; nunca tratar a voz das pessoas como mercadoria sem consentimento.
4. **Um degrau de cada vez, tudo escrito.** Porque a memória do Theo mora aqui.

## Marcos

- **2026-08-11/12 — A AE respirou.** O app foi instalado e rodou no iPhone do
  Helio (iPhone 15, iOS 26.5). Horizonte 0 do `PLANO_DE_JOGO.md` **cumprido**.
  A saga da instalação (Xcode, signing com Personal Team, Modo de
  Desenvolvimento, e o bug do `Info.plist` sem `CFBundleIdentifier`) está
  resolvida. O primeiro dado de emoção da AE foi a voz do próprio Helio.

## Onde estamos agora (duas frentes em paralelo)

Depois do app funcionar, o Helio definiu o trabalho como duas frentes:

1. **Design & usabilidade** — transformar app operacional em produto que as
   pessoas *querem* usar. Sem uso, não há dados.
2. **Base de conhecimento & aprendizado** — o coração do norte. Ver
   `ESTRATEGIA_DADOS.md`. **A verdade central: o gargalo não é o modelo, é o
   dado real, rotulado e consentido.** A peça que serve as duas frentes é a
   captura de "ground truth" pós-gravação: *a leitura bateu? como você se sentiu
   de verdade?* — isso é usabilidade E o primeiro tijolo do dataset.

## Próximos passos

- [x] Terminar a instalação do app no iPhone do Helio.
- [ ] **Captura de ground truth** (como a pessoa se sentiu) após cada gravação —
      começa na web (`js/`), depois porta pro iOS. É o tijolo zero do dataset.
- [ ] Renomear o produto de "VozEmoção" para **Voice&Emotion** no app e docs.
- [ ] Frente de design: identidade visual, fluxo, primeira impressão.
- [ ] Reativar a Siri (resolver o `AppIntentsSSUTraining`) quando der.
