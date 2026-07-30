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
        center.setNotificationCategories([category])
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
        Task { @MainActor in
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
