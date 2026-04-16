# VLI — Venda com Landing de Imóvel

> Sistema de criação **guiada** de Landing Pages para venda de imóveis.
> Um comando. 15 agentes especialistas. Do briefing à publicação em ~30 minutos.

**Não precisa saber HTML, CSS ou código.** O sistema pergunta, você responde, a LP sai pronta.

---

## Instalação

```bash
npx lp-imovel install
```

Ou com flags (sem perguntas interativas):

```bash
npx lp-imovel install --here --name="Seu Nome" --ides=all
```

O instalador:
- Copia templates, agentes, skills, scripts e resources pro seu projeto
- Detecta automaticamente as IDEs instaladas (Claude Code, Gemini, OpenCode, Trae, Codex, Antigravity)
- Replica skills e agentes em cada IDE detectada
- Cria a pasta `_lp-output/` para o output das LPs geradas

---

## Como usar

### Criar uma LP (fluxo completo guiado)

Dentro do seu projeto, na sua IDE:

```
/lp
```

O sistema conduz **15 etapas**:

| # | Etapa | O que acontece |
|---|---|---|
| 0 | Retomar sessão | Detecta LP em andamento e pergunta se quer continuar |
| 1 | Ambiente | Verifica Python/Pillow (silencioso se ok) |
| 2 | Dados do imóvel | Coleta dados básicos e define o slug da pasta |
| 3 | Briefing | Perguntas de corretor: público, diferencial, urgência |
| 4 | Template | Escolhe entre 4 modelos visuais |
| 5 | Paleta | Escolhe cores conforme posicionamento |
| 6 | Textos | Gera headline, descrições, FAQ, CTAs |
| 7 | Imagens | Renomeia, corta e converte fotos pra WebP |
| 8 | Alt-text | Descreve cada imagem (SEO + acessibilidade) |
| 9 | SEO | Meta tags, JSON-LD, keywords locais |
| 10 | Leads | Configura WhatsApp, email, webhook |
| 11 | Analytics | GA4, Meta Pixel (opcional) |
| 12 | Revisão | Checa conteúdo, links, contraste, mobile |
| 13 | Performance | Otimiza velocidade (lazy-load, preload, cache) |
| 14 | Publicar | ZIP, GitHub Pages, Netlify ou preview local |

### Outros comandos

| Comando | O que faz |
|---|---|
| `/lp-help` | Ajuda e tutorial do método VLI |
| `/lp-imagens` | Reprocessar fotos de uma LP existente |
| `/lp-revisar` | Revisão técnica completa |
| `/lp-publicar` | Republicar LP existente |
| `/lp-novo-template` | Adicionar template novo ao sistema (avançado) |

### Atalhos durante o fluxo

| Comando | Ação |
|---|---|
| `pular` | Pula a etapa atual |
| `voltar` | Refaz a etapa anterior |
| `ajuda` ou `?` | Abre ajuda contextual |
| `salvar e sair` | Salva progresso para retomar depois |

---

## Templates

| Template | Visual | Ideal para |
|---|---|---|
| **Vitrine** | Premium, fotos grandes | Alto padrão, lançamentos |
| **Ficha** | Técnico, escuro | Comprador analítico |
| **Bairro** | Lifestyle, verde | Família, condomínios |
| **Light** | Editorial luxo, claro | Boutique, design assinado |

## Paletas de Cores

| Paleta | Vibe | Melhor para |
|---|---|---|
| `ocean-gold` | Sofisticado, confiável | Alto padrão tradicional |
| `midnight` | Tecnológico, urbano | Apartamentos modernos |
| `forest` | Natural, sereno | Casas, áreas verdes |
| `urban` | Vibrante, energético | Lofts, studios |
| `pearl` | Editorial, luxo | Design assinado |
| `royal` | Imponente, clássico | Mansões, coberturas |

---

## IDEs suportadas

| IDE | Diretório |
|---|---|
| Claude Code (CLI / VS Code / Desktop) | `.claude/` |
| Google Gemini Code Assist | `.gemini/` |
| OpenCode | `.opencode/` |
| Trae | `.trae/` |
| Codex | `.codex/` |
| Antigravity | `.antigravity/` |

---

## Arquitetura

```
├── bin/
│   └── install.js        ← entry point do npx github:...
├── _vli/
│   ├── _config/          ← manifests (agentes, skills, templates, paletas)
│   └── core/
│       ├── agents/       ← 15 agentes especialistas (.md)
│       ├── skills/       ← 6 skills invocáveis
│       ├── templates/    ← 4 templates HTML + _shared/
│       ├── scripts/      ← optimize-images.py
│       ├── lib/          ← validator, session, slug, bridge
│       └── resources/    ← spec canônica, briefing, palettes.json
├── _lp-output/           ← LPs geradas (ignorado pelo git)
└── package.json
```

### Os 15 agentes especialistas

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

## Output gerado

Cada LP criada fica em:

```
_lp-output/
└── apto-jardim-europa/
    ├── index.html         ← a LP pronta
    ├── css/  js/  img/    ← assets otimizados
    ├── lp.json            ← dados estruturados
    ├── briefing.md        ← briefing do corretor
    ├── revisao.md         ← relatório de revisão
    ├── performance.md     ← relatório de performance
    └── .sessao.json       ← estado (para retomar se interromper)
```

---

## Requisitos

- **Node.js 18+** — para instalar via npx
- **Python 3.9+ com Pillow** — para processar imagens (instalado automaticamente pelo bootstrapper)
- **Navegador moderno** — para visualizar as LPs geradas

---

## Publicar no GitHub Pages (opcional)

Para usar a opção de publicação via GitHub Pages no passo 14, você precisa do `gh` CLI autenticado:

```bash
# 1. Instalar o gh CLI
# Windows (winget):
winget install --id GitHub.cli

# macOS (brew):
brew install gh

# 2. Autenticar
gh auth login
# Escolha: GitHub.com → HTTPS → Login with a web browser
```

Depois disso o agente `lp-publisher` consegue criar o repositório e publicar automaticamente.

> Sem o `gh` CLI, as opções de ZIP, preview local e Netlify continuam funcionando normalmente.

---

## Contribuindo

Veja [CONTRIBUTING.md](_vli/CONTRIBUTING.md) para detalhes sobre como adicionar templates, paletas, melhorar agentes ou reportar bugs.

---

## Licença

MIT — use comercialmente, distribua, modifique à vontade.

---

## Autor

**Marcelo Leal** — [@MarcelocardosoLeal](https://github.com/MarcelocardosoLeal)

Feito com IA, pensado pra quem vende imóvel.
