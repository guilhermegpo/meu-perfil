# meu-perfil

Portfólio profissional de Guilherme Pereira de Oliveira.

**Site:** https://guilhermegpo.github.io/meu-perfil/

[![CI](https://github.com/guilhermegpo/meu-perfil/actions/workflows/ci.yml/badge.svg)](https://github.com/guilhermegpo/meu-perfil/actions/workflows/ci.yml)
[![Deploy](https://github.com/guilhermegpo/meu-perfil/actions/workflows/deploy.yml/badge.svg)](https://github.com/guilhermegpo/meu-perfil/actions/workflows/deploy.yml)

---

## O que é

Site estático de uma página, gerado em build. Apresenta trajetória, tecnologias
e projetos, com foco em performance, acessibilidade e SEO.

## Decisões técnicas

Cada escolha aqui foi feita por um motivo, e o motivo está registrado.

### Astro em vez de React ou HTML puro

O site tem seis seções de conteúdo majoritariamente estático. Uma SPA carregaria
um framework inteiro no navegador para renderizar texto que nunca muda — e
pagaria isso em SEO, já que o conteúdo só existiria depois do JavaScript rodar.

HTML puro resolveria a performance, mas duplicaria markup e misturaria dados com
apresentação.

Astro gera HTML em build e não envia JavaScript de framework ao cliente. O único
JavaScript que chega ao navegador são os poucos bytes do alternador de tema.
Componentes e dados ficam separados sem custo em runtime.

### Dados versionados em vez da API do GitHub

O portfólio poderia buscar os projetos pela API do GitHub. Não busca.

Para um punhado de projetos que mudam pouco, isso adicionaria dependência de
rede, limite de requisições e um modo de falha visível ao visitante — sem ganho
real. Os dados moram em `src/data/`, tipados e versionados junto ao código.

### Tema com três estados

Claro explícito, escuro explícito e "seguir o sistema". A preferência escolhida
é gravada em `localStorage` e aplicada antes da primeira pintura, por um script
inline síncrono — caso contrário haveria um flash de tema claro em quem escolheu
escuro.

### Acessibilidade verificada, não presumida

Todos os 28 pares de cor do sistema (texto sobre fundo, cartão e superfície
sutil, nos dois temas) foram medidos contra o critério WCAG AA de 4.5:1. O pior
caso é 4.56:1. Há também link de pular para o conteúdo, foco visível, HTML
semântico e respeito a `prefers-reduced-motion`.

## Stack

| Camada | Escolha |
|---|---|
| Gerador de site | Astro |
| Linguagem | TypeScript |
| Estilos | CSS com custom properties, sem framework |
| Imagem social | Gerada por script com `sharp` |
| CI | GitHub Actions — checagem de tipos e build |
| Hospedagem | GitHub Pages |

## Estrutura

```text
src/
├── components/   Seções da página, cada uma com seu CSS com escopo
├── data/         Conteúdo tipado — perfil, tecnologias, projetos, trajetória
├── layouts/      Documento base: metadados, SEO, dados estruturados
├── lib/          Utilitários (normalização do base path)
├── pages/        Rotas
└── styles/       Tokens de design e estilos globais

public/           Assets servidos como estão
scripts/          Geração da imagem de compartilhamento social
legacy/           Primeira versão do site, preservada e sanitizada
```

## Rodando localmente

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # gera dist/
npm run preview  # serve o build
npm run check    # checagem de tipos
```

Requer Node.js 22 ou superior.

Para regerar a imagem de compartilhamento social após alterar nome ou cargo:

```bash
node scripts/generate-og-image.mjs
```

## Fluxo de trabalho

- `main` — código publicável. Todo push dispara o deploy.
- `develop` — integração do desenvolvimento.
- `feature/*`, `fix/*`, `docs/*`, `refactor/*` — trabalho em andamento.

Commits seguem [Conventional Commits](https://www.conventionalcommits.org/).

## Privacidade

Este repositório é público e não contém dados pessoais sensíveis. Não há data de
nascimento, endereço, telefone nem e-mail pessoal — no código, no conteúdo ou
nos metadados dos commits. O contato acontece por canais profissionais públicos.

A primeira versão do site continha alguns desses dados. Ela foi preservada em
[`legacy/`](legacy/) apenas após sanitização; o que foi removido e por quê está
documentado em [`legacy/README.md`](legacy/README.md).

## Licença

Código sob [MIT](LICENSE). Conteúdo, textos e imagens pessoais têm direitos
reservados — ver [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
