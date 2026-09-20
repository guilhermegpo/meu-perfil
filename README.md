# meu-perfil

Portfólio profissional de Guilherme Pereira de Oliveira — GPO.

**Site:** <https://guilhermegpo.github.io/meu-perfil/>

[![CI](https://github.com/guilhermegpo/meu-perfil/actions/workflows/ci.yml/badge.svg)](https://github.com/guilhermegpo/meu-perfil/actions/workflows/ci.yml)
[![Deploy](https://github.com/guilhermegpo/meu-perfil/actions/workflows/deploy.yml/badge.svg)](https://github.com/guilhermegpo/meu-perfil/actions/workflows/deploy.yml)

## O que é

Site estático em Astro: tema escuro premium, composição 3D feita só com CSS, cases individuais e
uma stack calculada a partir dos repositórios, não digitada. O navegador recebe HTML, CSS e um
módulo TypeScript pequeno. Não há framework hidratado nem biblioteca de 3D.

## Princípios

- **Tudo comprovável.** Números e tecnologias vêm de um JSON gerado a partir dos repositórios.
- **Privado fica privado.** Sistemas restritos aparecem de forma genérica: sem telas, dados, nomes
  ou links. Testes automáticos barram segredos e termos internos.
- **Movimento é opcional.** Tilt, parallax e animações respeitam `prefers-reduced-motion` e
  desligam em dispositivos modestos; nada depende de mouse.
- **A marca é assinatura.** O monograma GPO oficial nunca é redesenhado nem distorcido.

## Documentação

- [Arquitetura](docs/PORTFOLIO_ARCHITECTURE.md): infraestrutura, deploy, fluxo de conteúdo, 3D, SEO e medições
- [Design system](docs/DESIGN_SYSTEM.md): cores, tipografia, camadas 3D e guia de uso da marca
- [Origem do conteúdo](docs/CONTENT_SOURCE.md): de onde vem cada informação exibida

## Rodando localmente

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # gera dist/
npm run preview   # serve o build
```

Requer Node.js 22 ou superior.

## Verificação

```bash
npm run check     # tipos
npm run lint      # ESLint
npm run build
npm test          # testes de conteúdo e segurança (depois do build)
npm run verify    # contraste, metadados, estrutura, links, sitemap (depois do build)
```

O CI roda tudo isso em cada pull request e antes de cada deploy.

## Tarefas ocasionais

```bash
npm run evidence  # recalcula stack, testes e métricas a partir dos repositórios locais
npm run brand     # regera favicon, ícones e Open Graph a partir do master da logo
npm run banner    # regera o banner do perfil do GitHub
npm run fonts     # rebaixa as fontes
```

`npm run evidence` lê repositórios vizinhos, alguns privados, e executa as suítes de teste. Os
nomes de pastas privadas ficam em `scripts/repos.local.json` (ignorado pelo Git; modelo em
`scripts/repos.example.json`).

## Currículo

O PDF não é versionado. Coloque-o em `public/curriculo/` com o nome definido em `resumeFile`
(`src/data/profile.ts`). O botão "Currículo" aparece sozinho quando o arquivo existir; sem ele,
nenhum link quebrado é renderizado.

## Fluxo de trabalho

- `main` — código publicável. Todo push dispara o deploy. Exige pull request e o check
  "Verificar tipos e build".
- `develop` — integração.
- `feature/*`, `fix/*`, `docs/*` — trabalho em andamento. Commits seguem
  [Conventional Commits](https://www.conventionalcommits.org/).

## Privacidade

Repositório público sem dados pessoais sensíveis: nada de data de nascimento, endereço ou telefone
no código, no conteúdo ou nos metadados dos commits. O e-mail exibido é profissional e foi criado
para uso público. A primeira versão do site foi preservada, sanitizada, em [`legacy/`](legacy/).

## Licença

Código sob [MIT](LICENSE). Textos, imagens pessoais e a marca GPO têm direitos reservados — ver
[LICENSE-CONTENT.md](LICENSE-CONTENT.md).
