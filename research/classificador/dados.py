import json, random, csv, re, unicodedata
random.seed(11)
MULETAS = {"né","ne","tá","ta","tô","to","aí","ai","então","entao","tipo","assim","cara","enfim","bom","olha","sabe","entendeu","viu","hein","pô","po","ó","e","é","eh","hum","uhum","exato","exatamente","certo","beleza","ok","legal","pois","tal","meio","tipo assim"}
def sem_nomes(t):
    # Nome proprio no meio da frase (Maiuscula fora do inicio) sai: o modelo
    # publico nao pode carregar clientes nem pessoas. O assunto sobrevive sem eles.
    w = t.split()
    return ' '.join(x for i, x in enumerate(w) if i == 0 or not (x[:1].isupper() and x[1:2].islower()))
# Empresas e parceiros que aparecem em minusculas na transcricao: fora, sempre.
PARCEIROS = {"ifood","neon","btg","zurich","metlife","riachuelo","midway","generali","lockton","untd","plaud","ongc","ambev","embelleze","aurora","bitcoin","quinto","andar","mpc","carrier","lrs"}
def norm(t):
    t = sem_nomes(t)
    t = ' '.join(w for w in t.split() if w.lower().strip('.,;:!?') not in PARCEIROS)
    t = unicodedata.normalize('NFD', t.lower()).encode('ascii','ignore').decode()
    t = re.sub(r"[^a-z0-9 ]+", " ", t)
    toks = [w for w in t.split() if w not in MULETAS]
    return " ".join(toks)
def falado(t):  # veste uma frase escrita com muletas de fala, como o reconhecedor entrega
    m = ["né", "tá", "aí", "então", "tipo", "assim", "cara", "sabe", "entendeu"]
    w = t.split()
    for _ in range(random.randint(1, 3)):
        w.insert(random.randint(0, len(w)), random.choice(m))
    return " ".join(w)

turnos = json.load(open('turnos.json'))['turnos']
trab_falado = [' '.join(t.split()[:60]) for a, s, t in turnos if not a.startswith('06-22') and len(t.split()) >= 6]
# trabalho ESCRITO: frases limpas de trabalho, para o modelo nao associar trabalho a "falado"
trab_escrito = open('trabalho_escrito.txt', encoding='utf-8').read().strip().split('\n')
cot_escrito = [b.strip() for b in open('cotidiano_base.txt', encoding='utf-8').read().strip().split('\n') if b.strip()]
suj = ["hoje", "amanhã", "no sábado", "de manhã", "à noite", "depois do almoço", "no domingo", "mais tarde", "agora", "semana que vem"]
acoes = ["vou levar as crianças na escola", "vamos almoçar na casa da minha mãe", "preciso ir ao supermercado", "vou lavar o carro", "vamos ver o jogo na casa do vizinho", "tenho consulta no dentista", "vou correr no parque", "vamos fazer churrasco", "preciso arrumar o quarto", "vou passear com o cachorro", "vamos assistir aquele filme novo", "tenho que trocar o óleo do carro", "vou cortar a grama", "vamos visitar a vovó", "preciso comprar fralda e leite", "a gente pede sushi", "vou dormir cedo", "vamos na praia", "tem festa de aniversário da sobrinha", "vou ao médico fazer exame de rotina"]
extras = ["", ", se não chover", ", se der tempo", ", tá combinado", ", não esquece", ", depois eu te aviso", " e depois passo na padaria", ", pode ser?"]
for _ in range(160): cot_escrito.append(f"{random.choice(suj)} {random.choice(acoes)}{random.choice(extras)}")
cot_escrito = list(dict.fromkeys(cot_escrito))
cot_falado = [falado(c) for c in cot_escrito]          # cotidiano tambem FALADO

random.shuffle(trab_falado)
trabalho = trab_falado[:420] + trab_escrito + [falado(t) for t in trab_escrito]
cotidiano = cot_escrito + cot_falado
rows = [(norm(t), 'trabalho') for t in trabalho] + [(norm(c), 'cotidiano') for c in cotidiano]
rows = [(t, l) for t, l in rows if len(t.split()) >= 3]
random.shuffle(rows)
with open('dados.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['texto', 'assunto']); w.writerows(rows)
json.dump(sorted(MULETAS), open('muletas.json', 'w'))
print('trabalho:', sum(1 for _, l in rows if l=='trabalho'), '| cotidiano:', sum(1 for _, l in rows if l=='cotidiano'), '| total:', len(rows))
