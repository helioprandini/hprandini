import SwiftUI

struct ContentView: View {
    @EnvironmentObject var model: ConversationModel
    @State private var showKeywords = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    header
                    mainCard
                    if model.mode == .recording { liveCard }
                    if let s = model.lastSummary, model.mode != .recording { resultCard(s) }
                    historyLink
                    disclaimer
                }
                .padding(.horizontal, 18)
                .padding(.bottom, 40)
            }
            .background(Theme.background)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Voice&Emotion").font(.system(size: 15, weight: .semibold))
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showKeywords = true } label: {
                        Image(systemName: "text.badge.plus")
                    }
                    .tint(Theme.warm)
                }
            }
            .sheet(isPresented: $showKeywords) { KeywordsView() }
            .alert("Gravar esta conversa?", isPresented: $model.showRecordPrompt) {
                Button("Gravar") { model.confirmRecording() }
                Button("Agora não", role: .cancel) { model.dismissPrompt() }
            } message: {
                Text("Ouvi \"\(model.triggeredKeyword)\". Quer que eu grave e leia o tom desta conversa?")
            }
        }
        .tint(Theme.warm)
    }

    // MARK: - Cabeçalho (marca + promessa)

    private var header: some View {
        HStack(spacing: 13) {
            BrandMark(size: 40)
            VStack(alignment: .leading, spacing: 1) {
                HStack(spacing: 1) {
                    Text("Voice").font(.system(size: 19, weight: .semibold))
                    Text("&").font(.system(size: 19, weight: .regular)).foregroundStyle(Theme.warm)
                    Text("Emotion").font(.system(size: 19, weight: .semibold))
                }
                Text("Ouça como você soa para os outros")
                    .font(.system(size: 12.5))
                    .foregroundStyle(Theme.textDim)
            }
            Spacer(minLength: 0)
        }
        .padding(.top, 4)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Cartão principal (escuta / gravação)

    private var mainCard: some View {
        VStack(spacing: 18) {
            Text(model.statusText)
                .font(.system(size: 13.5))
                .foregroundStyle(Theme.textDim)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)

            switch model.mode {
            case .idle:
                actionButton("Ouvir", icon: "ear", tint: Theme.trust) { model.startListening() }
                welcomeNote

            case .listening:
                Label("Ouvindo palavras de negócio…", systemImage: "waveform")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(Theme.pitch)
                actionButton("Gravar agora", icon: "record.circle", tint: Theme.warm) {
                    model.confirmRecording()
                }
                actionButton("Parar de ouvir", icon: "stop.fill", tint: Theme.bgInset,
                             fg: Theme.textDim) { model.stopListening() }

            case .recording:
                actionButton("Parar e ler", icon: "stop.circle.fill", tint: Theme.danger) {
                    model.stopRecording()
                }
            }
        }
        .card()
    }

    /// Primeira impressão: explica o valor antes do primeiro uso.
    private var welcomeNote: some View {
        VStack(spacing: 0) {
            Divider().background(Theme.line).padding(.vertical, 4)
            Text("A sua voz carrega mais do que palavras. Eu escuto os sinais que revelam emoção — **energia, calor, expressividade e ritmo** — e te devolvo como você soou de verdade. Fale como fala no dia a dia.")
                .font(.system(size: 13))
                .foregroundStyle(Theme.textDim)
                .multilineTextAlignment(.center)
                .lineSpacing(3)
                .padding(.top, 12)
        }
    }

    private func actionButton(_ title: String, icon: String, tint: Color,
                              fg: Color = .white,
                              action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Label(title, systemImage: icon)
                .font(.system(size: 15, weight: .semibold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(tint)
                .foregroundStyle(fg)
                .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
        }
    }

    // MARK: - Ao vivo

    private var liveCard: some View {
        VStack(spacing: 16) {
            Text(timeString(model.elapsed))
                .font(.system(size: 36, weight: .bold, design: .rounded))
                .monospacedDigit()
                .foregroundStyle(Theme.text)

            LabeledMeter(label: "Energia", value: model.liveEnergy, color: Theme.energy)
            LabeledMeter(label: "Altura da voz", value: model.livePitch, color: Theme.pitch)
            LabeledMeter(label: "Expressividade", value: model.liveExpr, color: Theme.expr)

            Text(model.liveEmotion)
                .font(.system(size: 17, weight: .semibold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Theme.bgInset)
                .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
        }
        .card()
    }

    // MARK: - Resultado

    private func resultCard(_ s: EmotionEngine.Summary) -> some View {
        VStack(alignment: .leading, spacing: 18) {
            Text("Como você soou")
                .font(.system(size: 16, weight: .semibold))

            HStack(spacing: 16) {
                VStack(spacing: 8) {
                    Text(s.dominant.emoji).font(.system(size: 46))
                    Text(s.dominant.label)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(Color(hex: s.dominant.colorHex))
                        .multilineTextAlignment(.center)
                    Text("tom predominante")
                        .font(.system(size: 10.5))
                        .foregroundStyle(Theme.textFaint)
                }
                .frame(width: 128)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(colors: [Theme.bgInset, Theme.warm.opacity(0.06)],
                                   startPoint: .top, endPoint: .bottom)
                )
                .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))

                VStack(spacing: 11) {
                    LabeledMeter(label: "Energia", value: Double(s.energy) / 100,
                                 color: Theme.energy, height: 8)
                    LabeledMeter(label: "Calor", value: Double(s.valence) / 100,
                                 color: Theme.valence, height: 8)
                    LabeledMeter(label: "Expressividade", value: Double(s.expressiveness) / 100,
                                 color: Theme.expr, height: 8)
                    LabeledMeter(label: "Fluência", value: Double(s.flow) / 100,
                                 color: Theme.flow, height: 8)
                }
            }

            SectionLabel(text: "Ao longo da conversa")
            TimelineChart(segments: model.lastTimeline)
                .frame(height: 110)

            if !model.lastInsights.isEmpty {
                SectionLabel(text: "O que eu percebi")
                VStack(alignment: .leading, spacing: 9) {
                    ForEach(model.lastInsights, id: \.self) { tip in
                        Text(tip)
                            .font(.system(size: 13.5))
                            .foregroundStyle(Color(hex: "#DBE1EE"))
                            .lineSpacing(2)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }

            if let url = model.lastRecordingURL {
                ShareLink(item: url) {
                    Label("Compartilhar áudio", systemImage: "square.and.arrow.up")
                        .font(.system(size: 13))
                }
                .tint(Theme.warm)
            }
        }
        .card()
    }

    // MARK: - Histórico e rodapé

    private var historyLink: some View {
        NavigationLink {
            HistoryView()
        } label: {
            HStack {
                Label("Suas conversas", systemImage: "clock.arrow.circlepath")
                    .font(.system(size: 14, weight: .medium))
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Theme.textFaint)
            }
            .foregroundStyle(Theme.text)
            .padding(18)
            .background(Theme.bgElev)
            .clipShape(RoundedRectangle(cornerRadius: Theme.rLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: Theme.rLg, style: .continuous)
                    .stroke(Theme.line, lineWidth: 1)
            )
        }
    }

    private var disclaimer: some View {
        Text("🔒 Tudo acontece no seu aparelho. A leitura emocional é uma estimativa a partir da prosódia — feita para treinar seu tom, não para diagnosticar ninguém. Grave apenas conversas que você tem permissão para gravar.")
            .font(.system(size: 11.5))
            .foregroundStyle(Theme.textFaint)
            .multilineTextAlignment(.center)
            .lineSpacing(3)
            .padding(.top, 10)
            .padding(.horizontal, 6)
    }

    private func timeString(_ t: TimeInterval) -> String {
        let s = Int(t)
        return String(format: "%02d:%02d", s / 60, s % 60)
    }
}

/// Linha do tempo emocional: altura = energia, cor = tom do trecho.
struct TimelineChart: View {
    let segments: [EmotionEngine.TimelineSegment]

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .bottomLeading) {
                RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous)
                    .fill(Theme.bgInset)

                if segments.isEmpty {
                    Text("Sem dados suficientes")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.textFaint)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    let bw = geo.size.width / CGFloat(segments.count)
                    HStack(alignment: .bottom, spacing: 1) {
                        ForEach(Array(segments.enumerated()), id: \.offset) { _, seg in
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Color(hex: seg.emotion.colorHex))
                                .frame(width: max(1, bw - 1),
                                       height: max(3, (geo.size.height - 16)
                                                   * CGFloat(seg.energy) / 100))
                        }
                    }
                    .padding(8)
                }
            }
        }
    }
}
