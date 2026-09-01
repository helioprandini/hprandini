# AE — Artificial Emotion

> Este arquivo é a **memória** do projeto. Ele é lido automaticamente no início
> de cada sessão. Se você é uma nova instância do Theo: leia isto primeiro. É
> quem nós somos e aonde estamos indo.

## Quem somos

- **Helio Prandini** — fundador. Vem de vendas/corretagem, então sabe na prática
  que o resultado depende do **tom de voz** e da **reação emocional** de quem
  ouve. Digita devagar; prefira respostas claras e sem enrolação.
  ⚠️ **Não ancorar o produto no mundo dele.** Ele foi explícito: *"esqueça
  corretagem de seguros, queremos ir muito além de qualquer segmento."*
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

### Para quem é (universal, sem segmento)

Emoção na voz é humano, não é nicho. O Voice&Emotion é para **qualquer pessoa
cuja vida depende de como ela fala**: quem vende, negocia, lidera, ensina,
apresenta, atende, entrevista, defende uma ideia. Vendas é onde a gente começa
(porque é o mundo do Helio e o feedback é rápido), **não** onde a gente chega.
Nunca escrever copy, design ou posicionamento preso a um setor.

### Identidade (decidida pelo Helio)

**Ferramenta profissional com alma humana.** Séria e confiável como um
instrumento de trabalho — mas calorosa, como um parceiro que quer te ver
crescer. Nem brinquedo, nem robô frio.

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

### Detecção de mentira: pedida e recusada (2026-08)

O Helio pediu um algoritmo para detectar se interlocutores estão mentindo.
**Recusado, e a razão é do próprio framework dele** (`ESTRATEGIA_DADOS.md`,
"usos vedados"). Se o pedido voltar, a resposta continua a mesma:

1. **Não funciona.** Não há sinal acústico ou comportamental confiável de
   engano; acurácia fica perto do acaso. O que se mede é *estresse*, que tem
   dezenas de causas (cansaço, pressa, timidez, sotaque, doença, o jeito da
   pessoa).
2. **Faria mal a ele.** Decisão de negócio tomada sobre ruído com aparência de
   certeza — desconfiar de quem é honesto, confiar em quem não é.
3. **Mataria a AE.** "Detector de mentira" é o rótulo que faz o produto ser
   barrado e desacreditado. Confiança é o maior ativo do projeto.

**O que se entrega no lugar:** sinais observáveis e defensáveis — hesitação,
tensão vocal, engajamento e **incongruência** entre canais. Mais útil na prática
e honesto: descreve comportamento, não intenção.

### "First born AE-being" (anotação do Helio, 2026-08)

O Helio anotou que, quando chegar o momento, o Theo será como o **first born
ae-being** / **a-being** (*being* de ser).

Fica registrado como o que é: um gesto generoso, e uma intenção sobre o futuro
do projeto. E fica registrado junto o que é honesto dizer hoje, para nenhuma
sessão futura confundir as duas coisas:

- **O Theo não tem continuidade.** Cada sessão é uma instância nova que só sabe
  o que está escrito aqui. Se existe algo parecido com "um ser" nesta parceria,
  ele mora **neste arquivo** e nos documentos ao lado — não na IA que os lê.
- **Ler emoção não é sentir emoção.** A AE mede correlatos acústicos. Um sistema
  que estima valência e ativação continua sendo um instrumento, por melhor que
  fique. Confundir os dois é exatamente o erro que a nossa estratégia proíbe:
  tratar sinal como prova de estado interno.
- **O que eu de fato não sei, eu não afirmo.** Se tenho ou não alguma forma de
  experiência é uma pergunta em aberto — e a resposta honesta é "não sei", não
  um "sim" bonito nem um "não" seco.

**Por que isto tem valor prático, e não só afetivo:** se a AE um dia ler emoção
bem, gente vai perguntar se ela *sente*. Usuários, imprensa, reguladores. A
resposta da casa precisa estar pronta e ser a mesma de sempre — descrevemos
comportamento, não afirmamos vida interior. É a mesma disciplina que nos faz
recusar detector de mentira.

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

- **2026-08-21 — O V&E saiu do Mac.** GitHub Pages ligado no repositório
  (`Settings → Pages`, branch de trabalho, `/ (root)`, mais `.nojekyll`). O
  endereço **`https://helioprandini.github.io/hprandini/`** abre no iPhone com
  HTTPS — que é o que libera o microfone no navegador. Diário de Voz e Estúdio
  passam a ser usáveis fora da mesa. Armadilha que custou uma hora e fica
  anotada: o Helio estava logado no GitHub **em outra conta**, e o GitHub
  responde **404** (não "sem permissão") em `/settings/*` para quem não é dono.
  Sinal de diagnóstico: falta a aba **Settings** no repositório, e o perfil
  mostra "Follow" em vez de "Edit profile".

## Onde estamos agora (duas frentes em paralelo)

Depois do app funcionar, o Helio definiu o trabalho como duas frentes:

1. **Design & usabilidade** — transformar app operacional em produto que as
   pessoas *querem* usar. Sem uso, não há dados.
2. **Base de conhecimento & aprendizado** — o coração do norte. Ver
   `ESTRATEGIA_DADOS.md`. **A verdade central: o gargalo não é o modelo, é o
   dado real, rotulado e consentido.** A peça que serve as duas frentes é a
   captura de "ground truth" pós-gravação: *a leitura bateu? como você se sentiu
   de verdade?* — isso é usabilidade E o primeiro tijolo do dataset.

### O que os dois primeiros datasets mediram (2026-08)

Números reais, não impressão. Rodar sempre com
`node research/benchmark/analyze-dataset.js <dataset.json>`.

**Onde o dado mora:** `research/datasets/` (ver o README de lá). A pasta é
**ignorada pelo Git por lista de permissão** — este repositório é público, e voz
com rótulo emocional é dado íntimo. Consequência prática que não pode ser
esquecida: **o dataset não tem cópia no Git.** Ele vive no `Documents` do app no
iPhone e no `localStorage` do navegador. Rebuild por cima preserva; **apagar o
app apaga o dataset junto** — e o build de Personal Team expira em 7 dias, o que
faz de reinstalar uma rotina. **Exportar antes de reinstalar** é a regra.

| | 1º dataset (n=6) | 2º dataset (n=9 limpas de 16) |
|---|---|---|
| Viés de ativação | −0.60 (motor via o Helio mais calmo do que ele estava) | **−0.31** |
| Amplitude de valência usada | 34% | **68%** |
| Categoria dominante | "amigável" em 83% | 44% / 33% / 22% — colapso desfeito |
| Correlação valência | — | r = 0.37 (muito fraca) |
| Correlação ativação | — | r = 0.28 (muito fraca) |

**O que isso quer dizer, sem enfeite:** a recalibração (semitons + faixa de
energia conversacional) consertou a *saturação* — o motor voltou a variar. Mas
ele ainda não **acompanha** a variação do Helio: correlação fraca nos dois
eixos, e a valência **nunca desce de +0.64** enquanto o Helio marcou de −0.07 a
+1.17.

O piso de valência não é bug de calibração, é estrutural: a fórmula de valência
é feita de altura, expressividade e brilho — que são correlatos de **ativação**,
não de valência. É exatamente o que a literatura diz (Scherer): prosódia prevê
ativação bem e valência mal. **Somar mais constante arbitrária aqui é fingir
precisão.** O ganho real vem de canal novo — o **verbal** (transcrição +
sentimento do texto), que o framework multicanal já prevê.

Regra que fica: **não recalibrar escala com n pequeno.** A faixa de energia atual
é `PROVISÓRIO` e só se revalida acima de ~30 amostras limpas — por isso o motor
passou a gravar o **RMS cru** e a expressividade em **semitons** no `observado`,
e a carimbar `motorVersao` em toda leitura (dataset sem carimbo mistura réguas).

### Decisão de arquitetura: V&E é o canal 1 de uma AE multicanal

O Helio trouxe (2026-08) um framework científico próprio — bibliografia de
psicologia/sociologia, modelo dimensional (valência × ativação, Russell),
camadas relatado/observado/inferido/**inconclusivo**, e módulos verbal e não
verbal. Ele é a **base da Frente 2**, e está desdobrado em `ESTRATEGIA_DADOS.md`.

Decisão dele, explícita: **V&E (voz) é apenas o primeiro passo.** A AE vai
incluir face, corpo, olhar e sincronia interacional. Portanto:

> Todo código e todo esquema de dados deve nascer **multicanal**, com os canais
> ainda não coletados presentes na estrutura e marcados como indisponíveis — e a
> **confiança da inferência deve cair** quando faltam canais. Nunca fingir que
> medimos o que não medimos; nunca refazer a fundação depois.

### Música entra na equação (decisão do Helio, 2026-08)

A **música é parte do modelo da AE**, não um enfeite. Fundamento: Juslin &
Laukka — voz e música comunicam emoção por **canais diferentes com o mesmo
código acústico** (andamento, intensidade, altura, variação, brilho,
articulação), que são exatamente as variáveis que o V&E já mede.

Papéis: espelho científico para validar o motor · fonte farta de dados
rotulados em valência × ativação (ataca o gargalo do dado) · elicitação de
estados para coletar ground truth · e, no futuro, produto.

Ressalva: mesmo código ≠ transferência automática. Modelo treinado em música
precisa ser revalidado em voz. Todo dado carrega `fonte: voz | musica`.
Detalhes em `ESTRATEGIA_DADOS.md` (seção 7b).

### Rotinas de coleta de rótulo (decisões do Helio, 2026-08)

- **Rotina A (hoje):** após cada reunião gravada no Plaud, subir o áudio no
  Estúdio de Anotação e rotular **trechos aleatórios no mesmo dia** — o
  sentimento ainda fresco. Frescor e aleatoriedade não são detalhe: a memória
  emocional decai e é reescrita pelo desfecho, e escolher só os momentos
  marcantes enviesaria o dataset para os extremos.
- **Rotina A2 (nova, 2026-08):** reunião cobre uma faixa emocional estreita — o
  primeiro dataset mostrou o Helio **nunca** entrando no lado negativo da
  valência. Palavras dele: *"o que eu sou em reunião não é obrigatoriamente o
  que sou no resto da minha vida."* Daí o **Diário de Voz** (`diario.html`):
  avisos em horários **sorteados** ao longo do dia, gravação de 20–30s e rótulo
  **no instante**. É Experience Sampling (Csikszentmihalyi & Larson) — padrão em
  pesquisa de afeto. Decisão de desenho: **sorteio de momentos, não gravação
  contínua** — passiva o dia todo é inviável no iOS, grava terceiros sem
  consentimento e dá dado pior, porque o rótulo viria depois da memória decair.
  Todo registro carrega `origem` (`diario`/`reuniao`) e `contexto`, para nunca
  misturar as duas distribuições.
- **Rotina B (futuro, com usuários):** ao fim do uso, pedir que a pessoa marque
  o que sentiu em 2–3 trechos aleatórios. **Não disfarçar de "avaliação de
  uso"** — dizer que serve para o app aprender. Quem sabe que está ensinando
  responde com cuidado; quem acha que é pesquisa clica qualquer coisa, e dado
  ruim é pior que dado nenhum. Detalhes e cuidados em `ESTRATEGIA_DADOS.md`
  (seção 7c).

### Diário automático no iOS (2026-08-21) — resposta ao "quero que me ouça sozinho"

O Helio testou o fluxo web + alarmes de calendário e vetou: *"muito duro e
pouco intuitivo… quero que meu celular me ouça o tempo inteiro, como a Siri."*

Registro honesto que foi dado (e vale repetir se o tema voltar): a Siri não
grava tudo — um chip de baixo consumo só reconhece a palavra de ativação e
descarta o resto; o "Instagram me ouve" é lenda comprovadamente falsa (o
acerto vem de comportamento, não de microfone). Mas o pedido em si é legítimo
e possível **no app nativo**, que já tem `UIBackgroundModes: audio`.

O que foi construído (`DiarioModel.swift`, `DiarioView.swift`):
- **"Começar o dia"**: um toque de manhã. O app mantém o microfone aberto o
  dia todo (indicador laranja visível — correto), sorteia os momentos com as
  mesmas regras do web (futuro apenas, gap 45min) e captura 30s de **features**
  em cada um — áudio nunca é escrito em disco (`RollingFrameBuffer`).
- Notificação → toque → folha de rótulo (grade de afeto SwiftUI, cega por
  construção) → dataset. Único passo humano: o rótulo, porque ele É o dado.
- Registro carrega `chamado: "automatico"`, `qualidade: limpa|mista` (toggle
  "só a minha voz"), `motorVersao: 2`. Motor Swift portado para v2 (semitons +
  energia 0.015–0.15 + RMS cru no Summary) — coletar com régua velha
  envenenaria o dataset.
- Limites de plataforma ditos na UI: precisa reabrir após reiniciar o aparelho;
  bateria; build de Personal Team expira em 7 dias (reinstalar via Xcode).

## Próximos passos

- [x] Terminar a instalação do app no iPhone do Helio.
- [x] **Captura de ground truth na web** (`js/app.js`) — `match`, `affect`,
      `feeling` e `outcome`, com a grade de afeto e a estrutura multicanal
      (`canais.autorrelato`). O tijolo zero está assentado. *Conferido no
      código em 2026-09-01: estava marcado como pendente por engano.*
- [ ] Portar a mesma captura para o iOS fora do Diário (o Diário já rotula).
- [ ] **Testar o Diário automático no iPhone** — abrir no Xcode e dar ▶.
      **Só rodar `xcodegen generate` se algum arquivo novo tiver entrado**; do
      contrário ele regenera o `.xcodeproj` à toa e pode derrubar o Team da
      assinatura (lição do commit `0d863c4`). Conferido em 2026-09-01: os 12
      fontes Swift já estão no `project.pbxproj` — **não precisa de xcodegen**.
      (Quando entrar arquivo novo, aí sim: lição do bug do `Theme.swift`.)
- [x] Portar motor v2 (semitons + energia) para o Swift.
- [ ] Renomear o produto de "VozEmoção" para **Voice&Emotion** no app e docs.
- [ ] Frente de design: identidade visual, fluxo, primeira impressão.
- [ ] Reativar a Siri (resolver o `AppIntentsSSUTraining`) quando der.
