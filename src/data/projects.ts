/**
 * Projetos apresentados como cases, não como lista de repositórios.
 *
 * A maioria dos portfólios para em "nome + stack + link". Um recrutador que
 * passa trinta segundos na página não consegue julgar nada com isso. Por
 * isso cada projeto aqui responde quatro perguntas: qual era o problema, o
 * que eu fiz, como foi resolvido e o que mudou depois.
 *
 * Os dados moram aqui, versionados e tipados, em vez de virem da API do
 * GitHub em tempo de execução: o site é estático, e buscar em runtime
 * adicionaria dependência de rede e limite de requisições sem ganho real.
 */
export type ProjectStatus = 'em produção' | 'em desenvolvimento' | 'publicado';

export interface ProjectLink {
  readonly label: string;
  readonly href: string;
}

export interface Project {
  /** Usado na URL do case: /projetos/{slug} */
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly status: ProjectStatus;
  /** Uma linha, para o card. */
  readonly tagline: string;
  readonly problem: string;
  readonly participation: readonly string[];
  readonly solution: string;
  readonly result: string;
  readonly stack: readonly string[];
  readonly links: readonly ProjectLink[];
  /** Destaques ganham card largo no topo da seção. */
  readonly featured: boolean;
  /**
   * Aviso exibido no case quando há restrição de divulgação. Mantém o
   * projeto no portfólio sem expor o que não pode ser exposto.
   */
  readonly disclosure?: string;
  /** Itens ainda não implementados. Só aparece em projeto em desenvolvimento. */
  readonly planned?: readonly string[];
}

export const projects: readonly Project[] = [
  {
    slug: 'sistema-ila-fab',
    name: 'Sistema de gestão de cursos — ILA/FAB',
    category: 'Aplicação web interna',
    status: 'em produção',
    tagline:
      'Aplicação web interna para centralizar a gestão de cursos do Instituto de Logística da Aeronáutica.',
    problem:
      'Processos e informações de gestão de cursos precisavam de maior centralização e organização. Registros ficavam dispersos, o que dificultava consulta, padronização e rastreabilidade.',
    participation: [
      'Levantamento de requisitos e entendimento dos fluxos junto aos usuários',
      'Mapeamento dos processos existentes antes de escrever código',
      'Desenvolvimento da aplicação web',
      'Modelagem do banco de dados relacional',
      'Implantação em ambiente real e suporte aos usuários',
      'Documentação do sistema e dos processos',
    ],
    solution:
      'Desenvolvimento e implantação de uma aplicação web interna que reúne os registros em um só lugar, com estrutura de dados padronizada e telas desenhadas a partir dos fluxos que os próprios usuários descreveram.',
    result:
      'Centralização das informações, padronização dos registros e melhoria na consulta e na rastreabilidade dos dados de cursos.',
    stack: ['React', 'TypeScript', 'TanStack Router', 'Supabase', 'PostgreSQL'],
    links: [],
    featured: true,
    disclosure:
      'Sistema interno e de uso institucional. O código-fonte, as telas e os dados não são públicos. Este case descreve apenas o problema, minha participação e a natureza da solução.',
  },
  {
    slug: 'meu-chamado',
    name: 'Meu Chamado',
    category: 'Aplicativo mobile',
    status: 'em desenvolvimento',
    tagline:
      'Aplicativo mobile offline-first para organização e acompanhamento de chamados, com arquitetura multiusuário e multichamado.',
    problem:
      'Quem acompanha várias responsabilidades ao mesmo tempo acaba distribuindo o controle entre papel, planilhas e mensagens. Falta um lugar único que funcione mesmo sem internet e que permita mais de uma pessoa organizando o mesmo conjunto de informações.',
    participation: [
      'Definição do modelo de domínio: Workspace, User, Membership, Role e Calling',
      'Decisão pela arquitetura offline-first e registro em ADR',
      'Desenho do controle de acesso por papéis, extensível a novos perfis',
      'Estruturação dos módulos de chamado como unidades independentes',
    ],
    solution:
      'Aplicativo Android em Flutter, com dados locais por padrão e sincronização opcional. O controle de acesso é declarado por papel e permissão, e cada tipo de chamado é um módulo próprio sobre infraestrutura compartilhada — em vez de um módulo único cheio de condicionais.',
    result:
      'Fundação do repositório e decisões de arquitetura documentadas. O desenvolvimento das funcionalidades ainda não começou.',
    stack: ['Flutter', 'Dart', 'SQLite', 'Arquitetura modular'],
    links: [],
    featured: true,
    planned: [
      'Módulos de chamado com regras de domínio próprias',
      'Sincronização opcional de workspace compartilhado',
      'Distribuição de versões por GitHub Releases',
      'Pipeline de build e testes no GitHub Actions',
    ],
  },
  {
    slug: 'meu-perfil',
    name: 'Portfólio profissional',
    category: 'Site estático',
    status: 'publicado',
    tagline:
      'Este site. Construído com foco em performance, acessibilidade verificada e SEO.',
    problem:
      'Um portfólio precisa carregar rápido, funcionar bem no celular, ser legível por leitor de tela e aparecer em busca. A maioria dos portfólios de framework entrega o conteúdo só depois do JavaScript rodar, o que compromete as quatro coisas.',
    participation: [
      'Definição da arquitetura e da identidade visual',
      'Implementação dos componentes e do sistema de design',
      'Automação da verificação de contraste, metadados e links',
      'Configuração da publicação contínua',
    ],
    solution:
      'Site estático em Astro: o HTML é gerado em build e nenhum framework é enviado ao navegador. O único JavaScript que chega ao cliente cuida do tema, do menu e da revelação de conteúdo. Um script de verificação lê os tokens de cor direto do CSS e mede cada par contra o critério WCAG AA, rodando no CI a cada pull request.',
    result:
      'Site publicado com verificação automatizada de acessibilidade e metadados a cada alteração.',
    stack: ['Astro', 'TypeScript', 'CSS', 'GitHub Actions'],
    links: [
      { label: 'Repositório', href: 'https://github.com/guilhermegpo/meu-perfil' },
      { label: 'Ver ao vivo', href: 'https://guilhermegpo.github.io/meu-perfil/' },
    ],
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const otherProjects = projects.filter((project) => !project.featured);
