---
name: lp-publicar
description: 'Publica uma LP existente (GitHub Pages, Netlify, ZIP pra cPanel). Use quando o usuário quiser republicar ou digitar /lp-publicar.'
---

# /lp-publicar — Publicar LP Avulsa

## O que faz
Publica (ou republica) uma LP existente sem refazer o fluxo completo.

## Fluxo
1. Lista LPs em `_lp-output/` (prioriza completas)
2. Usuário escolhe qual LP
3. Roda `lp-revisor` primeiro (deve passar sem bloqueios)
4. Roda `lp-publisher` com escolha de target
5. Mostra URL/caminho final

## Referências
- Agentes: `lp-publisher`, `lp-revisor`
