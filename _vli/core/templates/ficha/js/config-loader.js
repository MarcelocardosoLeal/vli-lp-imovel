/* ===========================================================
   CONFIG LOADER - aplica configs do painel.html a LP
   Le ?lp=<id> da URL, busca no localStorage e aplica.
   Se nao houver ?lp=, a LP funciona com os dados demo normais.
   =========================================================== */
(function () {
  const PARAM = new URLSearchParams(location.search).get('lp');
  if (!PARAM) return;

  const STORAGE_KEY = 'lps_imoveis_v1';
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    console.warn('[config-loader] Sem dados no localStorage');
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return;
  }

  const lp = (data.lps || []).find((item) => item.id === PARAM);
  if (!lp) {
    console.warn('[config-loader] LP nao encontrada:', PARAM);
    return;
  }

  const PALETTES = {
    'ocean-gold': { primary: '#0c2340', primaryLight: '#163a5f', primaryDark: '#061729', accent: '#c5a55a', accentLight: '#d4b96e', accentDark: '#a88b3d', bg: '#ffffff', bgAlt: '#f7f5f0', bgSection: '#faf8f4', text: '#2d2d2d' },
    midnight: { primary: '#1a1a2e', primaryLight: '#16213e', primaryDark: '#0f0f1a', accent: '#e94560', accentLight: '#ff6b6b', accentDark: '#c23152', bg: '#ffffff', bgAlt: '#f5f5f7', bgSection: '#fafafc', text: '#2d2d2d' },
    forest: { primary: '#1b4332', primaryLight: '#2d6a4f', primaryDark: '#0f2b1e', accent: '#52b788', accentLight: '#74c69d', accentDark: '#40916c', bg: '#ffffff', bgAlt: '#f4f8f5', bgSection: '#f8faf8', text: '#1d2d25' },
    urban: { primary: '#212529', primaryLight: '#343a40', primaryDark: '#0d0f11', accent: '#ff6f00', accentLight: '#ff8f33', accentDark: '#cc5900', bg: '#ffffff', bgAlt: '#f5f5f5', bgSection: '#fafafa', text: '#212529' },
    pearl: { primary: '#3d3425', primaryLight: '#5a4e3a', primaryDark: '#2a2418', accent: '#8b6914', accentLight: '#a68327', accentDark: '#6b500a', bg: '#ffffff', bgAlt: '#f8f6f0', bgSection: '#fbf9f4', text: '#2d2820' },
    royal: { primary: '#2d1b69', primaryLight: '#4527a0', primaryDark: '#1a0e42', accent: '#e8b931', accentLight: '#f0cc5c', accentDark: '#c49b1f', bg: '#ffffff', bgAlt: '#f7f4fb', bgSection: '#faf8fd', text: '#2d2d2d' }
  };

  const pal = PALETTES[lp.palette] || PALETTES['ocean-gold'];
  const rgb = (hex) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  const paletteCSS = `
    --color-primary:${pal.primary};--color-primary-light:${pal.primaryLight};--color-primary-dark:${pal.primaryDark};
    --color-accent:${pal.accent};--color-accent-light:${pal.accentLight};--color-accent-dark:${pal.accentDark};
    --color-bg:${pal.bg};--color-bg-alt:${pal.bgAlt};--color-bg-section:${pal.bgSection};--color-text:${pal.text};
    --gradient-hero:linear-gradient(180deg, rgba(${rgb(pal.primary)}, 0.55) 0%, rgba(${rgb(pal.primary)}, 0.92) 100%);
    --gradient-accent:linear-gradient(135deg, ${pal.accent} 0%, ${pal.accentLight} 100%);
    --gradient-dark:linear-gradient(135deg, ${pal.primary} 0%, ${pal.primaryLight} 100%);
    --shadow-cta:0 4px 20px rgba(${rgb(pal.accent)}, 0.35);
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = `:root{${paletteCSS}}`;
  document.head.appendChild(styleEl);

  document.addEventListener('DOMContentLoaded', function applyData() {
    const SECTION_SELECTORS = {
      resumo: '#resumo',
      galeria: '#galeria',
      diferenciais: '#diferenciais',
      plantas: '#plantas',
      ficha: '#ficha',
      localizacao: '#localizacao',
      faq: '#faq',
      comercial: '#preco',
      bairro: '#bairro'
    };

    const sections = lp.sections || {};
    Object.entries(SECTION_SELECTORS).forEach(([id, selector]) => {
      if (sections[id] === false) {
        document.querySelectorAll(selector).forEach((el) => {
          el.style.display = 'none';
        });
      }
    });

    const set = (selector, value) => {
      if (value === '' || value == null) return;
      document.querySelectorAll(selector).forEach((el) => {
        el.textContent = value;
      });
    };

    const setAttr = (selector, attr, value) => {
      if (!value) return;
      document.querySelectorAll(selector).forEach((el) => {
        el.setAttribute(attr, value);
      });
    };

    const stat = (key, value, suffix = '') => {
      if (value === '' || value == null) return;
      document.querySelectorAll(`[data-stat="${key}"]`).forEach((el) => {
        el.textContent = `${value}${suffix}`;
      });
    };

    const setMeta = (selector, value) => {
      if (!value) return;
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', value);
    };

    const updateJsonLd = (id, payload) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = payload ? JSON.stringify(payload) : '';
    };

    const priceToNumber = (value) => {
      if (!value) return null;
      const digits = String(value).replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.');
      const parsed = Number.parseFloat(digits);
      return Number.isFinite(parsed) ? parsed.toFixed(2) : null;
    };

    const buildFaqSchema = () => {
      if (sections.faq === false) return null;
      const items = [];

      if (lp.dorms) {
        items.push({
          '@type': 'Question',
          name: `Quantos dormitorios tem ${lp.nome || 'o imovel'}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${lp.nome || 'O imovel'} possui ${lp.dorms} dormitorios${lp.suites ? `, sendo ${lp.suites} suites.` : '.'}`
          }
        });
      }

      if (lp.m2min || lp.m2max) {
        const area = lp.m2min && lp.m2max ? `${lp.m2min}m2 a ${lp.m2max}m2` : `${lp.m2max || lp.m2min}m2`;
        items.push({
          '@type': 'Question',
          name: 'Qual a metragem do imovel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `A metragem informada para o imovel e ${area}.`
          }
        });
      }

      if (lp.bairro || lp.cidade) {
        items.push({
          '@type': 'Question',
          name: `Onde fica ${lp.nome || 'o imovel'}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${lp.nome || 'O imovel'} esta localizado em ${[lp.bairro, lp.cidade].filter(Boolean).join(', ')}${lp.uf ? ` - ${lp.uf}` : ''}.`
          }
        });
      }

      if (lp.vagas) {
        items.push({
          '@type': 'Question',
          name: 'Quantas vagas de garagem o imovel possui?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `O imovel possui ${lp.vagas} vagas de garagem.`
          }
        });
      }

      if (lp.status) {
        items.push({
          '@type': 'Question',
          name: 'Qual o status do imovel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `O status informado para o imovel e ${lp.status}.`
          }
        });
      }

      if (Array.isArray(lp.diferenciais) && lp.diferenciais.length) {
        const labels = lp.diferenciais.map((item) => item.label).filter(Boolean);
        if (labels.length) {
          items.push({
            '@type': 'Question',
            name: 'Quais sao os diferenciais do imovel?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Entre os principais diferenciais estao: ${labels.join(', ')}.`
            }
          });
        }
      }

      return items.length
        ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items }
        : null;
    };

    const loc = [lp.bairro, lp.cidade].filter(Boolean).join(', ') + (lp.uf ? ` - ${lp.uf}` : '');
    const title = `${lp.tipo || 'Imovel'} a venda em ${lp.bairro || ''}, ${lp.cidade || ''} | ${lp.nome || ''}`.replace(/\s+/g, ' ').trim();

    document.title = title;
    set('[data-bind="nome"]', lp.nome);
    set('[data-bind="tipo"]', lp.tipo);
    set('[data-bind="localizacao"]', loc);
    set('[data-bind="bairro"]', lp.bairro);
    set('[data-bind="cidade"]', lp.cidade);
    set('[data-bind="status"]', lp.status);
    set('[data-bind="construtora"]', lp.construtora);
    set('[data-bind="endereco"]', lp.endereco);
    set('[data-bind="empresa"]', lp.empresa);
    set('[data-bind="telefone"]', lp.tel);

    stat('dorms', lp.dorms);
    stat('suites', lp.suites);
    stat('banh', lp.banh);
    stat('vagas', lp.vagas);
    stat('m2min', lp.m2min, ' m2');
    stat('m2max', lp.m2max, ' m2');
    if (lp.m2min && lp.m2max) stat('m2range', `${lp.m2min}-${lp.m2max}`, ' m2');
    else if (lp.m2max) stat('m2range', lp.m2max, ' m2');

    if (lp.preco) {
      set('[data-bind="preco"]', lp.preco);
    } else {
      document.querySelectorAll('[data-price-block]').forEach((el) => {
        el.style.display = 'none';
      });
    }

    if (Array.isArray(lp.diferenciais) && lp.diferenciais.length) {
      const container = document.querySelector('[data-bind="diferenciais-list"]');
      if (container) {
        container.innerHTML = '';
        lp.diferenciais.forEach((item) => {
          const el = document.createElement('div');
          el.className = container.dataset.itemClass || 'diff-card';
          el.innerHTML = `<span class="${container.dataset.iconClass || 'diff-card__icon'}">${item.icon || '*'}</span><span>${item.label}</span>`;
          container.appendChild(el);
        });
      }
    }

    if (lp.wpp) {
      const msg = encodeURIComponent(`Ola! Tenho interesse no imovel ${lp.nome || ''}.`);
      document.querySelectorAll('[data-wpp-link]').forEach((link) => {
        link.href = `https://wa.me/${lp.wpp}?text=${msg}`;
      });
    }

    if (lp.mapa) setAttr('iframe[data-bind="mapa"]', 'src', lp.mapa);

    const metaParts = [lp.tipo, lp.dorms && `${lp.dorms} dormitorios`, lp.m2max && `${lp.m2max}m2`, lp.bairro && `em ${lp.bairro}`].filter(Boolean);
    const metaDescription = `${metaParts.join(', ')}. Conheca ${lp.nome || 'este imovel'}.`;
    const heroImage = document.querySelector('#hero img')?.getAttribute('src') || document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    const orgName = lp.empresa || lp.construtora || document.querySelector('[data-bind="empresa"]')?.textContent?.trim() || '';

    setMeta('meta[name="description"]', metaDescription);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', metaDescription);
    setMeta('meta[property="og:image"]', heroImage);
    setMeta('meta[property="og:url"]', location.href);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', metaDescription);
    setMeta('meta[name="twitter:image"]', heroImage);

    updateJsonLd('schema-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: orgName || lp.nome || 'Imobiliaria',
      ...(lp.tel ? { telephone: lp.tel } : {})
    });

    updateJsonLd('schema-faq', buildFaqSchema());

    updateJsonLd('schema-product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${lp.nome || 'Imovel'}${lp.tipo ? ` - ${lp.tipo}` : ''}`,
      description: metaDescription,
      ...(heroImage ? { image: heroImage } : {}),
      ...(orgName ? { brand: { '@type': 'Organization', name: orgName } } : {}),
      ...(priceToNumber(lp.preco)
        ? {
            offers: {
              '@type': 'Offer',
              priceCurrency: 'BRL',
              price: priceToNumber(lp.preco)
            }
          }
        : {})
    });

    console.info('[config-loader] LP carregada:', lp.nome || lp.slug, '- paleta:', lp.palette);
  });
})();
