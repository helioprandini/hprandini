import Foundation

/// Rol de palavras-gatilho da Escuta Ativa — em camadas, não em lista.
///
/// Medido em 2026-09-04 contra 45 mil palavras de seis reuniões reais do Helio
/// (transcrições Plaud). O rol anterior tinha 132 termos de dicionário de
/// vendas; 62 deles nunca apareceram. O que ficou é o que de fato se diz.
///
/// Por que camadas: palavra genérica sozinha erra ("negócio" é gíria para
/// "coisa"; "mercado" é o supermercado; "valor" é valor pessoal). Ela só
/// dispara quando **duas genéricas distintas** aparecem na mesma janela de 60s.
/// As específicas, as emocionais e as em inglês disparam sozinhas.
///
/// A camada emocional é o que conserta o mapa de afeto: reunião nunca vai para
/// a valência negativa; o "puta problema" de corredor vai. Cada disparo carrega
/// a camada, para se medir depois de que lado do mapa vem cada gatilho.
enum BusinessKeywords {

    enum Camada: String, Codable {
        case especifica = "A"     // dispara sozinha
        case generica = "B"       // só duas juntas na janela
        case emocional = "C"      // dispara sozinha; marca tensão ou alívio
        case ingles = "D"         // reuniões em inglês
        case personalizada = "E"  // lista do usuário (parceiros, nomes) — nunca no produto
    }

    enum Tom: String, Codable { case tensao, alivio }

    struct Match: Equatable {
        let termo: String
        let camada: Camada
        let tom: Tom?
    }

    // MARK: - Camada A · específicas (frequência real entre parênteses)

    static let especificas: [String] = [
        "seguradora", "sinistro", "sinistralidade", "comissão", "prêmio", "margem",
        "cobertura", "resseguro", "franquia", "corretora", "corretor", "corretagem",
        "apólice", "endosso", "subscrição", "cotação", "coparticipação", "reembolso",
        "seguro garantia", "reserva técnica", "capacidade de resseguro",
        "telemedicina", "cripto", "crédito", "empréstimo", "imposto", "juros",
        "plano de saúde", "plano odontológico", "previdência", "vida em grupo",
        "carteira de clientes", "comissionamento", "capital segurado", "loss ratio"
    ]

    // MARK: - Camada B · genéricas (precisam de par na janela)

    static let genericas: [String] = [
        "negócio", "valor", "preço", "mercado", "custo", "dinheiro", "pagar", "cobrar",
        "contrato", "cliente", "produto", "operação", "proposta", "reunião", "seguro",
        "venda", "vender", "desconto", "oferta", "garantia", "milhões", "banco",
        "resultado", "capacidade", "estrutura", "apresentação", "agenda", "renovar",
        "renovação", "fechamento", "faturamento", "meta", "parceria", "acordo"
    ]

    // MARK: - Camada C · emocionais (o vocabulário de tensão e alívio do Helio)

    static let emocionais: [String: Tom] = [
        // tensão — o que aparece quando o dia aperta
        "puta": .tensao, "briga": .tensao, "problema": .tensao, "não dá": .tensao,
        "difícil": .tensao, "preocupa": .tensao, "preocupado": .tensao, "prejuízo": .tensao,
        "erro": .tensao, "errado": .tensao, "pressão": .tensao, "urgência": .tensao,
        "urgente": .tensao, "medo": .tensao, "risco": .tensao, "culpa": .tensao,
        "complicado": .tensao, "estresse": .tensao, "apertado": .tensao, "atrapalha": .tensao,
        "impossível": .tensao, "péssimo": .tensao, "dor de cabeça": .tensao, "perdemos": .tensao,
        // alívio — o outro lado do mapa
        "ótimo": .alivio, "perfeito": .alivio, "maravilha": .alivio, "tranquilo": .alivio,
        "empolgado": .alivio, "conseguimos": .alivio, "fechamos": .alivio, "ganhamos": .alivio,
        "incrível": .alivio, "sensacional": .alivio, "show": .alivio, "animado": .alivio,
        "oportunidade": .alivio, "alívio": .alivio, "feliz": .alivio
    ]

    // MARK: - Camada D · inglês (reuniões de renovação internacional)

    static let ingles: [String] = [
        "policy", "premium", "claim", "claims", "wording", "approval", "endorsement",
        "endorsements", "renewal", "quote", "quotation", "broker", "reinsurance",
        "reinsurer", "underwriting", "underwriter", "indemnity", "coverage", "deductible",
        "capacity", "loss ratio", "comfort letter", "insured", "insurer", "binder",
        "slip", "retention", "limit of liability"
    ]

    // MARK: - Rol compilado

    /// Termo normalizado → (camada, tom). Termos com espaço são frases.
    struct Rol {
        let palavras: [String: (Camada, Tom?)]
        let frases: [(String, Camada, Tom?)]
    }

    /// Remove acentos e normaliza para minúsculas (tolerante ao reconhecedor).
    static func normalize(_ text: String) -> String {
        return text.folding(options: .diacriticInsensitive, locale: .init(identifier: "pt_BR"))
            .lowercased()
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Monta o rol com a lista personalizada do usuário (camada E).
    static func rol(custom: [String]) -> Rol {
        var palavras: [String: (Camada, Tom?)] = [:]
        var frases: [(String, Camada, Tom?)] = []
        func add(_ raw: String, _ c: Camada, _ t: Tom?) {
            let n = normalize(raw)
            guard !n.isEmpty else { return }
            if n.contains(" ") { frases.append((n, c, t)) } else { palavras[n] = (c, t) }
        }
        // Ordem importa só para empates: a mais específica prevalece.
        genericas.forEach { add($0, .generica, nil) }
        ingles.forEach { add($0, .ingles, nil) }
        emocionais.forEach { add($0.key, .emocional, $0.value) }
        especificas.forEach { add($0, .especifica, nil) }
        custom.forEach { add($0, .personalizada, nil) }
        return Rol(palavras: palavras, frases: frases)
    }

    /// Camadas para a UI de palavras (nome legível → termos).
    static var base: [String: [String]] {
        [
            "A · específicas (disparam sozinhas)": especificas,
            "B · genéricas (só em par, 60s)": genericas,
            "C · emocionais (tensão e alívio)": Array(emocionais.keys).sorted(),
            "D · inglês": ingles
        ]
    }
}

/// Decide quando o texto reconhecido vira um gatilho.
///
/// O reconhecedor entrega o texto **acumulado** da sessão a cada resultado
/// parcial, então cada termo só conta na primeira vez em que aparece. As
/// genéricas ficam numa janela de 60s e só disparam em par. `reset()` ao
/// reiniciar a sessão de reconhecimento — o texto recomeça do zero.
final class GatilhoDetector {
    private let rol: BusinessKeywords.Rol
    private var vistos = Set<String>()
    private var genericasRecentes: [(termo: String, em: Date)] = []
    let janela: TimeInterval = 60

    init(rol: BusinessKeywords.Rol) { self.rol = rol }

    func reset() {
        vistos.removeAll()
        genericasRecentes.removeAll()
    }

    func avaliar(_ reconhecido: String, agora: Date = Date()) -> BusinessKeywords.Match? {
        let n = BusinessKeywords.normalize(reconhecido)
        guard !n.isEmpty else { return nil }

        var novos: [(String, BusinessKeywords.Camada, BusinessKeywords.Tom?)] = []
        for (frase, c, t) in rol.frases where !vistos.contains(frase) && n.contains(frase) {
            vistos.insert(frase); novos.append((frase, c, t))
        }
        let tokens = n.split { !$0.isLetter && !$0.isNumber }.map(String.init)
        for token in tokens where !vistos.contains(token) {
            if let (c, t) = rol.palavras[token] { vistos.insert(token); novos.append((token, c, t)) }
        }
        guard !novos.isEmpty else { return nil }

        // Qualquer não-genérica dispara sozinha, na ordem em que apareceu.
        if let forte = novos.first(where: { $0.1 != .generica }) {
            return .init(termo: forte.0, camada: forte.1, tom: forte.2)
        }
        // Genéricas: acumula na janela e só dispara em par.
        genericasRecentes.append(contentsOf: novos.map { ($0.0, agora) })
        genericasRecentes.removeAll { agora.timeIntervalSince($0.em) > janela }
        let distintas = Array(Set(genericasRecentes.map(\.termo))).sorted()
        if distintas.count >= 2 {
            genericasRecentes.removeAll()
            return .init(termo: distintas.prefix(2).joined(separator: " + "), camada: .generica, tom: nil)
        }
        return nil
    }
}
