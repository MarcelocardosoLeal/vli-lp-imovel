# Paletas — Template Vitrine

6 paletas prontas. Para trocar: o agente copia o arquivo desejado sobre `../variables.css`.

| Arquivo | Nome | Primary | Accent | Indicado para |
|---|---|---|---|---|
| `ocean-gold.css` | Ocean Gold | `#0c2340` | `#c5a55a` | Alto padrão clássico, empreendimentos tradicionais |
| `midnight.css` | Midnight | `#1a1a2e` | `#e94560` | Urbano moderno, studios, lofts |
| `forest.css` | Forest | `#1b4332` | `#52b788` | Condomínios, casas de campo, sustentável |
| `urban.css` | Urban | `#212529` | `#ff6f00` | Industrial, lofts, empreendimentos jovens |
| `pearl.css` | Pearl | `#3d3425` | `#8b6914` | Alto padrão leve, feminino, sofisticado |
| `royal.css` | Royal | `#2d1b69` | `#e8b931` | Luxo ousado, empreendimentos assinados |

## Como o agente usa

Quando o usuário pedir *"troca pra midnight"*, execute:

```bash
cp css/palettes/midnight.css css/variables.css
```

(Ou faça a substituição equivalente via `Write`.)

Isso não afeta `style.css` nem `responsive.css` — troca visual instantânea.
