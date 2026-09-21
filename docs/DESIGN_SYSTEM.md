# Design system GPO

Direção: **dark premium**, técnica e sóbria. A marca é um monograma prata metálico; o
site conversa com ela usando superfícies escuras, vidro discreto, um único acento azul-gelo
e profundidade controlada. A logo é a assinatura — não um efeito repetido em todas as seções.

Os tokens vivem em `src/styles/global.css`. O primeiro bloco `:root` contém só cores em
hexadecimal e é lido por `scripts/verify.mjs`, que mede o contraste WCAG de cada par.

## Marca GPO

### Arquivo oficial

`GPO Logo.png` (1254 × 1254, PNG com transparência, prata metálica) é a **fonte de verdade**.
Uma cópia byte a byte está em `src/assets/brand/gpo-master.png` e nunca é editada.

`npm run brand` gera os derivados sem redesenhar nada: recorta apenas a margem transparente
(caixa do símbolo: 1209 × 813, proporção 1,49:1) e compõe sobre fundos.

| Arquivo | Uso |
| --- | --- |
| `src/assets/brand/gpo-logo.png` | Marca recortada, resolução original. Entrada do pipeline de imagens do Astro (navbar, hero, rodapé). |
| `public/assets/brand/gpo-logo.png` / `.webp` | Mesma marca para uso externo. |
| `public/assets/brand/gpo-logo-512.png`, `gpo-logo-192.png` | Ícones quadrados (marca sobre ladrilho escuro) para manifesto e apps. |
| `public/assets/brand/favicon.png` | Favicon 48 × 48. |
| `public/assets/brand/apple-touch-icon.png` e `public/apple-touch-icon.png` | Ícone iOS 180 × 180 (a cópia na raiz atende o Safari). |
| `public/og-image.png` | Cartão Open Graph 1200 × 630. |
| `banner-perfil.png` (repositório do perfil) | Banner oficial do perfil do GitHub, fornecido pelo autor. Não é gerado por script e não é alterado. |

**Pendência:** não existe versão vetorial. Quando houver `gpo-mark.svg` (e `gpo-logo-dark.svg`),
ela substitui o PNG na navbar e nos ícones sem alterar o resto. Não vetorizar por
rastreamento automático: altera o desenho.

### Espaço livre

Mantenha ao redor do símbolo uma margem livre de **25% da sua altura** em todos os lados. Nada
de texto, borda ou ícone dentro dessa área. Na navbar o texto do nome fica a 0,75 rem do símbolo,
que é a margem mínima aceitável quando o símbolo é pequeno.

### Tamanhos mínimos

- Digital: **40 px de largura**. Abaixo disso os traços finos e o brilho se perdem.
- Em 16–48 px use o ícone quadrado (`favicon.png`), não o símbolo solto.
- Uso no site: navbar 46 px, rodapé 54 px, hero 520 px (com `srcset` 1x/2x).

### Fundos permitidos

Prata sobre escuro: `--bg` `#06090E`, `--bg-1` `#0A1018`, `--bg-2` `#0E1621`, superfícies
`#111923` e `#151F2C`. Sobre fundo claro ou fotografia use o ícone quadrado com ladrilho escuro.

### Usos incorretos

- Distorcer, esticar, inclinar em perspectiva ou alterar a proporção. No hero a marca é
  contra-rotacionada em relação ao palco 3D para ficar sempre frontal.
- Recolorir (azul, dourado, tom quente) ou aplicar gradiente sobre o desenho.
- Brilho, neon ou contorno luminoso exagerado. O único efeito permitido é uma faixa de luz
  discreta e uma sombra projetada suave.
- Recortar, girar ou usar como padrão repetido de fundo.
- Colocar em fundo claro sem ladrilho, ou sobre imagem com ruído.
- Recriar ou "melhorar" o desenho à mão.

## Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#06090E` | Fundo base |
| `--bg-1` | `#0A1018` | Fundo intermediário |
| `--bg-2` | `#0E1621` | Fundo elevado |
| `--surface` | `#111923` | Superfície de cartão |
| `--surface-2` | `#151F2C` | Superfície de destaque |
| `--surface-3` | `#1B2736` | Superfície mais alta |
| `--text` | `#F4F7FA` | Texto principal |
| `--text-muted` | `#A7B3C2` | Texto secundário (cinza frio) |
| `--text-faint` | `#8593A6` | Texto terciário |
| `--accent` | `#78BDF2` | Acento único (azul-gelo) |
| `--accent-strong` | `#A4D6F8` | Acento em hover/foco |
| `--on-accent` | `#06090E` | Texto sobre botão primário |
| `--silver` | `#CFD6DF` | Referência ao prata da marca |
| `--tone-live` / `-alpha` / `-internal` | `#7FD9A8` / `#F0C674` / `#B4C0CC` | Selos de status |

Pior contraste medido: **4,84:1** (`text-faint` sobre `surface-3`); todos os pares passam AA.
Não há tema claro: o site é escuro por decisão de marca.

## Tipografia

- Títulos: **Space Grotesk** 500–700. Corpo: **Inter** 400–600. Mono: pilha do sistema.
- Fontes servidas do próprio domínio (`src/assets/fonts`, WOFF2 latin e latin-ext, licença OFL).
- Escala fluida `--step--1` … `--step-hero`, definida com `clamp()`.

## Superfícies, profundidade e movimento

- **Vidro:** `.glass` — gradiente branco a 5%, borda de 1 px, blur opcional. Sem `backdrop-filter`
  continua legível.
- **Sombras:** `--shadow-1` (repouso) e `--shadow-2` (elevado), em camadas.
- **Movimento:** `--ease`, `--dur-fast` 160 ms, `--dur` 320 ms, `--dur-slow` 700 ms.
- **Regra:** só `transform` e `opacity` animam. Nada de animar `width`, `top`, `filter` ou
  `background-position`.

### Camadas 3D dos cartões de projeto

`.card` fornece a perspectiva e não gira. `.card__tilt` gira no máximo **±4° em X e ±6° em Y**.

| Camada | translateZ |
| --- | --- |
| Fundo | 0 |
| Brilho que segue o cursor | 5 px |
| Ilustração | 15 px |
| Rótulo (categoria e status) | 25 px |
| Título e conteúdo | 30 px |
| Botões | 35 px |

### Cena do hero

`perspective` 1400 px; palco com `preserve-3d` e rotação-base de 9° / −11°. Profundidades: piso
em grade −90, halo −30, anéis 20, monograma 60, painéis 60 a 130. O cursor desloca cada camada
proporcionalmente à sua profundidade (`--d`), com parallax de rolagem de até 26 px.

## Microinterações

Todas usam só `transform` e `opacity` (o reveal usa a propriedade `translate`, para não disputar
com os hovers) e ficam neutralizadas por `prefers-reduced-motion`.

| Onde | Efeito |
| --- | --- |
| Entrada dos blocos | Sobe 18 px e aparece uma vez; o traço do eyebrow "desenha" |
| Botões | Elevam 1 px, a seta desliza 3 px, o primário ganha uma faixa de luz |
| Links | Sublinhado cresce da esquerda |
| Navegação | Sublinhado parcial no hover, completo na seção atual; fio de progresso de leitura sob o header |
| Logo GPO | Encolhe levemente ao rolar e ganha um brilho que cruza o desenho no hover |
| Cartões e vitrines | Tilt até 4° / 6°, borda acende, a arte sobe de 15 para 24 px em Z, dá zoom de 3,5% a 6% e desliza no sentido oposto ao cursor; reflexo segue o cursor |
| Fichas, grupos, práticas | Elevam 3 a 4 px e ganham spotlight suave com mouse |
| Métricas | Contam de 0 ao valor na primeira vez que aparecem |
| Barras da stack | Crescem, escalonadas, quando o grupo é revelado |
| Hero | Peças entram em sequência e flutuam devagar, defasadas |
| Contato | Halo muito lento atrás do painel |

## Comportamento por dispositivo

| Situação | Comportamento |
| --- | --- |
| Mouse ou trackpad | Tilt dos cartões e parallax da cena por cursor |
| Toque | Sem tilt. O cartão no centro da tela ganha luz e sobe 3 px; a cena deriva devagar sozinha |
| `prefers-reduced-motion: reduce` | Sem tilt, parallax, translateZ, reveal nem animação contínua |
| Dispositivo modesto ou `saveData` | `data-perf="lite"`: sem blur e sem animações contínuas |
| Fora da viewport | Animações pausadas (`animation-play-state`) e laço `requestAnimationFrame` parado |
| Sem JavaScript | Conteúdo e menu permanecem visíveis |

## Acessibilidade

HTML semântico e landmarks, `aria-labelledby` nas seções, skip link, foco visível de 2 px em
qualquer elemento interativo, alvos de toque ≥ 44 px, `aria-current` na seção atual, menu móvel
fechável por Escape, `alt` em toda imagem (vazio nas decorativas), `forced-colors` respeitado.

## Fotografia e ilustrações

- **Foto oficial** (`public/assets/profile`): retrato 4:5 no card do Sobre, com `object-position` no
  rosto, gradiente inferior que funde a base com o fundo do site e legenda de vidro. O card tem
  `overflow: hidden`, proporção fixa e uma moldura deslocada cujo espaço é reservado por padding,
  então nada vaza do grid. Um recorte quadrado do rosto (avatar) aparece no hero e no contato.
- **Imagens ilustrativas** (`public/assets/projects`): Meu Financeiro, Meu Chamado e Meu Treino
  seguem o mesmo formato (16:9, 1672 × 941) e a mesma composição — marca e proposta à esquerda,
  mockup ao centro, painéis flutuantes à direita. No site usam o mesmo enquadramento 3D e o rótulo
  "Imagem ilustrativa". Cada app mantém a própria paleta (claro azul-verde-água, claro azul e
  escuro turquesa), unidos pelo símbolo "M" da família Apps Meu.
- Projetos privados ou institucionais usam a **versão sanitizada** da própria ilustração
  (rotulada "Imagem ilustrativa"): logotipos, brasões, nomes e contagens reais foram substituídos
  por ícones e rótulos genéricos, preservando cores, mockup e estilo de cada produto. Cada card em
  destaque tem identidade própria: vermelho e grafite (Controle de Chaves), claro e azul-verde-água
  (Meu Chamado) e azul institucional (sistema de cursos).

## Componentes

`Header`, `Hero` + `HeroScene`, `About`, `Experience`, `Projects` + `ProjectCard` +
`ProjectPreview`, `Stack`, `Engineering`, `Contact`, `Footer`, além de `Icon`, `Logo` e
`SectionHeading`. As ilustrações dos cartões são desenhos abstratos, rotulados "Ilustração";
nenhuma tela de sistema privado é exibida.
