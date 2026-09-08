import SwiftUI

/// Diário de Voz automático: um toque de manhã, rótulos ao longo do dia.
struct DiarioView: View {
    @ObservedObject var diario = DiarioModel.shared
    @State private var rotulando: DiarioModel.Momento?

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                explicacao
                controle
                if diario.aguardando != nil { consentimentoCard }
                if !diario.pendentesDeRotulo.isEmpty { pendentesCard }
                if !diario.momentos.isEmpty { historicoCard }
                avisoLegal
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 40)
        }
        .background(Theme.background)
        .navigationTitle("Diário de Voz")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $rotulando) { m in RotuloSheet(momento: m) }
        .onAppear {
            // Chegou pela notificação → abre direto o rótulo mais recente.
            if diario.querRotular {
                diario.querRotular = false
                rotulando = diario.pendentesDeRotulo.first
            }
        }
    }

    private var explicacao: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("O dia inteiro, sozinho")
                .font(.system(size: 16, weight: .semibold))
            Text("Ligue de manhã e guarde o telefone. Quando surgir fala que importa — negócio, tensão, alívio — eu leio um minuto de **medidas** (o áudio nunca é gravado) e pergunto: *posso registrar?* Não apaga na hora. Sim é um toque para marcar como você estava — o único passo que precisa ser seu, porque ele é a verdade que me ensina.")
                .font(.system(size: 13))
                .foregroundStyle(Theme.textDim)
                .lineSpacing(3)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .card()
    }

    private var controle: some View {
        VStack(spacing: 14) {
            Text(diario.statusText)
                .font(.system(size: 13.5))
                .foregroundStyle(Theme.textDim)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)

            switch diario.estado {
            case .desligado:
                Toggle(isOn: $diario.sorteioLigado) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Sortear momentos também").font(.system(size: 13.5))
                        Text("5 horários aleatórios, além dos gatilhos").font(.system(size: 11.5))
                            .foregroundStyle(Theme.textFaint)
                    }
                }
                .tint(Theme.warm)
                Button { diario.comecarDia() } label: {
                    Label("Começar o dia", systemImage: "sunrise.fill")
                        .font(.system(size: 15, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Theme.warm)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                }
            case .ouvindo:
                Label(diario.escutaAtiva ? "Escuta Ativa ligada" : "Ouvindo o seu dia…",
                      systemImage: diario.escutaAtiva ? "ear.fill" : "waveform")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(Theme.pitch)
                Text("Gatilhos hoje: \(diario.gatilhosHoje) · registrados: \(diario.capturados)")
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.textFaint)
                    .monospacedDigit()
                if !diario.horarios.isEmpty {
                    Text("Próximos momentos: " + diario.horarios
                        .map { $0.formatted(date: .omitted, time: .shortened) }
                        .joined(separator: " · "))
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.textFaint)
                        .multilineTextAlignment(.center)
                }
                Button { diario.encerrarDia() } label: {
                    Label("Encerrar o dia", systemImage: "moon.fill")
                        .font(.system(size: 14, weight: .medium))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Theme.bgInset)
                        .foregroundStyle(Theme.textDim)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                }
            }
        }
        .card()
    }

    /// O "Posso registrar?" também mora aqui, para quem está com o app aberto.
    private var consentimentoCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Posso registrar esse momento?")
                .font(.system(size: 15, weight: .semibold))
            if let g = diario.aguardando?.gatilho {
                Text("Ouvi \"\(g.termo)\". Se sim, você marca como estava — um toque. Se não, apago agora e não guardo nada.")
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.textDim)
                    .lineSpacing(3)
            }
            HStack(spacing: 10) {
                Button { diario.consentir(false) } label: {
                    Text("Não, apagar")
                        .font(.system(size: 14, weight: .medium))
                        .frame(maxWidth: .infinity).padding(.vertical, 12)
                        .background(Theme.bgInset).foregroundStyle(Theme.textDim)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                }
                Button {
                    diario.consentir(true)
                    rotulando = diario.pendentesDeRotulo.first
                } label: {
                    Text("Sim, registrar")
                        .font(.system(size: 14, weight: .semibold))
                        .frame(maxWidth: .infinity).padding(.vertical, 12)
                        .background(Theme.warm).foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .card()
    }

    private var pendentesCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Para marcar (\(diario.pendentesDeRotulo.count))")
                .font(.system(size: 15, weight: .semibold))
            ForEach(diario.pendentesDeRotulo) { m in
                Button { rotulando = m } label: {
                    HStack {
                        Text(m.data.formatted(date: .omitted, time: .shortened))
                            .font(.system(size: 14, weight: .semibold))
                            .monospacedDigit()
                        Text("como você estava?")
                            .font(.system(size: 13))
                            .foregroundStyle(Theme.textDim)
                        Spacer()
                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(Theme.warm)
                    }
                    .padding(13)
                    .background(Theme.bgInset)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                }
                .foregroundStyle(Theme.text)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .card()
    }

    private var historicoCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Momentos do dataset (\(diario.momentos.filter(\.rotulado).count))")
                    .font(.system(size: 15, weight: .semibold))
                Spacer()
                if let url = diario.exportar() {
                    ShareLink(item: url) {
                        Label("Exportar", systemImage: "square.and.arrow.up")
                            .font(.system(size: 12.5, weight: .medium))
                    }
                    .tint(Theme.warm)
                }
            }
            ForEach(diario.momentos.filter(\.rotulado).prefix(10)) { m in
                HStack(spacing: 10) {
                    Text(m.data.formatted(date: .abbreviated, time: .shortened))
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.textDim)
                    if let r = m.relatado {
                        Text(String(format: "val %+.2f · ativ %.2f",
                                    r.affect.valencia, r.affect.ativacao))
                            .font(.system(size: 12, weight: .medium))
                            .monospacedDigit()
                    }
                    Spacer()
                    if let g = m.gatilho {
                        Text("🔑 \(g.termo)")
                            .font(.system(size: 11))
                            .foregroundStyle(Theme.textFaint)
                            .lineLimit(1)
                    }
                    Text(m.qualidade == "mista" ? "🗣️+" : "✓")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.textFaint)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .card()
    }

    private var avisoLegal: some View {
        Text("⚖️ O microfone fica aberto o dia todo (o indicador laranja é o iPhone sendo honesto sobre isso). Perto de outras pessoas, elas precisam saber. Nenhum áudio é guardado — só números e os seus rótulos.")
            .font(.system(size: 11.5))
            .foregroundStyle(Theme.textFaint)
            .multilineTextAlignment(.center)
            .lineSpacing(3)
            .padding(.horizontal, 6)
    }
}

// MARK: - Folha de rótulo

/// O passo humano: grade de afeto (Russell) + contexto. Cego por construção —
/// a leitura do motor não aparece antes de a pessoa marcar, para não ancorar.
struct RotuloSheet: View {
    let momento: DiarioModel.Momento
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var diario = DiarioModel.shared

    @State private var ponto: CGPoint?          // 0…1 × 0…1 na grade
    @State private var feeling: String?
    @State private var onde: String?
    @State private var comQuem: String?
    @State private var soEu = true

    private let feelings = ["😃 animado", "😎 confiante", "🙂 calmo", "😐 neutro",
                            "😧 tenso", "😠 irritado", "😔 desanimado", "🥱 cansado"]
    private let lugares = ["💼 trabalho", "👥 reunião", "🏠 casa", "🚗 trânsito", "🎯 lazer"]
    private let companhias = ["🙋 sozinho", "👔 trabalho", "❤️ pessoal"]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    Text(momento.gatilho.map { "Momento das \(momento.data.formatted(date: .omitted, time: .shortened)) — ouvi \"\($0.termo)\"" }
                         ?? "Momento das \(momento.data.formatted(date: .omitted, time: .shortened))")
                        .font(.system(size: 13))
                        .foregroundStyle(Theme.textDim)

                    Text("Toque no quadrado onde você estava")
                        .font(.system(size: 14, weight: .semibold))
                    AffectGridView(ponto: $ponto)
                        .frame(height: 300)

                    chips("Um nome para isso (opcional)", options: feelings, selection: $feeling)
                    chips("Onde você estava?", options: lugares, selection: $onde)
                    chips("Com quem?", options: companhias, selection: $comQuem)

                    Toggle("Só a minha voz nesse momento", isOn: $soEu)
                        .font(.system(size: 13.5))
                        .tint(Theme.warm)

                    Button(action: salvar) {
                        Text("Salvar")
                            .font(.system(size: 15, weight: .semibold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(ponto == nil ? Theme.bgInset : Theme.warm)
                            .foregroundStyle(ponto == nil ? Theme.textFaint : .white)
                            .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                    }
                    .disabled(ponto == nil)

                    Button("Descartar este momento") {
                        diario.descartar(id: momento.id); dismiss()
                    }
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.textFaint)
                    .frame(maxWidth: .infinity)
                }
                .padding(18)
            }
            .background(Theme.background)
            .navigationTitle("Como você estava?")
            .navigationBarTitleDisplayMode(.inline)
        }
        .preferredColorScheme(.dark)
    }

    private func salvar() {
        guard let p = ponto else { return }
        // Mapeia a grade para as dimensões de Russell — mesmo contrato do web:
        // x → valência -2…+2 · y (topo = agitado) → ativação 0…3.
        let affect = DiarioModel.Affect(
            valencia: (Double(p.x) - 0.5) * 4,
            ativacao: (1 - Double(p.y)) * 3)
        diario.rotular(id: momento.id, affect: affect,
                       feeling: feeling, onde: onde, comQuem: comQuem,
                       qualidade: soEu ? "limpa" : "mista")
        dismiss()
    }

    private func chips(_ titulo: String, options: [String],
                       selection: Binding<String?>) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(titulo).font(.system(size: 13, weight: .medium))
                .foregroundStyle(Theme.textDim)
            FlowChips(options: options, selection: selection)
        }
    }
}

/// Grade valência × ativação, tocável. Rótulos DENTRO do desenho — a lição do
/// bug dos eixos encavalados na web vale aqui também.
struct AffectGridView: View {
    @Binding var ponto: CGPoint?

    var body: some View {
        GeometryReader { geo in
            ZStack {
                RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous)
                    .fill(Theme.bgInset)
                // Quadrantes com um véu de cor para orientar sem mandar
                VStack(spacing: 1) {
                    HStack(spacing: 1) {
                        Color(hex: "#FF5470").opacity(0.10)
                        Color(hex: "#FFD166").opacity(0.10)
                    }
                    HStack(spacing: 1) {
                        Color(hex: "#6C8BFF").opacity(0.10)
                        Color(hex: "#63D471").opacity(0.10)
                    }
                }
                .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))

                // Eixos
                Path { p in
                    p.move(to: CGPoint(x: geo.size.width / 2, y: 6))
                    p.addLine(to: CGPoint(x: geo.size.width / 2, y: geo.size.height - 6))
                    p.move(to: CGPoint(x: 6, y: geo.size.height / 2))
                    p.addLine(to: CGPoint(x: geo.size.width - 6, y: geo.size.height / 2))
                }
                .stroke(Theme.line, lineWidth: 1)

                legenda("agitado", x: 0.5, y: 0.05, geo: geo)
                legenda("quieto", x: 0.5, y: 0.95, geo: geo)
                legenda("desagradável", x: 0.14, y: 0.5, geo: geo)
                legenda("agradável", x: 0.87, y: 0.5, geo: geo)

                if let p = ponto {
                    Circle()
                        .fill(Theme.warm)
                        .frame(width: 22, height: 22)
                        .overlay(Circle().stroke(.white, lineWidth: 2))
                        .position(x: p.x * geo.size.width, y: p.y * geo.size.height)
                        .shadow(color: Theme.warm.opacity(0.6), radius: 8)
                }
            }
            .contentShape(Rectangle())
            .gesture(DragGesture(minimumDistance: 0).onEnded { v in
                ponto = CGPoint(
                    x: min(max(v.location.x / geo.size.width, 0), 1),
                    y: min(max(v.location.y / geo.size.height, 0), 1))
            })
        }
    }

    private func legenda(_ texto: String, x: Double, y: Double, geo: GeometryProxy) -> some View {
        Text(texto)
            .font(.system(size: 11.5, weight: .medium))
            .foregroundStyle(Theme.textDim)
            .position(x: x * geo.size.width, y: y * geo.size.height)
    }
}

/// Chips que quebram linha, com seleção única (toque de novo desmarca).
struct FlowChips: View {
    let options: [String]
    @Binding var selection: String?

    var body: some View {
        FlexibleHStack(spacing: 8) {
            ForEach(options, id: \.self) { opt in
                let on = selection == opt
                Button { selection = on ? nil : opt } label: {
                    Text(opt)
                        .font(.system(size: 13, weight: on ? .semibold : .regular))
                        .padding(.horizontal, 12).padding(.vertical, 8)
                        .background(on ? Theme.warm.opacity(0.22) : Theme.bgInset)
                        .foregroundStyle(on ? Theme.warm : Theme.text)
                        .clipShape(Capsule())
                        .overlay(Capsule().stroke(on ? Theme.warm : Theme.line, lineWidth: 1))
                }
            }
        }
    }
}

/// Layout de fluxo simples (iOS 16): mede e quebra linha sozinho.
struct FlexibleHStack: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let width = proposal.width ?? 320
        var x: CGFloat = 0, y: CGFloat = 0, rowH: CGFloat = 0
        for sub in subviews {
            let sz = sub.sizeThatFits(.unspecified)
            if x + sz.width > width { x = 0; y += rowH + spacing; rowH = 0 }
            x += sz.width + spacing
            rowH = max(rowH, sz.height)
        }
        return CGSize(width: width, height: y + rowH)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX, y = bounds.minY, rowH: CGFloat = 0
        for sub in subviews {
            let sz = sub.sizeThatFits(.unspecified)
            if x + sz.width > bounds.maxX { x = bounds.minX; y += rowH + spacing; rowH = 0 }
            sub.place(at: CGPoint(x: x, y: y), proposal: .unspecified)
            x += sz.width + spacing
            rowH = max(rowH, sz.height)
        }
    }
}
