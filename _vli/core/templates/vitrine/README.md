# 🏢 Template Vitrine

Landing page de imóvel com estilo premium, inspirada nas maiores incorporadoras do mercado brasileiro.

## Estilo Visual
- **Paleta padrão**: Ocean-Gold (azul marinho + dourado)
- **Tipografia**: Playfair Display (títulos) + Inter (corpo) + Cormorant Garamond (destaques)
- **Inspiração**: Heaven Residences (Lavvi), Casa Senses (Cyrela)

## Estrutura de Arquivos
```
vitrine/
├── index.html          # Página principal (editar conteúdo aqui)
├── css/
│   ├── variables.css   # 🎨 PALETA DE CORES (editar apenas este para trocar cores)
│   ├── style.css       # Layout e componentes (não precisa editar)
│   └── responsive.css  # Breakpoints (não precisa editar)
├── js/
│   └── main.js         # Interações (não precisa editar)
├── img/                # Coloque as imagens do imóvel aqui
└── README.md           # Este arquivo
```

## Como Usar

### 1. Trocar dados do imóvel
Edite o `index.html` substituindo os dados do "Edifício Aurora" pelos dados reais do imóvel.

### 2. Trocar paleta de cores
Edite SOMENTE o `css/variables.css`. Paletas disponíveis:

| Paleta       | Primary   | Accent    | Descrição                  |
|-------------|-----------|-----------|----------------------------|
| ocean-gold  | `#0c2340` | `#c5a55a` | Azul marinho + dourado     |
| midnight    | `#1a1a2e` | `#e94560` | Escuro + vermelho elegante |
| forest      | `#1b4332` | `#52b788` | Verde sofisticado          |
| urban       | `#212529` | `#ff6f00` | Urbano + laranja vibrante  |
| pearl       | `#f8f6f0` | `#8b6914` | Claro + dourado            |
| royal       | `#2d1b69` | `#e8b931` | Roxo + dourado             |

### 3. Adicionar imagens
Coloque as imagens na pasta `img/` e atualize os `src` no HTML.

## Seções da LP
1. Hero principal
2. Resumo técnico (cards)
3. Galeria com filtros
4. Diferenciais com ícones
5. Plantas (omitir se não houver)
6. Ficha técnica
7. Localização + mapa + pontos de interesse
8. FAQ accordion
9. Bloco comercial (preço)
10. Formulário + WhatsApp
11. Reforço final + CTA
12. Rodapé

## Recursos Técnicos
- ✅ Mobile-first
- ✅ SEO completo (title, meta, OG, JSON-LD)
- ✅ Schema FAQPage + Product + Organization
- ✅ Lightbox na galeria
- ✅ FAQ accordion
- ✅ CTA flutuante no mobile
- ✅ Header transparente com efeito scroll
- ✅ Animações de entrada no scroll
- ✅ Máscara de telefone no formulário
- ✅ Integração WhatsApp
- ✅ CSS Custom Properties (troca fácil de paleta)
- ✅ Zero dependências externas
