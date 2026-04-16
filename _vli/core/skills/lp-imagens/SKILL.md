---
name: lp-imagens
description: 'Pipeline de imagens avulso. Roda crop/rename/WebP em uma LP existente sem refazer todo o fluxo. Use quando o usuário quiser reprocessar fotos ou digitar /lp-imagens.'
---

# /lp-imagens — Pipeline de Imagens Avulso

## O que faz
Reprocessa imagens de uma LP existente sem refazer o fluxo completo.

## Fluxo
1. Lista LPs em `_lp-output/` com sessão existente
2. Usuário escolhe qual LP
3. Pede pasta com fotos novas (ou usa as existentes)
4. Roda `lp-imagens-prep` + `lp-imagens-alt`
5. Atualiza `lp.json` e `.sessao.json`

## Quando usar
- Usuário recebeu fotos novas do fotógrafo
- Quer trocar hero ou adicionar fotos na galeria
- Primeira vez esqueceu de preparar fotos e pulou a etapa

## Referências
- Agentes: `lp-imagens-prep`, `lp-imagens-alt`
- Script: `_vli/core/scripts/optimize-images.py`
