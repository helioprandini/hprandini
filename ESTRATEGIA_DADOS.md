# Estratégia de Dados & Modelo de Classificação — AE

> **Base científica deste documento:** o framework desenvolvido pelo Helio
> (2026-08) — bibliografia de psicologia comportamental e sociologia, modelo
> dimensional, camadas de inferência e módulos verbal/não verbal. Este arquivo
> é o desdobramento dele em decisões de engenharia.
>
> Norte: **traduzir a emoção humana em dados.**

---

## 0. Duas verdades que governam tudo

**Verdade 1 — o gargalo é o dado, não o modelo.**
Não existe atalho. O que separa a AE de um brinquedo é dado real, rotulado e
consentido. Cada gravação precisa virar um exemplo:
`[sinais medidos] → [o que a pessoa de fato sentiu]`.

**Verdade 2 — o sistema estima hipóteses; nunca afirma conhecer o estado mental
de alguém.**
Regra do Helio, e ela protege o negócio tanto quanto as pessoas. É o que separa
a AE de um "detector de emoção" — produto que perde a confiança e ganha
processo. Sinal observável **não é** prova de estado interno.

---

## 1. Arquitetura: AE é multicanal, V&E é o canal 1

O **V&E (Voice&Emotion)** analisa **voz**. É o primeiro passo, não o destino.
A AE incluirá face, corpo, olhar e sincronia interacional.

Por isso o esquema de dados nasce **multicanal desde já**:

| Canal | O que cobre | Status hoje |
|---|---|---|
| `autorrelato` | o que a pessoa declara sentir | ✅ coletado (Me ensina) |
| `paralinguistico` | volume, pitch, velocidade, monotonia, pausas, entonação | ✅ coletado (V&E) |
| `verbal` | conteúdo, estrutura da fala, agência, linguagem social | 🔜 requer transcrição |
| `facial` | expressão, olhar, tensão (ref. FACS) | ⬜ futuro |
| `corporal` | postura, gesto, distância, ritmo motor | ⬜ futuro |
| `interacional` | interrupções, espelhamento, latência, sincronia | ⬜ futuro |
| `contexto` | situação, interlocutores, normas, incentivos | 🔜 parcial |

**Regra de ouro da arquitetura:** canal ausente **não vira zero** — vira
`indisponível`, os pesos são **renormalizados** sobre os canais presentes, e a
**confiança da inferência cai**. Nunca fingir que medimos o que não medimos.

---

## 2. As quatro camadas (nunca colapsar entre si)

Cada leitura produz camadas distintas, e elas **não se misturam**:

1. **Relatado** — o que a pessoa diz sentir. *("Estou tranquilo.")*
2. **Observado** — o que foi medido, em comportamento, sem julgamento.
   *("Fala lenta, volume baixo, pouca variação de pitch, 38% de pausas.")*
3. **Inferido** — hipótese probabilística, sempre com confiança.
   *("Baixa ativação provável — confiança 0,62.")*
4. **Inconclusivo** — evidências conflitantes ou insuficientes. **Esta camada é
   obrigatória.** Um sistema honesto precisa poder dizer "não sei".

> Disciplina de registro: descrever **comportamento**, não julgamento. Registrar
> *"reduziu o ritmo e aumentou as pausas"*, nunca *"estava desanimado"*. A
> interpretação vem depois, separada, e pode ser revista quando o modelo mudar —
> o comportamento registrado continua válido.

---

## 3. Modelo dimensional (vetor primeiro, etiqueta depois)

Etiqueta é frágil e vira estereótipo. **A saída primária é um vetor**; a
categoria é secundária, derivada e provisória.

### Dimensões primárias

| Dimensão | Faixa | O que mede |
|---|---|---|
| **Valência** | −2 … +2 | agradável ↔ desagradável |
| **Ativação** | 0 … 3 | energia / prontidão (apatia ↔ agitação) |
| **Dominância** | 0 … 1 | sensação de controle ↔ submissão |
| **Congruência** | 0 … 1 | fala × sinais × comportamento batem entre si |
| **Reatividade** | 0 … 1 | quanto o estado muda diante de eventos |

### Dimensões complementares
Intensidade, duração, estabilidade, regulação emocional, orientação social,
impulsividade, flexibilidade cognitiva.

### Mapa valência × ativação (Russell)

| Valência | Ativação | Descrição possível |
|---|---|---|
| Positiva | Baixa | serenidade, satisfação |
| Positiva | Alta | entusiasmo, euforia |
| Negativa | Baixa | desânimo, resignação |
| Negativa | Alta | ansiedade, irritação, tensão |
| Ambivalente | Alta | conflito, indecisão |
| Ambivalente | Baixa | apatia, desconexão |

---

## 4. Índice de humor (I_H) — com honestidade embutida

Ponto de partida proposto pelo Helio:

```
I_H = 100 × (0,30·V + 0,25·N + 0,20·C + 0,15·R + 0,10·S)

V = conteúdo verbal e autorrelato
N = não verbal e paralinguístico
C = adequação ao contexto
R = reatividade / evolução no tempo
S = estabilidade / consistência do padrão
```

> ⚠️ **Os pesos são arbitrários até serem validados empiricamente.** Não há
> justificativa universal para 30% / 25%. São um ponto de partida a ser ajustado
> com dados — e o documento deve registrar cada reajuste.

**Adaptação para canais faltantes (nossa realidade hoje):**

```
I_H = 100 × Σ(wᵢ · xᵢ) / Σ(wᵢ)     ← só sobre canais disponíveis
confiança = f(cobertura de canais, congruência, quantidade de fala, ruído)
```

Hoje o V&E cobre principalmente **N** (paralinguístico) e parte de **R** e **S**.
Logo: o índice é calculável, mas **a confiança nasce limitada** — e isso deve
aparecer na tela, não ser escondido.

---

## 5. Módulo verbal (a implementar com transcrição)

**Conteúdo emocional:** tristeza, medo, raiva, culpa, vergonha, ansiedade /
prazer, esperança, entusiasmo, gratidão / cansaço, vazio, apatia / ameaça,
injustiça, rejeição / segurança, pertencimento, controle.

**Estrutura da fala:** velocidade, pausas, latência de resposta, fluência,
repetição, mudanças de assunto, coerência, detalhamento, uso de absolutos
("sempre", "nunca", "ninguém").

**Linguagem de agência:** *"eu escolhi"* (agência) × *"fizeram comigo"*
(atribuição externa) × *"não consigo"* (baixa autoeficácia) × *"vou tentar outra
forma"* (autorregulação).

**Linguagem social:** confiança, hostilidade, cooperação, dependência,
isolamento, reconhecimento, ameaça, reciprocidade, pertencimento.

> **Preservar sempre a frase original + tom + contexto.** *"Tudo bem"* pode ser
> tranquilidade, ironia, submissão, irritação ou fim de conversa. Classificar só
> o texto perde o significado.

---

## 6. Módulo não verbal

**Voz e paralinguagem — o que o V&E já mede hoje:**
volume, pitch, velocidade, monotonia, entonação, pausas, silêncios.
*A implementar:* tremor, suspiros, risos, choro, interrupções.

**Face e olhar** ⬜ · **Expressão corporal** ⬜ · **Sincronia interacional** ⬜
(estruturados no esquema, coleta futura).

---

## 7. Ground truth: o que perguntar

Alinhado a instrumentos validados, para permitir comparação externa:

- **Affect Grid** (Russell, Weiss & Mendelsohn) → valência × ativação num toque.
  É a captura mais eficiente e vira o coração do "Me ensina".
- **PANAS** (Watson, Clark & Tellegen) → afeto positivo e negativo.
- **POMS** (McNair, Lorr & Droppleman) → tensão, depressão, raiva, vigor,
  fadiga, confusão. Referência para estados transitórios.

Também capturamos: **congruência percebida** (a leitura bateu?) e **desfecho**
(a conversa avançou/travou) — este último é o sinal de valor prático.

---

## 7b. Música na equação (decisão do Helio, 2026-08)

**A música entra na AE.** Não como enfeite — como parte do modelo.

**Por que é legítimo:** a ponte já estava na bibliografia. Juslin & Laukka
mostraram que expressão vocal e performance musical comunicam emoção por
**canais diferentes com o mesmo código acústico**: andamento, intensidade,
altura, variação de altura, brilho de timbre, articulação. São as mesmas
variáveis que o motor do V&E já extrai da voz.

Quatro papéis possíveis, do mais concreto ao mais distante:

1. **Espelho científico** — validar o motor contra um sinal onde a emoção é
   deliberadamente codificada. Se ele lê bem a intenção emocional de um trecho
   musical, é evidência de que os descritores acústicos funcionam.
2. **Fonte de dados rotulados** — existem datasets públicos de *music emotion
   recognition* anotados em **valência × ativação** (o mesmo eixo que adotamos).
   Isso ataca direto o gargalo do projeto: dado rotulado é escasso; em música,
   não é.
3. **Elicitação de estado** — música induz humor de forma confiável. Serve para
   provocar estados-alvo e coletar ground truth com rótulo forte, em vez de
   depender só de conversas espontâneas.
4. **Produto** — futuro; ainda não definido. Não decidir agora.

**Ressalva honesta:** "mesmo código" não significa transferência automática.
Música é composta e executada com intenção estética; fala é espontânea e
situada. Um modelo treinado em música **precisa ser revalidado em voz** antes de
qualquer afirmação. Registrar sempre a origem do dado (`voz` ou `musica`) para
nunca misturar as duas coisas sem querer.

**Consequência de arquitetura:** o esquema de dados ganha um campo de origem
(`fonte: voz | musica`) e a música é tratada como **canal próprio**, não como
substituta do canal de voz.

---

## 8. Validação (como saber se funciona)

1. Definir o construto: humor momentâneo ≠ emoção ≠ traço de personalidade.
2. Dicionário de variáveis observáveis.
3. Treinar avaliadores humanos.
4. Concordância entre avaliadores (kappa / correlação intraclasse).
5. Comparar contra POMS / PANAS / Affect Grid.
6. Validade convergente e discriminante.
7. Estabilidade temporal (muda quando o contexto muda?).
8. Testar viés cultural, linguístico, regional, etário e de gênero.
9. Manter descrição comportamental separada de interpretação.
10. Definir limites de uso e governança dos dados.

> **Estado ≠ traço.** Irritabilidade numa conversa não faz alguém "uma pessoa
> agressiva". Nunca inferir personalidade a partir de uma sessão.

---

## 9. Riscos e limites (inegociáveis)

| Risco | Como se manifesta | Nossa defesa |
|---|---|---|
| **Erro de atribuição** | ler cansaço, dor, neurodivergência ou diferença cultural como hostilidade/tristeza | camada "inconclusivo"; nunca diagnosticar |
| **Erro de contexto** | julgar reunião formal como conversa íntima | contexto é dimensão do índice |
| **Falsa precisão** | mostrar "87%" com dado fraco | confiança derivada da cobertura real |
| **Uso indevido** | contratação, crédito, seguro, vigilância, punição | consentimento; sem uso decisório sobre pessoas |

**Usos vedados:** diagnóstico clínico, detecção de mentira, triagem de pessoas,
vigilância. O DSM-5-TR serve como referência conceitual — **jamais** para
diagnosticar alguém a partir de uma gravação.

**Privacidade:** processar no aparelho; guardar local; exportar/enviar é ato
explícito do usuário, nunca automático.

---

## 10. Protótipo (o que construir primeiro)

**Cinco dimensões:** valência, ativação, dominância, congruência, reatividade.
**Três fontes hoje:** autorrelato, paralinguística, contexto.
**Saída obrigatória:** vetor + categoria provisória + **confiança** + evidências
observadas + a possibilidade de `inconclusivo`.

---

## Bibliografia de referência

Curadoria do Helio — bibliografia de trabalho, não ranking absoluto.

**Fundamentos do comportamento:** James (*Principles of Psychology*) · Darwin
(*Expression of the Emotions*) · Pavlov · Watson · Skinner · Tolman · Bandura
(*Social Learning Theory*) · Lewin · Kahneman (*Thinking, Fast and Slow*) ·
Damásio (*Descartes' Error*).

**Emoção e afeto:** James-Lange · Schachter & Singer · Lazarus (*Emotion and
Adaptation*) · Frijda (*The Emotions*) · Ekman (*Emotion in the Human Face*) ·
Izard · **Russell (*Core Affect*)** · Barrett (*How Emotions Are Made*) ·
LeDoux · Panksepp.

**Personalidade e social:** Allport · Cattell · Eysenck · Costa & McCrae (NEO) ·
Bowlby · Ainsworth · Gottman · Milgram · Asch · Sherif.

**Sociologia da interação:** Mead · Cooley · **Goffman (*Presentation of Self*,
*Interaction Ritual*)** · Hochschild (*The Managed Heart*) · Garfinkel · Berger
& Luckmann · Bourdieu · Elias · Collins.

**Comunicação e mensuração:** Watzlawick et al. (*Pragmatics*) · Birdwhistell ·
Hall · Argyle · Kendon · **Ekman & Friesen (FACS)** · **POMS** · **PANAS** ·
**Affect Grid** · DSM-5-TR (referência conceitual).

---

## O que "aprendizado generativo" significa aqui (sem hype)

Não é o app inventar emoção. É o modelo conseguir **descrever em dados** a
emoção de uma fala que nunca ouviu — generalizar para vozes novas, mantendo a
honestidade sobre incerteza. Chega-se lá por degraus, e o degrau de hoje é
capturar valência e ativação junto com o sinal da voz.
