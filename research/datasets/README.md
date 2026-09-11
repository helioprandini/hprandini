# Datasets — onde o dado real mora

Esta pasta guarda os datasets rotulados exportados do V&E. É o ativo mais
valioso do projeto: pela tese do `ESTRATEGIA_DADOS.md`, **o gargalo não é o
modelo, é o dado real, rotulado e consentido.**

## Regra número um: isto não vai para o Git

O repositório é **público** (o GitHub Pages exige, em conta gratuita). Voz e
rótulo emocional são dado íntimo — e o Princípio 3 do `CLAUDE.md` é
*privacidade primeiro*.

Por isso o `.gitignore` desta pasta ignora **tudo** por padrão, e libera só ele
mesmo e este README. Não existe "só desta vez": um `git add -f` num dataset
publica a voz de alguém para sempre, porque o Git não esquece.

**O backup fora do Git é automático.** Um agente do sistema
(`com.ae.backup-datasets`, instalado em `~/Library/LaunchAgents/`) copia esta
pasta para o iCloud Drive (`AE-Backups/datasets/`) todo dia às 13h e em todo
login — script em `research/scripts/backup-datasets.sh`, log em
`research/scripts/backup.log`. Aditivo por desenho: nunca apaga nada no
destino. Qualquer arquivo salvo aqui entra no próximo ciclo sozinho.

## De onde vêm os arquivos

| Origem | Como exportar | Nome do arquivo |
|---|---|---|
| **Diário automático (iOS)** | Diário de Voz → **Exportar** (folha de compartilhamento) | `vem-diario-auto-<data>.json` |
| **Diário de Voz (web)** | botão de exportar em `diario.html` | `vem-diario-<data>.json` |
| **Estúdio de Anotação** | exportar em `studio.html` | dataset de reunião |
| **Papai** (acervo dos filhos) | exportar em `papai.html` | `papai-acervo-<data>.json` (com voz) · `papai-palavras-<data>.json` |

⚠️ **Exporte antes de reinstalar o app.** No iOS o dataset vive no `Documents`
do aplicativo. Rebuild *por cima* preserva; **apagar o app apaga o dataset
junto.** E o build de Personal Team expira em 7 dias, então reinstalar é
rotina — o que faz desta a armadilha mais provável de todas.

## Como ler os números

```bash
node research/benchmark/analyze-dataset.js research/datasets/<arquivo>.json
```

O script só considera honestas as amostras com `qualidade: "limpa"` — aquelas
em que a voz medida é a de quem rotulou. Em trecho com mistura de vozes, o
motor lê uma pessoa enquanto o rótulo descreve outra: o par sinal↔rótulo não
existe, e contá-lo seria inventar precisão.

## Não misturar réguas

Todo registro carrega `motorVersao`. Dataset sem carimbo mistura medições de
motores diferentes e o resultado não quer dizer nada.

Também não misturar **distribuições**: `origem: diario` cobre o dia inteiro,
`origem: reuniao` cobre uma faixa emocional estreita. São populações
diferentes — juntar as duas numa média esconde exatamente o efeito que o
Diário foi criado para revelar.

## Onde estamos

Em 2026-08, com **n = 9 amostras limpas**: correlação de valência r = 0.37 e de
ativação r = 0.28 — as duas fracas.

A faixa de energia do motor está marcada `PROVISÓRIO` e **só se revalida acima
de ~30 amostras limpas**. Até lá, a regra é firme: **não recalibrar escala com
n pequeno.** Ajustar a régua para caber em 9 pontos é decorar o ruído.

## O acervo "Papai" é caso à parte

Os arquivos `papai-*.json` ficam aqui pelo backup (a pasta já é espelhada no
iCloud todo dia), mas **não são dataset de treino**. Todo registro carrega
`origem: "papai"`, e é por esse campo que eles se mantêm fora de qualquer
análise de distribuição — misturá-los envenenaria o dataset de reunião e, pior,
trataria como descartável um material que não é. Ver `PAPAI.md`.

Vale também a regra do Git com mais força ainda: são opiniões, sentimentos e a
voz de um pai falando dos filhos. **Nunca** um `git add -f` aqui.
