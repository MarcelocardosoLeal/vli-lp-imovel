/* VLI - gerador de slug em kebab-case
   Uso: const { toSlug } = require('./slug'); toSlug('Apto Jd Europa 201') → 'apto-jd-europa-201' */

function toSlug(input) {
  if (!input) return '';
  return String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function uniqueSlug(input, existing = []) {
  const base = toSlug(input);
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

module.exports = { toSlug, uniqueSlug };
if (typeof window !== 'undefined') window.VLI_slug = { toSlug, uniqueSlug };
