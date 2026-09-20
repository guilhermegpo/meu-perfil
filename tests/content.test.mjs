/**
 * Testes de conteúdo e segurança.
 *
 *   npm test        (roda depois de `npm run build`)
 *
 * O site só pode afirmar o que os repositórios provam e não pode expor nada
 * privado. Estes testes transformam as duas regras em verificações
 * automáticas: um número que não bate com a evidência, um link para
 * repositório privado ou algo com cara de segredo quebram o CI.
 */
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const evidence = JSON.parse(await readFile(path.join(root, 'src/data/evidence.generated.json'), 'utf8'));

async function files(dir, filter) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await files(full, filter)));
    else if (filter(full)) out.push(full);
  }
  return out;
}

const isText = (f) => /\.(astro|ts|mjs|json|md|css|html|xml|txt|webmanifest|ya?ml)$/.test(f);
const publicFiles = [
  ...(await files(path.join(root, 'src'), (f) => isText(f) && !f.endsWith('evidence.generated.json'))),
  ...(await files(path.join(root, 'public'), isText)),
  ...(await files(path.join(root, 'dist'), isText)),
  ...(await files(path.join(root, 'docs'), isText)),
  ...(await files(path.join(root, 'scripts'), (f) => isText(f) && !f.endsWith('repos.local.json'))),
];
const contents = await Promise.all(publicFiles.map(async (f) => [f, await readFile(f, 'utf8')]));

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('há arquivos públicos para varrer (o build precisa ter rodado)', () => {
  assert.ok(contents.some(([f]) => f.includes(`${path.sep}dist${path.sep}`)), 'dist/ ausente: rode npm run build');
});

test('nenhum segredo, chave ou credencial nos arquivos publicáveis', () => {
  const patterns = [
    [/service_role/i, 'service_role'],
    [/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/, 'JWT'],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'chave privada'],
    [/\bAKIA[0-9A-Z]{16}\b/, 'chave AWS'],
    [/\b(?:ghp|gho|ghs|github_pat)_[A-Za-z0-9_]{20,}/, 'token GitHub'],
    [/[a-z0-9]{20}\.supabase\.co/i, 'URL de projeto Supabase'],
    [/SUPABASE_(?:URL|PROJECT_ID|ANON_KEY|SERVICE)/, 'variável do Supabase'],
    [/(?:password|senha)\s*[:=]\s*['"][^'"]{4,}/i, 'senha literal'],
  ];
  const hits = [];
  for (const [file, text] of contents) {
    for (const [re, label] of patterns) if (re.test(text)) hits.push(`${path.relative(root, file)}: ${label}`);
  }
  assert.deepEqual(hits, []);
});

test('nada de nome interno, dado militar ou link de repositório privado', async () => {
  // Os termos internos ficam em scripts/repos.local.json (ignorado pelo Git) para não
  // aparecerem neste repositório público. No CI o arquivo não existe: a varredura dos
  // termos internos roda na máquina do autor; as demais regras rodam sempre.
  const local = JSON.parse(
    await readFile(path.join(root, 'scripts', 'repos.local.json'), 'utf8').catch(() => '{}'),
  );
  const internal = (local.forbiddenTerms ?? []).map((term) => [
    new RegExp(escapeRegExp(term), 'i'),
    `termo interno "${term}"`,
  ]);
  const forbidden = [
    [/github\.com\/guilhermegpo\/controle-de-chaves/i, 'link de repositório privado'],
    [/(?<![\w.])\.env(?:\.local)?\b/, 'referência a arquivo .env'],
    ...internal,
  ];
  const hits = [];
  for (const [file, text] of contents) {
    for (const [re, label] of forbidden) if (re.test(text)) hits.push(`${path.relative(root, file)}: ${label}`);
  }
  assert.deepEqual(hits, []);
});

test('nenhum console.log ou debugger no código do site', () => {
  const hits = contents
    .filter(([f]) => f.includes(`${path.sep}src${path.sep}`))
    .filter(([, text]) => /console\.(log|debug|info)|debugger;/.test(text))
    .map(([f]) => path.relative(root, f));
  assert.deepEqual(hits, []);
});

test('evidência: contagem de cada tecnologia bate com a lista de projetos', () => {
  for (const tech of evidence.technologies) {
    assert.equal(tech.count, tech.projects.length, `${tech.name}: count diverge de projects`);
    assert.ok(tech.count > 0, `${tech.name} sem evidência não deveria existir`);
    for (const id of tech.projects) assert.ok(evidence.projects[id], `${tech.name} cita projeto desconhecido ${id}`);
  }
});

test('evidência: métricas conferem com os projetos', () => {
  const tests = Object.values(evidence.projects).reduce((sum, p) => sum + p.testCases, 0);
  assert.equal(evidence.metrics.automatedTests, tests);
  assert.equal(evidence.metrics.projectsAnalyzed, Object.keys(evidence.projects).length);
  assert.equal(evidence.metrics.technologies, evidence.technologies.length);
  assert.equal(
    evidence.metrics.testedProjects,
    Object.values(evidence.projects).filter((p) => p.testCases > 0).length,
  );
});

test('todo case de projeto gera uma página e consta no sitemap', async () => {
  const cases = await readdir(path.join(root, 'dist', 'projetos'));
  const sitemap = await readFile(path.join(root, 'dist', 'sitemap-0.xml'), 'utf8');
  assert.ok(cases.length >= 3, 'esperado ao menos os três cases em destaque');
  for (const slug of cases) assert.ok(sitemap.includes(`/projetos/${slug}`), `sitemap sem ${slug}`);
});

test('a página inicial mostra os números vindos da evidência', async () => {
  const html = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');
  const tests = evidence.metrics.automatedTests.toLocaleString('pt-BR');
  assert.ok(html.includes(tests), `home não exibe ${tests} testes`);
});
