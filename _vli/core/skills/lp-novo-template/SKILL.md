---
name: lp-novo-template
description: 'Helper para adicionar um template novo ao sistema VLI. Cria estrutura, registra no manifest e configura config-loader. Uso avançado — para devs.'
---

# /lp-novo-template — Adicionar Template Novo

## O que faz
Guia o desenvolvedor na criação de um template novo pro sistema VLI.

## Fluxo
1. Pergunta: nome, displayName, descrição, paleta padrão
2. Cria pasta `_vli/core/templates/<id>/` com estrutura padrão:
   ```
   <id>/
   ├── index.html    ← scaffold com data-bind/data-stat/sections
   ├── css/
   │   ├── variables.css
   │   ├── style.css
   │   └── responsive.css
   ├── js/
   │   ├── config-loader.js  ← cópia de _shared/js/config-loader.js
   │   └── main.js
   └── README.md
   ```
3. Adiciona linha no `_vli/_config/template-manifest.csv`
4. Lista data-bind obrigatórios da spec e marca os que já estão no HTML
5. Mostra checklist de preenchimento

## Requisitos do template
Todo template VLI DEVE ter:
- `data-bind="nome|tipo|localizacao|bairro|cidade|status|construtora|endereco|empresa|telefone|preco"`
- `data-stat="dorms|suites|banh|vagas|m2min|m2max|m2range"`
- `data-wpp-link` nos botões WhatsApp
- `data-price-block` nos blocos de preço
- `data-bind="diferenciais-list"` no container de diferenciais
- Sessões com IDs: `#resumo, #galeria, #diferenciais, #plantas, #ficha, #localizacao, #faq, #preco, #bairro`
- Schema JSON-LD: `#schema-organization, #schema-faq, #schema-product`
- Meta tags: og:title, og:description, og:image, twitter:*

## Referências
- Spec seção 2 e 4: sessões e mapeamento campo→sessão
- Config-loader: `_vli/core/templates/_shared/js/config-loader.js`
