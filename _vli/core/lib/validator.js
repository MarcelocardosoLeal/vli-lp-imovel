/* VLI - validador de LP contra spec NIVEL4 seção 5.1
   Uso: const { validate } = require('./validator'); validate(lpJson) → { ok, errors, warnings } */

const REQUIRED_FIELDS = [
  { key: 'nome', label: 'Nome do imóvel' },
  { key: 'tipo', label: 'Tipo (apartamento, casa, etc.)' },
  { key: 'bairro', label: 'Bairro' },
  { key: 'cidade', label: 'Cidade' }
];

const REQUIRED_AT_LEAST_ONE = [
  { keys: ['dorms', 'suites', 'vagas', 'm2min', 'm2max', 'banh'], label: 'Pelo menos 1 dado técnico (dorms, suítes, vagas, m² ou banheiros)' }
];

const REQUIRED_CONTACT = [
  { keys: ['tel', 'wpp'], label: 'Telefone ou WhatsApp' }
];

const PLACEHOLDER_PATTERNS = [
  /lorem\s*ipsum/i,
  /\[seu\s*texto/i,
  /\[your\s*text/i,
  /xxx+/i,
  /placeholder/i,
  /\?\?+/
];

function isEmpty(val) {
  return val === '' || val === null || val === undefined;
}

function hasPlaceholder(obj) {
  const found = [];
  const check = (val, path) => {
    if (typeof val === 'string') {
      for (const pat of PLACEHOLDER_PATTERNS) {
        if (pat.test(val)) { found.push({ path, value: val, pattern: pat.source }); break; }
      }
    } else if (Array.isArray(val)) {
      val.forEach((item, i) => check(item, `${path}[${i}]`));
    } else if (val && typeof val === 'object') {
      Object.entries(val).forEach(([k, v]) => check(v, `${path}.${k}`));
    }
  };
  check(obj, 'lp');
  return found;
}

function validate(lp) {
  const errors = [];
  const warnings = [];

  REQUIRED_FIELDS.forEach(({ key, label }) => {
    if (isEmpty(lp[key])) errors.push(`Campo obrigatório ausente: ${label}`);
  });

  REQUIRED_AT_LEAST_ONE.forEach(({ keys, label }) => {
    if (!keys.some(k => !isEmpty(lp[k]))) errors.push(label);
  });

  REQUIRED_CONTACT.forEach(({ keys, label }) => {
    if (!keys.some(k => !isEmpty(lp[k]))) errors.push(`Contato obrigatório: ${label}`);
  });

  const placeholders = hasPlaceholder(lp);
  placeholders.forEach(p => {
    errors.push(`Texto placeholder detectado em ${p.path}: "${p.value}"`);
  });

  if (lp.copy && lp.copy.hero_headline && lp.copy.hero_headline.length > 80) {
    warnings.push(`Headline com ${lp.copy.hero_headline.length} chars (recomendado < 80)`);
  }

  if (lp.seo && lp.seo.description) {
    const len = lp.seo.description.length;
    if (len < 130) warnings.push(`Meta description curta (${len} chars, mín. 130)`);
    if (len > 160) warnings.push(`Meta description longa (${len} chars, máx. 160)`);
  }

  if (lp.images) {
    if (!lp.images.hero) errors.push('Imagem hero obrigatória ausente');
    if (Array.isArray(lp.images.galeria) && lp.images.galeria.length === 0) {
      warnings.push('Galeria sem imagens — seção ficará vazia');
    }
  } else {
    warnings.push('Nenhuma imagem configurada — LP usará placeholders');
  }

  if (lp.wpp && !/^\+?\d{10,15}$/.test(lp.wpp.replace(/[\s()-]/g, ''))) {
    warnings.push(`WhatsApp em formato possivelmente inválido: "${lp.wpp}"`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    summary: errors.length === 0
      ? `✅ LP válida (${warnings.length} avisos)`
      : `❌ ${errors.length} bloqueio(s), ${warnings.length} aviso(s)`
  };
}

module.exports = { validate, REQUIRED_FIELDS, PLACEHOLDER_PATTERNS };
