# Estratégia de Dados & Aprendizado — o caminho até o algoritmo AE

> Norte: **traduzir a emoção humana em dados.** Este documento é honesto sobre
> como se chega lá — e sobre o que é o verdadeiro gargalo.

## A verdade central (ler antes de qualquer código de "IA")

Não existe atalho de modelo. O que separa a AE de um brinquedo é **dado real,
rotulado e consentido**. Hoje o app mede prosódia (energia, pitch, variação,
pausas) com **regras que o Theo escreveu à mão** — é uma boa aproximação, mas é
palpite calibrado, não aprendizado.

Para virar aprendizado de verdade, cada gravação precisa virar um **exemplo
rotulado**:

```
[ sinais acústicos da voz ]  →  [ como a pessoa REALMENTE se sentiu ]
   (o que a máquina mede)          (a verdade, dada por um humano)
```

Esse segundo campo — o **ground truth** — é o ouro. Sem ele, não há o que
treinar. Com ele, cada conversa gravada é um tijolo do dataset.

## Os degraus (do tijolo zero ao modelo)

### Degrau 0 — Capturar ground truth (é onde começamos)
Depois de cada gravação, perguntar de forma leve:
- **A leitura bateu?** (👍 / 👎)
- **Como você se sentiu de verdade?** (ex.: confiante, ansioso, animado, neutro…)
- Opcional: **como a conversa terminou?** (avançou / travou / fechou)

Guardar isso junto das features acústicas da sessão. Isso serve às DUAS frentes:
é usabilidade (o usuário sente que o app aprende com ele) e é o dataset nascendo.

### Degrau 1 — Acumular e exportar
- Guardar cada sessão rotulada localmente (privado, no aparelho).
- Poder **exportar** o dataset (JSON) — nossas primeiras linhas de dados reais.
- Meta simbólica: as primeiras 100 conversas rotuladas do Helio.

### Degrau 2 — Aprender com os próprios dados (personalização)
- Com dados suficientes de UMA pessoa, ajustar as faixas do motor a ela
  (calibração pessoal). Já é "aprendizado", ainda que simples e local.
- Medir honestamente: a leitura calibrada acerta mais que a genérica?

### Degrau 3 — Modelo de verdade
- Com dados de várias pessoas (consentidos), treinar um modelo que preveja o
  rótulo emocional a partir das features. Comparar contra as regras atuais.
- Só se o número provar que é melhor, ele substitui a heurística.

### Degrau 4 — O algoritmo AE
- Emoção humana → dados estruturados, generalizando para além de quem treinou.
  É o norte. Talvez impossível. É por isso que a gente tenta.

## Regras que não se quebram

- **Consentimento sempre.** Rótulo emocional é dado íntimo. Nada sai do aparelho
  sem o "sim" explícito da pessoa.
- **Privacidade por padrão.** Guardar local; processar no aparelho quando der.
  Exportar/enviar é escolha ativa do usuário, nunca automático.
- **Honestidade no número.** Nunca dizer que "aprendeu" sem medir. Se a regra
  antiga acerta mais que o modelo, a gente diz e mantém a regra.

## O que é o "aprendizado generativo" aqui (sem hype)

Generativo, pra nós, não é fazer o app "inventar" emoção. É, no futuro, o modelo
conseguir **descrever em dados** a emoção de uma fala que ele nunca ouviu —
generalizar a leitura para vozes novas. Chega-se lá com os degraus acima, um de
cada vez. O tijolo zero é hoje: **perguntar como a pessoa se sentiu.**
