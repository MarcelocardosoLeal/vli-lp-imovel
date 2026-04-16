#!/usr/bin/env node
/* ============================================================
   VLI — Venda com Landing de Imóvel
   Instalador CLI   (npx lp-imovel install)
   ============================================================ */

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { execSync } = require('child_process');

/* ── cores no terminal ── */
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  red:    '\x1b[31m',
  gray:   '\x1b[90m',
};
const ok   = (msg) => console.log(`${c.green}✅${c.reset} ${msg}`);
const warn = (msg) => console.log(`${c.yellow}⚠️ ${c.reset} ${msg}`);
const info = (msg) => console.log(`${c.cyan}ℹ️ ${c.reset} ${msg}`);
const err  = (msg) => console.log(`${c.red}❌${c.reset} ${msg}`);
const bold = (msg) => `${c.bold}${msg}${c.reset}`;
const gray = (msg) => `${c.gray}${msg}${c.reset}`;

/* ── helpers ── */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {};
  for (const arg of args) {
    const m = arg.match(/^--([^=]+)(?:=(.+))?$/);
    if (m) flags[m[1]] = m[2] ?? true;
    else if (!flags._cmd) flags._cmd = arg;
  }
  return flags;
}

function prompt(question) {
  /* leitura síncrona do stdin — funciona sem dependências externas */
  process.stdout.write(question);
  const buf = Buffer.alloc(256);
  const fd  = fs.openSync('/dev/stdin', 'rs') || fs.openSync('CON', 'rs');
  try {
    const n = fs.readSync(fd, buf, 0, 256);
    return buf.slice(0, n).toString().replace(/[\r\n]+$/, '').trim();
  } catch {
    return '';
  } finally {
    fs.closeSync(fd);
  }
}

/* ── detectar IDEs instaladas ── */
function detectIDEs(projectRoot) {
  const found = [];
  const checks = [
    { name: 'claude-code',  paths: ['.claude'] },
    { name: 'codex',        paths: ['.codex', '.openai'] },
    { name: 'gemini',       paths: ['.gemini'] },
    { name: 'opencode',     paths: ['.opencode'] },
    { name: 'trae',         paths: ['.trae'] },
    { name: 'antigravity',  paths: ['.antigravity'] },
  ];
  for (const ide of checks) {
    for (const p of ide.paths) {
      if (fs.existsSync(path.join(projectRoot, p))) {
        found.push(ide.name);
        break;
      }
    }
  }
  /* claude-code também detectado pelo binário global */
  if (!found.includes('claude-code')) {
    try { execSync('claude --version', { stdio: 'ignore' }); found.push('claude-code'); } catch {}
  }
  return found;
}

/* ── instalar skills numa IDE ── */
function installSkills(skillsDir, ideDir, ideName) {
  if (!fs.existsSync(skillsDir)) return 0;
  let count = 0;
  for (const skillName of fs.readdirSync(skillsDir)) {
    const skillFile = path.join(skillsDir, skillName, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    let dest;
    if (ideName === 'claude-code') {
      dest = path.join(ideDir, 'commands', `${skillName}.md`);
    } else if (ideName === 'gemini') {
      dest = path.join(ideDir, 'commands', `${skillName}.md`);
    } else if (ideName === 'opencode') {
      dest = path.join(ideDir, 'commands', `${skillName}.md`);
    } else {
      dest = path.join(ideDir, 'commands', `${skillName}.md`);
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(skillFile, dest);
    count++;
  }
  return count;
}

/* ── gerar config.yaml ── */
function writeConfig(vliDir, userName) {
  const iso = new Date().toISOString();
  const config = `# VLI - configuracao da instalacao
# Este arquivo e gerado/atualizado pelo instalador

user_name: "${userName}"
communication_language: "Portugues"
output_language: "Portugues"
output_folder: "{project-root}/_lp-output"

defaults:
  template: "vitrine"
  palette: "ocean-gold"
  imageQuality: 82
  generateWebp: true
  generateJpgFallback: false

deploy:
  defaultTarget: "zip"   # zip | github-pages | netlify | folder
  githubPagesBranch: "gh-pages"

integrations:
  whatsapp: ""
  ga4: ""
  metaPixel: ""
  webhook: ""

installation:
  date: "${iso}"
  user: "${userName}"
  ides: []
`;
  const configPath = path.join(vliDir, 'core', 'config.yaml');
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, config, 'utf8');
}

/* ══════════════════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════════════════ */
async function main() {
  const flags = parseArgs();
  const cmd   = flags._cmd || 'install';

  if (cmd !== 'install') {
    console.log(`Uso: npx lp-imovel install [--here] [--name="Seu Nome"] [--ides=all]`);
    process.exit(0);
  }

  console.log('');
  console.log(`${c.bold}${c.cyan}╔══════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║   VLI — Venda com Landing de Imóvel     ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}║   Instalador v0.1.0                      ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════╝${c.reset}`);
  console.log('');

  /* ── destino da instalação ── */
  const projectRoot = flags.here ? process.cwd()
    : path.join(process.cwd());

  /* ── nome do usuário ── */
  let userName = flags.name || '';
  if (!userName) {
    userName = prompt('Seu nome (para personalizar as LPs): ') || 'Usuário';
  }

  /* ── detectar IDEs ── */
  let ides = detectIDEs(projectRoot);
  if (flags.ides === 'all') {
    ides = ['claude-code', 'codex', 'gemini', 'opencode', 'trae', 'antigravity'];
  }
  if (ides.length === 0) {
    warn('Nenhuma IDE detectada automaticamente. Instalando só os arquivos do sistema.');
    warn('Para configurar manualmente depois: npx lp-imovel install --ides=all');
  } else {
    info(`IDEs detectadas: ${bold(ides.join(', '))}`);
  }

  console.log('');
  info(`Instalando em: ${bold(projectRoot)}`);
  console.log('');

  /* ── origem dos arquivos (dentro do pacote npm) ── */
  const pkgRoot  = path.resolve(__dirname, '..');
  const vliSrc   = path.join(pkgRoot, '_vli');
  const skillSrc = path.join(vliSrc, 'core', 'skills');

  if (!fs.existsSync(vliSrc)) {
    err('Arquivos do sistema VLI não encontrados no pacote. Reinstale.');
    process.exit(1);
  }

  /* ── 1. copiar _vli/ ── */
  process.stdout.write(`  Copiando sistema VLI...`);
  const vliDest = path.join(projectRoot, '_vli');
  copyDir(vliSrc, vliDest);
  console.log(` ${c.green}✓${c.reset}`);

  /* ── 2. criar _lp-output/ ── */
  process.stdout.write(`  Criando pasta de output...`);
  fs.mkdirSync(path.join(projectRoot, '_lp-output'), { recursive: true });
  /* .gitkeep para o git trackear a pasta vazia */
  const gitkeep = path.join(projectRoot, '_lp-output', '.gitkeep');
  if (!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep, '');
  console.log(` ${c.green}✓${c.reset}`);

  /* ── 3. gerar config.yaml (sem versionar) ── */
  process.stdout.write(`  Gerando configuração local...`);
  writeConfig(vliDest, userName);
  console.log(` ${c.green}✓${c.reset}`);

  /* ── 4. instalar skills nas IDEs ── */
  const ideMap = {
    'claude-code':  path.join(projectRoot, '.claude'),
    'gemini':       path.join(projectRoot, '.gemini'),
    'opencode':     path.join(projectRoot, '.opencode'),
    'codex':        path.join(projectRoot, '.codex'),
    'trae':         path.join(projectRoot, '.trae'),
    'antigravity':  path.join(projectRoot, '.antigravity'),
  };

  for (const ide of ides) {
    const ideDir = ideMap[ide];
    if (!ideDir) continue;
    process.stdout.write(`  Configurando skills para ${bold(ide)}...`);
    const n = installSkills(skillSrc, ideDir, ide);
    console.log(` ${c.green}✓${c.reset} ${gray(`(${n} skills)`)}`);
  }

  /* ── 5. adicionar ao .gitignore se existir ── */
  const gitignorePath = path.join(projectRoot, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    let gi = fs.readFileSync(gitignorePath, 'utf8');
    const toAdd = [];
    if (!gi.includes('_lp-output/'))           toAdd.push('_lp-output/');
    if (!gi.includes('_vli/core/config.yaml')) toAdd.push('_vli/core/config.yaml');
    if (toAdd.length) {
      gi += `\n# VLI — gerados localmente\n${toAdd.join('\n')}\n`;
      fs.writeFileSync(gitignorePath, gi, 'utf8');
      process.stdout.write(`  Atualizando .gitignore...`);
      console.log(` ${c.green}✓${c.reset} ${gray(`(${toAdd.join(', ')})`)}`);;
    }
  }

  /* ── concluído ── */
  console.log('');
  console.log(`${c.green}${c.bold}══════════════════════════════════════════${c.reset}`);
  console.log(`${c.green}${c.bold}  VLI instalado com sucesso! 🏠${c.reset}`);
  console.log(`${c.green}${c.bold}══════════════════════════════════════════${c.reset}`);
  console.log('');
  console.log(`  Próximo passo:`);
  console.log('');
  console.log(`  ${bold('1.')} Abra este projeto no ${bold('Claude Code')} (ou sua IDE)`);
  console.log(`  ${bold('2.')} Digite ${bold(c.cyan + '/lp' + c.reset)} para criar sua primeira Landing Page`);
  console.log('');
  console.log(gray(`  Ajuda: /lp-help   |   Docs: github.com/MarcelocardosoLeal/vli-lp-imovel`));
  console.log('');
}

main().catch((e) => { err(e.message); process.exit(1); });
