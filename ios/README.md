# 🎙️ VozEmoção — iOS

App iOS (SwiftUI) que ouve palavras ligadas a negócios e, com a sua confirmação,
grava e analisa o **tom emocional** da conversa. Feito para vendedores treinarem
voz, energia e expressividade.

## O que ele faz (e o que o iOS permite)

- **Modo Ouvir (app aberto):** usa reconhecimento de fala em pt-BR para detectar
  palavras de negócio (o repositório em `BusinessKeywords.swift`, com dezenas de
  termos de vendas, negociação, corretagem/seguros, financeiro etc.). Ao ouvir
  uma, mostra um **pop-up perguntando se quer gravar** e também envia uma
  **notificação** (que aparece na tela de bloqueio).
- **Gravação + análise:** captura o áudio e mede, quadro a quadro, energia, altura
  da voz (pitch), variação (expressividade), brilho espectral e pausas. Ao parar,
  classifica a emoção predominante, monta a linha do tempo e dá dicas de coaching.
- **Palavras personalizadas, histórico e compartilhamento** da gravação.

> ⚠️ **Limite honesto do iOS:** a Apple **não permite** que um app ouça o
> microfone continuamente em segundo plano com a tela travada, nem abra uma tela
> por cima do bloqueio automaticamente. Por isso a escuta ocorre com o app
> aberto, e o aviso na tela travada é uma **notificação** (que você toca para
> abrir e confirmar). Isso não tem como ser contornado sem jailbreak — que
> quebra a segurança do aparelho, sai da App Store e não é recomendável.

## Como compilar e testar no seu iPhone

Você precisa de um **Mac com Xcode**. Não dá para instalar em iPhone a partir do
Windows/Linux — é exigência da Apple.

1. Instale o Xcode (App Store) e o XcodeGen:
   ```bash
   brew install xcodegen
   ```
2. Gere o projeto:
   ```bash
   cd ios
   xcodegen generate
   open VozEmocao.xcodeproj
   ```
   (Ou crie um projeto iOS App no Xcode e arraste a pasta `VozEmocao/Sources` +
   o `Info.plist`.)
3. No Xcode: selecione o target **VozEmocao** → aba **Signing & Capabilities** →
   escolha seu **Apple ID** (Team). Um Apple ID grátis já permite instalar no seu
   próprio iPhone por 7 dias.
4. Conecte o iPhone, selecione-o como destino e clique em **Run (▶)**.
5. No iPhone, autorize **Microfone**, **Reconhecimento de fala** e
   **Notificações** quando pedir.

## Estrutura

```
ios/
  project.yml                     # config do XcodeGen
  VozEmocao/
    Resources/Info.plist          # permissões (microfone, fala)
    Sources/
      VozEmocaoApp.swift          # entrada do app
      ContentView.swift           # tela principal + gráfico + pop-up
      KeywordsView.swift          # palavras personalizadas + histórico
      ConversationModel.swift     # escuta, gravação e orquestração
      EmotionEngine.swift         # análise de prosódia (energia, pitch, etc.)
      AudioAnalyzer.swift         # FFT (Accelerate) para brilho espectral
      BusinessKeywords.swift      # repositório de palavras de negócio
      Support.swift               # settings, histórico, notificações
```

## Privacidade

Áudio e análise ficam no aparelho. O histórico guarda apenas os números (sem
áudio). O reconhecimento de fala pode usar servidores da Apple dependendo do
modelo/idioma — o iOS informa isso na permissão.
