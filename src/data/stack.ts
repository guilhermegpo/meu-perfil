/**
 * Stack por categoria.
 *
 * Sem percentuais. "React 90%" é um número que ninguém consegue justificar e
 * que qualquer entrevistador desmonta em duas perguntas. O rótulo aqui diz
 * apenas se a tecnologia já foi usada em projeto entregue ou se está em uso
 * de aprendizado — que é uma afirmação verificável.
 */
export type Usage = 'em projetos' | 'em aprendizado';

export interface StackCategory {
  readonly title: string;
  readonly items: readonly { readonly name: string; readonly usage: Usage }[];
}

export const stack: readonly StackCategory[] = [
  {
    title: 'Frontend',
    items: [
      { name: 'React', usage: 'em projetos' },
      { name: 'TypeScript', usage: 'em projetos' },
      { name: 'JavaScript', usage: 'em projetos' },
      { name: 'TanStack Router', usage: 'em projetos' },
      { name: 'HTML semântico', usage: 'em projetos' },
      { name: 'CSS responsivo', usage: 'em projetos' },
      { name: 'Astro', usage: 'em projetos' },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'Supabase', usage: 'em projetos' },
      { name: 'APIs REST', usage: 'em projetos' },
      { name: 'Java', usage: 'em aprendizado' },
    ],
  },
  {
    title: 'Mobile',
    items: [
      { name: 'Flutter', usage: 'em aprendizado' },
      { name: 'Dart', usage: 'em aprendizado' },
    ],
  },
  {
    title: 'Banco de dados',
    items: [
      { name: 'PostgreSQL', usage: 'em projetos' },
      { name: 'SQL', usage: 'em projetos' },
      { name: 'Modelagem relacional', usage: 'em projetos' },
    ],
  },
  {
    title: 'Ferramentas e DevOps',
    items: [
      { name: 'Git', usage: 'em projetos' },
      { name: 'GitHub', usage: 'em projetos' },
      { name: 'GitHub Actions', usage: 'em projetos' },
      { name: 'Docker', usage: 'em aprendizado' },
    ],
  },
];
