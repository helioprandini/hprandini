import SwiftUI

@main
struct VozEmocaoApp: App {
    @StateObject private var model = ConversationModel.shared

    init() {
        NotificationScheduler.requestAuthorization()
        NotificationCoordinator.shared.register()
        // O bom-dia fica sempre agendado; identificador fixo evita duplicar.
        NotificationScheduler.agendarBomDia()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(model)
                .preferredColorScheme(.dark)
        }
    }
}
