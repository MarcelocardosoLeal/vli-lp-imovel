# Briefing do Imovel - Entrada para o Agente

> Este arquivo e a forma mais segura de passar os dados do imovel para o agente.
>
> Voce pode usar de 3 jeitos:
>
> **1. Mais facil para leigo:** coloque este arquivo na raiz do projeto e diga:
> **"Crie a landing page completa deste imovel usando os arquivos desta pasta."**
>
> **2. Com material bruto:** coloque PDFs, textos, emails e fotos em `material-do-imovel/`
> e diga:
> **"Leia o material desta pasta, preencha o briefing e gere a LP completa."**
>
> **3. Sem arquivo nenhum:** diga ao agente que voce quer criar uma LP de imovel.
> Ele deve te entrevistar em blocos curtos e preencher este briefing com voce.
>
> Campos em branco = o agente deve omitir o item correspondente.
> O agente nao pode inventar dados.

---

## 0. Configuracao da LP

- **Template desejado:** `auto` | `vitrine` | `ficha` | `bairro` | `light`
- **Paleta de cores:** `ocean-gold` | `midnight` | `forest` | `urban` | `pearl` | `royal` | *(descreva uma personalizada)*
- **Nome da pasta de saida:** *(ex.: `edificio-aurora-jardim-europa`; se deixar vazio, o agente gera o slug)*

---

## 1. Identificacao do imovel *(OBRIGATORIO)*

- **Nome do imovel:**
- **Tipo:** *(Apartamento, Casa, Cobertura, Studio, Sala comercial, Terreno...)*
- **Bairro:**
- **Cidade:**
- **Estado (UF):**

---

## 2. Caracteristicas principais

- **Dormitorios:**
- **Suites:** *(deixe vazio se nao houver)*
- **Banheiros:**
- **Vagas de garagem:**
- **Area privativa minima (m2):**
- **Area privativa maxima (m2):** *(se igual a minima, repita o numero)*

---

## 3. Status e origem

- **Status:** `Lancamento` | `Em obras` | `Pronto` | `Usado` | `Revenda`
- **Previsao de entrega:** *(so se aplicavel - ex.: "Dezembro 2028")*
- **Construtora / Anunciante / Imobiliaria:**

---

## 4. Midia *(imagens sao essenciais - sem elas a LP fica fraca)*

> Se voce nao souber onde colocar os arquivos, use esta pasta:
> `material-do-imovel/img/`

### 4.1 Imagem do Hero
Arquivo ou URL da foto principal (fachada, render principal ou vista aerea):

- `hero:` *(ex.: `material-do-imovel/img/fachada-principal.jpg`)*

### 4.2 Galeria
Liste as fotos com categoria e legenda. Minimo recomendado: 5 imagens.

| Arquivo | Categoria | Legenda |
|---|---|---|
| `material-do-imovel/img/fachada.jpg` | fachada | Fachada principal |
| `material-do-imovel/img/sala.jpg` | interior | Sala de estar integrada |
| `material-do-imovel/img/cozinha.jpg` | interior | Cozinha americana |
| `material-do-imovel/img/piscina.jpg` | lazer | Piscina com deck |
| ... | ... | ... |

*Categorias aceitas:* `fachada` | `interior` | `lazer` | `areas-comuns` | `vista`

### 4.3 Plantas *(opcional)*
| Arquivo | Metragem |
|---|---|
| `material-do-imovel/img/planta-187.jpg` | 187 m2 |

### 4.4 Video tour *(opcional)*
- **URL do video (YouTube/Vimeo):**

---

## 5. Diferenciais

Liste 4 a 12 itens curtos. Exemplos: piscina adulto e infantil, academia equipada, rooftop, pet place, portaria 24h, coworking, varanda gourmet, churrasqueira, bicicletario.

- 
- 
- 
- 
- 
- 

---

## 6. Localizacao

- **Endereco completo:**
- **CEP:**
- **Link do Google Maps (embed ou URL):**

### Pontos de interesse proximos *(opcional, mas recomendado)*
| Lugar | Distancia |
|---|---|
| *(ex.: Parque Ibirapuera)* | *(ex.: 1,2 km)* |
| | |
| | |

---

## 7. Bloco comercial *(opcional - omitir se nao houver dado fechado)*

- **Preco:** *(ex.: "R$ 2.850.000" ou "A partir de R$ 2.500.000")*
- **Condicao de pagamento:** *(ex.: "Entrada + financiamento direto com a construtora")*
- **Texto comercial curto:** *(1 frase - ex.: "Lancamento com tabela especial ate 30/05")*

---

## 8. Captacao / Contato *(OBRIGATORIO)*

- **Nome da empresa:**
- **Telefone:** *(ex.: "(11) 99988-7766")*
- **WhatsApp:** *(formato internacional: `5511999887766`)*
- **E-mail:** *(opcional)*
- **Site:** *(opcional)*

---

## 9. FAQ *(opcional - se vazio, o agente gera 4 a 6 perguntas a partir dos dados acima)*

**Pergunta 1:**
**Resposta:**

**Pergunta 2:**
**Resposta:**

---

## 10. Observacoes livres

*Espaco para pedidos especificos: tom de voz, palavras a evitar, publico-alvo, referencias visuais externas, restricoes de marca, etc.*

---

## Checklist antes de gerar a LP

- [ ] Preenchi nome, tipo, bairro, cidade
- [ ] Tenho ao menos 1 imagem de hero *(ou autorizei placeholder)*
- [ ] Tenho ao menos 5 imagens para galeria *(recomendado)*
- [ ] Informei telefone ou WhatsApp
- [ ] Escolhi template e paleta ou deixei `auto`
