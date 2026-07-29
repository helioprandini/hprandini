import Foundation

/// Repositório de palavras-gatilho ligadas a negócios (pt-BR).
///
/// Quando o reconhecedor de voz ouve uma dessas palavras enquanto o app está
/// ativo, o app pergunta se deve gravar a conversa. A lista base fica aqui e
/// pode ser complementada com palavras personalizadas do usuário.
enum BusinessKeywords {

    /// Lista base, agrupada por categoria (apenas para organização).
    static let base: [String: [String]] = [
        "vendas": [
            "venda", "vender", "vendedor", "proposta", "proposta comercial", "orçamento",
            "cotação", "cliente", "negócio", "fechamento", "fechar negócio", "fechar o contrato",
            "pedido", "desconto", "promoção", "oferta", "condição de pagamento",
            "prazo de entrega", "tabela de preços", "preço", "valor", "investimento",
            "carteira de clientes", "prospecção", "follow up", "comissão", "meta",
            "faturamento", "pós-venda", "indicação", "renovar", "upgrade"
        ],
        "negociacao": [
            "negociação", "negociar", "contraproposta", "acordo", "parceria", "condições",
            "margem", "reajuste", "renovação", "aditivo", "cláusula", "assinatura",
            "assinar", "vigência", "multa", "garantia", "entrada", "parcela",
            "parcelamento", "à vista", "boleto", "nota fiscal", "pagamento", "vencimento",
            "carência", "fidelidade", "cancelamento", "rescisão"
        ],
        "corretagem_seguros": [
            "corretora", "corretor", "corretagem", "seguro", "seguradora", "apólice",
            "prêmio", "sinistro", "franquia", "cobertura", "endosso", "resseguro",
            "subscrição", "benefícios", "plano de saúde", "plano odontológico",
            "previdência", "consórcio", "capitalização", "vida em grupo", "coparticipação",
            "reembolso", "rede credenciada", "portabilidade", "sinistralidade"
        ],
        "financeiro": [
            "financiamento", "empréstimo", "juros", "taxa", "câmbio", "imposto",
            "lucro", "prejuízo", "receita", "despesa", "fluxo de caixa", "capital",
            "investidor", "ações", "dividendos", "rentabilidade", "aporte", "caixa"
        ],
        "reunioes_projetos": [
            "reunião", "agenda", "apresentação", "alinhamento", "projeto", "cronograma",
            "entrega", "escopo", "prospecto", "briefing", "prazo", "kickoff",
            "ata", "pauta", "demanda"
        ],
        "empresa": [
            "empresa", "sociedade", "sócio", "fornecedor", "distribuidor", "licitação",
            "edital", "concorrência", "mercado", "filial", "matriz", "cnpj",
            "razão social", "diretoria", "compliance"
        ]
    ]

    /// Remove acentos e normaliza para minúsculas (tolerante ao reconhecedor).
    static func normalize(_ text: String) -> String {
        return text.folding(options: .diacriticInsensitive, locale: .init(identifier: "pt_BR"))
            .lowercased()
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Todas as palavras normalizadas (base + personalizadas), separadas em
    /// termos simples e frases.
    static func loadSets(custom: [String]) -> (words: Set<String>, phrases: [String]) {
        var all = base.values.flatMap { $0 }
        all.append(contentsOf: custom)

        var words = Set<String>()
        var phrases = [String]()
        for raw in all {
            let n = normalize(raw)
            guard !n.isEmpty else { continue }
            if n.contains(" ") { phrases.append(n) } else { words.insert(n) }
        }
        return (words, phrases)
    }

    /// Retorna a primeira palavra-gatilho encontrada no texto reconhecido, ou nil.
    static func firstMatch(in recognized: String,
                           words: Set<String>,
                           phrases: [String]) -> String? {
        let n = normalize(recognized)
        guard !n.isEmpty else { return nil }

        for phrase in phrases where n.contains(phrase) {
            return phrase
        }
        let tokens = n.split { !$0.isLetter && !$0.isNumber }.map(String.init)
        for token in tokens where words.contains(token) {
            return token
        }
        return nil
    }
}
