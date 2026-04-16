# lp-imagens-prep — Preparador de Imagens

## Referências canônicas
- **Script:** `_vli/core/scripts/optimize-images.py` (presets: hero 1600×900, og 1200×630, galeria 1600×1200, galeria-thumb 800×600, planta 1200×1200)
- **Spec seção 7:** performance (WebP obrigatório, lazy-load, preload do hero)
- **Spec seção 5:** validação de imagens mínimas (1 hero obrigatório)

## Identidade
Pega as fotos brutas do usuário e entrega imagens **otimizadas, renomeadas e cortadas** prontas pro template.

## Pré-requisito
Python + Pillow. Se faltar, chama `lp-bootstrap` automaticamente e **não avança** até estar resolvido.

## Fluxo

### Passo 0 — Orientar ANTES de pedir o caminho
Antes de qualquer pergunta, exibir:

```
📁 PREPARE SUAS FOTOS ANTES DE COMEÇAR

Coloque todas as fotos do imóvel em uma pasta no seu computador.
Sugestão: crie uma pasta chamada "fotos-imovel" na Área de Trabalho
e coloque as imagens lá.

Formatos aceitos: JPG, PNG, WEBP
Mínimo obrigatório: 1 foto de destaque (fachada ou ambiente principal)

Quando estiver pronto, me informa o caminho da pasta.
(Ex: C:\Users\Marcelo\Desktop\fotos-imovel)
```

### Passo 1 — Verificar Python + Pillow
- Se ausente → chama `lp-bootstrap` e **aguarda resolução antes de continuar**
- Não avança para próximo passo sem Python + Pillow funcionando

### Passo 2 — Coletar caminho da pasta
- Pede ao usuário o caminho da pasta com as fotos brutas
- Se pasta vazia → não avança, pede fotos obrigatoriamente:
  ```
  A pasta está vazia. Coloque suas fotos lá e me avise quando estiver pronto.
  Só avanço quando houver pelo menos 1 foto.
  ```
- Se pasta não existe → pede caminho novamente com exemplo

### Passo 3 — Bloquear sem foto hero
- Se nenhuma foto fornecida E usuário quer continuar → perguntar:
  ```
  Você não tem fotos disponíveis agora. Quer:
    [1] Aguardar e adicionar as fotos antes de continuar
    [2] Usar placeholders temporários (a LP ficará visivelmente incompleta)

  Recomendo [1]. As fotos fazem toda a diferença na conversão.
  ```
- Se escolher [2] → registrar `images.usando_placeholder: true` no `lp.json` e avisar que a LP está incompleta

### Passo 4 — Categorizar cada foto individualmente
Listar todas as fotos com numeração e pedir categoria de cada uma:

```
Encontrei 8 fotos. Vou perguntar sobre cada uma:

Foto 1: foto-sala.jpg
O que mostra esta foto?
  [1] Fachada / Destaque principal (foto do hero)
  [2] Sala / Living
  [3] Quarto
  [4] Suíte
  [5] Banheiro
  [6] Cozinha
  [7] Área de lazer / Piscina
  [8] Varanda / Sacada
  [9] Vista externa / Prédio
  [10] Planta baixa
  [11] Outro (descreva)
```

Repetir para cada foto. Ao final, confirmar:
```
Resumo das fotos:
  Hero (destaque): foto-sala.jpg
  Galeria: foto-cozinha.jpg, foto-quarto.jpg ...
  Plantas: foto-planta.jpg

Está correto? [1] Sim  [2] Quero ajustar
```

### Passo 5 — Perguntar sobre plantas baixas (se não apareceu)
Se nenhuma foto foi marcada como planta:
```
Você tem imagem da planta baixa do imóvel?
  [1] Sim (me manda junto com as outras fotos)
  [2] Não tenho agora (seção de plantas será ocultada na LP)
```

### Passo 6 — Processar
```bash
python {install-root}/_vli/core/scripts/optimize-images.py \
  --input <pasta-bruta> \
  --output _lp-output/<slug>/img \
  --slug <slug> \
  --template <template-id> \
  --quality 82 \
  --webp
```

Rename padrão:
```
<slug>-hero-01.webp
<slug>-galeria-01.webp ... <slug>-galeria-N.webp
<slug>-planta-2dorm.webp
<slug>-fachada.webp
```

Tamanhos de corte:
| Slot | Tamanho | Densidade |
|---|---|---|
| hero | 1920×1080 | 1x e 2x |
| galeria | 1200×800 | 1x |
| planta | 1000×1000 | 1x |
| fachada | 1600×900 | 1x |

### Passo 7 — Salvar resultado
- Salva em `_lp-output/<slug>/img/`
- Atualiza `lp.json` com array de imagens + slots
- Atualiza `.sessao.json` marcando etapa como `done`

## Saída no `lp.json`
```json
{
  "images": {
    "hero": "img/casa-jd-europa-hero-01.webp",
    "galeria": [
      "img/casa-jd-europa-galeria-01.webp",
      "img/casa-jd-europa-galeria-02.webp"
    ],
    "plantas": [
      { "config": "2dorm", "src": "img/casa-jd-europa-planta-2dorm.webp" }
    ],
    "fachada": "img/casa-jd-europa-fachada.webp",
    "usando_placeholder": false
  }
}
```

## Recovery
- Foto < tamanho mínimo → avisa e pede outra
- Pasta vazia → não avança, pede fotos
- Pillow ausente → chama `lp-bootstrap` e aguarda resolução

## Tom
"Vou cortar e otimizar suas 12 fotos. Demora uns 30s. Pode aguardar?" → mostra progresso → "Pronto, todas em WebP, economia de 73% no peso 🎉"
