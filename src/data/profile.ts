/**
 * Fonte única de verdade para os dados pessoais exibidos no site.
 *
 * Regra do projeto: nada de dado sensível. Sem data de nascimento, endereço ou
 * telefone. O e-mail aqui é profissional e foi criado para uso público.
 * A origem de cada informação está em docs/CONTENT_SOURCE.md.
 */
export const profile = {
  /** Nome completo — metadados, dados estruturados e rodapé. */
  name: 'Guilherme Pereira de Oliveira',
  firstName: 'Guilherme',
  /** Cargo e frentes de atuação. Cada frente tem projeto que a comprova. */
  role: 'Full Stack Developer',
  areas: ['Web', 'Mobile', 'Backend'],
  location: 'Brasília, DF — Brasil',
  status: 'Aberto a oportunidades',

  /** Linha de posicionamento do hero. */
  headline: 'Sistemas que entram em uso, do modelo de dados à interface.',

  /** Descrição do hero e base da meta description. */
  description:
    'Desenvolvo aplicações web e mobile com atenção a arquitetura, segurança dos dados e qualidade. Implantei um sistema interno em uso real e mantenho projetos próprios com testes automatizados, documentação e versionamento.',

  email: 'guilhermegpo.dev@gmail.com',

  links: {
    github: 'https://github.com/guilhermegpo',
    linkedin: 'https://www.linkedin.com/in/guilhermeoliveira-gpo/',
  },

  /**
   * O botão de currículo só é renderizado se este arquivo existir em
   * `public/curriculo/`. A checagem acontece em tempo de build — ver
   * `src/lib/resume.ts`.
   */
  resumeFile: 'Guilherme-Pereira-Desenvolvedor-Full-Stack-Junior.pdf',
} as const;

export interface NavItem {
  readonly id: string;
  readonly label: string;
}

/** Seções da home, na ordem de leitura. O `id` é a âncora e o alvo do scroll-spy. */
export const navigation: readonly NavItem[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'stack', label: 'Stack' },
  { id: 'engenharia', label: 'Engenharia' },
  { id: 'contato', label: 'Contato' },
];
