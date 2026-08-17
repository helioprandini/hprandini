# Plano de Aprendizado — como a AE melhora de verdade

> Resposta à pergunta: *"podemos usar agentes de IA para ouvir e analisar
> milhares de conversas e melhorar a precisão?"*

## A resposta curta

**Agentes: sim — mas não para ouvir e julgar.** Para construir a esteira, medir
e curar dados já rotulados por humanos.

## Por que "agentes ouvindo conversas" não melhora a precisão

Um agente ouvindo 10.000 conversas e dizendo *"esta parece ansiosa"* não produz
**verdade** — produz **10.000 opiniões**. Treinar nosso motor com os palpites de
outro modelo ensina a imitar os erros dele. É um circuito que **amplifica erro**
com aparência de escala (na literatura: *model collapse* / *error
amplification*).

O gargalo nunca foi volume de análise. É **rótulo**: alguém dizendo *"eu me
sentia assim de verdade"*. Só quem sentiu pode dar isso.

E há a barreira que nós mesmos escrevemos: ouvir milhares de conversas reais sem
consentimento é **uso vedado** (`ESTRATEGIA_DADOS.md`).

## O que vinha antes de tudo: uma régua

Não dava para "melhorar a precisão" porque **nunca soubemos qual era a
precisão**. O motor era heurística ajustada no olho.

A primeira entrega deste plano foi a régua:
`research/benchmark/engine-validation.js` — mede se o motor recupera parâmetros
acústicos de sinais cuja verdade é conhecida por construção.

### O que a régua encontrou no primeiro uso

Um bug grave no detector de altura da voz: o limiar era aplicado à
autocorrelação **bruta**, que escala com o quadrado da amplitude. Consequência
prática: **o pitch só funcionava se a pessoa falasse alto ou perto do
microfone.** Tudo acima disso (expressividade, valência, categoria) herdava o
erro.

| | antes | depois |
|---|---|---|
| Erro médio de F0 | **100%** (não detectava) | **0,05%** |
| Testes passando | 10/22 | **22/22** |

Correção: autocorrelação normalizada por potência, seleção do primeiro pico
(evita erro de oitava) e interpolação parabólica. Aplicada na web e no iOS.

> Isso responde à pergunta original de um jeito inesperado: o maior ganho de
> precisão até agora não veio de mais dados — veio de **medir o que já
> existia**.

## Os degraus, na ordem certa

### ✅ Degrau 1 — Validar a medição (feito)
O motor lê corretamente os sinais físicos? Testável sem corpus.
`node research/benchmark/engine-validation.js`

### 🔜 Degrau 2 — Validar a interpretação (próximo)
Sinal medido corresponde à emoção que dizemos? **Só corpus rotulado por humanos
responde.** Corpora públicos, consentidos e usados em pesquisa:

| Corpus | O que tem | Rótulo |
|---|---|---|
| **RAVDESS** | fala e canto atuados, 24 atores | categorias + intensidade |
| **CREMA-D** | 7.442 clipes, 91 atores | categorias, votação de 2.443 avaliadores |
| **IEMOCAP** | ~12h de interação diádica | categorias + **valência/ativação/dominância** |
| **MSP-Podcast** | fala espontânea, grande escala | valência/ativação/dominância |
| **EmoDB** | alemão, clássico da área | categorias |
| **DEAM / PMEmo** | **música** | valência/ativação contínuas |

Os últimos conectam com a decisão de trazer música para a equação
(`ESTRATEGIA_DADOS.md`, seção 7b): são fartos e já anotados no **mesmo eixo** que
adotamos.

**Métricas honestas:** correlação (Pearson/CCC) entre nossa valência/ativação e a
anotada; matriz de confusão para categorias; concordância comparada à
concordância *entre humanos* — que também não é 100%, e é o teto realista.

### 🔜 Degrau 3 — Calibrar
Ajustar as faixas do motor com base no erro medido. Cada mudança precisa
**mostrar número antes e depois**.

### 🔜 Degrau 4 — Aprender
Só depois de 2 e 3: treinar modelo que preveja o rótulo a partir das features.
Substitui a heurística **apenas se o número provar** que é melhor.

## Onde agentes ajudam de verdade

1. **Esteira de ingestão** — baixar, normalizar e indexar corpora (formatos,
   taxas de amostragem, esquemas de rótulo diferentes). Trabalho chato e
   perfeito para automação.
2. **Extração em escala** — rodar nosso motor sobre milhares de arquivos e
   consolidar resultados. Isso é **medição**, não opinião.
3. **Ampliar a régua** — gerar casos sintéticos difíceis (ruído, sotaque
   simulado, corte, eco) para achar onde o motor quebra.
4. **Síntese de literatura** — extrair parâmetros e faixas relatados em artigos
   para comparar com os nossos.
5. **Anotação assistida** — agente como **um** anotador entre vários, nunca a
   verdade. Concordância medida e reportada.

Em nenhum desses o agente é a fonte da verdade emocional. Ele carrega, mede e
organiza — a verdade continua vindo de humanos.

## Regra permanente

> Nenhum rótulo gerado por IA entra no dataset de treino como verdade. Se um
> agente anotar, o dado carrega `origem_rotulo: ia` e fica separado dos rótulos
> humanos. Misturar os dois é como a AE morre por dentro sem ninguém perceber.
