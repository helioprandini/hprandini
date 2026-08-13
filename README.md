# 🎙️ Voice&Emotion

**Ouça como você soa para os outros.**

A sua voz carrega mais do que palavras. O Voice&Emotion escuta os sinais que
revelam emoção na fala e devolve, em segundos, como você soou de verdade.

É para **qualquer pessoa cuja vida depende de como ela fala**: quem vende,
negocia, lidera, ensina, apresenta, atende, entrevista ou defende uma ideia.
Emoção na voz é humano — não é nicho.

Tudo roda **no seu aparelho**: nada de servidor, instalação, chave de API ou upload de áudio.

> Este é o produto-base de um projeto maior: a **AE (Artificial Emotion)** — a
> busca por um algoritmo capaz de traduzir a emoção humana em dados.
> Ver [`CLAUDE.md`](CLAUDE.md), [`PLANO_DE_JOGO.md`](PLANO_DE_JOGO.md) e
> [`ESTRATEGIA_DADOS.md`](ESTRATEGIA_DADOS.md).

## Para que serve

O Voice&Emotion captura os sinais acústicos que carregam emoção na fala e mostra,
em linguagem simples, como sua voz variou ao longo da conversa:

- **Energia** — o quanto você projetou a voz
- **Calor** — quão acolhedor vs. contido você soou
- **Expressividade** — variação de entonação (envolvente vs. plano)
- **Fluência** — ritmo e pausas

E, depois de cada gravação, ele te pergunta **como você realmente se sentiu** —
porque só você sabe. Essa resposta ensina o sistema a ler melhor, e é o primeiro
tijolo do dataset da AE.

A partir disso, ele classifica trechos em variantes emocionais (Entusiasmado, Amigável,
Assertivo, Tenso, Monótono, Calmo…) e monta uma **linha do tempo emocional** da conversa,
com observações de coaching para melhorar.

## Como usar

1. Abra o `index.html` num navegador moderno (Chrome, Edge ou Firefox).
   - Recomendado: rode um servidor local para o microfone funcionar bem:
     ```bash
     npx serve .
     # ou
     python3 -m http.server 8000
     ```
     e acesse `http://localhost:8000`.
2. Clique no botão vermelho e **permita o acesso ao microfone**.
3. Fale / conduza sua conversa. Acompanhe os medidores ao vivo.
4. Clique de novo para parar. Veja o resumo, a linha do tempo e as dicas.
5. Reouça, baixe o áudio, e compare com conversas anteriores no histórico.

## Como a análise funciona (e seus limites)

A emoção na fala tem correlatos acústicos bem estudados na literatura de *speech emotion
recognition* (Scherer; Juslin & Laukka). O VozEmoção mede, quadro a quadro:

| Sinal acústico | Como é medido | O que indica |
|---|---|---|
| Energia (RMS) | amplitude do sinal | excitação / arousal |
| Altura da voz (F0) | autocorrelação | tensão / animação |
| Variação do pitch | desvio-padrão do F0 | expressividade vs. monotonia |
| Brilho espectral | centroide espectral | esforço / tensão vocal |
| Pausas | frações sem voz | hesitação vs. fluência |

Esses sinais são combinados em dois eixos (**energia** × **positividade**) e classificados
em variantes emocionais.

> ⚠️ **Importante:** é uma **estimativa de prosódia para treino de tom**, não um
> diagnóstico psicológico nem detecção de mentira. A precisão depende da qualidade do
> microfone e do ambiente. Grave apenas conversas que você tem permissão legal para gravar.

## Privacidade

100% local. O áudio nunca sai do seu navegador. O histórico (só os números da análise, sem
áudio) fica no `localStorage` do seu próprio dispositivo e pode ser apagado a qualquer
momento pelo botão **Limpar**.

## Estrutura

```
index.html        # interface
css/styles.css    # estilos
js/emotion.js     # motor de análise emocional (prosódia)
js/app.js         # gravação, captura ao vivo, render e histórico
```

## Próximos passos possíveis

- Separar falante vs. ouvinte (diarização) para analisar a reação de quem ouve
- Transcrição + análise de sentimento do texto (combinando com o tom)
- Exportar relatório em PDF por conversa
- Calibração por usuário para maior precisão dos eixos
