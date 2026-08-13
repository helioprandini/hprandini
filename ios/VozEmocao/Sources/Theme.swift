import SwiftUI

/// Sistema visual do Voice&Emotion — espelha `css/styles.css` da web.
///
/// Identidade: **ferramenta profissional com alma humana**.
///  - Profissional: base neutra e profunda, hierarquia clara, nada de enfeite.
///  - Humana: um acento quente (âmbar/coral), cantos suaves, respiro generoso.
///
/// Regra da paleta: as cores frias **estruturam**; as quentes só aparecem onde
/// há emoção (a voz, o dado sentido). Assim o calor significa algo, não decora.
enum Theme {

    // MARK: Base
    static let bg       = Color(hex: "#0B0E14")
    static let bgElev   = Color(hex: "#131824")
    static let bgInset  = Color(hex: "#1B2230")
    static let line     = Color.white.opacity(0.07)
    static let lineStrong = Color.white.opacity(0.14)

    // MARK: Texto
    static let text      = Color(hex: "#EEF1F7")
    static let textDim   = Color(hex: "#98A2B8")
    static let textFaint = Color(hex: "#6B7590")

    // MARK: Acentos — calor (humano) e confiança (estrutura)
    static let warm     = Color(hex: "#FF8A5B")
    static let warmSoft = Color(hex: "#FFB08A")
    static let trust    = Color(hex: "#6C8BFF")

    // MARK: Dimensões emocionais
    static let energy  = Color(hex: "#FF7A59")
    static let valence = Color(hex: "#FFC46B")   // "Calor"
    static let expr    = Color(hex: "#B085FF")
    static let flow    = Color(hex: "#5ED6A0")
    static let pitch   = Color(hex: "#4FD1C5")
    static let danger  = Color(hex: "#FF5470")

    // MARK: Formas
    static let rSm: CGFloat = 10
    static let rMd: CGFloat = 14
    static let rLg: CGFloat = 20

    /// Fundo do app: base neutra com dois halos suaves (calor à direita,
    /// confiança à esquerda) — o mesmo gesto da versão web.
    static var background: some View {
        ZStack {
            bg
            RadialGradient(
                colors: [warm.opacity(0.10), .clear],
                center: .init(x: 0.85, y: -0.05), startRadius: 8, endRadius: 480
            )
            RadialGradient(
                colors: [trust.opacity(0.10), .clear],
                center: .init(x: 0.1, y: 0.05), startRadius: 8, endRadius: 420
            )
        }
        .ignoresSafeArea()
    }
}

// MARK: - Marca

/// Onda de voz que ganha amplitude — uma fala que se abre.
/// Gradiente da confiança (azul) ao calor (coral).
struct BrandMark: View {
    var size: CGFloat = 34

    private let amplitudes: [CGFloat] = [0.30, 0.62, 1.0, 0.62, 0.30]

    var body: some View {
        RoundedRectangle(cornerRadius: size * 0.28, style: .continuous)
            .fill(LinearGradient(colors: [Theme.trust, Theme.warm],
                                 startPoint: .topLeading, endPoint: .bottomTrailing))
            .frame(width: size, height: size)
            .overlay {
                HStack(spacing: size * 0.09) {
                    ForEach(amplitudes.indices, id: \.self) { i in
                        Capsule()
                            .fill(.white.opacity(0.75 + Double(amplitudes[i]) * 0.25))
                            .frame(width: size * 0.075,
                                   height: size * 0.62 * amplitudes[i])
                    }
                }
            }
            .shadow(color: Theme.warm.opacity(0.25), radius: 8, y: 4)
    }
}

// MARK: - Peças reutilizáveis

/// Cartão padrão: fundo elevado, borda sutil, canto generoso.
struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(20)
            .background(Theme.bgElev)
            .clipShape(RoundedRectangle(cornerRadius: Theme.rLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: Theme.rLg, style: .continuous)
                    .stroke(Theme.line, lineWidth: 1)
            )
    }
}

extension View {
    func card() -> some View { modifier(CardModifier()) }
}

/// Título de seção — pequeno, espaçado, discreto (profissional).
struct SectionLabel: View {
    let text: String
    var tint: Color = Theme.textFaint

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 11, weight: .semibold))
            .tracking(0.9)
            .foregroundStyle(tint)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// Barra de medida (0...1) com trilho embutido.
struct MeterBar: View {
    let value: Double
    let color: Color
    var height: CGFloat = 10

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(Theme.bgInset)
                Capsule()
                    .fill(LinearGradient(colors: [color.opacity(0.65), color],
                                         startPoint: .leading, endPoint: .trailing))
                    .frame(width: max(0, min(1, value)) * geo.size.width)
            }
        }
        .frame(height: height)
    }
}

/// Medida rotulada — usada nos medidores ao vivo e no resumo.
struct LabeledMeter: View {
    let label: String
    let value: Double
    let color: Color
    var height: CGFloat = 10

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.system(size: 11.5, weight: .medium))
                .foregroundStyle(Theme.textDim)
            MeterBar(value: value, color: color, height: height)
        }
    }
}

// MARK: - Cor por hex

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
