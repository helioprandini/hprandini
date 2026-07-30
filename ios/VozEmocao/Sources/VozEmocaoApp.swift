import SwiftUI

@main
struct VozEmocaoApp: App {
    @StateObject private var model = ConversationModel.shared

    init() {
        NotificationScheduler.requestAuthorization()
        NotificationCoordinator.shared.register()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(model)
                .preferredColorScheme(.dark)
        }
    }
}
