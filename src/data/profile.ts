/**
 * Fonte única de verdade para os dados exibidos no site.
 *
 * Regra do projeto: nada de dado sensível. Sem data de nascimento, sem
 * endereço, sem telefone. O e-mail aqui é profissional e foi criado para
 * uso público.
 */
export const profile = {
  /** Nome completo — usado em metadados e dados estruturados. */
  name: 'Guilherme Pereira de Oliveira',
  /** Nome curto — usado no hero e na marca do cabeçalho. */
  displayName: 'Guilherme Pereira',
  role: 'Desenvolvedor Full Stack',
  focus: 'Mobile & Backend',
  location: 'Brasília, DF — Brasil',

  /**
   * Duas frases, ambas verificáveis. Nada de "apaixonado por tecnologia" nem
   * de tempo de experiência inventado — um recrutador cobra isso na entrevista.
   */
  /** Linha de posicionamento do hero. Curta, sem promessa vazia. */
  tagline: 'Construindo soluções reais com tecnologia e propósito.',

  headline:
    'Desenvolvi e implantei uma aplicação web interna no Instituto de Logística da Aeronáutica, do levantamento de requisitos à entrega. Formado em Análise e Desenvolvimento de Sistemas pela Universidade Cruzeiro do Sul.',

  email: 'guilhermegpo.dev@gmail.com',

  links: {
    linkedin: 'https://www.linkedin.com/in/guilhermeoliveira-gpo/',
    github: 'https://github.com/guilhermegpo',
  },

  /**
   * O botão de currículo só é renderizado se este arquivo existir em
   * `public/curriculo/`. A checagem acontece em tempo de build — ver
   * `src/lib/resume.ts`. Assim não há link quebrado enquanto o PDF não chega,
   * e nenhuma flag para lembrar de virar depois.
   */
  resumeFile: 'Guilherme-Pereira-Desenvolvedor-Full-Stack-Junior.pdf',
} as const;
