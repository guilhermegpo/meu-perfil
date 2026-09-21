/**
 * Organiza e otimiza os assets oficiais do portfólio.
 *
 *   npm run assets
 *
 * Fontes oficiais (pasta acima deste repositório):
 *   Foto.png
 *   Imagem Ilustrativa - Meu Chamado.png | Meu Financeiro.png | Meu Treino.png
 *
 * Masters, fora de `public/` (não são servidos):
 *   assets-source/profile/foto-oficial.png   original, preservado (pixels idênticos)
 *   assets-source/projects/{app}-hero.png    original, preservado
 *
 * Saídas servidas, em `public/assets/`:
 *   profile/foto-{480,960}.{avif,webp} e foto-960.jpg  retrato 4:5 para o card do Sobre
 *   profile/avatar-{96,192}.{avif,webp} e avatar-192.jpg  recorte quadrado do rosto
 *   projects/{app}-hero-{640,1024,1672}.{avif,webp}
 *
 * O JPG existe só onde é necessário: foto-960.jpg é a imagem de compartilhamento
 * (og:image) e avatar-192.jpg é o `src` de fallback do <img>.
 *
 * A foto oficial vem com extensão .png mas é um JPEG; o original é regravado
 * como PNG sem perda para a extensão dizer a verdade. Nenhuma imagem é
 * redesenhada, redimensionada para cima ou recolorida: só recorte e exportação.
 */
import sharp from 'sharp';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rel = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const SRC = rel('..');
const OUT = rel('public/assets');
const MASTERS = rel('assets-source');

const exists = (p) => access(p).then(() => true, () => false);
const log = (file, info) => process.stdout.write(`${path.relative(rel(''), file).replace(/\\/g, '/').padEnd(52)} ${info}\n`);

async function emit(image, file, options = {}) {
  const ext = path.extname(file).slice(1);
  const pipeline =
    ext === 'avif' ? image.avif({ quality: options.quality ?? 55, effort: 6 })
    : ext === 'webp' ? image.webp({ quality: options.quality ?? 84 })
    : ext === 'jpg' ? image.jpeg({ quality: options.quality ?? 86, mozjpeg: true })
    : image.png({ compressionLevel: 9 });
  const buffer = await pipeline.toBuffer();
  await writeFile(file, buffer);
  log(file, `${(buffer.length / 1024).toFixed(1)} KB`);
}

/* ------------------------------------------------------------------ foto -- */

const photoSource = path.join(SRC, 'Foto.png');
if (await exists(photoSource)) {
  const dir = path.join(OUT, 'profile');
  await mkdir(dir, { recursive: true });

  const base = sharp(photoSource).rotate(); // respeita EXIF
  const masterDir = path.join(MASTERS, 'profile');
  await mkdir(masterDir, { recursive: true });
  await emit(base.clone(), path.join(masterDir, 'foto-oficial.png'));

  // Retrato 4:5, largura do card do Sobre (até ~24rem, com densidade 2x).
  for (const width of [480, 960]) {
    for (const ext of ['avif', 'webp', ...(width === 960 ? ['jpg'] : [])]) {
      await emit(base.clone().resize({ width }), path.join(dir, `foto-${width}.${ext}`));
    }
  }

  // Avatar: quadrado centrado no rosto (a foto tem 1229 x 1536; o rosto fica no terço superior).
  const face = { left: 250, top: 70, width: 760, height: 760 };
  for (const size of [96, 192]) {
    for (const ext of ['avif', 'webp', ...(size === 192 ? ['jpg'] : [])]) {
      await emit(base.clone().extract(face).resize(size, size), path.join(dir, `avatar-${size}.${ext}`));
    }
  }
}

/* ------------------------------------------------------ imagens ilustrativas -- */

const apps = [
  ['meu-chamado', 'Imagem Ilustrativa - Meu Chamado.png'],
  ['meu-financeiro', 'Imagem Ilustrativa - Meu Financeiro.png'],
  ['meu-treino', 'Imagem Ilustrativa - Meu Treino.png'],
];

const projectsDir = path.join(OUT, 'projects');
await mkdir(projectsDir, { recursive: true });

for (const [slug, file] of apps) {
  const source = path.join(SRC, file);
  if (!(await exists(source))) continue;
  const base = sharp(source);
  const masterDir = path.join(MASTERS, 'projects');
  await mkdir(masterDir, { recursive: true });
  await emit(base.clone(), path.join(masterDir, `${slug}-hero.png`));
  for (const width of [640, 1024, 1672]) {
    for (const ext of ['avif', 'webp']) {
      await emit(base.clone().resize({ width, withoutEnlargement: true }), path.join(projectsDir, `${slug}-hero-${width}.${ext}`), {
        quality: ext === 'avif' ? 58 : 86,
      });
    }
  }
}
