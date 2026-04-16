---
name: lp-help
description: 'Ajuda contextual do método VLI. Ensina a usar o sistema, tira dúvidas, sugere próximo passo. Use quando o usuário pedir ajuda, digitar /lp-help, "?" ou "como funciona".'
---

# /lp-help — Ajuda do Método VLI

## O que faz
Ensina o método VLI pra usuários leigos. Responde dúvidas, mostra status da LP em andamento, sugere próximo passo.

## Execução
Delega pro agente `lp-help` (ver `_vli/core/agents/lp-help.md`).
O agente oferece menu com 6 opções e responde em linguagem leiga.

## Quando é acionado automaticamente
- Usuário digita "ajuda", "?", "como funciona" durante o `/lp`
- Erro inesperado no pipeline
- Primeira execução do VLI (onboarding)

## Referências
- Agente: `_vli/core/agents/lp-help.md`
- Spec: `_vli/core/resources/SPEC-NIVEL4.md`
- Manifests: `_vli/_config/*.csv`
