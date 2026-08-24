import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { profile } from '../data/profile';
import { asset } from './url';

/**
 * O currículo em PDF é fornecido manualmente e não é versionado.
 *
 * Em vez de manter uma flag para alguém lembrar de virar quando o arquivo
 * chegar, a existência é checada em tempo de build — o frontmatter do Astro
 * roda em Node, então `fs` está disponível. Sem o arquivo, o botão
 * simplesmente não é renderizado, e não existe link quebrado no site.
 */
const resumePath = fileURLToPath(
  new URL(`../../public/curriculo/${profile.resumeFile}`, import.meta.url),
);

export const resumeAvailable = existsSync(resumePath);

export const resumeHref = asset(`curriculo/${profile.resumeFile}`);
