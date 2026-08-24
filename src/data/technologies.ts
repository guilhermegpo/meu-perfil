/**
 * Tecnologias exibidas no site.
 *
 * Regra do projeto: só entra aqui o que é realmente usado ou está em uso
 * em algum projeto. `level` é honesto sobre o estágio, em vez de sugerir
 * domínio uniforme sobre tudo.
 */
export type Level = 'em uso' | 'em aprendizado';

export interface TechCategory {
  readonly title: string;
  readonly items: readonly { readonly name: string; readonly level: Level }[];
}

export const technologies: readonly TechCategory[] = [
  {
    title: 'Linguagens',
    items: [
      { name: 'Java', level: 'em uso' },
      { name: 'JavaScript', level: 'em uso' },
      { name: 'TypeScript', level: 'em aprendizado' },
      { name: 'Dart', level: 'em aprendizado' },
      { name: 'SQL', level: 'em uso' },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'Node.js', level: 'em uso' },
      { name: 'Modelagem relacional', level: 'em uso' },
      { name: 'APIs REST', level: 'em aprendizado' },
    ],
  },
  {
    title: 'Mobile',
    items: [{ name: 'Flutter', level: 'em aprendizado' }],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'HTML semântico', level: 'em uso' },
      { name: 'CSS responsivo', level: 'em uso' },
      { name: 'Astro', level: 'em uso' },
    ],
  },
  {
    title: 'Ferramentas',
    items: [
      { name: 'Git', level: 'em uso' },
      { name: 'GitHub Actions', level: 'em uso' },
      { name: 'Conventional Commits', level: 'em uso' },
    ],
  },
];
