# Arquitetura do portfólio

Site estático gerado em build. Nenhum framework é enviado ao navegador: o que roda no cliente é
um único módulo TypeScript pequeno (navegação, revelação, parallax e tilt).

## Infraestrutura

| Item | Decisão |
| --- | --- |
| Gerador | Astro 7, saída estática |
| Linguagem | TypeScript (checagem com `astro check`) |
| Estilo | CSS com custom properties, escopo por componente, sem framework |
| Hospedagem | GitHub Pages de projeto: `https://guilhermegpo.github.io/meu-perfil/` |
| Caminho base | `/meu-perfil` (`astro.config.mjs`); assets passam por `asset()` em `src/lib/url.ts` |
| Deploy | Push em `main` → workflow `Deploy` (OIDC, `actions/deploy-pages`) |
| CI | Pull request para `main`/`develop` → workflow `CI`, job **"Verificar tipos e build"** |
| Ruleset da `main` | Exige pull request e o status check "Verificar tipos e build". **Não renomeie esse job** |
| Domínio | Sem domínio próprio; a compatibilidade com o deploy atual foi preservada |
| Node | 22 ou superior |

Nada disso mudou na reformulação: mesmo `site`, mesmo `base`, mesmos workflows, mesmas URLs de
case (`/projetos/{slug}`). Os workflows ganharam apenas as etapas `Lint` e `Testes`.

## Estrutura

```text
src/
├── assets/         Marca (master e recorte), fonte local, retrato
├── components/     Seções e peças; cada uma com seu CSS com escopo
├── data/           Conteúdo tipado + evidence.generated.json
├── layouts/        BaseLayout: SEO, Open Graph, JSON-LD, manifesto
├── lib/            Base path e detecção do currículo em build
├── pages/          index, 404 e projetos/[slug]
├── scripts/        env, nav, reveal, motion, main
└── styles/         global.css (tokens) e fonts.css

scripts/            collect-evidence, generate-brand, generate-assets, sanitize-art, generate-banner, verify, fetch-fonts
tests/              content.test.mjs (conteúdo e segurança)
public/             favicon, ícones, og-image, manifesto, robots, assets/ (marca, foto, projetos)
docs/               Esta documentação
legacy/             Primeira versão do site, sanitizada
```

## Fluxo de conteúdo

```text
repositórios locais ──npm run evidence──▶ evidence.generated.json ──▶ data/*.ts ──▶ componentes
   (5 projetos)        (executa testes)      (versionado no Git)        (tipados)      (build)
```

- O coletor lê manifestos, migrações, workflows e **executa** as suítes de teste. Só saem dele
  nomes de tecnologia, contagens e ids de projeto.
- O JSON é versionado, então o CI nunca depende dos outros repositórios (alguns são privados).
- Textos narrativos vivem em `src/data/projects.ts`; números vêm sempre do JSON.
- Para atualizar após mudar os projetos: `npm run evidence`, revisar o diff, commitar.

## Assets

```text
public/assets/
├── brand/      logo oficial recortada (png, webp), ícones 192/512, favicon, apple-touch
├── profile/    foto-oficial.png (original) + foto-{480,960}.{avif,webp,jpg} + avatar-{96,192}.*
└── projects/   {app}-hero.png (original) + {app}-hero-{640,1024,1672}.{avif,webp}
```

`npm run assets` lê a foto e as imagens ilustrativas da pasta acima do repositório e gera as
versões otimizadas; os originais são preservados (a foto vem como JPEG com extensão .png e é
regravada como PNG sem perda). O componente `Picture.astro` monta o `<picture>` com AVIF, WebP e
reserva, `srcset`, `sizes` e dimensões intrínsecas. Nenhuma imagem é redesenhada ou recolorida.

### Artes de projetos privados

`npm run sanitize` lê `scripts/sanitize-art.local.json` (ignorado pelo Git) e produz só as versões
públicas em `public/assets/projects`. Três operações, aplicadas sobre os pixels: `blur`, `fill`
(reconstrução das bordas, com granulado) e `svg` (texto e ícones genéricos no lugar de logotipos e
nomes). O arquivo publicado não guarda camadas: o conteúdo original não pode ser recuperado. O
teste de conteúdo barra a publicação de qualquer PNG original desses projetos.

## Casos de estudo

`src/pages/projetos/[slug].astro` gera uma rota por projeto que tem `caseStudy` (case completo) ou
`showcase` (página enxuta para apps ainda sem repositório publicado). Cada página traz
título, descrição, canonical, Open Graph e JSON-LD próprios (`SoftwareSourceCode` para
repositório público; `CreativeWork` para os demais; `BreadcrumbList`). Adicionar um projeto:

1. incluir o repositório em `PROJECTS` de `scripts/collect-evidence.mjs` e rodar `npm run evidence`;
2. incluir o objeto em `projects.ts` (com o mesmo `slug` do id do coletor);
3. atualizar `CONTENT_SOURCE.md`.

## 3D e movimento

- **Só CSS** para a composição: `perspective`, `preserve-3d`, `translateZ`, rotação e sombras em
  camadas. Three.js não foi usado porque o efeito não justifica centenas de kilobytes.
- **Módulos** (`src/scripts`): `env.ts` detecta capacidades; `motion.ts` faz parallax do hero,
  tilt dos cartões, spotlight que segue o cursor e o equivalente em toque; `nav.ts` cuida do
  header, do progresso de leitura, do scroll-spy, do sumário dos cases e do menu; `reveal.ts`
  revela blocos ao rolar; `count.ts` anima os números da faixa de métricas.
- **Regras de desempenho:** apenas `transform`/`opacity`; escrita em `requestAnimationFrame`
  (um quadro por evento, laço para quando nada muda); `IntersectionObserver` pausa a cena fora da
  viewport; nenhum listener de `scroll` no header (usa um sentinela); listeners de ponteiro só
  existem em dispositivos com mouse.
- **Fallbacks:** `prefers-reduced-motion`, `data-perf="lite"` (`saveData`, ≤ 2 GB de memória ou
  ≤ 2 núcleos), toque sem tilt, e conteúdo integral sem JavaScript.

## SEO

`title`, `description`, `canonical`, Open Graph (com imagem 1200 × 630 e `alt`), Twitter Card,
JSON-LD (`Person` e `WebSite` em todas as páginas), `sitemap-index.xml` (integração do Astro),
`robots.txt`, manifesto e ícones. A página 404 fica fora do sitemap.

## Qualidade

| Comando | O que faz |
| --- | --- |
| `npm run check` | Tipos (Astro + TypeScript) |
| `npm run lint` | ESLint (regras de TS, Astro e `no-console`) |
| `npm run build` | Gera `dist/` |
| `npm test` | Testes de conteúdo e segurança (segredos, nomes privados, consistência da evidência, home reflete a evidência) |
| `npm run verify` | Contraste WCAG lido do CSS, metadados, um h1, `alt`, JSON-LD, ausência de terceiros, âncoras, links, sitemap e OG |

### Medições (2026-09-20, build local servido em `astro preview`, Chrome headless)

| | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 97 | 100 | 100 | 100 |

Desktop: LCP 0,5 s, TBT 0 ms, CLS 0,001. Mobile: LCP 2,5 s, TBT 0 ms, CLS 0. São medições
locais; refaça no site publicado após o deploy.

## Segurança do conteúdo

Site público. Regras aplicadas e testadas em `tests/content.test.mjs`: nenhum segredo, nenhum arquivo de ambiente,
nenhuma URL de projeto Supabase, nenhum nome de organização privada, nenhum link para
repositório privado e nenhum `console.log`. Detalhes de cada projeto restrito em `CONTENT_SOURCE.md`.
