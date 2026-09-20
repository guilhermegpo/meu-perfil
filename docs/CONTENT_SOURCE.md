# Origem do conteúdo

Regra: **tudo que o site afirma precisa ter origem rastreável.** Este documento diz de onde vem
cada informação importante e como conferi-la. Se algo não está aqui, não deveria estar no site.

Nomes de pastas de repositórios privados ficam fora deste arquivo (e do Git): estão em
`scripts/repos.local.json`, ignorado pelo controle de versão.

## Projetos analisados

| Id no site | Projeto | Visibilidade | Como é apresentado |
| --- | --- | --- | --- |
| `controle-de-chaves` | Controle de Chaves | Privado, em uso por uma equipe real | Genérico: sem organização, sem telas, sem dados, sem link de código |
| `meu-chamado` | Meu Chamado | Público | Completo, com link para o repositório |
| `sistema-ila-fab` | Sistema de gestão de cursos | Privado, uso institucional | Genérico e com aviso de divulgação restrita |
| `sistema-de-escalas` | Sistema de escalas de serviço | Privado, uso interno | Genérico, apenas na lista "Todos os projetos" |
| `meu-perfil` | Este portfólio | Público | Completo |

Não existe projeto "Meu Financeiro" nos repositórios; por isso ele não aparece em lugar nenhum.

## Números calculados

Todos vêm de `src/data/evidence.generated.json`, gerado por `npm run evidence`
(`scripts/collect-evidence.mjs`). O coletor lê manifestos, migrações e workflows, **executa** as
suítes de teste e registra o resultado. Data do levantamento: campo `generatedAt` do JSON.

| Exibição | Como é obtida | Valor atual |
| --- | --- | --- |
| Testes automatizados | Soma do total reportado por `flutter test` e `vitest run` | 419 (300 + 119) |
| Projetos com testes | Projetos com ao menos um teste | 2 |
| Projetos analisados | Projetos em `PROJECTS` no coletor | 5 |
| Aplicações mobile | Projetos com plataforma mobile | 2 |
| Sistemas web | Projetos web, exceto o próprio site | 3 |
| Tecnologias | Itens do catálogo com evidência em ao menos um projeto | 24 |
| "N projetos" por tecnologia | Projetos em que a regra de detecção acertou | por item |
| Versão do Meu Chamado | Campo `version` do `pubspec.yaml` | 0.2.0-alpha.4 |
| ADRs | Arquivos numerados em `docs/adr` do Meu Chamado | 17 |
| Políticas RLS e funções SQL | Ocorrências de `create policy` / `create function` nas migrações | por projeto |
| Migrações do Controle de Chaves | Arquivos `.sql` em `supabase/migrations` | 33 |

As contagens de política e função contam declarações nas migrações, não o estado final do banco.

### Regras de detecção de tecnologia

Definidas em `collect-evidence.mjs`: dependência em `package.json` ou `pubspec.yaml`
(React, TypeScript, TanStack Router, Tailwind, Astro, Vite, Vitest, ESLint, Prettier, Capacitor,
Supabase, Riverpod, Drift); presença de pasta ou arquivo (Android, Edge Functions, Cloudflare
Workers, GitHub Actions); conteúdo das migrações (PostgreSQL, Row Level Security); manifesto
web (PWA); JavaScript = código-fonte `.js` sem TypeScript.

### Removido por falta de evidência

Não aparecem porque nenhum repositório os comprova: **Docker** (nenhum Dockerfile), **Postman**,
**IntelliJ IDEA**, **VS Code** (só uma lista de extensões recomendadas) e "APIs REST" como item
próprio (o acesso a dados é via Supabase). Se houver projeto que os use, inclua o repositório no
coletor e adicione a regra.

## Textos por seção

| Seção | Origem |
| --- | --- |
| Hero (status, cargo, frentes, descrição) | Informado pelo autor. Frentes Web, Mobile e Backend validadas na auditoria: Web (sistemas React e este site), Mobile (Flutter e Capacitor/Android), Backend (Supabase: SQL, RLS, funções transacionais, Edge Functions) |
| Painéis do hero | "domínio": modelo do Meu Chamado (Workspace, Membership, Role). "no banco": práticas do Controle de Chaves e dos sistemas web. "419 testes": evidência |
| Sobre | Síntese das práticas verificadas nos projetos; formação informada pelo autor. A nota sobre IA vem dos trailers de coautoria (`Co-Authored-By`) do histórico do Meu Chamado e do Controle de Chaves e do histórico da plataforma Lovable nos sistemas web |
| Experiência e formação | **Informadas pelo autor** (`experience.ts`, `education.ts`). Não são verificáveis pelo código; o único vínculo comprovável é o sistema de gestão de cursos existir e ter sido implantado |
| Cartões e cases | `projects.ts`, redigido a partir da documentação de cada projeto (tabela abaixo) |
| Stack | Evidência (acima) |
| Engenharia | `engineering.ts`, cada linha com a fonte abaixo |
| Contato | E-mail profissional público, já documentado no repositório e no README do perfil; LinkedIn e GitHub do autor |

## Fontes por case

### Controle de Chaves

| Afirmação | Fonte no projeto |
| --- | --- |
| Reconstruído de um APK de referência; código original indisponível | `docs/RECOVERY.md` |
| Substituiu backend baseado em Google Drive; Capacitor + Supabase | `README.md` |
| Saída e retorno com trava de linha e índice único parcial | `docs/DATABASE.md` (RPCs transacionais e tabela `movements`) |
| Quatro perfis, RLS em todas as tabelas, cliente sem escrita direta em `profiles` | `docs/DATABASE.md` (seção RLS) |
| Sessão: só o token no armazenamento seguro, biometria, senha nunca salva | `docs/SECURITY.md` |
| Credencial embutida no cliente legado tratada como comprometida | `docs/SECURITY.md` |
| Auditoria que o cliente não altera | `docs/DATABASE.md` (`audit_logs`) |
| Condição do veículo, conferência de pátio, locais configuráveis | `docs/DATABASE.md`; migrações de condição |
| Três tipos de operação; troca de motorização atômica; snapshot histórico | `docs/DATABASE.md` (seções code43 e code46) |
| Arquivar diferente de excluir; cadastro atômico com trava por placa | `docs/DATABASE.md` (seções code45 e code46) |
| Atualização obrigatória; liberação por usuário-alvo | `README.md` e `docs/RELEASE.md`; migração de releases direcionadas |
| Push e notificações | Edge Function de push e migração de assinaturas |
| PWA com service worker | `package.json` (script de build) e manifesto |
| Interface legada preservada (~4.300 linhas) | `docs/ARCHITECTURE.md`; registrada como dívida |
| Sem CI para a suíte | Ausência de workflow de testes (só build iOS) |
| Em uso por equipe real | Informado pelo autor |

Dados operacionais (tamanho da frota, nomes, usuários, projeto Supabase, organização): **não
publicados**.

### Meu Chamado

Fonte: `README.md`, `CHANGELOG.md`, `ROADMAP.md`, `BRAND.md`, `docs/adr/*`, `docs/architecture`,
`docs/security/threat-model.md`, `pubspec.yaml`, `.github/workflows/ci.yml` e o repositório
público. O domínio é descrito de forma neutra ("organização de responsabilidades e
acompanhamento de pessoas"); o projeto é independente e não oficial, como declara o repositório.
Itens do roadmap aparecem separados e marcados como não implementados.

### Sistema de gestão de cursos

Fonte: README técnico e estrutura do repositório privado (rotas, tabelas, dependências,
configuração de deploy). Publicado apenas: problema, natureza da solução, stack, arquitetura de
alto nível, contagens agregadas e a atuação do autor. **Não publicado:** telas, nomes de pessoas,
normas e estrutura internas, nome interno do sistema. O texto de problema e resultados vem do
README do perfil, escrito pelo autor. A ausência de testes e de CI foi constatada no repositório
e está declarada no case.

### Sistema de escalas de serviço

Fonte: estrutura do repositório privado (rotas, dependências, tabelas). O repositório não tem
README; por isso o projeto entra só na lista, sem case e sem citar instituição. **Pendência do
autor:** confirmar se pode ser citado e como.

### Este portfólio

Fonte: este repositório, `docs/PORTFOLIO_ARCHITECTURE.md` e as medições de Lighthouse ali registradas.

## Práticas de engenharia (seção "Como eu construo software")

| Prática | Evidência |
| --- | --- |
| Arquitetura / ADRs | 17 ADRs e `docs/architecture` do Meu Chamado; `docs/ARCHITECTURE.md` do Controle de Chaves |
| Testes | Suítes executadas pelo coletor |
| Segurança | RLS nos três sistemas com Supabase; PBKDF2, banco criptografado e `FLAG_SECURE` no Meu Chamado (ADR 0016 e README); `docs/SECURITY.md` do Controle de Chaves |
| Offline-first | ADR 0004 do Meu Chamado; manifestos PWA dos sistemas web |
| RBAC | ADR 0003; perfis do Controle de Chaves; tabelas de papéis e permissões nos sistemas web |
| Banco de dados | Migrações, índices únicos parciais e funções com trava de linha do Controle de Chaves |
| CI/CD | Workflows do Meu Chamado, deste site e do Controle de Chaves (build iOS) |
| Status checks obrigatórios | Rulesets do GitHub nos repositórios públicos (consultados com `gh api`); a `main` do Meu Chamado e deste site os exigem, e `develop` só no Meu Chamado |
| Versionamento | Tags SemVer, `CHANGELOG.md` e histórico de commits |
| Documentação | Documentos citados acima; regra "README desatualizado é defeito" no README técnico do sistema de cursos |
| UX e acessibilidade | `scripts/verify.mjs` deste site |
| Performance | Medições deste site; script de profiling do Controle de Chaves |

## Divulgação de uso de IA

O histórico do Meu Chamado (46 de 90 commits) e do Controle de Chaves (43 de 64) traz coautoria de
um assistente de IA; os dois sistemas web foram gerados na plataforma Lovable (quase todos os
commits têm o autor `gpt-engineer-app[bot]`). O site declara isso em Sobre e em cada case. As
frases sobre o que fica com o autor (requisitos, revisão, validação, decisões) são declaração
do autor e devem ser revistas por ele.

## Pendências de confirmação

- Redação da atuação em cada case (inferida da documentação; revisar).
- Nome e menção institucional do sistema de escalas.
- Currículo em PDF: `public/curriculo/` (o botão aparece sozinho quando o arquivo existir).
- Versão vetorial da marca GPO.
