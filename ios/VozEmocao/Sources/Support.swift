import Foundation
import UserNotifications

/// Palavras personalizadas do usuário (além da lista base de negócios).
enum UserSettings {
    private static let key = "custom_keywords"

    static var customKeywords: [String] {
        get { UserDefaults.standard.stringArray(forKey: key) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: key) }
    }

    static func add(_ word: String) {
        let trimmed = word.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        var list = customKeywords
        let norm = BusinessKeywords.normalize(trimmed)
        guard !list.contains(where: { BusinessKeywords.normalize($0) == norm }) else { return }
        list.append(trimmed)
        customKeywords = list
    }

    static func remove(_ word: String) {
        customKeywords = customKeywords.filter { $0 != word }
    }
}

/// Histórico das conversas analisadas (só os números, sem áudio).
enum History {
    private static let key = "history_v1"

    struct Entry: Codable, Identifiable {
        let id: TimeInterval
        let date: Date
        let durationMs: Double
        let energy: Int
        let valence: Int
        let expressiveness: Int
        let flow: Int
        let dominantLabel: String
        let dominantEmoji: String
        let dominantColor: String
    }

    static func all() -> [Entry] {
        guard let data = UserDefaults.standard.data(forKey: key),
              let list = try? JSONDecoder().decode([Entry].self, from: data) else { return [] }
        return list
    }

    static func add(summary: EmotionEngine.Summary,
                    timeline: [EmotionEngine.TimelineSegment],
                    durationMs: Double) {
        var list = all()
        let entry = Entry(
            id: Date().timeIntervalSince1970,
            date: Date(),
            durationMs: durationMs,
            energy: summary.energy,
            valence: summary.valence,
            expressiveness: summary.expressiveness,
            flow: summary.flow,
            dominantLabel: summary.dominant.label,
            dominantEmoji: summary.dominant.emoji,
            dominantColor: summary.dominant.colorHex
        )
        list.insert(entry, at: 0)
        if list.count > 50 { list = Array(list.prefix(50)) }
        if let data = try? JSONEncoder().encode(list) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }

    static func clear() { UserDefaults.standard.removeObject(forKey: key) }
}

/// Notificação local que aparece na tela de bloqueio quando uma palavra de
/// negócio é ouvida. Traz botões de ação ("Gravar agora" / "Agora não") para
/// o usuário decidir direto no bloqueio, sem precisar abrir o app antes.
///
/// (No iOS não é possível abrir uma tela sobre o bloqueio automaticamente; a
/// notificação com ações é o mecanismo legítimo mais próximo disso.)
enum NotificationScheduler {
    static let categoryId = "RECORD_PROMPT"
    static let actionRecord = "RECORD_NOW"
    static let actionDismiss = "DISMISS_PROMPT"
    static let diarioCategoryId = "DIARIO_LABEL"
    static let diarioStartCategoryId = "DIARIO_START"

    /// Bom-dia diário: o telefone lembra a pessoa, não o contrário. O toque
    /// nesta notificação LIGA o dia (ver NotificationCoordinator) — o iOS não
    /// permite que um app se inicie sozinho, então um toque é o piso; este
    /// arranjo faz esse único toque ser na própria notificação.
    static func agendarBomDia(hora: Int = 8, minuto: Int = 50) {
        let content = UNMutableNotificationContent()
        content.title = "Bom dia, Helio ☀️"
        content.body = "Toque aqui e eu começo a ouvir o seu dia — é o seu único passo."
        content.sound = .default
        content.categoryIdentifier = diarioStartCategoryId

        var comps = DateComponents()
        comps.hour = hora; comps.minute = minuto
        let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: true)
        // Identificador fixo: re-agendar substitui em vez de acumular.
        UNUserNotificationCenter.current().add(UNNotificationRequest(
            identifier: "diario-bom-dia", content: content, trigger: trigger))
    }

    /// Chamado do Diário automático: um momento foi capturado, falta o rótulo.
    static func presentDiario(titulo: String, corpo: String) {
        let content = UNMutableNotificationContent()
        content.title = titulo
        content.body = corpo
        content.sound = .default
        content.categoryIdentifier = diarioCategoryId
        content.interruptionLevel = .timeSensitive
        UNUserNotificationCenter.current().add(UNNotificationRequest(
            identifier: "diario-\(Int(Date().timeIntervalSince1970))",
            content: content, trigger: nil))
    }

    static func requestAuthorization() {
        UNUserNotificationCenter.current()
            .requestAuthorization(options: [.alert, .sound]) { _, _ in }
    }

    static func presentRecordPrompt(keyword: String) {
        let content = UNMutableNotificationContent()
        content.title = "Assunto de negócio detectado"
        content.body = "Ouvi \"\(keyword)\". Quer gravar e analisar esta conversa?"
        content.sound = .default
        content.categoryIdentifier = categoryId
        content.interruptionLevel = .timeSensitive // aparece mesmo em foco/bloqueio

        let request = UNNotificationRequest(
            identifier: "record-prompt-\(Int(Date().timeIntervalSince1970))",
            content: content,
            trigger: nil
        )
        UNUserNotificationCenter.current().add(request)
    }
}

/// Registra as categorias de notificação e trata os toques do usuário,
/// encaminhando para o modelo de conversa.
final class NotificationCoordinator: NSObject, UNUserNotificationCenterDelegate {
    static let shared = NotificationCoordinator()

    func register() {
        let center = UNUserNotificationCenter.current()
        center.delegate = self

        let record = UNNotificationAction(
            identifier: NotificationScheduler.actionRecord,
            title: "🔴 Gravar agora",
            options: [.foreground]
        )
        let dismiss = UNNotificationAction(
            identifier: NotificationScheduler.actionDismiss,
            title: "Agora não",
            options: []
        )
        let category = UNNotificationCategory(
            identifier: NotificationScheduler.categoryId,
            actions: [record, dismiss],
            intentIdentifiers: [],
            options: []
        )
        // Diário: sem botões — o toque abre direto a folha de rótulo.
        let diario = UNNotificationCategory(
            identifier: NotificationScheduler.diarioCategoryId,
            actions: [], intentIdentifiers: [], options: [])
        let diarioStart = UNNotificationCategory(
            identifier: NotificationScheduler.diarioStartCategoryId,
            actions: [], intentIdentifiers: [], options: [])
        center.setNotificationCategories([category, diario, diarioStart])
    }

    // Mostra a notificação mesmo com o app aberto.
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound])
    }

    // Trata o toque no botão da notificação.
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        let action = response.actionIdentifier
        let category = response.notification.request.content.categoryIdentifier
        Task { @MainActor in
            if category == NotificationScheduler.diarioCategoryId {
                // O toque no chamado do Diário leva direto à folha de rótulo.
                DiarioModel.shared.querRotular = true
                DiarioModel.shared.abrirPedido = true
                completionHandler()
                return
            }
            if category == NotificationScheduler.diarioStartCategoryId {
                // Bom-dia tocado → o dia começa aqui mesmo, sem mais toques.
                DiarioModel.shared.abrirPedido = true
                if DiarioModel.shared.estado == .desligado {
                    DiarioModel.shared.comecarDia()
                }
                completionHandler()
                return
            }
            switch action {
            case NotificationScheduler.actionRecord, UNNotificationDefaultActionIdentifier:
                ConversationModel.shared.confirmRecording()
            case NotificationScheduler.actionDismiss:
                ConversationModel.shared.dismissPrompt()
            default:
                break
            }
            completionHandler()
        }
    }
}
