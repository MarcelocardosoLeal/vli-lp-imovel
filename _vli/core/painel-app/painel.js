/* ===========================================================
   PAINEL DE LANDING PAGES — IMÓVEIS
   100% client-side. Persiste em localStorage.
   =========================================================== */

const STORAGE_KEY = 'lps_imoveis_v1';

// === PALETAS DISPONÍVEIS ===
const PALETTES = [
  { id: 'ocean-gold', name: 'Ocean Gold',  desc: 'Clássico, alto padrão',     primary: '#0c2340', accent: '#c5a55a', bg: '#ffffff', text: '#2d2d2d' },
  { id: 'midnight',   name: 'Midnight',    desc: 'Urbano moderno',            primary: '#1a1a2e', accent: '#e94560', bg: '#ffffff', text: '#2d2d2d' },
  { id: 'forest',     name: 'Forest',      desc: 'Sustentável, casa de campo',primary: '#1b4332', accent: '#52b788', bg: '#ffffff', text: '#1d2d25' },
  { id: 'urban',      name: 'Urban',       desc: 'Industrial, lofts',         primary: '#212529', accent: '#ff6f00', bg: '#ffffff', text: '#212529' },
  { id: 'pearl',      name: 'Pearl',       desc: 'Leve, sofisticado',         primary: '#3d3425', accent: '#8b6914', bg: '#fbf9f4', text: '#2d2820' },
  { id: 'royal',      name: 'Royal',       desc: 'Luxo ousado',               primary: '#2d1b69', accent: '#e8b931', bg: '#ffffff', text: '#2d2d2d' },
];

// === DIFERENCIAIS DISPONÍVEIS ===
const DIFFS_OPCOES = [
  { id: 'piscina',       icon: '🏊', label: 'Piscina' },
  { id: 'piscina-aq',    icon: '🌡️', label: 'Piscina aquecida' },
  { id: 'academia',      icon: '🏋️', label: 'Academia' },
  { id: 'gourmet',       icon: '🍖', label: 'Espaço gourmet' },
  { id: 'rooftop',       icon: '🌆', label: 'Rooftop' },
  { id: 'portaria24',    icon: '🔒', label: 'Portaria 24h' },
  { id: 'biometria',     icon: '🪪', label: 'Biometria' },
  { id: 'pet',           icon: '🐾', label: 'Pet friendly' },
  { id: 'bicicletario',  icon: '🚲', label: 'Bicicletário' },
  { id: 'coworking',     icon: '💻', label: 'Coworking' },
  { id: 'playground',    icon: '🛝', label: 'Playground' },
  { id: 'salao',         icon: '🎉', label: 'Salão de festas' },
  { id: 'quadra',        icon: '🎾', label: 'Quadra esportiva' },
  { id: 'jardim',        icon: '🌳', label: 'Jardim' },
  { id: 'varanda',       icon: '🌿', label: 'Varanda' },
  { id: 'energia-solar', icon: '☀️', label: 'Energia solar' },
  { id: 'pe-duplo',      icon: '🏠', label: 'Pé-direito duplo' },
  { id: 'vista-mar',     icon: '🌊', label: 'Vista para o mar' },
  { id: 'fgts',          icon: '💳', label: 'FGTS aceito' },
  { id: 'financiamento', icon: '🏦', label: 'Financiamento' },
  { id: 'permuta',       icon: '🔄', label: 'Permuta aceita' },
];

// === SEÇÕES DA LP ===
const SECTIONS = [
  { id: 'hero',         num: 1,  label: 'Hero principal',          locked: true  },
  { id: 'resumo',       num: 2,  label: 'Resumo técnico',          locked: false },
  { id: 'galeria',      num: 3,  label: 'Galeria de fotos',        locked: false },
  { id: 'diferenciais', num: 4,  label: 'Diferenciais',            locked: false },
  { id: 'plantas',      num: 5,  label: 'Plantas',                 locked: false },
  { id: 'ficha',        num: 6,  label: 'Ficha técnica',           locked: false },
  { id: 'localizacao',  num: 7,  label: 'Localização + mapa',      locked: false },
  { id: 'faq',          num: 8,  label: 'FAQ',                     locked: false },
  { id: 'comercial',    num: 9,  label: 'Bloco comercial (preço)', locked: false },
  { id: 'contato',      num: 10, label: 'Formulário + CTA',        locked: true  },
  { id: 'rodape',       num: 12, label: 'Rodapé',                  locked: true  },
];

// === ESTADO ===
let state = { lps: [], currentId: null };

// === STORAGE ===
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) { try { state = JSON.parse(raw); } catch { state = { lps: [], currentId: null }; } }
  if (!state.lps) state.lps = [];
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

// === MODELO DE LP NOVA ===
function newLP() {
  return {
    id: 'lp_' + Date.now(),
    slug: '',
    template: 'vitrine',
    palette: 'ocean-gold',
    sections: SECTIONS.reduce((a, s) => (a[s.id] = true, a), {}),
    nome: '',
    tipo: '',
    bairro: '',
    cidade: '',
    uf: '',
    dorms: '', suites: '', banh: '', vagas: '',
    m2min: '', m2max: '',
    status: '', construtora: '',
    preco: '',
    empresa: '', tel: '', wpp: '',
    endereco: '', mapa: '',
    diferenciais: [],
    createdAt: new Date().toISOString(),
  };
}

// === RENDER LISTA ===
function renderList() {
  const grid = document.getElementById('lp-grid');
  const empty = document.getElementById('empty-state');
  grid.innerHTML = '';
  if (state.lps.length === 0) { empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  state.lps.forEach(lp => {
    const pal = PALETTES.find(p => p.id === lp.palette) || PALETTES[0];
    const card = document.createElement('div');
    card.className = 'lp-card';
    card.dataset.id = lp.id;
    card.innerHTML = `
      <div class="lp-card__name">${escapeHtml(lp.nome) || '<em>(sem nome)</em>'}</div>
      <div class="lp-card__loc">${escapeHtml(lp.bairro)}${lp.bairro && lp.cidade ? ', ' : ''}${escapeHtml(lp.cidade)}</div>
      <div class="lp-card__meta">
        <span class="lp-card__chip">${lp.template}</span>
        <span class="lp-card__chip lp-card__chip--palette" style="--swatch:${pal.accent}">${pal.name}</span>
      </div>
      <div class="lp-card__actions">
        <button class="btn btn--ghost btn--sm js-edit">✎ Editar</button>
        <button class="btn btn--primary btn--sm js-open">▶ Abrir LP</button>
      </div>`;
    card.querySelector('.js-edit').addEventListener('click', e => { e.stopPropagation(); openEditor(lp.id); });
    card.querySelector('.js-open').addEventListener('click', e => { e.stopPropagation(); openLP(lp); });
    card.addEventListener('click', () => openEditor(lp.id));
    grid.appendChild(card);
  });
}

// === RENDER PALETAS ===
function renderPalettes() {
  const grid = document.getElementById('palette-grid');
  grid.innerHTML = '';
  PALETTES.forEach(p => {
    const card = document.createElement('label');
    card.className = 'palette-card';
    card.innerHTML = `
      <input type="radio" name="lp-palette" value="${p.id}">
      <div class="palette-card__swatches">
        <div class="palette-card__swatch" style="background:${p.primary}"></div>
        <div class="palette-card__swatch" style="background:${p.accent}"></div>
        <div class="palette-card__swatch" style="background:${p.bg};border-color:#ddd"></div>
      </div>
      <div class="palette-card__name">${p.name}</div>
      <div class="palette-card__desc">${p.desc}</div>`;
    card.querySelector('input').addEventListener('change', () => {
      document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('palette-card--active'));
      card.classList.add('palette-card--active');
      saveCurrentField('palette', p.id);
    });
    grid.appendChild(card);
  });
}

// === RENDER DIFERENCIAIS ===
function renderDiffs() {
  const grid = document.getElementById('diffs-check-grid');
  if (!grid) return;
  grid.innerHTML = '';
  DIFFS_OPCOES.forEach(d => {
    const label = document.createElement('label');
    label.className = 'diff-check';
    label.innerHTML = `<input type="checkbox" data-diff-id="${d.id}"><span>${d.icon} ${d.label}</span>`;
    label.querySelector('input').addEventListener('change', saveDiffs);
    grid.appendChild(label);
  });
}

function saveDiffs() {
  const lp = currentLP(); if (!lp) return;
  lp.diferenciais = [];
  document.querySelectorAll('[data-diff-id]:checked').forEach(cb => {
    const opt = DIFFS_OPCOES.find(d => d.id === cb.dataset.diffId);
    if (opt) lp.diferenciais.push({ id: opt.id, icon: opt.icon, label: opt.label });
  });
  save(); refreshJsonView();
}

function hydrateDiffs(lp) {
  const selected = (lp.diferenciais || []).map(d => d.id);
  document.querySelectorAll('[data-diff-id]').forEach(cb => {
    cb.checked = selected.includes(cb.dataset.diffId);
  });
}

// === RENDER SEÇÕES ===
function renderSections() {
  const list = document.getElementById('section-list');
  list.innerHTML = '';
  SECTIONS.forEach(s => {
    const row = document.createElement('label');
    row.className = 'section-row';
    row.innerHTML = `
      <input type="checkbox" data-section="${s.id}" ${s.locked ? 'disabled checked' : ''}>
      <span class="section-row__num">${s.num}.</span>
      <span class="section-row__label">${s.label}</span>
      ${s.locked ? '<span class="section-row__lock">🔒 obrigatória</span>' : ''}`;
    row.querySelector('input').addEventListener('change', e => {
      const lp = currentLP(); if (!lp) return;
      lp.sections[s.id] = e.target.checked;
      save(); refreshJsonView();
    });
    list.appendChild(row);
  });
}

// === EDITOR ===
function openEditor(id) {
  state.currentId = id;
  const lp = currentLP();
  if (!lp) return;
  document.getElementById('view-list').classList.add('hidden');
  document.getElementById('view-editor').classList.remove('hidden');
  document.getElementById('editor-title').textContent = lp.nome || lp.slug || 'Nova LP';

  // Hidrata campos
  setVal('lp-slug', lp.slug);
  setVal('lp-nome', lp.nome);
  setVal('lp-tipo', lp.tipo);
  setVal('lp-bairro', lp.bairro);
  setVal('lp-cidade', lp.cidade);
  setVal('lp-uf', lp.uf);
  setVal('lp-dorms', lp.dorms);
  setVal('lp-suites', lp.suites);
  setVal('lp-banh', lp.banh);
  setVal('lp-vagas', lp.vagas);
  setVal('lp-m2min', lp.m2min);
  setVal('lp-m2max', lp.m2max);
  setVal('lp-status', lp.status);
  setVal('lp-construtora', lp.construtora);
  setVal('lp-preco', lp.preco);
  setVal('lp-empresa', lp.empresa);
  setVal('lp-tel', lp.tel);
  setVal('lp-wpp', lp.wpp);
  setVal('lp-endereco', lp.endereco);
  setVal('lp-mapa', lp.mapa);

  // Template ativo
  document.querySelectorAll('input[name=lp-template]').forEach(r => {
    r.checked = r.value === lp.template;
    r.closest('.template-card').classList.toggle('template-card--active', r.checked);
  });

  // Paleta ativa
  document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('palette-card--active'));
  document.querySelectorAll('.palette-card input').forEach(i => {
    if (i.value === lp.palette) { i.checked = true; i.closest('.palette-card').classList.add('palette-card--active'); }
  });

  // Seções
  document.querySelectorAll('[data-section]').forEach(cb => {
    cb.checked = lp.sections[cb.dataset.section] !== false;
  });

  // Diferenciais
  hydrateDiffs(lp);

  // Tab inicial
  switchTab('basico');
  refreshJsonView();
}
function closeEditor() {
  state.currentId = null;
  document.getElementById('view-editor').classList.add('hidden');
  document.getElementById('view-list').classList.remove('hidden');
  renderList();
}

function currentLP() { return state.lps.find(l => l.id === state.currentId); }

function saveCurrentField(field, value) {
  const lp = currentLP(); if (!lp) return;
  lp[field] = value;
  if (field === 'nome' || field === 'slug') document.getElementById('editor-title').textContent = lp.nome || lp.slug || 'Nova LP';
  save(); refreshJsonView();
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('tab--active', t.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('tab-panel--active', p.dataset.panel === name));
}

// === ABRIR LP ===
function openLP(lp) {
  if (!lp.slug) { toast('Defina um slug antes de abrir a LP.'); switchTab('basico'); return; }
  if (!lp.nome) { toast('Defina o nome do imóvel antes de abrir.'); switchTab('basico'); return; }
  // A URL inclui o id da LP — o template vai ler do localStorage
  const url = `templates/${lp.template}/index.html?lp=${encodeURIComponent(lp.id)}`;
  window.open(url, '_blank');
}

// === HELPERS ===
function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v ?? ''; }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.add('hidden'), 2400);
}
function refreshJsonView() {
  const ta = document.getElementById('lp-json'); if (!ta) return;
  ta.value = JSON.stringify(currentLP(), null, 2);
}

// === EXPORT / IMPORT ===
function exportAll() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `lps-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  toast('Backup baixado.');
}
function importJSON() {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json';
  inp.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.lps) throw new Error('formato inválido');
        state = data; save(); renderList(); toast('Importado com sucesso.');
      } catch (err) { toast('Arquivo inválido: ' + err.message); }
    };
    r.readAsText(f);
  });
  inp.click();
}

// === BIND CAMPOS ===
function bindFieldInputs() {
  const fields = ['slug','nome','tipo','bairro','cidade','uf','dorms','suites','banh','vagas','m2min','m2max','status','construtora','preco','empresa','tel','wpp','endereco','mapa'];
  fields.forEach(f => {
    const el = document.getElementById('lp-' + f);
    if (el) el.addEventListener('input', () => saveCurrentField(f, el.value));
  });
  document.querySelectorAll('input[name=lp-template]').forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('template-card--active'));
      r.closest('.template-card').classList.add('template-card--active');
      saveCurrentField('template', r.value);
    });
  });
}

// === BIND BOTÕES "PEDIR AO CLAUDE" ===
function bindClaudeButtons() {
  document.querySelectorAll('.btn-claude').forEach(b => {
    b.addEventListener('click', () => {
      let prompt = b.dataset.prompt || '';
      const lp = currentLP();
      if (lp) prompt = prompt.replace(/\[SLUG\]/g, lp.slug || '<slug>');
      navigator.clipboard.writeText(prompt).then(
        () => toast('Prompt copiado! Cola no Claude Code.'),
        () => toast('Não consegui copiar. Selecione manualmente: ' + prompt)
      );
    });
  });
}

// === INIT ===
window.addEventListener('DOMContentLoaded', () => {
  load();
  renderList();
  renderPalettes();
  renderSections();
  renderDiffs();
  bindFieldInputs();
  bindClaudeButtons();

  document.getElementById('btn-new').addEventListener('click', () => {
    const lp = newLP();
    state.lps.push(lp);
    save();
    openEditor(lp.id);
  });
  document.getElementById('btn-back').addEventListener('click', closeEditor);
  document.getElementById('btn-delete').addEventListener('click', () => {
    if (!confirm('Apagar esta LP? A ação não pode ser desfeita.')) return;
    state.lps = state.lps.filter(l => l.id !== state.currentId);
    save(); closeEditor();
  });
  document.getElementById('btn-open').addEventListener('click', () => { const lp = currentLP(); if (lp) openLP(lp); });
  document.getElementById('btn-export-all').addEventListener('click', exportAll);
  document.getElementById('btn-import').addEventListener('click', importJSON);
  document.getElementById('btn-copy-json').addEventListener('click', () => {
    const ta = document.getElementById('lp-json');
    ta.select(); document.execCommand('copy'); toast('JSON copiado.');
  });
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
});
