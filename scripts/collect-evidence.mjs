/**
 * Coleta evidências dos repositórios locais e grava `src/data/evidence.generated.json`.
 *
 *   npm run evidence
 *
 * Roda apenas na máquina do autor, porque lê os repositórios vizinhos (alguns
 * privados). O JSON resultante é versionado: o build do site e o CI nunca
 * dependem dos outros repositórios. Só saem daqui nomes de tecnologia,
 * contagens e identificadores de projeto — nunca código, caminhos internos,
 * valores de configuração ou dados de qualquer natureza.
 *
 * Toda tecnologia exibida no site precisa ter uma regra de detecção aqui. Se a
 * regra não encontra evidência no repositório, a tecnologia não aparece.
 */
import { readFile, readdir, access, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPOS_ROOT = process.env.REPOS_ROOT ?? path.resolve(HERE, '..', '..');
const OUT = path.resolve(HERE, '..', 'src', 'data', 'evidence.generated.json');

/**
 * Pastas dos repositórios que não são públicos. O mapeamento fica em
 * `scripts/repos.local.json`, ignorado pelo Git, para que nomes internos de
 * repositórios privados não apareçam neste repositório público. Veja
 * `scripts/repos.example.json`.
 */
const localDirs = JSON.parse(
  await readFile(path.join(HERE, 'repos.local.json'), 'utf8').catch(() => '{}'),
);
const privateDir = (id) => {
  const dir = localDirs[id];
  if (!dir) throw new Error(`Defina "${id}" em scripts/repos.local.json (veja repos.example.json).`);
  return dir;
};

/** id do projeto no site -> pasta do repositório e plataformas. */
const PROJECTS = {
  'controle-de-chaves': { dir: 'controle-de-chaves', platforms: ['mobile', 'web'] },
  'meu-chamado': { dir: 'meu-chamado', platforms: ['mobile'] },
  'sistema-ila-fab': { dir: privateDir('sistema-ila-fab'), platforms: ['web'] },
  'sistema-escalas-servico': { dir: privateDir('sistema-escalas-servico'), platforms: ['web'] },
  'meu-perfil': { dir: 'meu-perfil', platforms: ['web'], site: true },
};

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );
const readText = (p) => readFile(p, 'utf8').catch(() => '');

async function walk(dir, { skip = ['node_modules', '.git', 'build', 'dist', '.dart_tool'] } = {}) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (skip.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full, { skip })));
    else out.push(full);
  }
  return out;
}

async function inspect(id, { dir }) {
  const root = path.join(REPOS_ROOT, dir);
  const pkg = JSON.parse((await readText(path.join(root, 'package.json'))) || '{}');
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const pubspec = await readText(path.join(root, 'pubspec.yaml'));
  const migrations = (await walk(path.join(root, 'supabase', 'migrations'))).filter((f) =>
    f.endsWith('.sql'),
  );
  const sql = (await Promise.all(migrations.map((f) => readText(f)))).join('\n');
  const workflows = (await walk(path.join(root, '.github', 'workflows'))).filter((f) =>
    /\.ya?ml$/.test(f),
  );
  const src = await walk(path.join(root, 'src'));
  const testsJs = [...(await walk(path.join(root, 'src'))), ...(await walk(path.join(root, 'test')))].filter(
    (f) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(f),
  );
  const testsDart = (await walk(path.join(root, 'test'))).filter((f) => f.endsWith('_test.dart'));
  const adrs = (await walk(path.join(root, 'docs', 'adr'))).filter((f) => /\/?\d{4}-.*\.md$/.test(f.replace(/\\/g, '/')));
  const docs = (await walk(path.join(root, 'docs'))).filter((f) => f.endsWith('.md'));
  const changelog = await exists(path.join(root, 'CHANGELOG.md'));

  const facts = {
    react: 'react' in deps,
    typescript: 'typescript' in deps,
    javascript: src.some((f) => /\.m?js$/.test(f)) && !('typescript' in deps),
    tanstack: '@tanstack/react-router' in deps,
    tailwind: 'tailwindcss' in deps,
    astro: 'astro' in deps,
    vite: 'vite' in deps,
    flutter: /sdk:\s*flutter/.test(pubspec),
    dart: pubspec.length > 0,
    riverpod: /flutter_riverpod/.test(pubspec),
    drift: /^\s*drift:/m.test(pubspec),
    capacitor: '@capacitor/core' in deps,
    android: await exists(path.join(root, 'android')),
    supabase: '@supabase/supabase-js' in deps,
    postgres: migrations.length > 0,
    rls: /enable row level security/i.test(sql),
    edge: await exists(path.join(root, 'supabase', 'functions')),
    actions: workflows.length > 0,
    cloudflare: await exists(path.join(root, 'wrangler.jsonc')),
    vitest: 'vitest' in deps,
    fluttertest: testsDart.length > 0,
    eslint: 'eslint' in deps,
    prettier: 'prettier' in deps,
    pwa:
      (await exists(path.join(root, 'public', 'manifest.webmanifest'))) ||
      (await exists(path.join(root, 'public', 'manifest.json'))) ||
      (await exists(path.join(root, 'src', 'routes', 'api', 'public', 'manifest.ts'))),
    adr: adrs.length > 0,
    changelog,
  };

  return {
    facts,
    migrations: migrations.length,
    policies: (sql.match(/create policy/gi) ?? []).length,
    sqlFunctions: (sql.match(/create (or replace )?function/gi) ?? []).length,
    adrs: adrs.length,
    docs: docs.length,
    testFiles: testsJs.length + testsDart.length,
    testCases: await countTests(root, testsJs, testsDart),
    commits: gitCount(root),
    tags: gitTags(root),
    version: (pubspec.match(/^version:\s*([^\s+]+)/m) ?? [])[1] ?? null,
  };
}

/**
 * Casos de teste. O número que vale é o que o runner reporta ao executar a
 * suíte — testes parametrizados e laços fazem a contagem estática ficar
 * abaixo. Se a execução falhar, cai para a contagem estática (piso).
 */
async function countTests(root, testsJs, testsDart) {
  const ran = runSuite(root, testsJs.length > 0, testsDart.length > 0);
  if (ran !== null) return ran;
  let n = 0;
  for (const f of testsJs) {
    n += ((await readText(f)).match(/^\s*(it|test)(\.each)?\(/gm) ?? []).length;
  }
  for (const f of testsDart) {
    n += ((await readText(f)).match(/^\s*(test|testWidgets)\(/gm) ?? []).length;
  }
  return n;
}

function runSuite(root, js, dart) {
  const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');
  const strip = (t) => t.replace(ansi, '');
  try {
    if (js) {
      const out = strip(
        execFileSync('npx', ['vitest', 'run'], { cwd: root, encoding: 'utf8', shell: true, timeout: 180000 }),
      );
      const m = out.match(/Tests\s+(\d+) passed \((\d+)\)/);
      if (m && m[1] === m[2]) return Number(m[1]);
    }
    if (dart) {
      const out = strip(
        execFileSync('flutter', ['test'], { cwd: root, encoding: 'utf8', shell: true, timeout: 280000 }),
      );
      const all = [...out.matchAll(/\+(\d+): All tests passed/g)];
      if (all.length) return Number(all.at(-1)[1]);
    }
  } catch {
    /* suíte indisponível ou falhando: usa a contagem estática. */
  }
  return null;
}

function git(root, ...args) {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}
const gitCount = (root) => Number(git(root, 'rev-list', '--count', 'HEAD')) || 0;
const gitTags = (root) => git(root, 'tag').split('\n').filter(Boolean).length;

/** Catálogo: id -> rótulo, categoria e chave de fato. */
const CATALOG = [
  ['Frontend', 'React', 'react'],
  ['Frontend', 'TypeScript', 'typescript'],
  ['Frontend', 'JavaScript', 'javascript'],
  ['Frontend', 'TanStack Router', 'tanstack'],
  ['Frontend', 'Tailwind CSS', 'tailwind'],
  ['Frontend', 'Astro', 'astro'],
  ['Frontend', 'Vite', 'vite'],
  ['Frontend', 'PWA', 'pwa'],
  ['Mobile', 'Flutter', 'flutter'],
  ['Mobile', 'Dart', 'dart'],
  ['Mobile', 'Riverpod', 'riverpod'],
  ['Mobile', 'Capacitor', 'capacitor'],
  ['Mobile', 'Android', 'android'],
  ['Backend', 'Supabase', 'supabase'],
  ['Backend', 'Edge Functions', 'edge'],
  ['Banco de dados', 'PostgreSQL', 'postgres'],
  ['Banco de dados', 'Row Level Security', 'rls'],
  ['Banco de dados', 'Drift / SQLite', 'drift'],
  ['DevOps', 'GitHub Actions', 'actions'],
  ['DevOps', 'Cloudflare Workers', 'cloudflare'],
  ['Ferramentas', 'Vitest', 'vitest'],
  ['Ferramentas', 'Flutter Test', 'fluttertest'],
  ['Ferramentas', 'ESLint', 'eslint'],
  ['Ferramentas', 'Prettier', 'prettier'],
];

const inspected = {};
for (const [id, cfg] of Object.entries(PROJECTS)) {
  inspected[id] = await inspect(id, cfg);
}

const technologies = CATALOG.map(([category, name, key]) => {
  const projects = Object.keys(PROJECTS).filter((id) => inspected[id].facts[key]);
  return { category, name, projects, count: projects.length };
}).filter((t) => t.count > 0);

const sum = (fn) => Object.keys(PROJECTS).reduce((acc, id) => acc + fn(inspected[id]), 0);
const has = (platform, filter = () => true) =>
  Object.entries(PROJECTS).filter(([, c]) => c.platforms.includes(platform) && filter(c)).length;

const result = {
  generatedAt: new Date().toISOString().slice(0, 10),
  metrics: {
    projectsAnalyzed: Object.keys(PROJECTS).length,
    automatedTests: sum((p) => p.testCases),
    testedProjects: Object.keys(PROJECTS).filter((id) => inspected[id].testCases > 0).length,
    mobileApps: has('mobile'),
    webSystems: has('web', (c) => !c.site),
    technologies: technologies.length,
    adrs: sum((p) => p.adrs),
  },
  projects: Object.fromEntries(
    Object.entries(inspected).map(([id, p]) => [
      id,
      {
        migrations: p.migrations,
        sqlFunctions: p.sqlFunctions,
        policies: p.policies,
        adrs: p.adrs,
        testCases: p.testCases,
        testFiles: p.testFiles,
        tags: p.tags,
        commits: p.commits,
        version: p.version,
      },
    ]),
  ),
  technologies,
};

await writeFile(OUT, `${JSON.stringify(result, null, 2)}\n`);
console.log(`evidência gravada em ${path.relative(process.cwd(), OUT)}`);
console.log(result.metrics);
