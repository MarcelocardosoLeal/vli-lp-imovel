# Contribuindo com o VLI

Obrigado pelo interesse em contribuir!

## Como contribuir

### Adicionar template novo
1. Use `/lp-novo-template` pra criar a estrutura base
2. Ou copie um template existente de `core/templates/` e customize
3. Adicione uma linha em `_config/template-manifest.csv`
4. Garanta que todos os `data-bind` e `data-stat` obrigatórios estejam no HTML
5. Teste com `config-loader.js` do `_shared/`

### Adicionar paleta nova
1. Adicione os 10 valores hex em `core/resources/palettes.json`
2. Adicione uma linha em `_config/palette-manifest.csv`
3. Teste em pelo menos 2 templates diferentes

### Melhorar um agente
1. Edite o `.md` correspondente em `core/agents/`
2. Mantenha o bloco "Referências canônicas" atualizado
3. Teste o fluxo completo (`/lp`) pra garantir que não quebra

### Reportar bug
Abra uma issue em https://github.com/MarcelocardosoLeal/vli-lp-imovel/issues com:
- O que fez (passo a passo)
- O que esperava
- O que aconteceu
- IDE e sistema operacional

## Regras

- Mantenha linguagem leiga nos agentes (o usuário final não é dev)
- Nunca inventar dados do imóvel — se não sabe, pergunte
- Spec canônica: `core/resources/SPEC-NIVEL4.md` é a verdade final
- Toda mudança em manifests CSV deve ser refletida nos agentes que os leem
