/* VLI - gerenciador de sessão
   Persiste estado do pipeline em _lp-output/<slug>/.sessao.json
   Permite retomar de onde parou se o usuário fechar e voltar. */

const fs = require('fs');
const path = require('path');

const STAGES = [
  'bootstrap', 'corretor', 'arquiteto', 'paleta', 'copywriter',
  'imagens-prep', 'imagens-alt', 'seo', 'leads', 'analytics',
  'revisor', 'performance', 'publisher'
];

function sessionPath(outputDir, slug) {
  return path.join(outputDir, slug, '.sessao.json');
}

function lpJsonPath(outputDir, slug) {
  return path.join(outputDir, slug, 'lp.json');
}

function loadSession(outputDir, slug) {
  const fp = sessionPath(outputDir, slug);
  if (!fs.existsSync(fp)) return null;
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return null; }
}

function createSession(outputDir, slug) {
  const dir = path.join(outputDir, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const session = {
    slug,
    version: '0.1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: 'bootstrap',
    stages: {},
    completed: false
  };

  STAGES.forEach(s => {
    session.stages[s] = { status: 'pending', startedAt: null, completedAt: null };
  });

  fs.writeFileSync(sessionPath(outputDir, slug), JSON.stringify(session, null, 2), 'utf8');
  return session;
}

function updateStage(outputDir, slug, stage, status) {
  const session = loadSession(outputDir, slug);
  if (!session) return null;

  session.stages[stage] = session.stages[stage] || {};
  session.stages[stage].status = status;

  if (status === 'in_progress') session.stages[stage].startedAt = new Date().toISOString();
  if (status === 'done' || status === 'skipped') session.stages[stage].completedAt = new Date().toISOString();

  session.updatedAt = new Date().toISOString();

  const idx = STAGES.indexOf(stage);
  if (status === 'done' && idx < STAGES.length - 1) {
    session.currentStage = STAGES[idx + 1];
  }
  if (stage === 'publisher' && status === 'done') {
    session.completed = true;
  }

  fs.writeFileSync(sessionPath(outputDir, slug), JSON.stringify(session, null, 2), 'utf8');
  return session;
}

function getNextStage(session) {
  if (!session || session.completed) return null;
  return session.currentStage;
}

function listSessions(outputDir) {
  if (!fs.existsSync(outputDir)) return [];
  return fs.readdirSync(outputDir)
    .filter(d => fs.existsSync(path.join(outputDir, d, '.sessao.json')))
    .map(slug => ({ slug, ...loadSession(outputDir, slug) }));
}

function loadLpJson(outputDir, slug) {
  const fp = lpJsonPath(outputDir, slug);
  if (!fs.existsSync(fp)) return {};
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return {}; }
}

function saveLpJson(outputDir, slug, data) {
  const dir = path.join(outputDir, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(lpJsonPath(outputDir, slug), JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  STAGES, loadSession, createSession, updateStage,
  getNextStage, listSessions, loadLpJson, saveLpJson
};
