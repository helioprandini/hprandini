# 🎙️ Voice&Emotion — iOS

App iOS (SwiftUI) que ouve palavras ligadas a negócios e, com a sua confirmação,
grava e lê o **tom emocional** da conversa.

É para **qualquer pessoa cuja vida depende de como ela fala** — quem vende,
negocia, lidera, ensina, apresenta ou defende uma ideia.

## O que ele faz (e o que o iOS permite)

- **Modo Ouvir:** usa reconhecimento de fala em pt-BR (no próprio aparelho quando
  disponível) para detectar palavras de negócio (o repositório em
  `BusinessKeywords.swift`, com dezenas de termos de vendas, negociação,
  corretagem/seguros, financeiro etc.). Depois de iniciado, **continua ouvindo
  mesmo com a tela bloqueada ou o app minimizado** (modo de áudio em background).
- **Aviso na tela de bloqueio com ação:** ao ouvir uma palavra de negócio, chega
  uma **notificação com os botões "🔴 Gravar agora" / "Agora não"** direto no
  bloqueio — você decide sem precisar abrir o app antes.
- **Início mãos-livres pela Siri:** *(temporariamente desativado — o build phase
  `AppIntentsSSUTraining` do Xcode estava falhando; o recurso foi removido para
  destravar a instalação e será reativado depois.)*
- **Gravação + análise:** captura o áudio e mede, quadro a quadro, energia, altura
  da voz (pitch), variação (expressividade), brilho espectral e pausas. Ao parar,
  classifica a emoção predominante, monta a linha do tempo e dá dicas de coaching.
- **Palavras personalizadas, histórico e compartilhamento** da gravação.

> ⚠️ **Limite honesto do iOS (o que ainda NÃO dá):** o app não **inicia sozinho**
> a escuta quando está fechado ou o telefone está apenas bloqueado — quem começa
> é você (abrindo o app e tocando em Ouvir). A Apple não permite que um
> app ligue o microfone sozinho em background sem uma ação sua, nem abra uma tela
> por cima do bloqueio automaticamente. O que conseguimos: **uma vez iniciado, ele
> segue ouvindo com a tela travada** e te avisa por **notificação com botão de
> gravar**. Contornar isso exigiria jailbreak — que quebra a segurança do
> aparelho, sai da App Store e não é recomendável.

### Fluxo real de uso
1. Antes da reunião/visita, abra o app e toque **Ouvir**.
2. Bloqueia o telefone e guarda no bolso. O app continua escutando.
3. Quando alguém fala "proposta", "desconto", "apólice"… chega a notificação no
   bloqueio. Você toca **🔴 Gravar agora**.
4. Ao final, toca **Parar e ler** e vê como você soou.

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
   - A escuta em background já vem ligada pelo `Info.plist` (`UIBackgroundModes:
     audio`). Se preferir, confirme em **+ Capability → Background Modes → Audio**.
   - A notificação usa nível *time-sensitive* para aparecer mesmo no modo Foco.
     Com Apple ID grátis isso pode ser ignorado (a notificação ainda chega, só
     sem prioridade extra) — sem problema para testar.
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
      RecordingSession.swift      # captura/análise fora do main actor
      Theme.swift                 # sistema visual (paleta, marca, componentes)
      Support.swift               # settings, histórico, notificações c/ ações
```

## Privacidade

Áudio e análise ficam no aparelho. O histórico guarda apenas os números (sem
áudio). O reconhecimento de fala pode usar servidores da Apple dependendo do
modelo/idioma — o iOS informa isso na permissão.
