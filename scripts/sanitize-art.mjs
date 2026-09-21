/**
 * Gera versões públicas e sanitizadas de ilustrações de projetos privados.
 *
 *   npm run sanitize
 *
 * Lê `scripts/sanitize-art.local.json` (ignorado pelo Git; modelo em
 * `sanitize-art.example.json`). Lá ficam os arquivos de origem, as coordenadas
 * das máscaras e os textos de troca — informações que nomeiam o material
 * original e por isso não entram neste repositório público.
 *
 * Cada trabalho tem: `source`, `name`, `crop` opcional e `patches`. Os patches
 * são aplicados em ordem, sobre os pixels, e o arquivo publicado nunca contém
 * o conteúdo original por baixo (não há camadas, só pixels já substituídos):
 *
 *   blur   borra a região (sigma) — para texto pequeno ou logotipo ao fundo
 *   fill   reconstrói a região interpolando as bordas (`color: "auto"`), usa uma cor fixa
 *          ou a cor plana de um ponto limpo (`sample: [x, y]`)
 *   svg    desenha SVG por cima, na resolução da fonte — texto e ícones genéricos
 *
 * Saída em `public/assets/projects/{name}-hero-{640,1024,1672}.{avif,webp}`.
 * Nenhum PNG original é copiado para o repositório.
 */
import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rel = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const config = JSON.parse(await readFile(rel('scripts/sanitize-art.local.json'), 'utf8').catch(() => 'null'));
if (!config) {
  process.stderr.write('Crie scripts/sanitize-art.local.json (veja sanitize-art.example.json).\n');
  process.exit(1);
}

const outDir = rel('public/assets/projects');
await mkdir(outDir, { recursive: true });
const sourceDir = path.resolve(rel(''), config.sourceDir ?? '..');

/**
 * Preenchimento que reconstrói a região a partir das bordas: interpola
 * bilinearmente as cores das quatro margens (retalho de Coons). Em fundos
 * suaves — gradiente, vidro, tela clara — não deixa "caixa" visível.
 */
async function edgeFill(base, { x, y, w, h }, info, feather = 1.2) {
  const pad = 3;
  const left = Math.max(x - pad, 0);
  const top = Math.max(y - pad, 0);
  const width = Math.min(w + pad * 2, info.width - left);
  const height = Math.min(h + pad * 2, info.height - top);
  const { data } = await sharp(base).extract({ left, top, width, height }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const ox = x - left;
  const oy = y - top;
  const at = (i, j) => {
    const k = (j * width + i) * 3;
    return [data[k], data[k + 1], data[k + 2]];
  };
  const mean = (list) => [0, 1, 2].map((c) => list.reduce((acc, px) => acc + px[c], 0) / list.length);
  const L = [];
  const R = [];
  const T = [];
  const B = [];
  for (let j = 0; j < h; j += 1) {
    L.push(mean(Array.from({ length: ox }, (_, i) => at(i, oy + j))));
    R.push(mean(Array.from({ length: pad }, (_, i) => at(ox + w + i, oy + j))));
  }
  for (let i = 0; i < w; i += 1) {
    T.push(mean(Array.from({ length: oy }, (_, j) => at(ox + i, j))));
    B.push(mean(Array.from({ length: pad }, (_, j) => at(ox + i, oy + h + j))));
  }
  const corner = (a, b) => [0, 1, 2].map((c) => (a[c] + b[c]) / 2);
  const TL = corner(L[0], T[0]);
  const TR = corner(R[0], T[w - 1]);
  const BL = corner(L[h - 1], B[0]);
  const BR = corner(R[h - 1], B[w - 1]);
  const out = Buffer.alloc(w * h * 3);
  for (let j = 0; j < h; j += 1) {
    const v = (j + 0.5) / h;
    for (let i = 0; i < w; i += 1) {
      const u = (i + 0.5) / w;
      for (let c = 0; c < 3; c += 1) {
        const value =
          (1 - u) * L[j][c] + u * R[j][c] + (1 - v) * T[i][c] + v * B[i][c] -
          ((1 - u) * (1 - v) * TL[c] + u * (1 - v) * TR[c] + (1 - u) * v * BL[c] + u * v * BR[c]);
        // Ruído leve: a arte tem granulado, e um retalho liso vira uma "caixa" visível.
        const grain = (Math.random() - 0.5) * 6;
        out[(j * w + i) * 3 + c] = Math.max(0, Math.min(255, Math.round(value + grain)));
      }
    }
  }
  let patch = sharp(out, { raw: { width: w, height: h, channels: 3 } });
  if (feather > 0) patch = patch.blur(feather);
  return patch.png().toBuffer();
}

async function apply(base, patch, info) {
  const { x, y, w, h } = patch;
  if (patch.type === 'blur') {
    const region = await sharp(base).extract({ left: x, top: y, width: w, height: h }).blur(patch.sigma ?? 8).toBuffer();
    return sharp(base).composite([{ input: region, left: x, top: y }]).png().toBuffer();
  }
  if (patch.type === 'fill') {
    if (patch.color && patch.color !== 'auto') {
      const rect = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${patch.color}"/></svg>`,
      );
      return sharp(base).composite([{ input: rect, left: x, top: y }]).png().toBuffer();
    }
    if (patch.sample) {
      // Cor plana amostrada em um ponto limpo do mesmo painel (5 x 5 px).
      const [sx, sy] = patch.sample;
      const { data } = await sharp(base).extract({ left: sx - 2, top: sy - 2, width: 5, height: 5 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const avg = [0, 1, 2].map((c) => Math.round(Array.from({ length: 25 }, (_, k) => data[k * 3 + c]).reduce((x, y) => x + y, 0) / 25));
      const flat = Buffer.alloc(w * h * 3);
      for (let k = 0; k < w * h; k += 1) {
        const grain = (Math.random() - 0.5) * 6;
        for (let c = 0; c < 3; c += 1) flat[k * 3 + c] = Math.max(0, Math.min(255, Math.round(avg[c] + grain)));
      }
      const input = await sharp(flat, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
      return sharp(base).composite([{ input, left: x, top: y }]).png().toBuffer();
    }
    const input = await edgeFill(base, patch, info, patch.feather ?? 1.2);
    return sharp(base).composite([{ input, left: x, top: y }]).png().toBuffer();
  }
  if (patch.type === 'svg') {
    const overlay = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}" font-family="Segoe UI, Arial, sans-serif">${patch.svg}</svg>`,
    );
    return sharp(base).composite([{ input: overlay, left: 0, top: 0 }]).png().toBuffer();
  }
  throw new Error(`Patch desconhecido: ${patch.type}`);
}

for (const job of config.jobs) {
  const source = path.join(sourceDir, job.source);
  let base = await sharp(source).png().toBuffer();
  const info = await sharp(base).metadata();

  for (const patch of job.patches) base = await apply(base, patch, info);

  let image = sharp(base);
  if (job.crop) image = image.extract(job.crop);
  const finished = await image.png().toBuffer();
  if (job.preview) await writeFile(path.resolve(sourceDir, job.preview), finished);

  const meta = await sharp(finished).metadata();
  for (const width of [640, 1024, 1672]) {
    for (const ext of ['avif', 'webp']) {
      const out = sharp(finished).resize({ width });
      const buffer = await (ext === 'avif' ? out.avif({ quality: 58, effort: 6 }) : out.webp({ quality: 86 })).toBuffer();
      const file = path.join(outDir, `${job.name}-hero-${width}.${ext}`);
      await writeFile(file, buffer);
      process.stdout.write(`${path.relative(rel(''), file).replace(/\\/g, '/').padEnd(56)} ${(buffer.length / 1024).toFixed(1)} KB\n`);
    }
  }
  process.stdout.write(`${job.name}: ${meta.width}x${meta.height}\n`);
}
