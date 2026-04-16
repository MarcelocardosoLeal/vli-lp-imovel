---
name: lp-revisar
description: 'Revisão técnica completa de uma LP existente. Checa conteúdo, SEO, acessibilidade, performance. Use quando o usuário quiser auditar uma LP ou digitar /lp-revisar.'
---

# /lp-revisar — Revisão Técnica Avulsa

## O que faz
Roda revisão completa numa LP existente. Útil pra auditar antes de republicar ou após mudanças manuais.

## Fluxo
1. Lista LPs em `_lp-output/`
2. Usuário escolhe qual LP
3. Roda `lp-revisor` + `lp-performance`
4. Mostra relatório: ✅ aprovados, ⚠️ avisos, ❌ bloqueios
5. Oferece corrigir automaticamente ou indicar agente correto

## Referências
- Agentes: `lp-revisor`, `lp-performance`
- Lib: `_vli/core/lib/validator.js`
