# Currículo público

O currículo em PDF é fornecido manualmente e não deve conter telefone,
endereço residencial ou outros dados pessoais desnecessários para a finalidade
profissional.

Quando a versão sanitizada estiver disponível, coloque o arquivo em:

```text
public/curriculo/Guilherme-Pereira-Desenvolvedor-Full-Stack-Junior.pdf
```

O botão de download aparece automaticamente no hero e na seção de contato. A
checagem acontece durante o build em `src/lib/resume.ts`; sem o arquivo, nenhum
link é renderizado.

Antes de publicar:

- revisar visualmente todas as páginas e os metadados do PDF;
- confirmar a ausência de dados pessoais excessivos;
- executar `npm ci`, `npm run check`, `npm run build` e `npm run verify`;
- confirmar HTTP 200 no link publicado;
- executar Lighthouse e verificar ausência de regressão.

Para trocar o nome esperado, altere `resumeFile` em `src/data/profile.ts`.
