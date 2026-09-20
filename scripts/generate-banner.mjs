/**
 * Gera o banner do perfil do GitHub a partir da logo oficial já recortada.
 *
 *   npm run banner
 *
 * Entrada: public/brand/gpo-logo.png (gerada por `npm run brand`)
 * Saída:   ../guilhermegpo/assets/banner.png, se o repositório do perfil
 *          existir ao lado; caso contrário, public/brand/github-banner.png.
 *
 * O banner compartilha paleta, grade e composição com o site e com a imagem
 * Open Graph. Um único arquivo escuro serve aos dois temas do GitHub.
 */
import sharp from 'sharp';
import { access, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const rel = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const W = 1600;
const H = 480;

const profileAssets = rel('../guilhermegpo/assets');
const target = await access(profileAssets).then(
  () => `${profileAssets}/banner.png`,
  () => rel('public/brand/github-banner.png'),
);

const vLines = Array.from({ length: 17 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${H}"/>`).join('');
const hLines = Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${W}" y2="${i * 100}"/>`).join('');

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#06090e"/><stop offset="1" stop-color="#0e1621"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.2" cy="0.5" r="0.45">
      <stop offset="0" stop-color="#78bdf2" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#78bdf2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#06090e" stop-opacity="0"/>
      <stop offset="1" stop-color="#06090e" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g stroke="#ffffff" stroke-opacity="0.04">${vLines}${hLines}</g>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect y="330" width="100%" height="150" fill="url(#fade)"/>

  <rect x="600" y="118" width="44" height="3" fill="#78bdf2"/>
  <text x="600" y="168" font-family="Segoe UI, Arial, sans-serif" font-size="22" letter-spacing="6" fill="#93a4b8">FULL STACK DEVELOPER</text>
  <text x="600" y="256" font-family="Segoe UI, Arial, sans-serif" font-size="58" font-weight="700" fill="#f4f7fa">Guilherme Pereira de Oliveira</text>
  <text x="600" y="324" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="600" fill="#78bdf2">Web  •  Mobile  •  Backend</text>
  <text x="600" y="392" font-family="Consolas, monospace" font-size="22" fill="#6f8096">guilhermegpo.github.io/meu-perfil</text>
</svg>`);

const mark = await sharp(rel('public/brand/gpo-logo.png')).resize({ width: 400 }).png().toBuffer();
const { height: markH } = await sharp(mark).metadata();
const markTop = Math.round((H - markH) / 2) - 12;

const reflection = await sharp(mark)
  .flip()
  .composite([
    {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${markH}"><defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#m)"/></svg>`,
      ),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

const banner = await sharp(background)
  .composite([
    { input: reflection, left: 110, top: markTop + markH + 10 },
    { input: mark, left: 110, top: markTop },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(target, banner);
process.stdout.write(`${target}  ${W}x${H}  ${(banner.length / 1024).toFixed(1)} KB\n`);
