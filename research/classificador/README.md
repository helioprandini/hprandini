# Porteiro de assunto — trabalho × cotidiano

O que roda no iPhone (`ios/VozEmocao/Resources/AssuntoClassifier.mlmodel`, 35 KB)
para decidir se uma palavra-chave veio de conversa de trabalho ou do dia a dia.
"Negócio" com a seguradora passa; "esse negócio aí em cima da mesa" não.

## Como foi feito (2026-09-09)

- **Trabalho:** falas das reuniões reais do Helio (transcrições Plaud, fora do
  Git — são íntimas) + `trabalho_escrito.txt` (frases limpas, para o modelo não
  associar "trabalho" a "falado").
- **Cotidiano:** `cotidiano_base.txt` (escrito à mão, com 22 variações do
  "negócio = coisa") + combinações, cada uma também em versão *falada* (com
  "né", "tá", "aí"), pela mesma razão espelhada.
- **Normalização** (em `dados.py` e repetida no `AssuntoGate` do app):
  minúsculas, sem acento, sem pontuação, sem muletas de fala, **sem nomes
  próprios** — o modelo público não carrega cliente nem pessoa.
- **Algoritmo:** Create ML `maxEnt` (saco de palavras). O *transfer learning*
  com embedding dinâmico foi pior (89%) e é 20× mais lento.

## Números honestos

| | |
|---|---|
| Holdout (20%) | 94,2% |
| Frases duras que o modelo nunca viu (22) | 20 — as 2 erradas têm 6 palavras, sem contexto |
| Limiar no app | barra só com ≥ 70% de "cotidiano"; as frases de trabalho ficam entre 0,00 e 0,21 |

**A lição que custou uma rodada:** o primeiro modelo fez 98% no holdout e
9/18 nas duras — tinha aprendido *estilo* (transcrição × texto escrito), não
assunto. Holdout alto com teste externo baixo é o cheiro desse erro.

## Regerar

```bash
# precisa das transcricoes Plaud em ~/Downloads e ~/Documents (nao estao no Git)
python3 dados.py            # gera dados.csv e muletas.json
swiftc -O -o treino treino.swift && ./treino
cp AssuntoClassifier.mlmodel ../../ios/VozEmocao/Resources/
```
