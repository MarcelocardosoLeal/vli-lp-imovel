# VLI — Venda com Landing de Imóvel

Sistema de criação **guiada** de Landing Pages para venda de imóveis.
Um comando. 15 agentes especialistas. Do briefing à publicação em ~30 minutos.

**Não precisa saber HTML, CSS ou código.** O sistema pergunta, você responde, a LP sai pronta.

---

## Instalação

```bash
npx lp-imovel install
```

Ou com flags (sem perguntas):

```bash
npx lp-imovel install --here --name="Seu Nome" --ides=all
```

O instalador:
- Copia templates, agentes, skills, scripts e resources
- Detecta IDEs instaladas (Claude Code, Gemini, OpenCode, Trae, Codex, Antigravity)
- Replica skills e agentes em cada IDE
- Cria pasta `_lp-output/` pro output das LPs

---

## Como usar

### Criar uma LP (fluxo completo guiado)

```
/lp
```

O sistema conduz 13 etapas:

| # | Etapa | O que acontece |
|---|---|---|
| 1 | Ambiente | Verifica Python/Pillow (silencioso se ok) |
| 2 | Briefing | Perguntas de corretor: público, diferencial, urgência |
| 3 | Template | Escolhe entre 4 modelos visuais |
| 4 | Paleta | Escolhe cores conforme posicionamento |
| 5 | Textos | Gera headline, descrições, FAQ, CTAs |
| 6 | Imagens | Renomeia, corta e converte fotos pra WebP |
| 7 | Alt-text | Descreve cada imagem (SEO + acessibilidade) |
| 8 | SEO | Meta tags, JSON-LD, keywords locais |
| 9 | Leads | Configura WhatsApp, email, webhook |
| 10 | Analytics | GA4, Meta Pixel (opcional) |
| 11 | Revisão | Checa conteúdo, links, contraste, mobile |
| 12 | Performance | Otimiza velocidade (lazy-load, preload, cache) |
| 13 | Publicar | ZIP, GitHub Pages, Netlify ou preview local |

### Outros comandos

| Comando | O que faz |
|---|---|
| `/lp-help` | Ajuda e tutorial do método VLI |
| `/lp-imagens` | Reprocessar fotos de uma LP existente |
| `/lp-revisar` | Revisão técnica completa |
| `/lp-publicar` | Republicar LP existente |
| `/lp-novo-template` | Adicionar template novo ao sistema (avançado) |

### Durante o fluxo

- `pular` → pula a etapa atual
- `voltar` → refaz a etapa anterior
- `ajuda` ou `?` → abre ajuda contextual
- `salvar e sair` → salva progresso, retoma amanhã

---

## Templates

| Template | Visual | Ideal para |
|---|---|---|
| **Vitrine** | Premium, fotos grandes | Alto padrão, lançamentos |
| **Ficha** | Técnico, escuro | Comprador analítico |
| **Bairro** | Lifestyle, verde | Família, condomínios |
| **Light** | Editorial luxo, claro | Boutique, design assinado |

## Paletas

| Paleta | Vibe | Melhor para |
|---|---|---|
| `ocean-gold` | Sofisticado, confiável | Alto padrão tradicional |
| `midnight` | Tecnológico, urbano | Apartamentos modernos |
| `forest` | Natural, sereno | Casas, áreas verdes |
| `urban` | Vibrante, energético | Lofts, studios |
| `pearl` | Editorial, luxo | Design assinado |
| `royal` | Imponente, clássico | Mansões, coberturas |

---

## Arquitetura

```
_vli/
├── _config/              ← manifests (agentes, skills, templates, paletas)
├── core/
│   ├── agents/           ← 15 agentes especialistas (.md)
│   ├── skills/           ← 6 skills invocáveis
│   ├── templates/        ← 4 templates + _shared/
│   ├── painel-app/       ← painel visual (GUI alternativa)
│   ├── scripts/          ← optimize-images.py
│   ├── lib/              ← validator, session, slug, bridge
│   └── resources/        ← spec, briefing, palettes.json
├── bin/
│   └── install.js        ← npx entry point
└── package.json
```

### Os 15 agentes

| Agente | Papel |
|---|---|
| `lp-orquestrador` | Maestro — conduz o fluxo completo |
| `lp-bootstrap` | Prepara ambiente (Python, Pillow) |
| `lp-corretor` | Briefing comercial |
| `lp-arquiteto` | Escolhe template e seções |
| `lp-paleta` | Escolhe paleta de cores |
| `lp-copywriter` | Gera textos persuasivos |
| `lp-imagens-prep` | Crop, rename, WebP |
| `lp-imagens-alt` | Alt-text descritivo |
| `lp-seo` | Meta tags, JSON-LD |
| `lp-leads` | WhatsApp, email, webhook |
| `lp-analytics` | GA4, Meta Pixel |
| `lp-revisor` | Checagem técnica |
| `lp-performance` | Lighthouse, otimização |
| `lp-publisher` | Deploy (Pages, Netlify, ZIP) |
| `lp-help` | Tutorial e dúvidas |

---

## IDEs suportadas

- Claude Code (CLI + VS Code + Desktop)
- Google Gemini Code Assist
- OpenCode
- Trae
- Codex
- Antigravity

---

## Requisitos

- **Node.js 18+** (pra instalar)
- **Python 3.9+ + Pillow** (pra processar imagens — instalado automaticamente)
- **Navegador moderno** (pra ver as LPs)

---

## Output

Cada LP gerada fica em:

```
_lp-output/
└── apto-jardim-europa/
    ├── index.html         ← a LP
    ├── css/  js/  img/    ← assets otimizados
    ├── lp.json            ← dados estruturados
    ├── briefing.md        ← briefing do corretor
    ├── revisao.md         ← relatório de revisão
    ├── performance.md     ← relatório de performance
    └── .sessao.json       ← estado (pra retomar)
```

---

## Licença

MIT — use comercialmente, distribua, modifique.

---

## Autor

**Marcelo Leal** — [@marceloleal](https://github.com/marceloleal)

Feito com IA, pensado pra quem vende imóvel.
