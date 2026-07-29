import SwiftUI

@main
struct VozEmocaoApp: App {
    @StateObject private var model = ConversationModel()

    init() {
        NotificationScheduler.requestAuthorization()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(model)
                .preferredColorScheme(.dark)
        }
    }
}
