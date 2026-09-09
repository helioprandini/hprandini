import Foundation
import CreateML
setbuf(stdout, nil)

// A MESMA normalização que o app vai aplicar antes de classificar.
let muletas: Set<String> = Set((try! JSONSerialization.jsonObject(with: Data(contentsOf: URL(fileURLWithPath: "muletas.json")))) as! [String])
func norm(_ t: String) -> String {
  let base = t.folding(options: .diacriticInsensitive, locale: .init(identifier: "pt_BR")).lowercased()
  let limpo = base.map { $0.isLetter || $0.isNumber || $0 == " " ? $0 : " " }
  return String(limpo).split(separator: " ").map(String.init).filter { !muletas.contains($0) }.joined(separator: " ")
}

let dados = try MLDataTable(contentsOf: URL(fileURLWithPath: "dados.csv"))
let (treino, teste) = dados.randomSplit(by: 0.8, seed: 7)
print("treino:", treino.rows.count, "| teste:", teste.rows.count)

let duras: [(String, String)] = [
  ("o negócio com a seguradora vai fechar essa semana", "trabalho"),
  ("cadê aquele negócio que eu deixei aqui", "cotidiano"),
  ("esse negócio de resseguro é complicado", "trabalho"),
  ("o negócio quebrou e não liga mais", "cotidiano"),
  ("a gente precisa falar do negócio com o banco", "trabalho"),
  ("tira esse negócio da frente", "cotidiano"),
  ("aí o cliente falou que a seguradora não aceitou, né, e quer resposta até sexta", "trabalho"),
  ("então tipo preciso mandar a proposta pro cliente antes da reunião", "trabalho"),
  ("o prêmio subiu e a comissão caiu, tá, o cliente vai reclamar", "trabalho"),
  ("vamos revisar a sinistralidade da carteira de saúde antes de renovar", "trabalho"),
  ("o mercado de garantia tá apertado, ninguém quer dar capacidade", "trabalho"),
  ("vamos no mercado comprar carne pro churrasco de domingo", "cotidiano"),
  ("as crianças estão gripadas, vou ficar em casa hoje", "cotidiano"),
  ("o valor do aluguel do apartamento subiu de novo", "cotidiano"),
  ("a apresentação pra diretoria do banco é terça de manhã", "trabalho"),
  ("faz um café aí enquanto eu termino de arrumar a cozinha", "cotidiano"),
  ("o cliente pediu desconto no contrato e a margem já tá no osso", "trabalho"),
  ("dormi mal, o vizinho fez festa até as três", "cotidiano"),
  ("cara esse negócio do varejo com o banco precisa de capacidade de resseguro", "trabalho"),
  ("aí eu peguei aquele negócio da geladeira e joguei fora, tava vencido", "cotidiano"),
  ("a seguradora mandou a proposta, tá, mas quer exclusividade", "trabalho"),
  ("vou buscar as meninas na escola e depois passo no mercado", "cotidiano"),
]

func avaliar(_ m: MLTextClassifier, _ nome: String) throws -> Int {
  let ev = m.evaluation(on: teste, textColumn: "texto", labelColumn: "assunto")
  var acertos = 0; var erros: [String] = []
  for (t, esperado) in duras {
    let p = try m.prediction(from: norm(t))
    if p == esperado { acertos += 1 } else { erros.append("  ✗ \(p) ← \(t)") }
  }
  print(String(format: "\n== %@ ==  holdout: %.1f%%  |  frases duras: %d/%d", nome, (1 - ev.classificationError) * 100, acertos, duras.count))
  erros.forEach { print($0) }
  return acertos
}

let p1 = MLTextClassifier.ModelParameters(validation: .none, algorithm: .maxEnt(revision: 1), language: .portuguese)
let m1 = try MLTextClassifier(trainingData: treino, textColumn: "texto", labelColumn: "assunto", parameters: p1)
let a1 = try avaliar(m1, "maxEnt (normalizado)")
let meta = MLModelMetadata(author: "Theo — AE", shortDescription: "Assunto da conversa: trabalho vs cotidiano. Entrada normalizada (minusculas, sem acento, sem muletas). Treinado nas reunioes do Helio.", version: "2.0")
try m1.write(to: URL(fileURLWithPath: "AssuntoClassifier.mlmodel"), metadata: meta)
print("salvo AssuntoClassifier.mlmodel (maxEnt)  acertos duras =", a1)
