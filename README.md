# meu-perfil

Portfólio profissional de Guilherme Pereira de Oliveira.

**Site:** https://guilhermegpo.github.io/meu-perfil/

[![CI](https://github.com/guilhermegpo/meu-perfil/actions/workflows/ci.yml/badge.svg)](https://github.com/guilhermegpo/meu-perfil/actions/workflows/ci.yml)
[![Deploy](https://github.com/guilhermegpo/meu-perfil/actions/workflows/deploy.yml/badge.svg)](https://github.com/guilhermegpo/meu-perfil/actions/workflows/deploy.yml)

---

## O que é

Site estático gerado em build. Apresenta trajetória profissional, stack e
projetos — estes últimos como cases, com página própria para cada um.

Lighthouse 100/100/100/100 em desktop e mobile, com acessibilidade verificada
por script no CI.

## Decisões técnicas

Cada escolha aqui foi feita por um motivo, e o motivo está registrado.

### Astro em vez de React ou HTML puro

O site é conteúdo majoritariamente estático. Uma SPA carregaria um framework
inteiro no navegador para renderizar texto que nunca muda — e pagaria isso em
SEO, já que o conteúdo só existiria depois do JavaScript rodar.

HTML puro resolveria a performance, mas duplicaria markup e misturaria dados
com apresentação.

Astro gera HTML em build e não envia JavaScript de framework ao cliente. O que
chega ao navegador são três blocos pequenos: alternador de tema, menu de telas
pequenas e revelação de conteúdo ao rolar.

### Cases com página própria, não modal

A maioria dos portfólios abre o detalhe do projeto em modal. Modal não tem URL
para mandar a um recrutador, não é indexado por buscador e quebra o botão
voltar.

Cada case é uma rota real gerada em build — `/projetos/{slug}` — com título,
descrição e dados estruturados próprios.

### Fontes servidas do próprio domínio

A folha do Google Fonts era o único recurso bloqueando a primeira renderização.
Medido pelo Lighthouse em rede móvel lenta, custava cerca de 1,9 s.

`npm run fonts` baixa os arquivos WOFF2 para `src/assets/fonts/`, mantendo só
os subconjuntos latin e latin-ext. O resultado: primeiro desenho caiu de 2,7 s
para 1,2 s, e a página não faz nenhuma requisição a terceiros.

### Dados versionados em vez da API do GitHub

O portfólio poderia buscar os projetos pela API do GitHub. Não busca.

Para um punhado de projetos que mudam pouco, isso adicionaria dependência de
rede, limite de requisições e um modo de falha visível ao visitante — sem ganho
real. Os dados moram em `src/data/`, tipados e versionados junto ao código.

### Sem percentual de habilidade

`React 90%` é um número que ninguém consegue justificar e que qualquer
entrevistador desmonta em duas perguntas. A stack marca apenas se a tecnologia
foi usada em projeto entregue ou está em uso de aprendizado — as duas
afirmações são verificáveis.

### Acessibilidade verificada, não presumida

`npm run verify` lê os tokens de cor direto do `global.css` e mede cada par de
texto sobre fundo contra o critério WCAG AA. Ler do CSS em vez de manter uma
cópia dos valores é o ponto: a verificação não pode divergir do que o site
realmente usa.

O mesmo script confere os metadados de SEO de cada página gerada e valida que
todo link interno aponta para um arquivo que existe em `dist/`. Roda no CI a
cada pull request.

## Stack

| Camada | Escolha |
|---|---|
| Gerador de site | Astro |
| Linguagem | TypeScript |
| Estilos | CSS com custom properties, sem framework |
| Imagens | Pipeline do Astro — AVIF e WebP com srcset |
| Tipografia | Inter e Space Grotesk, servidas localmente |
| CI | GitHub Actions — tipos, build e verificação |
| Hospedagem | GitHub Pages |

## Estrutura

```text
src/
├── components/   Seções e cartões, cada um com seu CSS com escopo
├── data/         Conteúdo tipado — perfil, experiência, projetos, stack, formação
├── layouts/      Documento base: metadados, SEO, dados estruturados
├── lib/          Base path e detecção do currículo em build
├── pages/        Home e as rotas de case em /projetos/
└── styles/       Tokens de design e fontes

public/
├── curriculo/    Onde o PDF do currículo é colocado
└── ...           Favicon, imagem social, robots

scripts/
├── fetch-fonts.mjs      Baixa as fontes do Google para o repositório
├── generate-images.mjs  Cartão social e ícone de atalho
└── verify.mjs           Contraste, metadados e links

legacy/           Primeira versão do site, preservada e sanitizada
```

## Rodando localmente

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # gera dist/
npm run preview  # serve o build
npm run check    # checagem de tipos
npm run verify   # contraste, metadados e links (roda após o build)
```

Requer Node.js 22 ou superior.

Tarefas ocasionais:

```bash
npm run fonts    # rebaixa as fontes (após trocar família ou peso)
npm run images   # regenera cartão social e ícone (após trocar nome ou foto)
```

## Currículo

O PDF não é versionado. Coloque-o em `public/curriculo/` com o nome definido em
`resumeFile` (`src/data/profile.ts`).

O botão "Baixar currículo" aparece sozinho no hero e no contato quando o arquivo
existir — a checagem acontece em tempo de build, em `src/lib/resume.ts`. Sem o
arquivo, o botão não é renderizado e o site nunca mostra link quebrado.

## Fluxo de trabalho

- `main` — código publicável. Todo push dispara o deploy.
- `develop` — integração do desenvolvimento.
- `feature/*`, `fix/*`, `docs/*`, `refactor/*` — trabalho em andamento.

Commits seguem [Conventional Commits](https://www.conventionalcommits.org/).

## Privacidade

Este repositório é público e não contém dados pessoais sensíveis. Não há data de
nascimento, endereço nem telefone — no código, no conteúdo ou nos metadados dos
commits. O e-mail exibido é profissional e foi criado para uso público.

A primeira versão do site continha alguns desses dados. Ela foi preservada em
[`legacy/`](legacy/) apenas após sanitização; o que foi removido e por quê está
documentado em [`legacy/README.md`](legacy/README.md).

## Licença

Código sob [MIT](LICENSE). Conteúdo, textos e imagens pessoais têm direitos
reservados — ver [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
