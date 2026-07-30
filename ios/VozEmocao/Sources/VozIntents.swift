import AppIntents

/// Atalhos de voz/Siri para iniciar sem tocar no aparelho.
/// Ex.: "Ei Siri, gravar conversa no VozEmoção".

@available(iOS 16.0, *)
struct StartRecordingIntent: AppIntent {
    static var title: LocalizedStringResource = "Gravar conversa"
    static var description = IntentDescription("Começa a gravar e analisar o tom da conversa.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult {
        ConversationModel.shared.confirmRecording()
        return .result()
    }
}

@available(iOS 16.0, *)
struct StartListeningIntent: AppIntent {
    static var title: LocalizedStringResource = "Ouvir palavras de negócio"
    static var description = IntentDescription("Começa a ouvir e avisa quando surgir um assunto de negócio.")
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult {
        ConversationModel.shared.startListening()
        return .result()
    }
}

@available(iOS 16.0, *)
struct StopIntent: AppIntent {
    static var title: LocalizedStringResource = "Parar e analisar"
    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult {
        let model = ConversationModel.shared
        if model.mode == .recording {
            model.stopRecording()
        } else {
            model.stopListening()
        }
        return .result()
    }
}

@available(iOS 16.0, *)
struct VozAppShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: StartRecordingIntent(),
            phrases: [
                "Gravar conversa no \(.applicationName)",
                "\(.applicationName) gravar conversa"
            ],
            shortTitle: "Gravar conversa",
            systemImageName: "record.circle"
        )
        AppShortcut(
            intent: StartListeningIntent(),
            phrases: [
                "Ouvir com o \(.applicationName)",
                "\(.applicationName) ouvir conversa"
            ],
            shortTitle: "Ouvir",
            systemImageName: "ear"
        )
    }
}
