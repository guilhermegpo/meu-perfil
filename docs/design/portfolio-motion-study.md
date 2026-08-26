# Portfolio Motion Study

## Estado atual

O portfólio já parte de uma base sólida: HTML estático gerado pelo Astro,
conteúdo factual centralizado em arquivos tipados, identidade navy/teal, temas
claro e escuro, navegação por teclado, foco visível, menu móvel com Escape,
imagens responsivas, `prefers-reduced-motion` e verificação automatizada de
contraste, metadados e links internos.

O Lighthouse público registra 100 em Performance, Accessibility, Best Practices
e SEO antes deste refinamento. Esse resultado é a linha de base, não uma licença
para evitar evolução visual.

## Pontos fortes

- hierarquia textual clara e conteúdo fácil de escanear;
- cases que explicam problema, participação, solução e resultado;
- experiência ILA/FAB descrita sem expor sistema, telas ou dados internos;
- tipografia local, sem dependência de fontes em tempo de navegação;
- poucos scripts no cliente e nenhum framework hidratado;
- componentes pequenos, dados separados da apresentação e rotas previsíveis;
- estados de foco, contraste e redução de movimento já tratados.

## O que melhorar

- integrar a fotografia ao hero em vez de apresentá-la como um bloco isolado;
- diferenciar CTA principal, ações secundárias e links de rede;
- transformar a seção Sobre em uma composição editorial que comunique fatos
  profissionais antes dos parágrafos;
- dar ritmo visual aos cases em desktop sem prejudicar a leitura no celular;
- tornar o sistema de motion explícito, com durações e curvas consistentes;
- reduzir a sensação de uma sequência uniforme de cartões equivalentes;
- reforçar o storytelling entre formação, experiência e projetos.

## Padrões estudados

O briefing de referência aponta quatro sites para uma revisão visual ao vivo:

- `motionsites.ai`;
- `codewithsadee.github.io/vcard-personal-portfolio/`;
- `rhuanbello.com`;
- `portfolio-paulo.com`.

A integração de navegador não estava disponível durante a primeira etapa deste
estudo. Para não atribuir observações que não foram verificadas, as decisões
abaixo usam somente os padrões explicitamente definidos no briefing — hero
editorial, bento, catálogo de projetos, sticky cards, grid técnico, motion de
reveal e marquee — e a auditoria do código atual. A comparação visual ao vivo
deve ser repetida antes de considerar o estudo encerrado.

## Padrões adotados

### Hero editorial

A foto passa a viver em uma moldura composta por camadas, grid técnico e
pequenos rótulos factuais. O objetivo é integrá-la à narrativa sem transformar
o hero em banner publicitário.

### Bento informativo

O Sobre ganha blocos assimétricos para comunicar ADS concluído, foco Full Stack,
interesse em Mobile & Backend e experiência real de implantação. Os blocos não
usam números inventados nem percentuais de domínio.

### Cases com profundidade

Os projetos em destaque ganham índice visual e comportamento sticky apenas em
telas largas. No mobile voltam ao fluxo comum para evitar sobreposição,
scroll-trap ou perda de contexto.

### Motion discreto

Reveals, hovers e deslocamentos compartilham tokens. A animação reforça
hierarquia; não segura conteúdo, não substitui feedback e não é requisito para
entender a interface.

### Rail de tecnologias

Uma faixa decorativa pode reforçar repertório sem barras de progresso. A lista
semântica existente continua sendo a fonte acessível; a faixa é `aria-hidden` e
fica estática quando há preferência por menos movimento.

## Padrões rejeitados

- scroll hijacking e suavização artificial de rolagem;
- cursor customizado que substitui o ponteiro do sistema;
- WebGL, Three.js ou vídeo de fundo sem função de produto;
- glassmorphism em todas as superfícies;
- glow neon e linguagem gamer;
- parallax que dependa do movimento do ponteiro;
- percentuais de proficiência;
- carrosséis que escondem conteúdo importante;
- instalação de GSAP, Framer Motion ou Lenis para efeitos resolvidos por CSS e
  APIs nativas.

## Justificativas

O portfólio precisa demonstrar julgamento de engenharia. CSS, Astro e Web APIs
já cobrem as interações propostas com menor custo de JavaScript, dependências e
manutenção. A direção visual preserva a identidade existente e usa movimento
para criar ritmo, não espetáculo.

O comportamento sticky é progressive enhancement: ele melhora a sequência dos
cases em desktop, mas sua remoção em telas menores não elimina informação nem
ação.

## Sistema de motion

Tokens previstos:

```text
motion-fast: 160ms
motion-normal: 320ms
motion-slow: 620ms
ease-standard: cubic-bezier(0.22, 0.61, 0.36, 1)
ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1)
```

Aplicações:

- `motion-fast`: foco visual, cor e feedback de botão;
- `motion-normal`: hover de card, menu e indicadores;
- `motion-slow`: reveal de seção e composição do hero;
- `ease-emphasized`: entrada curta de elementos editoriais.

Com `prefers-reduced-motion: reduce`, transforms, animações repetidas e rolagem
suave são removidos. O conteúdo permanece visível mesmo sem JavaScript.

## Estratégia de performance

- manter Astro estático e zero framework no cliente;
- não adicionar dependências de animação;
- continuar usando formatos AVIF/WebP e `srcset` para a fotografia;
- limitar sombras, blur e áreas grandes com `backdrop-filter`;
- evitar listeners de `scroll`; usar `IntersectionObserver` quando necessário;
- medir Lighthouse antes e depois, investigando qualquer regressão;
- manter o orçamento mínimo de 90/95/95/95 e a meta de 100/100/100/100.

## Estratégia de acessibilidade

- preservar ordem do DOM independente da composição visual;
- manter todos os alvos interativos com pelo menos 44 px;
- nunca depender apenas de hover;
- manter foco visível e retorno de foco no menu móvel;
- usar texto real para status, sem depender apenas de cor;
- manter elementos decorativos fora da árvore acessível;
- testar teclado, Escape, `aria-expanded` e redução de movimento;
- rodar contraste, Astro check, build, verify e Lighthouse.

## Desktop

- hero em duas colunas com composição visual integrada;
- navegação sticky com vidro discreto;
- bento com hierarquia assimétrica;
- cases em destaque com profundidade e sticky progressivo;
- whitespace maior entre blocos narrativos.

## Tablet

- hero mantém duas áreas enquanto houver largura útil;
- bento reduz complexidade sem trocar a ordem semântica;
- cards deixam de sobrepor antes de comprometer leitura;
- navegação móvel entra quando os rótulos deixam de caber com conforto.

## Mobile

- fotografia compacta, ainda integrada ao grid visual;
- CTA primário ocupa largura confortável e redes ficam em linha separada;
- cards e timeline seguem fluxo único;
- nenhum overflow horizontal em 320, 375, 390 e 430 px;
- motion reduzido e interações por toque recebem o mesmo feedback do hover.
