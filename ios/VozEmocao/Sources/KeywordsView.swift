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
        ScrollView {
            VStack(spacing: 10) {
                if entries.isEmpty {
                    VStack(spacing: 8) {
                        Image(systemName: "waveform")
                            .font(.system(size: 30))
                            .foregroundStyle(Theme.textFaint)
                        Text("Nenhuma conversa ainda")
                            .font(.system(size: 15, weight: .medium))
                        Text("Grave a primeira e comece a acompanhar sua evolução.")
                            .font(.system(size: 13))
                            .foregroundStyle(Theme.textDim)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 60)
                }

                ForEach(entries) { e in
                    HStack(spacing: 13) {
                        Text(e.dominantEmoji).font(.system(size: 27))
                        VStack(alignment: .leading, spacing: 2) {
                            Text(e.dominantLabel)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(Color(hex: e.dominantColor))
                            Text("\(e.date.formatted(date: .abbreviated, time: .shortened)) · energia \(e.energy) · calor \(e.valence)")
                                .font(.system(size: 11.5))
                                .foregroundStyle(Theme.textFaint)
                        }
                        Spacer(minLength: 0)
                    }
                    .padding(14)
                    .background(Theme.bgInset)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 30)
        }
        .background(Theme.background)
        .navigationTitle("Suas conversas")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Limpar") {
                    History.clear()
                    entries = []
                }
                .tint(Theme.warm)
            }
        }
    }
}
