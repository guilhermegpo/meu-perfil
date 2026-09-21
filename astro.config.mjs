// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// O site é publicado como GitHub Pages de projeto, então mora em um subcaminho.
// `site` + `base` garantem URLs absolutas corretas no sitemap e nas meta tags.
export default defineConfig({
  site: 'https://guilhermegpo.github.io',
  base: '/meu-perfil',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  // O case do sistema de gestão de cursos ganhou um endereço neutro; o antigo continua
  // respondendo, para não quebrar links já publicados.
  redirects: {
    '/projetos/sistema-ila-fab': '/meu-perfil/projetos/sistema-gestao-cursos',
  },
  build: {
    inlineStylesheets: 'always',
  },
});
