/**
 * Gera os ativos de marca a partir do master do monograma GPO.
 *
 *   npm run brand
 *
 * Entrada:  src/assets/brand/gpo-master.png   (prata metálica, fundo transparente)
 * Saídas:   src/assets/brand/gpo-logo.png     monograma recortado (resolução original), para o Astro
 *           public/assets/brand/gpo-logo.png|.webp   mesma marca, para uso externo e dados estruturados
 *           public/assets/brand/gpo-logo-512.png, gpo-logo-192.png, favicon.png, apple-touch-icon.png
 *           public/og-image.png               cartão de compartilhamento 1200x630
 *
 * A marca não é redesenhada: o script só recorta a margem transparente e a
 * compõe sobre fundos. Se um dia existir a versão vetorial (gpo-mark.svg),
 * ela substitui o PNG na navbar e nos ícones sem mexer no resto.
 *
 * `sharp` já vem como dependência do Astro.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const rel = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const MASTER = rel('src/assets/brand/gpo-master.png');

/** Caixa delimitadora dos pixels visíveis; ignora a poeira de baixa opacidade. */
async function boundingBox(input, alphaMin = 40) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  let x0 = w;
  let y0 = h;
  let x1 = 0;
  let y1 = 0;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (data[(y * w + x) * c + 3] <= alphaMin) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

const box = await boundingBox(MASTER);
const mark = await sharp(MASTER).extract(box).png({ compressionLevel: 9 }).toBuffer();
const markAt = (width) => sharp(mark).resize({ width }).png({ compressionLevel: 9 }).toBuffer();

const save = async (file, buffer) => {
  await writeFile(rel(file), buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`${file.padEnd(34)} ${meta.width}x${meta.height}  ${(buffer.length / 1024).toFixed(1)} KB`);
};

await save('src/assets/brand/gpo-logo.png', mark);
await save('public/assets/brand/gpo-logo.png', mark);
await save(
  'public/assets/brand/gpo-logo.webp',
  await sharp(mark).webp({ quality: 95, alphaQuality: 100 }).toBuffer(),
);

/* ----------------------------------------------------- ícones de aba/app -- */

const TILE = '#0a1018';

/** Ícone quadrado: fundo escuro arredondado e o monograma centralizado. */
async function tile(size, { radius = 0.22, fill = 0.74 } = {}) {
  const inner = await markAt(Math.round(size * fill));
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#101a27"/><stop offset="1" stop-color="${TILE}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * radius}" fill="url(#g)"/>
    </svg>`,
  );
  return sharp(bg).composite([{ input: inner, gravity: 'center' }]).png({ compressionLevel: 9 }).toBuffer();
}

const touchIcon = await tile(180, { radius: 0 });
await save('public/assets/brand/favicon.png', await tile(48, { radius: 0.2, fill: 0.84 }));
await save('public/assets/brand/gpo-logo-192.png', await tile(192));
await save('public/assets/brand/gpo-logo-512.png', await tile(512));
await save('public/assets/brand/apple-touch-icon.png', touchIcon);
// Cópia na raiz: o Safari procura /apple-touch-icon.png sem ler o <head>.
await save('public/apple-touch-icon.png', touchIcon);

/* ------------------------------------------------------------ Open Graph -- */

const OG = { width: 1200, height: 630 };
const gridLines = Array.from({ length: 13 }, (_, i) => {
  const x = i * 100;
  return `<line x1="${x}" y1="0" x2="${x}" y2="${OG.height}"/>`;
}).join('');
const gridRows = Array.from({ length: 7 }, (_, i) => {
  const y = i * 105;
  return `<line x1="0" y1="${y}" x2="${OG.width}" y2="${y}"/>`;
}).join('');

const ogBackground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#06090e"/><stop offset="1" stop-color="#0e1621"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.76" cy="0.46" r="0.5">
      <stop offset="0" stop-color="#78bdf2" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#78bdf2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#06090e" stop-opacity="0"/>
      <stop offset="1" stop-color="#06090e" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g stroke="#ffffff" stroke-opacity="0.045" stroke-width="1">${gridLines}${gridRows}</g>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect y="430" width="100%" height="200" fill="url(#fade)"/>

  <rect x="80" y="152" width="44" height="3" fill="#78bdf2"/>
  <text x="80" y="212" font-family="Segoe UI, Arial, sans-serif" font-size="22" letter-spacing="6"
        fill="#93a4b8">FULL STACK DEVELOPER</text>
  <text x="80" y="296" font-family="Segoe UI, Arial, sans-serif" font-size="66" font-weight="700"
        fill="#f4f7fa">Guilherme</text>
  <text x="80" y="370" font-family="Segoe UI, Arial, sans-serif" font-size="66" font-weight="700"
        fill="#f4f7fa">Pereira de Oliveira</text>
  <text x="80" y="438" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="600"
        fill="#78bdf2">Web  •  Mobile  •  Backend</text>
  <text x="80" y="566" font-family="Consolas, monospace" font-size="22" fill="#6f8096">guilhermegpo.github.io/meu-perfil</text>
</svg>`);

/** Reflexo: cópia espelhada e esmaecida logo abaixo da marca. */
const ogMarkW = 400;
const ogMark = await markAt(ogMarkW);
const ogMarkMeta = await sharp(ogMark).metadata();
const reflection = await sharp(ogMark)
  .flip()
  .composite([
    {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${ogMarkMeta.width}" height="${ogMarkMeta.height}">
          <defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/>
          </linearGradient></defs><rect width="100%" height="100%" fill="url(#m)"/></svg>`,
      ),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

const markLeft = 690;
const markTop = 150;
const og = await sharp(ogBackground)
  .composite([
    { input: reflection, left: markLeft, top: markTop + ogMarkMeta.height + 14 },
    { input: ogMark, left: markLeft, top: markTop },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

await save('public/og-image.png', og);
