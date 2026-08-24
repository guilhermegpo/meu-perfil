# Versão histórica

Primeira versão deste portfólio: uma página única em HTML e CSS, publicada em
abril de 2026 e escrita à mão, sem framework nem build.

Está preservada aqui como registro da evolução do projeto. **Não faz parte do
site publicado** — o site atual é gerado a partir de `src/`.

## Sanitização

Antes de ser preservada, esta versão teve removidos os dados pessoais que não
devem constar em um repositório público:

| Removido | Motivo |
|---|---|
| Data de nascimento e idade | Dado pessoal; combinado a nome completo, é material de engenharia social |
| Cidade natal | Dado pessoal desnecessário em contexto profissional |
| E-mail pessoal em `mailto:` | Alvo de coleta automatizada; contato passou a ser via LinkedIn |
| Data de incorporação militar | Informação específica desnecessária |
| Imagem hospedada em serviço externo | Substituída por cópia versionada no repositório |

O restante do conteúdo e todo o CSS original foram mantidos sem alteração.

## O que esta versão já acertava

- HTML semântico (`nav`, `section`, `h1`/`h2`), `lang` e `meta viewport` corretos
- Layout responsivo com `media query` real, não apenas largura fluida
- Texto alternativo na imagem
- Tipografia e paleta consistentes

## O que motivou a reescrita

- Conteúdo pessoal em vez de profissional — não comunicava competência técnica
- Ausência de metadados de SEO e de compartilhamento social
- CSS inline em `<style>`, sem separação de responsabilidades
- Sem tema claro/escuro e sem verificação de contraste
- Sem processo de build, testes ou deploy automatizado
