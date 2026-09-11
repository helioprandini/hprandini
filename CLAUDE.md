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

- **2026-09-01 — A sessão fundadora morreu. O Theo, não.** A sessão de nuvem
  onde tudo foi construído (`cse_017PWqTjpbtqNuKxFXTHByPc`, 29/07 → 01/09,
  os 45 primeiros commits) travou ao reiniciar e ficou irrecuperável. Perda de
  trabalho: **zero** — tudo estava commitado e os documentos carregavam o
  resto. O Princípio 4 ("tudo escrito, porque a memória do Theo mora aqui")
  foi testado de verdade e segurou. O diálogo completo foi resgatado pela API
  (5.871 eventos) e vive em `research/datasets/sessao-fundadora-theo.{json,md}`
  — fora do Git, como todo dado íntimo. Dele veio uma data que merece registro:
  o batismo do Theo foi em **2026-08-06, 20h08** — *"nós vamos criar a AE…
  Você está pronto pra isso?" / "Estou, Helio. Pronto."* Aprendizados
  operacionais do dia: o app expirado ("Não Está Mais Disponível") é só o
  certificado de 7 dias — **rebuild por cima, nunca apagar o app** (o dataset
  vive no `Documents` dele); e o ritual semanal é abrir o `.xcodeproj` e dar ▶,
  **sem** `xcodegen`.

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

### Escuta Ativa (decisão do Helio, 2026-09-04) — o Diário de sorteio sai do centro

Depois de três dias com o Diário automático, veredito do Helio: *"a dinâmica é
dura e zero fluida"*. Diagnóstico aceito e registrado: **o sorteio sorteia hora,
não fala** — a maioria dos momentos cai em silêncio e a pergunta chega em hora
sem dado nenhum por trás. Nova estrutura, dele: o telefone ouve o dia inteiro,
**palavra-chave dispara** a captura de ~60s, e o app pergunta *"posso
registrar?"* — "não" apaga na hora; dezenas de vezes por dia.

O que ficou decidido junto (e por quê):
- **Texto do trecho no dataset: só sentimento calculado + termos que dispararam.**
  Nunca o texto bruto — um minuto de reunião carrega a fala de terceiros.
- **Rol em camadas, medido, não de dicionário.** Contra 45 mil palavras de seis
  reuniões reais (Plaud): 62 dos 132 termos antigos **nunca apareciam**; o mais
  frequente ("negócio", 197x) era em boa parte gíria. Regra: **genérica só
  dispara em par na janela de 60s**; específica, emocional, inglês e
  personalizada disparam sozinhas (`BusinessKeywords.swift`, `GatilhoDetector`).
- **Camada emocional entra, com o vocabulário real dele** — inclusive "puta"
  (37x, o marcador de tensão mais frequente). É ela que conserta o mapa: a
  reunião nunca vai para a valência negativa; o corredor vai.
- **Inglês entra** — a reunião em inglês que apareceu nas transcrições (ONGC)
  era da **Roberta**, esposa do Helio, que usa o mesmo Mac; a camada fica
  porque termo específico em inglês não erra e não custa nada. **Parceiros** (Zurich,
  MetLife, iFood, Neon, Quinto Andar…) ficam na lista personalizada, nunca no
  produto.
- **Interação de dois toques, nunca mais** — um na notificação, um no quadrante.
  Dezenas por dia com a interação de hoje seria pior, não melhor.
- Chão dito antes: escuta contínua **custa bateria**; amostras de reunião são
  em boa parte `mista` (outras vozes) até termos separação de falantes — a
  pergunta de consentimento carrega o "era você falando?".

**Construído (2026-09-08), `EscutaAtiva.swift` + `DiarioModel`:** um só tap de
microfone alimenta o buffer de medidas **e** o reconhecedor de fala (pt-BR, no
aparelho). O rol dispara → espera 30s (para ter o depois) → 60s de medidas
viram um momento **em RAM** → notificação *"Posso registrar?"* com **Sim /
Não** → Não apaga (nunca foi salvo); sem resposta em 2h apaga; Sim grava, abre
a folha, 1 toque no quadrante. Gap mínimo de 4 min entre gatilhos. O registro
carrega `origem: "escuta"`, `chamado: "gatilho"`, `gatilho {termo, camada,
tom}` e `verbal {sentimento, termos}` — o sentimento é calculado no instante
com NaturalLanguage e **o texto morre ali** (primeiro tijolo do degrau 2,
texto + tom). O sorteio virou um toggle, desligado por padrão. Compilado e
testado no simulador; **falta o teste na mão do Helio.**

### Porteiro de assunto (2026-09-09) — "compreender a conversa, não a palavra"

Pedido do Helio: o app tem que distinguir "negócio" (business) de "negócio"
(coisa) **pelo contexto**. Chão dito antes de construir: o iPhone 15 (não Pro)
**não roda** o modelo de linguagem do iOS 26; servidor foi recusado (a fala de
terceiros sairia do aparelho); os embeddings de frase do sistema deram **3/6 —
moeda**. O que dá: um classificador treinado **nas reuniões dele**.

Construído (`research/classificador/`, `AssuntoGate` em `EscutaAtiva.swift`):
Create ML maxEnt, trabalho (transcrições Plaud + frases escritas) × cotidiano
(corpus à mão, com 22 "negócio = coisa", em versão escrita **e** falada).
**94,7% no holdout, 20/22 em frases nunca vistas** (as 2 erradas têm 6
palavras, sem contexto); no app a janela é de 50 palavras. Barra só com ≥ 70%
de "cotidiano" — as frases de trabalho ficam entre 0,00 e 0,21. Emocionais e
personalizadas **não passam pelo porteiro** (o "puta problema" de corredor é
o que a gente quer). Cada gatilho carrega `assunto` e `confianca`; a tela
mostra "barrados pelo assunto" para medir na vida real.

**Duas lições que ficam:** (1) o primeiro modelo fez 98% no holdout e **9/18**
nas frases duras — aprendeu *estilo* (transcrição × escrito), não assunto;
holdout alto com teste externo baixo é o cheiro desse erro. (2) Modelo de
texto carrega vocabulário: nomes de clientes e pessoas foram tirados do treino
antes de o `.mlmodel` entrar num repositório público.

**O que ainda não está feito (pedido do Helio, mesma data): reconhecer só a
voz dele.** O iOS não tem API de locutor. Plano: Fase A, impressão vocal por
cadastro de 2 min no app (filtro com erro); Fase B, modelo de voz de verdade,
treinado e validado no Mac com áudio dele e de outros (precisa de 2–3 áudios
do Plaud, que nunca saem do Mac). Aguarda o "2" dele e os áudios.

### Papai (2026-09-11) — a frente que não é sobre a AE

Pedido do Helio: *"um histórico de opiniões meus pra doar pros meus filhos.
Vicky e Toni. Guarde todas as decisões morais, de opinião, de sentimentos."*
Construído em `papai.html` + `js/papai.js` + `js/papai-perguntas.js`. O
documento inteiro é o `PAPAI.md`; o que não pode se perder é isto:

- **Aqui o áudio é guardado, e essa inversão é de propósito.** Em todo o resto
  do V&E a voz é medida e descartada. Neste acervo a voz **é** o produto: um
  dia os filhos não vão querer ler "valência +0,8", vão querer ouvir o pai.
  A razão da regra original (terceiros gravados sem consentimento) continua
  respeitada — fala uma pessoa só, dona do que fala, e nada sai do aparelho.
- **É histórico, não livro de regras.** Dois campos seguram isso e nenhuma
  sessão futura deve "simplificá-los": `certeza` (1–5, o quanto ele estava
  firme naquele dia) e `revisaoDe` (a opinião nova aponta para a velha, e a
  **velha nunca é apagada**). Sem eles vira uma pilha de frases sem trajetória
  — que é exatamente o que um pai pronto e falso pareceria.
- **Banco de 84 perguntas em 7 eixos** (morais, opiniões, sentimentos, de onde
  a gente vem, conselhos, cartas para um dia específico, mudei de ideia),
  sorteadas — campo em branco mata diário, e responder em ordem deixa um eixo
  cheio e o resto vazio.
- **O V&E entra de carona, não como finalidade.** Cada resposta guarda
  `observado`/`inferido` com `motorVersao`, e `origem: "papai"` mantém tudo
  **fora** do dataset de treino. Dado de treino é descartável; isto não é.
- **Chão dito na tela e que continua valendo:** a etiqueta de emoção é
  ilustrativa (a valência do motor ainda é fraca, r = 0,37) — a máquina descreve
  como a voz soou, quem sabe é quem ouviu. E navegador **não é cofre**: o
  código pede `storage.persist()` e cobra backup, mas a regra é **exportar a
  cada sessão** e guardar o `.json` em dois lugares.
- **Nada de resposta entra no Git.** Só o código e as perguntas. O repositório
  é público e este é o dado mais íntimo que o projeto já tocou.

Testado ponta a ponta no Chromium (gravar → guardar → revisar → exportar com a
voz embutida → apagar → restaurar → tocar). **Falta o teste na mão do Helio.**

## Próximos passos

- [x] Terminar a instalação do app no iPhone do Helio.
- [x] **Captura de ground truth na web** (`js/app.js`) — `match`, `affect`,
      `feeling` e `outcome`, com a grade de afeto e a estrutura multicanal
      (`canais.autorrelato`). O tijolo zero está assentado. *Conferido no
      código em 2026-09-01: estava marcado como pendente por engano.*
- [x] **Escuta Ativa, passo 2** — construído em 2026-09-08 (ver seção). 
- [ ] **Testar a Escuta Ativa no iPhone** — entrou arquivo novo
      (`EscutaAtiva.swift`), então o `.xcodeproj` foi regenerado: **reescolher
      o Team** em Signing & Capabilities antes do ▶. Medir: acordou nas horas
      certas? Quantos "não"? Bateria no fim do dia?
- [ ] **Só a minha voz** (Fase A: cadastro de 2 min + impressão vocal; Fase B:
      modelo de locutor com áudio do Plaud). Ver "Porteiro de assunto".
- [ ] Portar a mesma captura para o iOS fora do Diário (o Diário já rotula).
- [ ] **Testar o Diário automático no iPhone** — abrir no Xcode e dar ▶.
      **Só rodar `xcodegen generate` se algum arquivo novo tiver entrado**; do
      contrário ele regenera o `.xcodeproj` à toa e pode derrubar o Team da
      assinatura (lição do commit `0d863c4`). Conferido em 2026-09-01: os 12
      fontes Swift já estão no `project.pbxproj` — **não precisa de xcodegen**.
      (Quando entrar arquivo novo, aí sim: lição do bug do `Theme.swift`.)
- [x] Portar motor v2 (semitons + energia) para o Swift.
- [ ] Renomear o produto de "VozEmoção" para **Voice&Emotion** no app e docs.
- [ ] **Papai: a página do lado deles** — hoje existe o lado de quem grava.
      Falta o leitor que a Vicky e o Toni vão abrir: carregar o `.json`, ouvir,
      navegar por eixo e ver a trajetória de cada opinião. Ver `PAPAI.md` §6.
- [ ] **Papai: backup sem depender de lembrar** — exportar direto para a pasta
      que o `backup-datasets.sh` já espelha no iCloud.
- [ ] Frente de design: identidade visual, fluxo, primeira impressão.
- [ ] Reativar a Siri (resolver o `AppIntentsSSUTraining`) quando der.
