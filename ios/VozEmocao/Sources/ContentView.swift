import SwiftUI

// Cor a partir de hex "#RRGGBB"
extension Color {
    init(hex: String) {
        let s = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        var v: UInt64 = 0
        Scanner(string: s).scanHexInt64(&v)
        self.init(.sRGB,
                  red: Double((v >> 16) & 0xFF) / 255,
                  green: Double((v >> 8) & 0xFF) / 255,
                  blue: Double(v & 0xFF) / 255)
    }
}

struct ContentView: View {
    @EnvironmentObject var model: ConversationModel
    @State private var showKeywords = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    listeningCard
                    if model.mode == .recording { liveCard }
                    if let s = model.lastSummary, model.mode != .recording { resultCard(s) }
                    historyLink
                    disclaimer
                }
                .padding()
            }
            .background(Color(hex: "#0F1220").ignoresSafeArea())
            .navigationTitle("VozEmoção")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showKeywords = true } label: { Image(systemName: "text.badge.plus") }
                }
            }
            .sheet(isPresented: $showKeywords) { KeywordsView() }
            // Pop-up dentro do app perguntando se quer gravar
            .alert("Gravar esta conversa?", isPresented: $model.showRecordPrompt) {
                Button("Gravar", role: .none) { model.confirmRecording() }
                Button("Agora não", role: .cancel) { model.dismissPrompt() }
            } message: {
                Text("Ouvi \"\(model.triggeredKeyword)\" — um assunto de negócio. Quer que eu grave e analise o tom da conversa?")
            }
        }
    }

    // MARK: - Cartão principal (escuta / gravação)

    private var listeningCard: some View {
        VStack(spacing: 16) {
            Text(model.statusText)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            switch model.mode {
            case .idle:
                bigButton(title: "Ouvir", system: "ear", color: "#6C8BFF") { model.startListening() }
            case .listening:
                VStack(spacing: 10) {
                    Label("Ouvindo palavras de negócio…", systemImage: "waveform")
                        .foregroundStyle(Color(hex: "#4FD1C5"))
                    bigButton(title: "Parar de ouvir", system: "stop.fill", color: "#FF5470") { model.stopListening() }
                    bigButton(title: "Gravar agora", system: "record.circle", color: "#FF7A59") { model.confirmRecording() }
                }
            case .recording:
                bigButton(title: "Parar e analisar", system: "stop.circle.fill", color: "#FF5470") { model.stopRecording() }
            }
        }
        .padding()
        .background(Color(hex: "#191D33"))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func bigButton(title: String, system: String, color: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Label(title, systemImage: system)
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color(hex: color))
                .foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }

    // MARK: - Medidores ao vivo

    private var liveCard: some View {
        VStack(spacing: 14) {
            Text(timeString(model.elapsed))
                .font(.system(size: 34, weight: .bold, design: .rounded))
                .monospacedDigit()
            meter("Energia / Volume", model.liveEnergy, "#FF7A59")
            meter("Altura da voz", model.livePitch, "#4FD1C5")
            meter("Expressividade", model.liveExpr, "#B085FF")
            Text(model.liveEmotion)
                .font(.title3.bold())
                .padding(.top, 4)
        }
        .padding()
        .background(Color(hex: "#191D33"))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func meter(_ label: String, _ value: Double, _ color: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label).font(.caption).foregroundStyle(.secondary)
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color(hex: "#212747"))
                    Capsule().fill(Color(hex: color))
                        .frame(width: geo.size.width * value)
                }
            }
            .frame(height: 12)
        }
    }

    // MARK: - Resultado

    private func resultCard(_ s: EmotionEngine.Summary) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Resumo emocional").font(.headline)
            HStack(spacing: 16) {
                VStack {
                    Text(s.dominant.emoji).font(.system(size: 48))
                    Text(s.dominant.label).font(.subheadline.bold())
                        .foregroundStyle(Color(hex: s.dominant.colorHex))
                        .multilineTextAlignment(.center)
                }
                .frame(width: 130)
                .padding(.vertical, 8)

                VStack(spacing: 8) {
                    dim("Energia", s.energy, "#FF7A59")
                    dim("Positividade", s.valence, "#FFD166")
                    dim("Expressividade", s.expressiveness, "#B085FF")
                    dim("Fluência", s.flow, "#63D471")
                }
            }

            TimelineChart(segments: model.lastTimeline)
                .frame(height: 120)

            if !model.lastInsights.isEmpty {
                Text("Observações de coaching").font(.subheadline.bold())
                ForEach(model.lastInsights, id: \.self) { tip in
                    Text("• \(tip)").font(.footnote).foregroundStyle(.secondary)
                }
            }

            if let url = model.lastRecordingURL {
                ShareLink(item: url) {
                    Label("Compartilhar gravação", systemImage: "square.and.arrow.up")
                }
                .font(.footnote)
            }
        }
        .padding()
        .background(Color(hex: "#191D33"))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func dim(_ label: String, _ value: Int, _ color: String) -> some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(label).font(.caption2).foregroundStyle(.secondary)
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color(hex: "#212747"))
                    Capsule().fill(Color(hex: color))
                        .frame(width: geo.size.width * Double(value) / 100)
                }
            }
            .frame(height: 9)
        }
    }

    private var historyLink: some View {
        NavigationLink {
            HistoryView()
        } label: {
            Label("Histórico de conversas", systemImage: "clock.arrow.circlepath")
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(hex: "#191D33"))
                .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }

    private var disclaimer: some View {
        Text("🔒 Tudo roda no seu iPhone. A análise emocional é uma estimativa de prosódia (energia, altura e variação da voz, pausas) para treino de tom — não um diagnóstico. Grave apenas conversas que você tem permissão para gravar.")
            .font(.caption2)
            .foregroundStyle(.secondary)
            .multilineTextAlignment(.center)
            .padding(.top, 8)
    }

    private func timeString(_ t: TimeInterval) -> String {
        let s = Int(t)
        return String(format: "%02d:%02d", s / 60, s % 60)
    }
}

/// Gráfico simples da linha do tempo emocional (barras = energia, cor = emoção).
struct TimelineChart: View {
    let segments: [EmotionEngine.TimelineSegment]

    var body: some View {
        GeometryReader { geo in
            let n = max(segments.count, 1)
            let bw = geo.size.width / CGFloat(n)
            ZStack(alignment: .bottomLeading) {
                RoundedRectangle(cornerRadius: 12).fill(Color(hex: "#212747"))
                HStack(alignment: .bottom, spacing: 1) {
                    ForEach(Array(segments.enumerated()), id: \.offset) { _, seg in
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color(hex: seg.emotion.colorHex))
                            .frame(width: bw - 1,
                                   height: max(4, geo.size.height * CGFloat(seg.energy) / 100))
                    }
                }
                .padding(.horizontal, 2)
            }
        }
    }
}
