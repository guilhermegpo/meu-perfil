/**
 * Gera public/og-image.png a partir de um SVG.
 *
 * A imagem de compartilhamento social é estática e muda muito pouco, então é
 * gerada por script e versionada — em vez de rodar a cada build. Executar com:
 *
 *   node scripts/generate-og-image.mjs
 *
 * `sharp` já vem como dependência do Astro; não foi adicionado por causa disso.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0c10"/>
      <stop offset="100%" stop-color="#191c2b"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="0" y="0" width="8" height="${HEIGHT}" fill="#a5b4fc"/>

  <text x="88" y="238" font-family="Segoe UI, Arial, sans-serif" font-size="30"
        fill="#7b8194" letter-spacing="4">BRASILIA, DF — BRASIL</text>

  <text x="88" y="322" font-family="Segoe UI, Arial, sans-serif" font-size="66"
        font-weight="700" fill="#edeef2">Guilherme Pereira</text>
  <text x="88" y="396" font-family="Segoe UI, Arial, sans-serif" font-size="66"
        font-weight="700" fill="#edeef2">de Oliveira</text>

  <text x="88" y="466" font-family="Segoe UI, Arial, sans-serif" font-size="34"
        fill="#a3a9b8">Desenvolvedor Full Stack <tspan fill="#a5b4fc">— Mobile &amp; Backend</tspan></text>

  <text x="88" y="548" font-family="Consolas, monospace" font-size="26"
        fill="#7b8194">github.com/guilhermegpo</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(new URL('../public/og-image.png', import.meta.url), png);
console.log(`og-image.png gerado — ${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB`);
