/* ===========================================================
   CONFIG LOADER - TEMPLATE LIGHT
   Le ?lp=<id> da URL, busca os dados no localStorage e aplica
   a paleta e os campos dinamicos do painel.
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
    'ocean-gold': { primary: '#c5a55a', primaryLight: '#d8bf82', primaryDark: '#9f7f36', bg: '#fcf9f8', bgAlt: '#f4f0e8', bgSection: '#ece6db', text: '#1f2328', textLight: '#6b655b', border: '#d9cfbf', dark: '#182331' },
    midnight: { primary: '#e94560', primaryLight: '#ff6b6b', primaryDark: '#c23152', bg: '#fdfafb', bgAlt: '#f6f1f3', bgSection: '#ede5e8', text: '#241f22', textLight: '#6d6368', border: '#decfd5', dark: '#221b20' },
    forest: { primary: '#52b788', primaryLight: '#74c69d', primaryDark: '#40916c', bg: '#fbfcfa', bgAlt: '#f2f7f2', bgSection: '#e7efe8', text: '#1d2d25', textLight: '#607165', border: '#ceddce', dark: '#16261f' },
    urban: { primary: '#ff6f00', primaryLight: '#ff8f33', primaryDark: '#cc5900', bg: '#fdfaf8', bgAlt: '#f6f1ed', bgSection: '#ece4dd', text: '#2b2520', textLight: '#6f655d', border: '#dfd2c7', dark: '#221d18' },
    pearl: { primary: '#b3935d', primaryLight: '#d1b57b', primaryDark: '#8a6e42', bg: '#fcf9f8', bgAlt: '#f6f3f2', bgSection: '#eeebea', text: '#1b1c1c', textLight: '#6d665c', border: '#d8d0c4', dark: '#1f1b17' },
    royal: { primary: '#e8b931', primaryLight: '#f0cc5c', primaryDark: '#c49b1f', bg: '#fcfafd', bgAlt: '#f3f0f8', bgSection: '#ebe6f2', text: '#251f2d', textLight: '#6b6177', border: '#d8cfe4', dark: '#221a32' }
  };

  const pal = PALETTES[lp.palette] || PALETTES.pearl;
  const rgb = (hex) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  const paletteCSS = `
    --color-primary:${pal.primary};
    --color-primary-light:${pal.primaryLight};
    --color-primary-dark:${pal.primaryDark};
    --color-accent:${pal.primary};
    --color-accent-light:${pal.primaryLight};
    --color-accent-dark:${pal.primaryDark};
    --color-bg:${pal.bg};
    --color-bg-alt:${pal.bgAlt};
    --color-bg-section:${pal.bgSection};
    --color-bg-dark:${pal.dark};
    --color-text:${pal.text};
    --color-text-light:${pal.textLight};
    --color-text-inverse:#ffffff;
    --color-border:${pal.border};
    --color-cta:${pal.primary};
    --color-cta-hover:${pal.primaryDark};
    --color-cta-text:#ffffff;
    --gradient-hero:linear-gradient(180deg, rgba(${rgb(pal.dark)}, 0.22) 0%, rgba(${rgb(pal.dark)}, 0.55) 100%);
    --gradient-accent:linear-gradient(135deg, ${pal.primary} 0%, ${pal.primaryLight} 100%);
    --gradient-dark:linear-gradient(135deg, ${pal.dark} 0%, ${pal.primaryDark} 100%);
    --shadow-card:0 14px 36px rgba(${rgb(pal.dark)}, 0.08);
    --shadow-elevated:0 20px 56px rgba(${rgb(pal.dark)}, 0.12);
    --shadow-cta:0 10px 24px rgba(${rgb(pal.primary)}, 0.22);
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = `:root{${paletteCSS}}`;
  document.head.appendChild(styleEl);

  document.addEventListener('DOMContentLoaded', () => {
    const sectionSelectors = {
      resumo: '#resumo',
      galeria: '#galeria',
      diferenciais: '#diferenciais',
      plantas: '#plantas',
      ficha: '#ficha',
      localizacao: '#bairro, #localizacao',
      faq: '#faq',
      comercial: '#preco'
    };

    const sections = lp.sections || {};
    Object.entries(sectionSelectors).forEach(([id, selector]) => {
      if (sections[id] === false) {
        document.querySelectorAll(selector).forEach((el) => {
          el.style.display = 'none';
        });
      }
    });

    const setText = (selector, value) => {
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

    const setStat = (key, value, suffix = '') => {
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
    setText('[data-bind="nome"]', lp.nome);
    setText('[data-bind="tipo"]', lp.tipo);
    setText('[data-bind="localizacao"]', loc);
    setText('[data-bind="bairro"]', lp.bairro);
    setText('[data-bind="cidade"]', lp.cidade);
    setText('[data-bind="status"]', lp.status);
    setText('[data-bind="construtora"]', lp.construtora);
    setText('[data-bind="endereco"]', lp.endereco);
    setText('[data-bind="empresa"]', lp.empresa);
    setText('[data-bind="telefone"]', lp.tel);

    setStat('dorms', lp.dorms);
    setStat('suites', lp.suites);
    setStat('banh', lp.banh);
    setStat('vagas', lp.vagas);
    setStat('m2min', lp.m2min, 'm2');
    setStat('m2max', lp.m2max, 'm2');

    if (lp.preco) {
      setText('[data-bind="preco"]', lp.preco);
    } else {
      document.querySelectorAll('[data-price-block]').forEach((el) => {
        el.style.display = 'none';
      });
    }

    if (Array.isArray(lp.diferenciais) && lp.diferenciais.length) {
      const container = document.querySelector('[data-bind="diferenciais-list"]');
      if (container) {
        container.innerHTML = '';
        lp.diferenciais.slice(0, 8).forEach((item) => {
          const card = document.createElement('div');
          card.className = 'text-center group';
          card.innerHTML = `
            <span class="block text-2xl md:text-3xl text-primary mb-8 leading-none">${item.icon || '*'}</span>
            <h5 class="font-label uppercase text-[10px] tracking-[0.4em] mb-4">${item.label || ''}</h5>
            <div class="w-8 h-[1px] bg-primary/30 mx-auto group-hover:w-20 group-hover:bg-primary transition-all duration-700"></div>
          `;
          container.appendChild(card);
        });
      }
    }

    if (lp.wpp) {
      const msg = encodeURIComponent(`Ola! Tenho interesse no imovel ${lp.nome || ''}.`);
      document.querySelectorAll('[data-wpp-link]').forEach((link) => {
        link.href = `https://wa.me/${lp.wpp}?text=${msg}`;
      });
    }

    if (lp.mapa) {
      setAttr('iframe[data-bind="mapa"]', 'src', lp.mapa);
    }

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
