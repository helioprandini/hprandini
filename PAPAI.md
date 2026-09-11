# Papai — histórico de opiniões para a Vicky e o Toni

> Pedido do Helio, 2026-09-11: *"eu queria criar um histórico de opiniões meus
> pra doar pros meus filhos. Vicky e Toni. Guarde todas as decisões morais, de
> opinião, de sentimentos. Pode usar V&E."*

Roda em `papai.html` (`js/papai.js`, `js/papai-perguntas.js`, `css/papai.css`).

---

## 1. O que é — e o que deliberadamente não é

**É** um histórico: o que o Helio pensava, sentia e decidiu **em cada data**,
com a voz dele junto e com o quanto ele tinha de certeza naquele dia.

**Não é** um livro de regras. A diferença não é poética, é estrutural: um
livro de regras entrega ao filho um pai pronto, e pai pronto não existe — o
que existe é um pai que mudou de ideia e aprendeu. Se o acervo mostrasse só a
última opinião sobre cada coisa, ele mentiria por omissão sobre a única coisa
que interessa: **como esse homem chegou até ali**.

Duas peças do esquema carregam isso, e nenhuma pode ser removida sem matar o
propósito:

| Campo | Para que serve |
|---|---|
| `certeza` (1–5) | Separa "estou pensando alto numa terça" de "isso eu não mudo". Sem ele, um palpite e uma convicção de vida chegam aos filhos com o mesmo peso. |
| `revisaoDe` | Aponta da opinião nova para a velha. **A velha nunca é apagada.** A tela mostra a de hoje na frente e a trajetória dobrada embaixo ("Como você pensava antes"). |

---

## 2. A regra do projeto que esta frente inverte, de propósito

Em **todo** o resto do V&E o áudio é medido e **descartado** — sobrevivem só
números e rótulos (Princípio 3, e o fato de que um dataset não precisa da voz,
precisa das medidas).

**Aqui é o contrário: o áudio é o produto.** A Vicky e o Toni não vão querer
ler que o pai tinha "valência +0,8 e ativação 2,1" ao falar da mãe deles. Vão
querer **ouvir**. Guardar só a medida aqui seria guardar a sombra e jogar fora
a pessoa.

A razão original da regra continua respeitada, por outro caminho: nada sai do
aparelho, nada entra no Git, e quem fala é **uma pessoa só, dona do que fala** —
não há terceiro gravado sem consentimento, que era o risco de verdade.

---

## 3. Onde o dado mora — e a trava que falta

| Camada | O que guarda | Risco |
|---|---|---|
| `localStorage["papai_registros_v1"]` | metadados, texto, leituras | limpeza de navegador apaga |
| IndexedDB `papai_v1` / `audio` | os blobs de voz | despejo automático quando falta espaço |
| Arquivo `.json` exportado | **tudo, num arquivo só** (áudio em base64) | é o único que sobrevive à troca de aparelho |

O código faz o que dá para fazer sozinho: pede `navigator.storage.persist()`
(marca o armazenamento como durável, o que impede o despejo automático) e
cobra na tela quando faz tempo que não há backup.

**O que o código não resolve, e por isso está escrito aqui:** navegador não é
cofre. A regra é **exportar depois de cada sessão** e deixar o arquivo em pelo
menos dois lugares (iCloud e um HD, por exemplo). Um acervo que morre numa
limpeza de cache é pior do que nunca ter começado — porque até o dia em que se
descobre, todo mundo achava que estava guardado.

### Isto nunca entra no Git

O repositório é **público**. As respostas — voz, opinião, sentimento sobre
filhos e sobre os mortos da família — são o dado mais íntimo que este projeto
já tocou. Vale a mesma regra de `research/datasets/`, e com mais força:

- **entra no Git:** `papai.html`, `js/papai*.js`, `css/papai.css`, este documento
  e o **banco de perguntas** (são perguntas, não respostas);
- **nunca entra:** qualquer `papai-acervo-*.json`, `papai-palavras-*.json`,
  qualquer áudio. O lugar deles é `research/datasets/` (ignorado por lista de
  permissão) e o backup automático para o iCloud que já existe.

---

## 4. O que isto tem a ver com o norte da AE

Honestamente: **pouco, e está tudo bem.** O norte é traduzir emoção humana em
dados; isto aqui é um pai falando com os filhos. O V&E entra como **carona**,
não como finalidade:

- cada resposta guarda `observado` (as medidas) e `inferido` (a leitura), com
  `motorVersao` carimbado — então, sem custo nenhum, o acervo vira também
  amostra de uma faixa emocional que nenhuma reunião alcança: falar de um pai
  morto, de um filho nascendo, de um arrependimento;
- `origem: "papai"` mantém isso **separado** do dataset de treino. Misturar
  sem marcar contaminaria as distribuições — e além disso, dado de treino é
  descartável e este não é.

Se um dia esses registros forem usados para treinar qualquer coisa, a decisão é
do Helio, explícita, e provavelmente depois de os filhos já terem recebido o
acervo. O acervo vem primeiro.

---

## 5. Chão: o que está dito na tela e precisa continuar dito

- A leitura emocional de cada resposta é **correlato acústico** — descreve
  como a voz soou. E hoje ela é **fraca em valência** (r = 0,37 no segundo
  dataset; o motor mal desce do lado agradável). Então a etiqueta de emoção no
  registro é **ilustrativa**, não verdade sobre o que ele sentia. Se alguém um
  dia mostrar esse acervo aos filhos, é isso que se diz: *a máquina achou isso;
  quem sabe é quem ouviu*.
- Não há transcrição. Não dá para buscar por palavra dentro das respostas
  faladas — só pela pergunta, eixo e data.

---

## 6. O que falta (em ordem de importância)

1. **O lado deles.** Hoje existe o lado de quem grava. Falta a página que a
   Vicky e o Toni vão abrir um dia: carregar o `.json`, ouvir, navegar por
   eixo e ver a trajetória de cada opinião. O `Restaurar de um arquivo` já
   serve de quebra-galho — restaura num aparelho qualquer e o acervo aparece —
   mas é ferramenta de autor, não presente.
2. **Backup que não dependa de lembrar.** Hoje o botão é manual. O caminho
   natural é o mesmo do resto: exportar para uma pasta que o
   `research/scripts/backup-datasets.sh` já espelha no iCloud todo dia.
3. **Transcrição no Mac** (Whisper, local). Daria busca por palavra e o canal
   verbal do framework — que é justamente onde a valência melhora.
4. **Levar para o iOS.** O app já grava e já tem o motor; a diferença é que o
   acervo do iPhone estaria sempre à mão, e é no carro e na cozinha que essas
   respostas nascem, não na mesa do escritório.
5. **Cartas com data de abertura.** O campo `abrir` já é guardado
   ("quando quiserem", "aos 18", "no dia certo"), mas nada na tela ainda
   esconde ou destaca com base nele.

---

## 7. Uma nota sobre por que este arquivo existe

O Princípio 4 do `CLAUDE.md` diz: *um degrau de cada vez, tudo escrito, porque
a memória do Theo mora aqui*. Vale em dobro nesta frente. Uma sessão futura que
leia só o código vai ver um formulário com gravador e pode "simplificar" as
duas coisas que parecem redundância — o campo `certeza` e a corrente
`revisaoDe`. São elas o presente. O resto é embalagem.
