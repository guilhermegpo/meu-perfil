/**
 * Baixa as fontes do Google Fonts para dentro do repositório.
 *
 *   npm run fonts
 *
 * Motivo: a folha de estilo do Google Fonts é um recurso que bloqueia a
 * renderização e mora em outro domínio. Medido pelo Lighthouse em rede móvel
 * lenta, ela custava cerca de 1,9 s ao primeiro desenho — a única coisa
 * segurando a página. Servindo os arquivos do mesmo domínio, o navegador
 * dispensa DNS, TLS e o ida-e-volta extra da folha intermediária.
 *
 * Só os subconjuntos latin e latin-ext são mantidos: o site é em português e
 * baixar cirílico, grego e vietnamita seria peso morto.
 *
 * Os arquivos ficam em `src/assets/fonts/`, e não em `public/`, para que o
 * Vite reescreva as URLs com o hash e o base path corretos.
 */
import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const FAMILIES =
  'family=Inter:wght@400..600&family=Space+Grotesk:wght@500..700&display=swap';

// Sem um user agent moderno, o Google devolve TTF em vez de WOFF2.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const KEEP = ['latin', 'latin-ext'];

const fontsDir = fileURLToPath(new URL('../src/assets/fonts/', import.meta.url));
const cssOut = fileURLToPath(new URL('../src/styles/fonts.css', import.meta.url));

await mkdir(fontsDir, { recursive: true });

// Remove arquivos de execuções anteriores para não acumular órfãos.
for (const file of await readdir(fontsDir).catch(() => [])) {
  if (file.endsWith('.woff2')) await unlink(new URL(file, `file://${fontsDir}`));
}

const response = await fetch(`https://fonts.googleapis.com/css2?${FAMILIES}`, {
  headers: { 'User-Agent': UA },
});
if (!response.ok) throw new Error(`Google Fonts respondeu ${response.status}`);
const css = await response.text();

/** Divide a folha em blocos @font-face individuais. */
const blocks = [...css.matchAll(/\/\*\s*([\w-\[\]]+)\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)];
if (blocks.length === 0) throw new Error('Nenhum @font-face encontrado na resposta.');

const rules = [];
let total = 0;

for (const [, subset, block] of blocks) {
  if (!KEEP.includes(subset)) continue;

  const family = /font-family:\s*'([^']+)'/.exec(block)?.[1];
  const weight = /font-weight:\s*([^;]+);/.exec(block)?.[1].trim();
  const style = /font-style:\s*([^;]+);/.exec(block)?.[1].trim() ?? 'normal';
  const range = /unicode-range:\s*([^;]+);/.exec(block)?.[1].trim();
  const url = /url\((https:[^)]+\.woff2)\)/.exec(block)?.[1];
  if (!family || !url) continue;

  const slug = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight.replace(/\s+/g, '-')}-${subset}.woff2`;
  const file = await fetch(url, { headers: { 'User-Agent': UA } });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(new URL(slug, `file://${fontsDir}`), bytes);
  total += bytes.length;

  rules.push(`@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('../assets/fonts/${slug}') format('woff2');
  unicode-range: ${range};
}`);

  console.log(`  ${slug.padEnd(44)} ${(bytes.length / 1024).toFixed(1)} KB`);
}

const header = `/*
 * Gerado por \`npm run fonts\`. Não edite à mão.
 *
 * Fontes servidas do próprio domínio para que nada de terceiros bloqueie a
 * primeira renderização. Apenas os subconjuntos latin e latin-ext.
 *
 * Inter e Space Grotesk — SIL Open Font License 1.1.
 */

`;

await writeFile(cssOut, header + rules.join('\n\n') + '\n');
console.log(`\n  ${rules.length} arquivos, ${(total / 1024).toFixed(1)} KB no total`);
console.log('  src/styles/fonts.css atualizado');
