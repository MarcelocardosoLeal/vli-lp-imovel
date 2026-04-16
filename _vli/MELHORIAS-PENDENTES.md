# VLI — Melhorias e Correções Pendentes
> Gerado em: 2026-04-16
> Fonte: revisão completa do diálogo de criação da LP do Apto Vila Ré

---

## PRIORIDADE 1 — Bloqueios críticos de fluxo

### 1.1 Python deve ser instalado automaticamente
**Problema:** o agente `lp-bootstrap` detectou que Python não estava instalado e simplesmente ignorou, convertendo sem WebP e sem avisar o usuário com clareza.
**Correção:** o bootstrap deve:
1. Detectar Python ausente
2. Tentar instalar automaticamente via `winget install Python.Python.3` (Windows), `brew install python3` (Mac) ou `apt-get install python3` (Linux)
3. Se falhar, exibir instruções claras passo a passo antes de continuar
4. Não avançar para etapas de imagem sem Python+Pillow funcionando

---

### 1.2 Sistema não pode continuar sem fotos
**Problema:** o fluxo continuou normalmente sem que as fotos fossem processadas de verdade (Python ausente = sem WebP).
**Correção:** etapa de imagens deve ser bloqueante:
- Se Python ausente → resolve primeiro (item 1.1)
- Se pasta de fotos vazia → não avança, pede fotos obrigatoriamente
- Se nenhuma foto for fornecida → só permite continuar se o usuário explicitamente confirmar "quero usar placeholders por enquanto" e o sistema deixa claro que a LP ficará incompleta visualmente

---

### 1.3 Endereço e Google Maps não foram solicitados
**Problema:** o template Vitrine tem seção de localização com iframe do Google Maps, mas o sistema nunca perguntou o endereço ao usuário. O mapa ficou com coordenadas genéricas de Vila Ré.
**Correção:** o agente `lp-corretor` ou `lp-arquiteto` deve:
1. Perguntar o endereço completo do imóvel (rua, número, bairro, cidade, CEP)
2. Gerar automaticamente o link embed do Google Maps a partir do endereço, OU
3. Perguntar: "Me passa o link do Google Maps do imóvel (abra o Maps, busque o endereço e copie o link)"
4. Validar se o link é um embed válido antes de usar

---

## PRIORIDADE 2 — Experiência do usuário (UX)

### 2.1 Informar ao usuário onde colocar as fotos ANTES de pedir
**Problema:** o sistema perguntou o caminho da pasta de fotos sem antes orientar onde colocar as imagens.
**Correção:** logo no início do fluxo (após bootstrap), exibir mensagem:

```
📁 PREPARE SUAS FOTOS ANTES DE COMEÇAR

Coloque todas as fotos do imóvel em uma pasta.
Sugestão: crie uma pasta chamada "fotos-imovel" na
área de trabalho e coloque as imagens lá.

Formatos aceitos: JPG, PNG, WEBP
Mínimo recomendado: 1 foto do hero (fachada ou destaque)

Quando estiver pronto, me informa o caminho da pasta.
```

---

### 2.2 Oferecer ficha de dados do imóvel antes do briefing
**Problema:** o sistema foi direto para perguntas de briefing sem verificar se o usuário já tinha os dados do imóvel organizados.
**Correção:** no início do fluxo perguntar:

```
Você já tem os dados do imóvel organizados?

  [1] Sim, tenho tudo (endereço, m², dorms, preço, etc.)
  [2] Tenho alguns dados, podemos ir perguntando
  [3] Não tenho, preciso de ajuda para organizar

```

Se [1] → mostrar ficha modelo para o usuário preencher de uma vez:
```
Preencha os campos abaixo (deixe em branco o que não sabe):

NOME DO IMÓVEL: 
TIPO: (apartamento / casa / studio / cobertura)
ENDEREÇO COMPLETO:
BAIRRO:
CIDADE/ESTADO:
METRAGEM (m²):
DORMITÓRIOS:
SUÍTES:
BANHEIROS:
VAGAS:
PREÇO:
CONSTRUTORA/INCORPORADORA:
STATUS: (pronto / em construção / lançamento)
DIFERENCIAIS:
LINK GOOGLE MAPS (opcional):
```

---

### 2.3 Usar listas numeradas em TODAS as escolhas
**Problema:** em alguns momentos o sistema usou [a][b][c] ou texto livre em vez de [1][2][3]. O usuário deve sempre poder digitar apenas um número.
**Correção:** padronizar TODAS as perguntas de escolha com formato:
```
  [1] Opção A
  [2] Opção B
  [3] Opção C
```
Nunca usar letras, nunca pedir texto livre quando há opções definidas.

---

### 2.4 Perguntar nome amigável para a LP (slug)
**Problema:** o slug `apto-vila-re` foi gerado automaticamente sem consultar o usuário.
**Correção:** perguntar:
```
Como quer chamar essa LP internamente?
(será o nome da pasta de arquivos)

Sugestão: apto-vila-re
[1] Usar sugestão
[2] Digitar outro nome
```

---

### 2.5 Template deve ser seguido rigorosamente — sem improvisação
**Problema:** o HTML gerado não seguiu fielmente o template Vitrine. Foram removidas seções (plantas, filtros da galeria), alteradas estruturas e adicionados elementos que não existem no template original.
**Correção:**
- Copiar o `index.html` do template escolhido como base
- Substituir apenas os valores nos `data-bind` e `data-stat`
- Se o template tem uma seção que não tem dados (ex: plantas) → perguntar ao usuário antes de omitir
- Nunca remover seções sem confirmar com o usuário
- Nunca criar HTML do zero — sempre partir do template original

---

### 2.6 Campos do template sem dados → perguntar, não omitir
**Problema:** o template Vitrine tem campo `construtora`, `previsão de entrega`, endereço, etc. que não foram preenchidos nem perguntados.
**Correção:** o agente `lp-arquiteto` deve:
1. Ler todos os `data-bind` e `data-stat` do template escolhido
2. Cruzar com os dados já coletados no briefing
3. Para cada campo sem dado → perguntar ao usuário antes de gerar o HTML
4. Nunca deixar campo vazio sem avisar o usuário

---

### 2.7 Mostrar nomes das fotos e pedir categorização claramente
**Problema:** o sistema listou os nomes das fotos (com nomes confusos como "ChatGPT Image 28 de out...") e perguntou qual era a "principal", mas sem mostrar as imagens.
**Correção:**
- Listar fotos com numeração clara
- Perguntar categoria de cada uma individualmente:
```
Foto 1: ChatGPT Image 29 de out. 18_46_47.png
O que mostra esta foto?
  [1] Fachada / Hero (foto principal)
  [2] Sala / Living
  [3] Quarto
  [4] Banheiro
  [5] Cozinha
  [6] Área de lazer
  [7] Varanda
  [8] Outros
```

---

## PRIORIDADE 3 — Melhorias técnicas

### 3.1 Validação do número de WhatsApp
**Problema:** o usuário digitou `1198575846425` (13 dígitos ambíguos). O sistema usou sem validar.
**Correção:**
- Validar formato brasileiro: DDD (2 dígitos) + 9 + 8 dígitos = 11 dígitos sem país
- Se número inválido → mostrar exemplo e pedir novamente:
```
  ✅ Formato correto: 11987654321 (DDD + número)
  ❌ Não usar: +55, 55, parênteses ou traços
```

---

### 3.2 Explicar FormSubmit ao usuário antes de usar
**Problema:** o formulário de contato foi configurado com FormSubmit sem explicar ao usuário o que é ou como funciona.
**Correção:** ao configurar leads por email, informar:
```
Vou usar o FormSubmit para enviar os contatos
para o seu email. É grátis e não precisa de cadastro.

Na primeira vez que alguém preencher o formulário,
você receberá um email de confirmação — clique no
link de ativação para começar a receber os leads.
```

---

### 3.3 Preview deve usar servidor local, não file://
**Problema:** abrir `index.html` direto no navegador (`file://`) causa problemas de CORS — fontes externas, iframes do Maps e alguns scripts podem não carregar.
**Correção:** o agente `lp-publisher` para preview local deve usar:
```bash
npx serve _lp-output/apto-vila-re
# Abre em: http://localhost:3000
```
E informar ao usuário o endereço `http://localhost:XXXX` em vez de abrir o arquivo direto.

---

### 3.4 Gerar performance.md e revisao.md de verdade
**Problema:** os arquivos `revisao.md` e `performance.md` nunca foram criados na pasta de output, apesar de serem prometidos pelo sistema.
**Correção:** os agentes `lp-revisor` e `lp-performance` devem escrever esses arquivos fisicamente em `_lp-output/<slug>/` com o resultado da revisão.

---

### 3.5 Salvar .sessao.json com etapas corretas após cada passo
**Problema:** o `.sessao.json` foi criado no início mas nunca atualizado durante o fluxo. Se o usuário fechar e reabrir, o sistema não saberá em qual etapa estava.
**Correção:** após CADA etapa concluída, atualizar o campo correspondente em `.sessao.json`:
```json
{ "status": "done", "completedAt": "2026-04-16T..." }
```

---

## PRIORIDADE 4 — Conteúdo e copy

### 4.1 Nunca gerar copy sem antes ter os dados completos
**Problema:** o copywriter gerou textos com base em dados parciais — sem endereço, sem construtora, sem dados completos.
**Correção:** o agente `lp-copywriter` só deve ser chamado após todos os dados obrigatórios estarem no `lp.json`.

### 4.2 Alt-text gerado sem ver as imagens
**Problema:** o sistema gerou alt-text genérico para as fotos sem ter visto as imagens (os nomes eram genéricos do ChatGPT).
**Correção:** ao gerar alt-text, o sistema deve pedir uma breve descrição de cada foto ao usuário, ou usar a categoria definida na etapa de imagens para gerar o texto.

### 4.3 Perguntar se tem plantas baixas
**Problema:** o template Vitrine tem seção de plantas, mas o sistema não perguntou ao usuário se tinha plantas disponíveis.
**Correção:** durante a etapa de imagens, perguntar explicitamente:
```
Você tem imagem da planta baixa do apartamento?
  [1] Sim (me manda junto com as outras fotos)
  [2] Não tenho agora (seção de plantas será ocultada)
```

---

## RESUMO EXECUTIVO

| # | Correção | Prioridade | Esforço |
|---|---|---|---|
| 1.1 | Instalar Python automaticamente | 🔴 Alta | Médio |
| 1.2 | Bloquear fluxo sem fotos | 🔴 Alta | Baixo |
| 1.3 | Pedir endereço e link Maps | 🔴 Alta | Baixo |
| 2.1 | Orientar onde colocar fotos | 🟡 Média | Baixo |
| 2.2 | Ficha de dados antes do briefing | 🟡 Média | Médio |
| 2.3 | Padronizar listas [1][2][3] | 🟡 Média | Baixo |
| 2.4 | Perguntar slug/nome da LP | 🟡 Média | Baixo |
| 2.5 | Seguir template rigorosamente | 🔴 Alta | Alto |
| 2.6 | Perguntar campos faltantes do template | 🔴 Alta | Médio |
| 2.7 | Categorização clara das fotos | 🟡 Média | Baixo |
| 3.1 | Validar WhatsApp | 🟢 Baixa | Baixo |
| 3.2 | Explicar FormSubmit | 🟢 Baixa | Baixo |
| 3.3 | Preview com servidor local | 🟡 Média | Baixo |
| 3.4 | Gerar revisao.md e performance.md | 🟡 Média | Médio |
| 3.5 | Atualizar .sessao.json em cada etapa | 🟡 Média | Baixo |
| 4.1 | Só gerar copy com dados completos | 🟡 Média | Baixo |
| 4.2 | Alt-text baseado em descrição real | 🟢 Baixa | Baixo |
| 4.3 | Perguntar sobre plantas baixas | 🟡 Média | Baixo |
