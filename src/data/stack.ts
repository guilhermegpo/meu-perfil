/**
 * Stack por categoria.
 *
 * Sem percentuais. "React 90%" é um número que ninguém consegue justificar e
 * que qualquer entrevistador desmonta em duas perguntas. O rótulo aqui diz
 * apenas se a tecnologia já foi usada em projeto entregue ou se está em uso
 * de aprendizado — as duas afirmações são verificáveis.
 *
 * Flutter e Dart entraram como "em projetos" quando o Meu Chamado ganhou
 * release pública (`v0.1.0-alpha.1`), com 28 testes e CI.
 *
 * Práticas de engenharia — CI/CD, ADRs, Conventional Commits — não entram
 * aqui. Elas têm seção própria, porque não são tecnologia, são método.
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
      { name: 'Astro', usage: 'em projetos' },
      { name: 'TanStack Router', usage: 'em projetos' },
    ],
  },
  {
    title: 'Mobile',
    items: [
      { name: 'Flutter', usage: 'em projetos' },
      { name: 'Dart', usage: 'em projetos' },
    ],
  },
  {
    title: 'Backend e dados',
    items: [
      { name: 'Supabase', usage: 'em projetos' },
      { name: 'PostgreSQL', usage: 'em projetos' },
      { name: 'SQL', usage: 'em projetos' },
      { name: 'APIs REST', usage: 'em projetos' },
      { name: 'Drift / SQLite', usage: 'em projetos' },
    ],
  },
  {
    title: 'Ferramentas',
    items: [
      { name: 'Git', usage: 'em projetos' },
      { name: 'GitHub', usage: 'em projetos' },
      { name: 'Postman', usage: 'em projetos' },
      { name: 'VS Code', usage: 'em projetos' },
      { name: 'IntelliJ IDEA', usage: 'em projetos' },
      { name: 'Docker', usage: 'em aprendizado' },
    ],
  },
];
