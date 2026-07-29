import SwiftUI

/// Tela para o usuário ver e adicionar palavras-gatilho personalizadas.
struct KeywordsView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var model: ConversationModel
    @State private var newWord = ""
    @State private var custom = UserSettings.customKeywords

    var body: some View {
        NavigationStack {
            List {
                Section("Adicionar palavra ou frase") {
                    HStack {
                        TextField("ex.: fechar contrato", text: $newWord)
                        Button("Adicionar") {
                            UserSettings.add(newWord)
                            newWord = ""
                            custom = UserSettings.customKeywords
                            model.reloadKeywords()
                        }
                        .disabled(newWord.trimmingCharacters(in: .whitespaces).isEmpty)
                    }
                }

                if !custom.isEmpty {
                    Section("Minhas palavras") {
                        ForEach(custom, id: \.self) { word in
                            Text(word)
                        }
                        .onDelete { idx in
                            idx.map { custom[$0] }.forEach { UserSettings.remove($0) }
                            custom = UserSettings.customKeywords
                            model.reloadKeywords()
                        }
                    }
                }

                Section("Categorias base (negócios)") {
                    ForEach(BusinessKeywords.base.keys.sorted(), id: \.self) { cat in
                        HStack {
                            Text(cat.replacingOccurrences(of: "_", with: " ").capitalized)
                            Spacer()
                            Text("\(BusinessKeywords.base[cat]?.count ?? 0)")
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Palavras de negócio")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("OK") { dismiss() }
                }
            }
        }
    }
}

/// Tela do histórico de conversas.
struct HistoryView: View {
    @State private var entries = History.all()

    var body: some View {
        List {
            if entries.isEmpty {
                Text("Nenhuma conversa analisada ainda.")
                    .foregroundStyle(.secondary)
            }
            ForEach(entries) { e in
                HStack(spacing: 12) {
                    Text(e.dominantEmoji).font(.system(size: 30))
                    VStack(alignment: .leading, spacing: 2) {
                        Text(e.dominantLabel)
                            .font(.subheadline.bold())
                            .foregroundStyle(Color(hex: e.dominantColor))
                        Text("\(e.date.formatted(date: .abbreviated, time: .shortened)) · energia \(e.energy) · positividade \(e.valence)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .onDelete { _ in }
        }
        .navigationTitle("Histórico")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Limpar") {
                    History.clear()
                    entries = []
                }
            }
        }
    }
}
