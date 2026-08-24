/**
 * Fonte única de verdade para os dados pessoais exibidos no site.
 *
 * Regra do projeto: nada de dado sensível aqui. Sem data de nascimento,
 * sem endereço, sem telefone, sem e-mail pessoal. O contato acontece por
 * canais profissionais públicos.
 */
export const profile = {
  name: 'Guilherme Pereira de Oliveira',
  shortName: 'Guilherme Oliveira',
  role: 'Desenvolvedor Full Stack',
  focus: 'Mobile & Backend',
  location: 'Brasília, DF — Brasil',
  tagline:
    'Construo produtos completos: do modelo de domínio ao aplicativo na mão do usuário.',
  summary:
    'Estudante de Análise e Desenvolvimento de Sistemas, com formação técnica em TI. Desenvolvo produtos próprios em Flutter e Node.js, documentando as decisões de arquitetura para que cada escolha possa ser explicada e defendida.',
  photo: 'perfil.jpg',
  photoAlt: 'Retrato de Guilherme Pereira de Oliveira',
  links: {
    linkedin: 'https://www.linkedin.com/in/guilhermeoliveira-gpo/',
    github: 'https://github.com/guilhermegpo',
  },
} as const;
