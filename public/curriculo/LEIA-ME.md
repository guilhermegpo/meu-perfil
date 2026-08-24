# Currículo em PDF

Coloque o arquivo nesta pasta com exatamente este nome:

```text
Guilherme-Pereira-Desenvolvedor-Full-Stack-Junior.pdf
```

O botão "Baixar currículo" aparece sozinho no hero e na seção de contato assim
que o arquivo existir — a checagem acontece em tempo de build, em
`src/lib/resume.ts`. Não há nenhuma configuração para alterar.

Sem o arquivo, o botão simplesmente não é renderizado, de modo que o site nunca
mostra um link quebrado.

Para trocar o nome do arquivo, altere `resumeFile` em `src/data/profile.ts`.
