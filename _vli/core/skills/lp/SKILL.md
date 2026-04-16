---
name: lp
description: 'Comando único do método VLI. Cria uma Landing Page de imóvel do briefing até a publicação, guiando o usuário leigo por 13 etapas com 15 agentes especialistas. Use quando o usuário pedir para criar uma landing page de imóvel ou digitar /lp.'
---

# /lp — Criar Landing Page de Imóvel (Método VLI)

## O que faz
Conduz o usuário do zero até uma LP publicada, sem exigir conhecimento técnico.
1 comando, 13 etapas, 15 agentes especialistas, ~30 minutos na primeira vez.

## Como usar
O usuário digita `/lp` e o sistema faz o resto.

## Fluxo de execução

### Passo 0 — Detectar sessão existente
Leia `_lp-output/` procurando `.sessao.json` com `completed: false`.
- Se encontrar: "Encontrei a LP **[nome]** em andamento (etapa [X] de 13). Quer continuar de onde parou ou começar uma nova?"
  - `continuar` → retoma a partir da etapa salva, recarrega `lp.json` + `briefing.md`
  - `nova` → confirma descarte e segue pro Passo 1
  - `ver progresso` → mostra resumo das etapas concluídas antes de decidir
- Se não encontrar: seguir pro Passo 1

> **Nota para o usuário:** você pode fechar a IDE a qualquer momento e digitar `/lp` de novo — o sistema retoma exatamente onde parou.

### Passo 1 — Bootstrap do ambiente
**Agente:** `lp-bootstrap` (silencioso se tudo ok)
- Verifica Python, Pillow, pastas
- Se faltar algo: explica e resolve em linguagem leiga
- **Diga ao usuário:** "Preparando o ambiente..." (só se for a primeira vez)

### Passo 2 — Briefing comercial
**Agente:** `lp-corretor`
- Faz perguntas de corretor (público, diferencial, objeção, urgência)
- 1 pergunta por vez, conversa natural
- **Salva em:** `_lp-output/<slug>/briefing.md` + `lp.json.briefing`
- **Diga ao usuário:** "Agora vou fazer umas perguntas como se eu fosse o corretor..."

### Passo 3 — Escolher template
**Agente:** `lp-arquiteto`
- Recomenda template com base no briefing
- Pergunta quais seções ativar/desativar
- **Diga ao usuário:** "Pelo que entendi do imóvel, sugiro o template **[nome]**..."

### Passo 4 — Escolher paleta
**Agente:** `lp-paleta`
- Sugere 3 paletas com base no posicionamento
- **Diga ao usuário:** "Agora vamos escolher as cores..."

### Passo 5 — Criar textos
**Agente:** `lp-copywriter`
- Gera headline, sub, descrições, FAQ, CTAs
- Mostra em formato legível, espera aprovação
- **Diga ao usuário:** "Criei os textos da sua LP. Veja se gosta..."

### Passo 6 — Preparar imagens
**Agente:** `lp-imagens-prep`
- Pede pasta com fotos brutas
- Renomeia, corta, converte WebP
- Se faltar Pillow: chama `lp-bootstrap` automaticamente
- **Diga ao usuário:** "Me manda o caminho da pasta com as fotos do imóvel..."

### Passo 7 — Alt-text das imagens
**Agente:** `lp-imagens-alt`
- Gera alt-text descritivo pra cada imagem
- **Diga ao usuário:** (silencioso, mostra resultado tabulado)

### Passo 8 — SEO
**Agente:** `lp-seo`
- Meta tags, JSON-LD, keywords locais
- **Diga ao usuário:** "Configurando pra sua LP aparecer no Google..."

### Passo 9 — Captura de leads
**Agente:** `lp-leads`
- WhatsApp, email, webhook, CRM
- **Diga ao usuário:** "Como quer receber os contatos dos interessados?"

### Passo 10 — Analytics (opcional)
**Agente:** `lp-analytics`
- GA4, Pixel, GTM
- **Diga ao usuário:** "Quer medir quantas pessoas visitam? (pode pular)"

### Passo 11 — Revisão técnica
**Agente:** `lp-revisor`
- Checa data-bind, SEO, links, acessibilidade
- Se encontrar bloqueios: volta pro agente responsável
- **Diga ao usuário:** "Fazendo revisão final..."

### Passo 12 — Performance
**Agente:** `lp-performance`
- Otimiza lazy-load, preload, fonts, CSS
- **Diga ao usuário:** "Otimizando velocidade..."

### Passo 13 — Publicar
**Agente:** `lp-publisher`
- ZIP, GitHub Pages, Netlify ou preview local
- **Diga ao usuário:** "Tudo pronto! Onde quer publicar?"

## Regras gerais

### Linguagem
- NUNCA dizer "vou invocar o agente lp-paleta"
- SEMPRE dizer "agora vamos escolher as cores"
- Tratar o usuário como dono do imóvel, não como dev

### Controle de fluxo
- `pular` → marca etapa como `skipped`, segue
- `voltar` → refaz etapa anterior
- `ajuda` ou `?` → chama `lp-help`, depois retoma
- `salvar e sair` → persiste `.sessao.json`, encerra
- `recomeçar` → confirma 2x, depois descarta sessão

### Persistência
- Atualizar `.sessao.json` após CADA etapa concluída
- Salvar `lp.json` a cada mudança
- Se o usuário voltar amanhã: `/lp` retoma automaticamente

### Referências
- Spec canônica: `_vli/core/resources/SPEC-NIVEL4.md`
- Briefing template: `_vli/core/resources/briefing-template.md`
- Paletas: `_vli/core/resources/palettes.json`
- Agentes: `_vli/core/agents/lp-*.md`
- Manifests: `_vli/_config/*.csv`
