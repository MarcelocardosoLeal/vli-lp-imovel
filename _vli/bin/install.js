#!/usr/bin/env node
/* ===========================================================
   VLI INSTALLER — npx lp-imovel install
   Instala o método VLI no projeto do usuário:
   - Copia agentes, skills, templates, scripts, resources
   - Replica pra IDEs suportadas (.claude, .gemini, .opencode, .trae)
   - Cria config.yaml com dados do usuário
   =========================================================== */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const VERSION = '0.1.0';
const IDES = {
  'claude-code': { dir: '.claude', skillsDir: '.claude/skills', agentsDir: '.claude/agents' },
  'gemini':      { dir: '.gemini', skillsDir: '.gemini/skills', agentsDir: '.gemini/agents' },
  'opencode':    { dir: '.opencode', skillsDir: '.opencode/skills', agentsDir: '.opencode/agents' },
  'trae':        { dir: '.trae', skillsDir: '.trae/skills', agentsDir: '.trae/agents' },
  'codex':       { dir: '.codex', skillsDir: '.codex/skills', agentsDir: '.codex/agents' },
  'antigravity': { dir: '.antigravity', skillsDir: '.antigravity/skills', agentsDir: '.antigravity/agents' }
};

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function detectIDEs(targetDir) {
  const found = [];
  for (const [ide, cfg] of Object.entries(IDES)) {
    if (fs.existsSync(path.join(targetDir, cfg.dir))) found.push(ide);
  }
  return found;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║  VLI — Venda com Landing de Imóvel v' + VERSION + '   ║');
  console.log('  ║  Sistema de criação guiada de LPs imóveis   ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');

  const args = process.argv.slice(2);
  const isHere = args.includes('--here');
  const targetDir = isHere ? process.cwd() : (args.find(a => !a.startsWith('-') && !a.startsWith('--')) || process.cwd());
  const vliSource = path.resolve(__dirname, '..');

  console.log(`  Destino: ${targetDir}`);
  console.log(`  Fonte:   ${vliSource}`);
  console.log('');

  // Flags CLI (pra uso não-interativo)
  const nameFlag = args.find(a => a.startsWith('--name='));
  const idesFlag = args.find(a => a.startsWith('--ides='));
  const nonInteractive = nameFlag || !process.stdin.isTTY;

  let userName;
  if (nameFlag) {
    userName = nameFlag.split('=')[1];
  } else if (nonInteractive) {
    userName = 'Usuario';
  } else {
    userName = await ask(rl, '  Seu nome: ');
  }
  console.log('');

  // Detectar IDEs
  const detectedIDEs = detectIDEs(targetDir);
  const allIDEs = Object.keys(IDES);
  let selectedIDEs;

  if (idesFlag) {
    const val = idesFlag.split('=')[1];
    selectedIDEs = val === 'all' ? allIDEs : val.split(',');
  } else if (nonInteractive) {
    selectedIDEs = detectedIDEs.length > 0 ? detectedIDEs : allIDEs;
  } else if (detectedIDEs.length > 0) {
    console.log(`  IDEs detectadas: ${detectedIDEs.join(', ')}`);
    const others = await ask(rl, `  Instalar em mais IDEs? (Enter = só detectadas, "all" = todas): `);
    selectedIDEs = others.trim().toLowerCase() === 'all' ? allIDEs : detectedIDEs;
  } else {
    console.log('  Nenhuma IDE detectada. Instalando pra todas suportadas.');
    selectedIDEs = allIDEs;
  }
  console.log('');

  // 1. Copiar _vli/ inteira pro destino
  console.log('  [1/5] Copiando sistema VLI...');
  const destVli = path.join(targetDir, '_vli');
  copyRecursive(vliSource, destVli);
  console.log('        ✓ _vli/ copiada');

  // 2. Gerar config.yaml
  console.log('  [2/5] Gerando configuração...');
  const configPath = path.join(destVli, 'core', 'config.yaml');
  let config = fs.readFileSync(configPath, 'utf8');
  config = config.replace('user_name: ""', `user_name: "${userName}"`);
  fs.writeFileSync(configPath, config, 'utf8');
  console.log('        ✓ config.yaml atualizada');

  // 3. Copiar skills pra cada IDE
  console.log('  [3/5] Instalando skills nas IDEs...');
  const skillsSource = path.join(vliSource, 'core', 'skills');
  for (const ide of selectedIDEs) {
    const cfg = IDES[ide];
    const skillsDest = path.join(targetDir, cfg.skillsDir);
    if (fs.existsSync(skillsSource)) {
      for (const skill of fs.readdirSync(skillsSource)) {
        const src = path.join(skillsSource, skill);
        const dest = path.join(skillsDest, skill);
        copyRecursive(src, dest);
      }
    }
    console.log(`        ✓ ${ide}: ${cfg.skillsDir}/`);
  }

  // 4. Copiar agentes pra cada IDE
  console.log('  [4/5] Instalando agentes nas IDEs...');
  const agentsSource = path.join(vliSource, 'core', 'agents');
  for (const ide of selectedIDEs) {
    const cfg = IDES[ide];
    const agentsDest = path.join(targetDir, cfg.agentsDir);
    if (fs.existsSync(agentsSource)) {
      for (const agent of fs.readdirSync(agentsSource)) {
        const src = path.join(agentsSource, agent);
        const dest = path.join(agentsDest, agent);
        fs.mkdirSync(agentsDest, { recursive: true });
        fs.copyFileSync(src, dest);
      }
    }
    console.log(`        ✓ ${ide}: ${cfg.agentsDir}/`);
  }

  // 5. Criar pasta de saída
  console.log('  [5/5] Preparando ambiente...');
  const outputDir = path.join(targetDir, '_lp-output');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, '.gitkeep'), '', 'utf8');
  console.log('        ✓ _lp-output/ criada');

  // Gerar manifest de instalação
  const manifest = {
    installation: {
      version: VERSION,
      installDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      userName,
      ides: selectedIDEs
    }
  };
  fs.writeFileSync(
    path.join(destVli, '_config', 'manifest.yaml'),
    fs.readFileSync(path.join(destVli, '_config', 'manifest.yaml'), 'utf8') +
    `\ninstallation:\n  date: "${manifest.installation.installDate}"\n  user: "${userName}"\n  ides: [${selectedIDEs.join(', ')}]\n`,
    'utf8'
  );

  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║  ✅ VLI instalado com sucesso!               ║');
  console.log('  ╠══════════════════════════════════════════════╣');
  console.log('  ║                                              ║');
  console.log('  ║  Para começar:  /lp                          ║');
  console.log('  ║  Para ajuda:    /lp-help                     ║');
  console.log('  ║                                              ║');
  console.log('  ║  Agentes: 15  |  Skills: 6  |  Templates: 4 ║');
  console.log('  ║  Paletas: 6   |  IDEs: ' + selectedIDEs.length.toString().padEnd(2) + '                    ║');
  console.log('  ║                                              ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');

  rl.close();
}

main().catch(err => {
  console.error('Erro na instalação:', err.message);
  process.exit(1);
});
