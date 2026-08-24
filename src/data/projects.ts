/**
 * Projetos exibidos no portfólio.
 *
 * Os dados moram aqui, versionados, em vez de virem da API do GitHub em
 * tempo de execução. Motivo: o site é estático, então buscar em build ou em
 * runtime adicionaria dependência de rede, limite de requisições e um modo
 * de falha — sem ganho real para um punhado de projetos que mudam pouco.
 */
export type ProjectStatus = 'em desenvolvimento' | 'publicado';

export interface Project {
  readonly name: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
  readonly status: ProjectStatus;
  readonly repo?: string;
  readonly demo?: string;
}

export const projects: readonly Project[] = [
  {
    name: 'Meu Chamado',
    description:
      'Aplicativo mobile para organização e acompanhamento de chamados, com arquitetura multiusuário e multichamado. Primeiro produto da família Apps Meu.',
    highlights: [
      'Offline-first: funciona por completo sem nuvem',
      'RBAC extensível, com papéis e permissões declarados em vez de condicionais espalhadas',
      'Módulos de domínio independentes sobre infraestrutura compartilhada',
      'Decisões de arquitetura registradas em ADRs',
    ],
    stack: ['Flutter', 'Dart', 'SQLite', 'Arquitetura modular'],
    status: 'em desenvolvimento',
  },
  {
    name: 'meu-perfil',
    description:
      'Este portfólio. Site estático construído com foco em performance, acessibilidade e SEO, com deploy contínuo a cada merge na branch principal.',
    highlights: [
      'HTML gerado em build, sem JavaScript de framework no cliente',
      'Tema claro e escuro respeitando a preferência do sistema',
      'Metadados de SEO, Open Graph e sitemap gerados automaticamente',
      'Publicação automatizada por GitHub Actions',
    ],
    stack: ['Astro', 'TypeScript', 'CSS', 'GitHub Actions'],
    status: 'publicado',
    repo: 'https://github.com/guilhermegpo/meu-perfil',
    demo: 'https://guilhermegpo.github.io/meu-perfil/',
  },
];
