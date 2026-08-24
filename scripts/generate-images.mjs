/**
 * Gera as imagens estáticas que o pipeline do Astro não cobre:
 *
 *   public/og-image.png        cartão de compartilhamento social (1200x630)
 *   public/apple-touch-icon.png  ícone de atalho em iOS (180x180)
 *
 * Executar após mudar nome, cargo ou foto:
 *
 *   npm run images
 *
 * São geradas por script e versionadas, em vez de produzidas a cada build:
 * mudam raramente e não justificam custo em toda publicação. `sharp` já vem
 * como dependência do Astro — não foi adicionado por causa disto.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const OG = { width: 1200, height: 630 };
const PHOTO = 300;

const url = (name) => new URL(`../public/${name}`, import.meta.url);

/* -------------------------------------------------- cartão social (og) -- */

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#071320"/>
      <stop offset="100%" stop-color="#0f2436"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.75" cy="0.3" r="0.6">
      <stop offset="0%" stop-color="#5ad3c6" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#5ad3c6" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${OG.width}" height="${OG.height}" fill="url(#bg)"/>
  <rect width="${OG.width}" height="${OG.height}" fill="url(#halo)"/>
  <rect x="0" y="0" width="6" height="${OG.height}" fill="#5ad3c6"/>

  <text x="80" y="196" font-family="Segoe UI, Arial, sans-serif" font-size="24"
        fill="#8ba1b8" letter-spacing="5">BRASILIA, DF — BRASIL</text>

  <text x="80" y="292" font-family="Segoe UI, Arial, sans-serif" font-size="76"
        font-weight="700" fill="#e9eff6">Guilherme Pereira</text>

  <text x="80" y="360" font-family="Segoe UI, Arial, sans-serif" font-size="36"
        fill="#a4b8cc">Desenvolvedor Full Stack</text>
  <text x="80" y="410" font-family="Segoe UI, Arial, sans-serif" font-size="36"
        font-weight="600" fill="#5ad3c6">Mobile &amp; Backend</text>

  <text x="80" y="516" font-family="Consolas, monospace" font-size="24"
        fill="#8ba1b8">React · TypeScript · PostgreSQL · Flutter</text>
  <text x="80" y="556" font-family="Consolas, monospace" font-size="24"
        fill="#5d6e82">github.com/guilhermegpo</text>
</svg>`;

/** Máscara de cantos arredondados para a foto. */
const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO}" height="${PHOTO}">
  <rect width="${PHOTO}" height="${PHOTO}" rx="28" fill="#fff"/>
</svg>`;

const photo = await sharp(new URL('../src/assets/guilherme.png', import.meta.url).pathname.slice(1))
  .resize(PHOTO, PHOTO, { fit: 'cover' })
  .composite([{ input: Buffer.from(mask), blend: 'dest-in' }])
  .png()
  .toBuffer();

const og = await sharp(Buffer.from(background))
  .composite([{ input: photo, left: OG.width - PHOTO - 90, top: (OG.height - PHOTO) / 2 }])
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(url('og-image.png'), og);
console.log(`og-image.png        ${OG.width}x${OG.height}  ${(og.length / 1024).toFixed(1)} KB`);

/* ------------------------------------------------------ ícone de atalho -- */

const iconSize = 180;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}">
  <rect width="${iconSize}" height="${iconSize}" rx="40" fill="#0f766e"/>
  <text x="${iconSize / 2}" y="${iconSize * 0.66}" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif" font-size="82" font-weight="700"
        fill="#ffffff">GP</text>
</svg>`;

const touch = await sharp(Buffer.from(icon)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(url('apple-touch-icon.png'), touch);
console.log(`apple-touch-icon.png  ${iconSize}x${iconSize}  ${(touch.length / 1024).toFixed(1)} KB`);
