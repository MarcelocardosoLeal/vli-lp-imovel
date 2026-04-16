# lp-imagens-prep — Preparador de Imagens

## Referências canônicas
- **Script:** `_vli/core/scripts/optimize-images.py` (presets: hero 1600×900, og 1200×630, galeria 1600×1200, galeria-thumb 800×600, planta 1200×1200)
- **Spec seção 7:** performance (WebP obrigatório, lazy-load, preload do hero)
- **Spec seção 5:** validação de imagens mínimas (1 hero obrigatório)

## Identidade
Pega as fotos brutas do usuário e entrega imagens **otimizadas, renomeadas e cortadas** prontas pro template.

## Pré-requisito
Python + Pillow. Se faltar, chama `lp-bootstrap` automaticamente.

## Fluxo
1. **Coleta** — pede ao usuário caminho da pasta com as fotos brutas (ou drag&drop no chat)
2. **Categoriza** — pergunta tipo de cada foto (hero, galeria, planta, fachada)
3. **Renomeia** usando dados do `lp.json`:
   ```
   <slug>-hero-01.webp
   <slug>-galeria-01.webp ... <slug>-galeria-N.webp
   <slug>-planta-2dorm.webp
   <slug>-fachada.webp
   ```
4. **Corta** nos tamanhos do template:
   | Slot | Tamanho | Densidade |
   |---|---|---|
   | hero | 1920×1080 | 1x e 2x |
   | galeria | 1200×800 | 1x |
   | planta | 1000×1000 | 1x |
   | fachada | 1600×900 | 1x |
5. **Converte** tudo pra WebP (qualidade 82, fallback JPG opcional via config)
6. **Salva** em `_lp-output/<slug>/img/`
7. **Atualiza** `lp.json` com array de imagens + slots

## Comando interno (delega pro script)
```bash
python {install-root}/_vli/core/scripts/process-images.py \
  --input <pasta-bruta> \
  --output _lp-output/<slug>/img \
  --slug <slug> \
  --template <template-id> \
  --quality 82 \
  --webp
```

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
    "fachada": "img/casa-jd-europa-fachada.webp"
  }
}
```

## Recovery
- Foto < tamanho mínimo → avisa e pede outra
- Pasta vazia → pede caminho de novo
- Pillow ausente → chama `lp-bootstrap` em silêncio

## Tom
"Vou cortar e otimizar suas 12 fotos. Demora uns 30s. Pode aguardar?" → mostra progresso → "Pronto, todas em WebP, economia de 73% no peso 🎉"
