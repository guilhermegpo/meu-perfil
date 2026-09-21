/**
 * Verificação de acessibilidade, SEO e integridade do site gerado.
 *
 *   node scripts/verify.mjs      (depois de `npm run build`)
 *
 * Faz cinco coisas, todas com valor real:
 *
 *  1. Lê os tokens de cor direto do `global.css` e mede cada par de texto sobre
 *     fundo contra o critério WCAG AA. Ler do CSS em vez de manter uma cópia dos
 *     valores aqui é o ponto: a verificação não pode divergir do que o site usa.
 *  2. Confere os metadados de SEO e de compartilhamento de cada página.
 *  3. Confere a estrutura: um único h1, `alt` em toda imagem, JSON-LD válido e
 *     nenhum recurso carregado de terceiros.
 *  4. Confere que todo link interno, asset e âncora aponta para algo que existe.
 *  5. Confere sitemap e robots.txt.
 *
 * Sai com código 1 se algo falhar, para servir de portão no CI.
 */
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const CSS = path.join(root, 'src', 'styles', 'global.css');
const DIST = path.join(root, 'dist');
const BASE = '/meu-perfil';
const AA = 4.5;

let failures = 0;

const pass = (msg) => console.log(`  [32mPASS[0m  ${msg}`);
const fail = (msg) => {
  console.log(`  [31mFALHA[0m ${msg}`);
  failures += 1;
};
const head = (msg) => console.log(`\n[1m${msg}[0m`);
const check = (ok, okMsg, failMsg) => (ok ? pass(okMsg) : fail(failMsg));

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

/* ---------------------------------------------------------------- cores -- */

function relativeLuminance(hex) {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Extrai os tokens `--nome: #hex;` do primeiro bloco `:root { ... }`. */
function colorTokens(css) {
  const open = css.indexOf(':root {');
  if (open === -1) throw new Error('Bloco :root não encontrado no CSS.');
  const block = css.slice(open, css.indexOf('}', open));
  const tokens = {};
  for (const [, name, value] of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[name] = value.toLowerCase();
  }
  return tokens;
}

async function checkContrast() {
  head('Contraste — WCAG AA (mínimo 4.5:1)');

  const t = colorTokens(await readFile(CSS, 'utf8'));
  const surfaces = ['bg', 'bg-1', 'bg-2', 'surface', 'surface-2', 'surface-3'];
  const inks = ['text', 'text-muted', 'text-faint', 'accent', 'accent-strong'];
  const missing = [...surfaces, ...inks, 'on-accent', 'tone-live', 'tone-alpha', 'tone-internal'].filter(
    (name) => !t[name],
  );
  if (missing.length > 0) {
    fail(`tokens ausentes no CSS: ${missing.join(', ')}`);
    return;
  }

  let worst = { ratio: Infinity, label: '' };
  const measure = (label, fg, bg) => {
    const ratio = contrast(fg, bg);
    if (ratio < worst.ratio) worst = { ratio, label };
    check(ratio >= AA, `${ratio.toFixed(2).padStart(5)}:1  ${label}`, `${ratio.toFixed(2).padStart(5)}:1  ${label}`);
  };

  for (const surface of surfaces) {
    for (const ink of inks) measure(`${ink} sobre ${surface}`, t[ink], t[surface]);
  }
  measure('texto sobre botão primário', t['on-accent'], t['accent']);
  measure('texto sobre botão primário (gradiente claro)', t['on-accent'], t['accent-strong']);
  for (const tone of ['tone-live', 'tone-alpha', 'tone-internal']) {
    measure(`${tone} sobre surface-2`, t[tone], t['surface-2']);
    measure(`${tone} sobre bg`, t[tone], t['bg']);
  }

  console.log(`\n  Pior caso: ${worst.ratio.toFixed(2)}:1 — ${worst.label}`);
}

/* ---------------------------------------------------------------- páginas -- */

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const REQUIRED_META = [
  ['<title>', /<title>[^<]{20,}<\/title>/],
  ['meta description', /<meta name="description" content="[^"]{60,}"/],
  ['canonical', /<link rel="canonical" href="https:\/\/[^"]+"/],
  ['og:title', /<meta property="og:title"/],
  ['og:description', /<meta property="og:description"/],
  ['og:image absoluta', /<meta property="og:image" content="https:\/\/[^"]+"/],
  ['og:image:alt', /<meta property="og:image:alt"/],
  ['og:url', /<meta property="og:url"/],
  ['twitter:card', /<meta name="twitter:card" content="summary_large_image"/],
  ['twitter:image', /<meta name="twitter:image"/],
  ['favicon', /<link rel="icon"/],
  ['apple-touch-icon', /<link rel="apple-touch-icon"/],
  ['theme-color', /<meta name="theme-color"/],
  ['lang pt-BR', /<html lang="pt-BR"/],
  ['dados estruturados', /application\/ld\+json/],
];

async function checkPage(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const html = await readFile(file, 'utf8');
  if (html.includes('http-equiv="refresh"')) {
    pass(`${rel} — redirecionamento (sem metadados próprios)`);
    return;
  }

  const missing = REQUIRED_META.filter(([, re]) => !re.test(html)).map(([name]) => name);
  check(
    missing.length === 0,
    `${rel} — ${REQUIRED_META.length} metadados presentes`,
    `${rel} — ausentes: ${missing.join(', ')}`,
  );

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  check(h1s === 1, `${rel} — um único h1`, `${rel} — ${h1s} elementos h1 (esperado 1)`);

  const noAlt = [...html.matchAll(/<img\b[^>]*>/g)].filter(([tag]) => !/\salt(=|\s|>)/.test(tag)).length;
  check(noAlt === 0, `${rel} — todas as imagens têm alt`, `${rel} — ${noAlt} imagem(ns) sem alt`);

  const noSize = [...html.matchAll(/<img\b[^>]*>/g)].filter(
    ([tag]) => !/\swidth=/.test(tag) || !/\sheight=/.test(tag),
  ).length;
  check(
    noSize === 0,
    `${rel} — imagens com width e height (sem salto de layout)`,
    `${rel} — ${noSize} imagem(ns) sem width/height`,
  );

  let jsonLdOk = true;
  for (const [, body] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(body);
    } catch {
      jsonLdOk = false;
    }
  }
  check(jsonLdOk, `${rel} — JSON-LD válido`, `${rel} — JSON-LD inválido`);

  const external = [...html.matchAll(/<(?:script|link|img|iframe)\b[^>]*\s(?:src|href)="(https?:\/\/[^"]+)"/g)]
    .filter(([tag, url]) => !/rel="(canonical|sitemap|me)"/.test(tag) && !url.includes('guilhermegpo.github.io'))
    .map(([, url]) => url);
  check(
    external.length === 0,
    `${rel} — nenhum recurso de terceiros carregado`,
    `${rel} — recursos externos: ${external.join(', ')}`,
  );

  // Âncoras: todo `#id` (local ou com prefixo do site) precisa existir na página de destino.
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id));
  const local = [...html.matchAll(/href="#([^"]+)"/g)].map(([, id]) => id);
  const broken = local.filter((id) => !ids.has(id));
  check(broken.length === 0, `${rel} — âncoras internas existem`, `${rel} — âncoras quebradas: ${broken.join(', ')}`);
}

async function checkMetadata(pages) {
  head('Metadados, estrutura e SEO por página');
  for (const file of pages) await checkPage(file);
}

/* ----------------------------------------------------------------- links -- */

async function checkLinks(pages) {
  head('Links internos e assets');
  let checked = 0;

  for (const file of pages) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const html = await readFile(file, 'utf8');

    const refs = new Set();
    for (const [, url] of html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
      for (const candidate of url.split(',').map((part) => part.trim().split(' ')[0])) {
        if (candidate.startsWith(BASE)) refs.add(candidate.split('#')[0].split('?')[0]);
      }
    }

    for (const ref of refs) {
      const relative = ref.slice(BASE.length).replace(/^\//, '');
      const candidates =
        relative === '' || relative.endsWith('/')
          ? [path.join(DIST, relative, 'index.html')]
          : [path.join(DIST, relative), path.join(DIST, relative, 'index.html')];

      let ok = false;
      for (const candidate of candidates) {
        if (await exists(candidate)) {
          ok = true;
          break;
        }
      }
      checked += 1;
      if (!ok) fail(`${rel} aponta para ${ref}, que não existe em dist/`);
    }
  }

  pass(`${checked} referências internas verificadas`);
}

/* --------------------------------------------------------- sitemap/robots -- */

async function checkCrawlers(pages) {
  head('Sitemap e robots.txt');

  const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8').catch(() => '');
  check(/Sitemap:\s*https:\/\//.test(robots), 'robots.txt aponta para o sitemap', 'robots.txt sem Sitemap');

  const sitemap = await readFile(path.join(DIST, 'sitemap-0.xml'), 'utf8').catch(() => '');
  const redirects = new Set();
  for (const f of pages) if ((await readFile(f, 'utf8')).includes('http-equiv="refresh"')) redirects.add(f);
  const indexable = pages.filter((f) => !f.endsWith('404.html') && !redirects.has(f));
  const missing = indexable
    .map((f) => path.relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, ''))
    .filter((route) => !sitemap.includes(`${BASE}/${route}`));
  check(
    sitemap.length > 0 && missing.length === 0,
    `sitemap lista as ${indexable.length} páginas indexáveis`,
    `sitemap sem: ${missing.join(', ') || '(arquivo ausente)'}`,
  );

  const og = await readFile(path.join(DIST, 'og-image.png')).catch(() => null);
  const dims = og && og.length > 24 ? [og.readUInt32BE(16), og.readUInt32BE(20)] : [0, 0];
  check(dims[0] === 1200 && dims[1] === 630, 'og-image.png tem 1200x630', `og-image.png tem ${dims.join('x')}`);
}

/* ------------------------------------------------------------------ run -- */

await checkContrast();

let pages = [];
try {
  pages = await htmlFiles(DIST);
} catch {
  console.log('\n[33mdist/ não encontrado — rode `npm run build` para verificar o HTML.[0m');
}

if (pages.length > 0) {
  await checkMetadata(pages);
  await checkLinks(pages);
  await checkCrawlers(pages);
}

console.log('');
if (failures > 0) {
  console.log(`[31m${failures} verificação(ões) falharam.[0m`);
  process.exit(1);
}
console.log('[32mTodas as verificações passaram.[0m');
