/**
 * Verificação de acessibilidade e metadados.
 *
 *   node scripts/verify.mjs
 *
 * Faz três coisas, todas com valor real:
 *
 *  1. Lê os tokens de cor direto do `global.css` e mede cada par de
 *     texto sobre fundo contra o critério WCAG AA. Ler do CSS em vez de
 *     manter uma cópia dos valores aqui é o ponto: a verificação não pode
 *     divergir silenciosamente do que o site realmente usa.
 *  2. Confere que o HTML gerado tem os metadados de SEO e compartilhamento.
 *  3. Confere que todo link interno e todo asset referenciado existe em `dist/`.
 *
 * Sai com código 1 se algo falhar, para servir de portão no CI.
 */
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const CSS = path.join(root, 'src', 'styles', 'global.css');
const DIST = path.join(root, 'dist');
const AA = 4.5;

let failures = 0;

const pass = (msg) => console.log(`  [32mPASS[0m  ${msg}`);
const fail = (msg) => {
  console.log(`  [31mFALHA[0m ${msg}`);
  failures += 1;
};
const head = (msg) => console.log(`\n[1m${msg}[0m`);

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

/** Extrai os tokens `--nome: #hex;` de um bloco de regra do CSS. */
function tokensFrom(css, selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Seletor não encontrado no CSS: ${selector}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const block = css.slice(open, close);

  const tokens = {};
  for (const [, name, value] of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[name] = value.toLowerCase();
  }
  return tokens;
}

async function checkContrast() {
  head('Contraste — WCAG AA (mínimo 4.5:1)');

  const css = await readFile(CSS, 'utf8');
  const themes = {
    claro: tokensFrom(css, ':root {'),
    escuro: tokensFrom(css, ":root[data-theme='dark'] {"),
  };

  let worst = { ratio: Infinity, label: '' };

  for (const [themeName, t] of Object.entries(themes)) {
    const surfaces = [
      ['fundo', t['bg']],
      ['cartão', t['bg-elevated']],
      ['superfície sutil', t['bg-subtle']],
    ];
    const inks = [
      ['texto', t['text']],
      ['texto secundário', t['text-muted']],
      ['texto tênue', t['text-faint']],
      ['destaque', t['accent']],
    ];

    for (const [surfaceName, surface] of surfaces) {
      for (const [inkName, ink] of inks) {
        const ratio = contrast(ink, surface);
        const label = `${themeName}: ${inkName} sobre ${surfaceName}`;
        if (ratio < worst.ratio) worst = { ratio, label };
        if (ratio >= AA) pass(`${ratio.toFixed(2).padStart(5)}:1  ${label}`);
        else fail(`${ratio.toFixed(2).padStart(5)}:1  ${label}`);
      }
    }

    const extras = [
      [`${themeName}: texto sobre botão primário`, t['accent-contrast'], t['accent']],
      [`${themeName}: destaque sobre fundo de destaque`, t['accent'], t['accent-subtle']],
    ];
    for (const [label, fg, bg] of extras) {
      const ratio = contrast(fg, bg);
      if (ratio < worst.ratio) worst = { ratio, label };
      if (ratio >= AA) pass(`${ratio.toFixed(2).padStart(5)}:1  ${label}`);
      else fail(`${ratio.toFixed(2).padStart(5)}:1  ${label}`);
    }
  }

  console.log(`\n  Pior caso: ${worst.ratio.toFixed(2)}:1 — ${worst.label}`);
}

/* ------------------------------------------------------------ metadados -- */

const REQUIRED_META = [
  ['<title>', /<title>[^<]{20,}<\/title>/],
  ['meta description', /<meta name="description" content="[^"]{60,}"/],
  ['canonical', /<link rel="canonical" href="https:\/\/[^"]+"/],
  ['og:title', /<meta property="og:title"/],
  ['og:description', /<meta property="og:description"/],
  ['og:image absoluta', /<meta property="og:image" content="https:\/\/[^"]+"/],
  ['og:url', /<meta property="og:url"/],
  ['twitter:card', /<meta name="twitter:card"/],
  ['favicon', /<link rel="icon"/],
  ['lang pt-BR', /<html lang="pt-BR"/],
  ['dados estruturados', /application\/ld\+json/],
];

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

async function checkMetadata(pages) {
  head('Metadados de SEO e compartilhamento');

  for (const file of pages) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const html = await readFile(file, 'utf8');
    const missing = REQUIRED_META.filter(([, re]) => !re.test(html)).map(([name]) => name);
    if (missing.length === 0) pass(`${rel} — ${REQUIRED_META.length} metadados presentes`);
    else fail(`${rel} — ausentes: ${missing.join(', ')}`);
  }
}

/* ----------------------------------------------------------------- links -- */

async function checkLinks(pages) {
  head('Links internos e assets');

  const base = '/meu-perfil';
  let checked = 0;

  for (const file of pages) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const html = await readFile(file, 'utf8');

    const refs = new Set();
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!url.startsWith(base)) continue;
      refs.add(url.split('#')[0].split('?')[0]);
    }

    for (const ref of refs) {
      const relative = ref.slice(base.length).replace(/^\//, '');
      const candidates = relative === '' || relative.endsWith('/')
        ? [path.join(DIST, relative, 'index.html')]
        : [path.join(DIST, relative), path.join(DIST, relative, 'index.html')];

      let ok = false;
      for (const candidate of candidates) {
        try {
          await access(candidate);
          ok = true;
          break;
        } catch {
          /* tenta o próximo candidato */
        }
      }

      checked += 1;
      if (!ok) fail(`${rel} aponta para ${ref}, que não existe em dist/`);
    }
  }

  pass(`${checked} referências internas verificadas`);
}

/* ------------------------------------------------------------------ run -- */

await checkContrast();

let pages = [];
try {
  pages = await htmlFiles(DIST);
} catch {
  console.log('\n[33mdist/ não encontrado — rode `npm run build` para verificar HTML.[0m');
}

if (pages.length > 0) {
  await checkMetadata(pages);
  await checkLinks(pages);
}

console.log('');
if (failures > 0) {
  console.log(`[31m${failures} verificação(ões) falharam.[0m`);
  process.exit(1);
}
console.log('[32mTodas as verificações passaram.[0m');
