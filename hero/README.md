# HeRo — Guia de Viagens

Guia de viagens do Helio e da Roberta. Cidade de estreia: **Doha, setembro de 2026**.

Abre em: `https://helioprandini.github.io/hprandini/hero/`

## O que ele faz

- **43 restaurantes de Doha avaliados** — status confirmado para setembro/2026, cozinha, distância do
  Souq Waqif, faixa de preço em QAR e BRL, pratos que valem pedir, álcool, reserva, ambiente e quatro
  notas (gastronomia, autenticidade local, custo-benefício e "vale por estar em Doha").
- **Geolocalização** — ordena a lista pelos mais próximos de onde você está, com rota no mapa.
- **Comentários** — por restaurante, com autor (Helio / Roberta / Nós dois) e estrelas. Ficam no
  aparelho; há exportar e importar para não perder ao trocar de celular.
- **Curadoria** — 10 categorias de escolha (não ranking copiado), análise de redundância entre casas
  parecidas e roteiros fechados para 2, 3 e 4 noites.
- **Reservas** — monta o pedido pronto em inglês e entrega num toque no WhatsApp, no discador ou na
  área de transferência. **Não confirma sozinho** — o porquê está na aba "Saber antes".

## Regras que este projeto não quebra

1. **Preço não se inventa.** Cada ficha carrega `precoNota`: `confirmado`, `parcial` ou
   `nao-confirmado`. Onde não deu para confirmar com fonte primária, a interface diz isso em amarelo
   e a faixa é apresentada como estimativa declarada.
2. **Fonte junto do dado.** Toda ficha lista as fontes usadas, com link. Prioridade: site oficial do
   restaurante → site oficial do hotel → MICHELIN → Visit Qatar / Qatar Museums → imprensa
   gastronômica local. TripAdvisor não é fonte principal.
3. **Conflito de fonte se declara.** Quando duas fontes discordam (Scalini, BiBo), o `statusNota` diz
   qual é o conflito e qual fonte foi considerada mais confiável — não se escolhe em silêncio.
4. **Nada de foto de terceiros no repositório.** O botão "Site / fotos" leva ao material oficial da casa.

## Como adicionar uma cidade nova

Uma cidade nova **não mexe em uma linha de `hero.js` nem de `hero.css`**. São dois arquivos de dados:

```
hero/js/data-<cidade>.js            → HERO_CIDADE + HERO_RESTAURANTES
hero/js/data-<cidade>-curadoria.js  → HERO_CURADORIA
```

Copie os de Doha como molde e troque os `<script src>` no `index.html`. Quando houver mais de uma
cidade viva ao mesmo tempo, o passo natural é um seletor no topo que carrega o par de arquivos certo —
a estrutura já está pronta para isso, porque nenhum dado está embutido na interface.

### Campos de um restaurante

| campo | o que é |
|---|---|
| `status` | `aberto` · `fechado` · `inconclusivo` |
| `statusNota` | como se confirmou, e o conflito de fontes quando existe |
| `categorias` | `qatari` `arabe` `alta` `internacional` `local` `peixe` `doce` `cafe` `barato` `alta-acessivel` `romantico` |
| `lat` / `lng` | aproximados, no nível do quarteirão — servem para ordenar por proximidade |
| `mapsQuery` | busca pelo nome; é o que o app usa para navegar, e é o que o mapa resolve com precisão |
| `distKm` / `tempoMin` / `aPe` | distância da base da viagem |
| `precoQar` | `[min, max]` por pessoa · `precoNota` diz o quanto disso é confirmado |
| `degustacao` / `brunch` / `almoco` | cada um com `qar` e `confirmado` |
| `pratos[]` | `{ nome, qar, porque }` — o "porque" é o que justifica pedir |
| `notas` | `gastro` · `autent` · `custo` · `doha` (0–10) |
| `fontes[]` | `{ t: título, u: url }` |

## Rodar localmente

```
python3 -m http.server 8899
# abre http://127.0.0.1:8899/hero/
```

Geolocalização exige HTTPS (ou `localhost`). No iPhone, use o endereço do GitHub Pages.
