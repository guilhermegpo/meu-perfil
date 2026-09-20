/**
 * Projetos e cases.
 *
 * Cada projeto responde às perguntas que um recrutador faz: qual era o
 * problema, o que eu fiz, como foi decidido e o que existe hoje. Os textos são
 * escritos aqui; os números (testes, tecnologias, versão) vêm do JSON gerado
 * a partir dos repositórios — ver `evidence.ts`. A origem de cada afirmação
 * está em docs/CONTENT_SOURCE.md.
 *
 * Projetos privados ou de uso institucional entram de forma genérica: sem
 * nome de organização, sem dados, sem telas, sem link de código.
 */
import { evidence, formatNumber, projectEvidence } from './evidence';

export type ProjectKind = 'mobile' | 'web' | 'site';
/** Tom visual do selo de status. */
export type StatusTone = 'live' | 'alpha' | 'internal' | 'published' | 'concept';

export interface ProjectLink {
  readonly label: string;
  readonly href: string;
}

export interface CaseDecision {
  readonly title: string;
  readonly body: string;
}

export interface CaseChallenge {
  readonly challenge: string;
  readonly solution: string;
}

export interface ArchitectureLayer {
  readonly name: string;
  readonly detail: string;
}

/** Imagem ilustrativa oficial do projeto, derivada em `public/assets/projects/{slug}-hero-*`. */
export interface HeroImage {
  readonly slug: string;
  readonly alt: string;
}

/**
 * Página enxuta para projetos que ainda não têm repositório publicado. Só
 * carrega o que o próprio material do produto afirma; não há stack, teste,
 * arquitetura ou métrica, porque nada disso pode ser comprovado ainda.
 */
export interface Showcase {
  readonly intro: string;
  readonly pointsTitle: string;
  readonly points: readonly string[];
  readonly identity: string;
  readonly status: string;
}

export interface CaseStudy {
  readonly context: string;
  readonly problem: string;
  readonly objective: string;
  readonly responsibility: readonly string[];
  readonly architecture: {
    readonly summary: string;
    readonly layers: readonly ArchitectureLayer[];
  };
  readonly decisions: readonly CaseDecision[];
  readonly features: readonly string[];
  readonly challenges: readonly CaseChallenge[];
  readonly results: readonly string[];
  readonly learnings: readonly string[];
  readonly status: string;
  /** Itens de roadmap; nunca apresentados como entregues. */
  readonly planned?: readonly string[];
}

export interface Project {
  /** Também é o id em `evidence.generated.json` e a rota `/projetos/{slug}`. */
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly kind: ProjectKind;
  readonly status: string;
  readonly tone: StatusTone;
  /** Uma linha, para o cartão e para a meta description. */
  readonly tagline: string;
  /** Principais recursos exibidos no cartão. */
  readonly highlights: readonly string[];
  readonly links: readonly ProjectLink[];
  readonly featured: boolean;
  /** Repositório público, quando existe. Só ele vira `SoftwareSourceCode`. */
  readonly repository?: string;
  /** Aviso de divulgação restrita, exibido no cartão e no case. */
  readonly disclosure?: string;
  readonly caseStudy?: CaseStudy;
  /** Família de produtos a que o projeto pertence. */
  readonly family?: string;
  readonly heroImage?: HeroImage;
  readonly showcase?: Showcase;
}

const RESTRICTED =
  'Sistema de uso institucional e restrito. O código-fonte, as telas e os dados não são públicos; este texto descreve apenas o problema, a natureza da solução e a minha atuação.';

export const projects: readonly Project[] = [
  {
    slug: 'controle-de-chaves',
    name: 'Controle de Chaves',
    category: 'Aplicativo Android e PWA',
    kind: 'mobile',
    status: 'Em uso · evolução contínua',
    tone: 'live',
    tagline:
      'Controle de chaves e movimentação de veículos de uma frota, com perfis de acesso, histórico e auditoria.',
    highlights: [
      'Saída e retorno com regra transacional no banco',
      'Quatro perfis de acesso com RLS em todas as tabelas',
      'Login por biometria e notificações push',
      'Atualização obrigatória com liberação gradual',
    ],
    links: [],
    featured: true,
    disclosure:
      'Sistema operacional em uso por uma equipe real. Por isso o código, as telas, os dados e o nome da organização não são públicos.',
    caseStudy: {
      context:
        'Aplicativo usado por uma equipe operacional para registrar a saída e o retorno de veículos e o estado das chaves. O sistema anterior dependia de um backend baseado em Google Drive, e o código-fonte original não estava mais disponível: a reconstrução partiu de um APK compilado de referência.',
      problem:
        'Registrar quem está com cada chave sem conflito quando várias pessoas operam ao mesmo tempo, manter um histórico que não mude depois de gravado e garantir que as regras críticas não dependam apenas do que a tela permite.',
      objective:
        'Substituir o backend antigo por uma arquitetura oficial (Capacitor + Supabase), preservar a interface que os usuários já conheciam e ganhar consistência, segurança e um ciclo de atualização controlado.',
      responsibility: [
        'Requisitos e regras de negócio de cada rodada de evolução',
        'Arquitetura da reconstrução e modelo de dados no PostgreSQL',
        'Regras de acesso (RLS) e operações críticas no banco',
        'Validação em ambiente de teste, com dados fictícios, e publicação controlada das versões',
        'Documentação de arquitetura, banco, segurança e release',
      ],
      architecture: {
        summary:
          'A interface roda em uma WebView Android (Capacitor) e também como PWA. Toda regra que precisa ser confiável mora no banco; o cliente só chama funções e reage ao resultado.',
        layers: [
          {
            name: 'Cliente',
            detail:
              'Interface HTML/CSS/JS preservada do app original, com uma camada de serviços em módulos ES empacotada com Vite. Android via Capacitor; PWA com service worker.',
          },
          {
            name: 'Backend',
            detail:
              'Supabase: PostgreSQL, Auth, Realtime, Storage e Edge Functions. As chaves administrativas existem só no servidor.',
          },
          {
            name: 'Regras no banco',
            detail:
              'RLS ativa em todas as tabelas e funções SECURITY DEFINER transacionais para saída, retorno, cadastro e remoção.',
          },
          {
            name: 'Sessão',
            detail:
              'Nenhuma senha é guardada. Só o token de sessão fica no armazenamento seguro nativo, liberado por biometria.',
          },
          {
            name: 'Distribuição',
            detail:
              'APK assinado, tabela de versões com atualização obrigatória e liberação por usuário-alvo antes de chegar a todos.',
          },
        ],
      },
      decisions: [
        {
          title: 'Regra de negócio no banco, não na tela',
          body: 'Saída e retorno são funções que travam a linha da chave antes de validar a disponibilidade, e um índice único parcial impede duas saídas abertas da mesma chave. A tela não é a barreira de segurança.',
        },
        {
          title: 'Preservar a interface, reescrever o motor de dados',
          body: 'O HTML legado ficou como estava e ganhou um módulo de serviços ao lado. Evitou uma reescrita completa antes da primeira build funcional. O custo é um arquivo grande de interface, registrado como dívida conhecida.',
        },
        {
          title: 'Migrações apenas aditivas',
          body: 'Versões antigas das funções continuam existindo, então aparelhos que ainda não atualizaram seguem funcionando durante a transição.',
        },
        {
          title: 'Histórico imutável',
          body: 'Cada movimentação guarda uma cópia dos dados relevantes do veículo no momento do registro, para editar o cadastro depois não reescrever o passado.',
        },
        {
          title: 'Arquivar é diferente de excluir',
          body: 'Arquivar preserva chave, movimentações e auditoria e pode ser desfeito. A exclusão definitiva é uma ação separada e restrita.',
        },
        {
          title: 'Liberação gradual',
          body: 'Uma nova versão chega primeiro a um usuário-alvo. Só depois da validação em aparelho real ela é liberada para todos.',
        },
      ],
      features: [
        'Saída e retorno de veículos com histórico completo',
        'Três tipos de operação: entrega, operacional e retorno',
        'Quatro perfis de acesso com permissões distintas',
        'Registro da condição do veículo (quilometragem, energia, limpeza) e conferência de pátio',
        'Locais de estacionamento configuráveis',
        'Atualização em tempo real entre aparelhos',
        'Notificações push e locais',
        'Auditoria que o cliente não consegue apagar',
        'Operações em massa',
        'Login por biometria e sessão única',
        'Atualização obrigatória do aplicativo',
      ],
      challenges: [
        {
          challenge: 'Duas pessoas retirando a mesma chave ao mesmo tempo.',
          solution:
            'Função transacional com trava de linha e índice único parcial: a segunda tentativa recebe um erro tratado em vez de gravar um conflito.',
        },
        {
          challenge: 'Aparelhos com versões antigas instaladas continuando a funcionar após mudanças no banco.',
          solution:
            'Funções versionadas, migrações aditivas e número de versão comparado a cada abertura do app.',
        },
        {
          challenge: 'Trocar o tipo de motorização de um veículo sem deixar leituras de energia incoerentes.',
          solution:
            'Regra atômica no banco que limpa só a leitura que deixa de se aplicar, com a motorização registrada em cada movimentação para preservar o histórico.',
        },
        {
          challenge: 'Remoção de chave feita em passos no cliente podia deixar um veículo sem chave visível.',
          solution:
            'Função única que remove ou arquiva de forma atômica, com auditoria, e cadastro decidido no servidor com trava por placa.',
        },
        {
          challenge: 'Recuperar o aplicativo sem o código-fonte, a partir de um APK que fechava ao abrir.',
          solution:
            'Reconstrução do projeto com a toolchain oficial do Android, sem patch binário, e diagnóstico documentado do defeito do artefato original.',
        },
      ],
      results: [
        'Em uso por uma equipe operacional real.',
        'Suíte automatizada da camada de serviços, executada no ambiente local.',
        'Esquema versionado em migrações SQL, com RLS e funções transacionais.',
        'Ciclo de release documentado: build assinado, verificação de assinatura, checksum e liberação controlada.',
      ],
      learnings: [
        'A regra crítica pertence ao banco; a interface só a espelha.',
        'Evoluir sem quebrar quem já instalou exige compatibilidade explícita, não boa vontade.',
        'Preservar código legado pode ser uma decisão certa, desde que a dívida fique registrada.',
        'Faltam testes automatizados na interface e um pipeline de CI para a suíte — é a próxima melhoria.',
      ],
      status:
        'Em uso e evoluindo por rodadas. Novas versões passam por liberação gradual e validação em aparelho real antes de chegarem a todos.',
    },
  },
  {
    slug: 'meu-chamado',
    name: 'Meu Chamado',
    category: 'Aplicativo Android (Flutter)',
    kind: 'mobile',
    status: `Alpha · ${projectEvidence('meu-chamado').version}`,
    tone: 'alpha',
    tagline:
      'Aplicativo Android offline-first para organizar usuários e chamados em um Workspace local, com segurança dos dados no aparelho.',
    highlights: [
      'Offline-first: banco local criptografado',
      'RBAC com três papéis e proteção do último administrador',
      'PIN com biometria opcional',
      'Decisões de arquitetura registradas em ADRs',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/guilhermegpo/meu-chamado' },
      { label: 'Releases', href: 'https://github.com/guilhermegpo/meu-chamado/releases' },
    ],
    featured: true,
    repository: 'https://github.com/guilhermegpo/meu-chamado',
    family: 'Apps Meu',
    heroImage: {
      slug: 'meu-chamado',
      alt: 'Imagem ilustrativa do Meu Chamado: tela inicial do aplicativo no celular, com chamados, tarefas, agenda, reuniões e lembretes.',
    },
    caseStudy: {
      context:
        'Projeto independente e não oficial, em código aberto. Nasce da necessidade de organizar responsabilidades e o acompanhamento de pessoas em um só lugar que funcione sem internet.',
      problem:
        'Quem acumula responsabilidades costuma dividir o controle entre papel, planilhas e mensagens. Falta uma base única, que funcione offline, que separe o que cada pessoa pode ver e que proteja dados de terceiros.',
      objective:
        'Entregar uma base Android local, modular, que funciona sem conta ou serviço externo, mantém os dados no aparelho e cresce por módulos sem reescrever o núcleo.',
      responsibility: [
        'Projeto individual: produto, modelo de domínio, arquitetura e implementação',
        'Segurança local, migrações do banco e testes automatizados',
        'CI de pull requests, versionamento semântico e changelog',
        'Documentação: ADRs, modelo de ameaças, privacidade e domínio',
      ],
      architecture: {
        summary:
          'Arquitetura em camadas com organização por feature. As dependências apontam para o domínio; Flutter e SQLite são detalhes de infraestrutura e não definem as regras de autorização.',
        layers: [
          { name: 'Apresentação', detail: 'Telas Flutter, navegação, temas e acessibilidade.' },
          { name: 'Aplicação', detail: 'Casos de uso, autorização e coordenação de operações, com estado assíncrono em Riverpod.' },
          { name: 'Domínio', detail: 'Workspace, User, Membership, Role e Calling, com as invariantes do sistema.' },
          {
            name: 'Infraestrutura',
            detail:
              'Drift sobre SQLite criptografado (SQLite3 Multiple Ciphers), armazenamento seguro do sistema e migrações versionadas.',
          },
        ],
      },
      decisions: [
        {
          title: 'Offline-first',
          body: 'O banco local é a fonte de trabalho e os casos de uso não esperam a rede. Sincronização é opcional e futura. O ADR compara as alternativas descartadas: cloud-first, cache de API remota e arquivo SQLite em pasta sincronizada.',
        },
        {
          title: 'Autorização central por papéis',
          body: 'Três papéis (administrador, moderador e usuário) verificados em um único ponto, com a invariante de que um Workspace nunca fica sem administrador.',
        },
        {
          title: 'Chave do banco independente do PIN',
          body: 'O banco é criptografado com uma chave aleatória guardada no armazenamento seguro do sistema, não derivada do PIN. Trocar o PIN não obriga a recriptografar tudo.',
        },
        {
          title: 'Snapshot do escopo trimestral',
          body: 'O histórico de um trimestre encerrado congela quais duplas faziam parte dele, para o "X de Y" do passado não se mover quando o cadastro muda.',
        },
        {
          title: 'Privacidade por padrão',
          body: 'Nenhum dado real de pessoas no repositório, minimização de dados nos snapshots (só identificadores) e fronteiras de confiança documentadas.',
        },
      ],
      features: [
        'Onboarding e Workspace local',
        'Primeiro usuário administrador, múltiplos usuários e foto opcional local',
        'Papéis ADMIN, MODERATOR e USER',
        'Catálogo de chamados, com ativação e arquivamento',
        'Módulo de acompanhamento trimestral com histórico de trimestres',
        'PIN de seis dígitos (PBKDF2-HMAC-SHA256) e biometria opcional',
        'Banco local criptografado com migração sem perda a partir do formato anterior',
        'Bloqueio automático e atraso progressivo após PINs errados',
        'Tema claro, escuro ou do sistema',
      ],
      challenges: [
        {
          challenge: 'Um denominador histórico que muda quando o cadastro atual muda.',
          solution:
            'Snapshot de escopo por trimestre encerrado, materializado como regra de domínio antes de cada leitura, inclusive quando o app ficou fechado por vários trimestres.',
        },
        {
          challenge: 'Migrar o banco em texto puro para o formato criptografado sem perder dados.',
          solution: 'Migração que verifica o resultado, mantém backup e desfaz em caso de erro.',
        },
        {
          challenge: 'Testar virada de trimestre sem depender do relógio do sistema.',
          solution: 'Relógio injetável no repositório do módulo, exercitado pelos testes.',
        },
        {
          challenge: 'Proteger dados sem apagá-los como punição.',
          solution: 'Atraso progressivo com teto após PINs errados, sem nunca apagar dados.',
        },
      ],
      results: [
        `${formatNumber(projectEvidence('meu-chamado').testCases)} testes automatizados, todos passando na execução mais recente.`,
        `${projectEvidence('meu-chamado').adrs} ADRs, modelo de ameaças e documentos de privacidade e domínio.`,
        'CI de pull requests, changelog e pré-versões marcadas com versionamento semântico.',
      ],
      learnings: [
        'Escrever a decisão e as alternativas descartadas evita rediscutir o mesmo problema meses depois.',
        'Invariantes de domínio protegidas por teste dão liberdade para mudar a interface.',
        'Migração de dados precisa de plano de desfazer desde o primeiro dia.',
      ],
      status:
        'Alpha declarada: modelo de dados e interfaces ainda podem mudar. Não há APK de release assinado com chave de produção — apenas artefatos de debug para validação.',
      planned: [
        'Sincronização opcional de Workspace compartilhado',
        'Distribuição de versões por GitHub Releases',
        'Módulos de chamado com regras de domínio próprias',
      ],
    },
  },
  {
    slug: 'sistema-ila-fab',
    name: 'Sistema de gestão de cursos',
    category: 'Aplicação web interna',
    kind: 'web',
    status: 'Uso institucional',
    tone: 'internal',
    tagline:
      'Aplicação web interna para planejar, coordenar e acompanhar cursos, com escalas, solicitações, auditoria e controle de permissões.',
    highlights: [
      'Catálogo, planejamento e coordenação de cursos',
      'Escalas com cronograma anual e fluxo de solicitações',
      'Permissões granulares e auditoria de eventos sensíveis',
      'PWA instalável com exportação em PDF e Excel',
    ],
    links: [],
    featured: true,
    disclosure: RESTRICTED,
    caseStudy: {
      context:
        'Sistema interno de uma seção de coordenação de cursos, desenvolvido e implantado durante meu período de serviço temporário. Acesso apenas autenticado, sem cadastro público.',
      problem:
        'O planejamento, a coordenação e o acompanhamento de cursos exigiam centralizar as informações, padronizar os registros e dar suporte à consulta e à rastreabilidade.',
      objective:
        'Reunir o ciclo de vida dos cursos, as escalas e as solicitações entre pessoas em uma única aplicação web, com permissões por perfil e trilha de auditoria.',
      responsibility: [
        'Levantamento de requisitos junto aos usuários',
        'Mapeamento dos fluxos relacionados aos cursos',
        'Modelo de dados, regras de acesso e organização das telas',
        'Implantação da aplicação e suporte aos usuários',
        'Documentação técnica e funcional',
      ],
      architecture: {
        summary:
          'Aplicação React com roteamento e funções de servidor do TanStack Start, publicada em Cloudflare Workers, sobre Supabase. A autorização é decidida no banco.',
        layers: [
          { name: 'Interface', detail: 'React 19 e TypeScript, TanStack Router e Query, Tailwind e componentes Radix, formulários com validação por schema.' },
          { name: 'Servidor', detail: 'Funções de servidor para operações administrativas, publicadas em Cloudflare Workers.' },
          {
            name: 'Dados',
            detail: 'PostgreSQL no Supabase, com RLS por tabela, funções SQL e tabelas de papéis e permissões.',
          },
          { name: 'Auditoria', detail: 'Registro de eventos sensíveis com retenção definida.' },
          { name: 'Instalação', detail: 'PWA com manifesto configurável pela própria aplicação.' },
        ],
      },
      decisions: [
        {
          title: 'Segurança no banco',
          body: 'Cada tabela tem políticas RLS e as regras de acesso ficam em funções SQL, para que esconder um botão nunca seja a única barreira.',
        },
        {
          title: 'Permissões configuráveis',
          body: 'Cargos, tags e permissões são dados, não código: a administração ajusta quem vê e quem altera sem nova publicação.',
        },
        {
          title: 'Documentação como parte da entrega',
          body: 'O README técnico tem uma regra de processo: qualquer mudança funcional deve atualizar a seção correspondente na mesma entrega.',
        },
      ],
      features: [
        'Catálogo de cursos com planejamento e coordenação',
        'Escalas de coordenadores e supervisores, com cronograma anual',
        'Contagem de atribuições por pessoa, com fechamento mensal e anual',
        'Solicitações de troca e adiantamento com fluxo de aprovação',
        'Indisponibilidades e notificações dentro do sistema',
        'Auditoria de eventos sensíveis',
        'Cargos, tags, permissões e aparência configuráveis',
        'Exportação em PDF e Excel',
      ],
      challenges: [
        {
          challenge: 'Muitos perfis com visibilidades diferentes sobre os mesmos dados.',
          solution: 'Políticas RLS por tabela e funções SQL de verificação, com as regras de visibilidade documentadas.',
        },
        {
          challenge: 'Manter a documentação fiel a um sistema que muda o tempo todo.',
          solution: 'Regra de processo que trata README desatualizado como defeito.',
        },
      ],
      results: [
        'Sistema implantado e utilizado pela equipe.',
        'Centralização das informações, padronização dos registros e melhoria na consulta e na rastreabilidade.',
        `Modelo de dados com ${projectEvidence('sistema-ila-fab').policies} políticas RLS e ${projectEvidence('sistema-ila-fab').sqlFunctions} funções SQL declaradas nas migrações.`,
      ],
      learnings: [
        'Levantar requisitos com quem usa o sistema muda o desenho mais do que qualquer escolha de framework.',
        'O projeto não tem testes automatizados nem CI. Regras de negócio como as escalas pedem testes e é o que eu faria primeiro numa próxima rodada.',
      ],
      status: 'Em uso. Sem release público, por ser sistema institucional.',
    },
  },
  {
    slug: 'sistema-de-escalas',
    name: 'Sistema de escalas de serviço',
    category: 'Aplicação web interna',
    kind: 'web',
    status: 'Projeto interno',
    tone: 'internal',
    tagline:
      'Aplicação web interna para gerar e gerenciar escalas de serviço.',
    highlights: [
      'Geração de escalas com regras de negócio',
      'Trocas, adiantamentos e aprovações',
      'Importação e exportação em CSV, Excel e PDF',
      'Logs de auditoria e permissões por usuário',
    ],
    links: [],
    featured: false,
    disclosure: 'Código-fonte e dados não são públicos.',
  },
  {
    slug: 'meu-financeiro',
    name: 'Meu Financeiro',
    category: 'Aplicativo mobile',
    kind: 'mobile',
    status: 'Em breve',
    tone: 'concept',
    tagline: 'Organização financeira pessoal: seu dinheiro, seus planos, no seu controle.',
    highlights: [
      'Controle de receitas e despesas',
      'Objetivos financeiros',
      'Acompanhamento da evolução financeira',
      'Dados 100% locais',
    ],
    links: [],
    featured: false,
    family: 'Apps Meu',
    heroImage: {
      slug: 'meu-financeiro',
      alt: 'Imagem ilustrativa do Meu Financeiro: painel do aplicativo no celular e em um monitor, com saldo, receitas, despesas, categorias e objetivos.',
    },
    showcase: {
      intro:
        'Aplicativo de organização financeira pessoal da família Apps Meu, pensado para dar clareza sobre receitas, despesas, metas e evolução, com os dados guardados no próprio aparelho.',
      pointsTitle: 'Proposta do produto',
      points: [
        'Controle de receitas e despesas',
        'Definição e acompanhamento de objetivos',
        'Visão da evolução financeira ao longo do tempo',
        'Dados 100% locais',
      ],
      identity:
        'Identidade própria em azul e verde-água, com o "M" da família Apps Meu acompanhado de um gráfico de crescimento. Visual claro, limpo e estratégico.',
      status:
        'O repositório ainda não foi publicado. O case técnico — arquitetura, decisões e testes — entra aqui quando o projeto estiver disponível. A imagem desta página é ilustrativa e os valores exibidos nela são fictícios.',
    },
  },
  {
    slug: 'meu-treino',
    name: 'Meu Treino',
    category: 'Aplicativo mobile',
    kind: 'mobile',
    status: 'Em breve',
    tone: 'concept',
    tagline: 'Disciplina hoje, resultados sempre: treinos organizados e evolução no controle.',
    highlights: [
      'Treinos personalizados',
      'Acompanhamento da evolução',
      'Registro de séries e repetições',
      'Foco e disciplina',
    ],
    links: [],
    featured: false,
    family: 'Apps Meu',
    heroImage: {
      slug: 'meu-treino',
      alt: 'Imagem ilustrativa do Meu Treino: tela inicial do aplicativo no celular, com o próximo treino, metas semanais e gráfico de evolução, em ambiente escuro de academia.',
    },
    showcase: {
      intro:
        'Aplicativo de treino da família Apps Meu: organiza os treinos, registra séries e repetições e mostra a evolução para manter a consistência.',
      pointsTitle: 'Proposta do produto',
      points: [
        'Treinos personalizados por objetivo',
        'Registro de séries e repetições',
        'Acompanhamento do progresso',
        'Metas semanais e foco em disciplina',
      ],
      identity:
        'Identidade própria em modo escuro, com azul-petróleo e turquesa e o "M" da família Apps Meu ao lado de um halter. Visual atlético, energético e tecnológico.',
      status:
        'O repositório ainda não foi publicado. O case técnico — arquitetura, decisões e testes — entra aqui quando o projeto estiver disponível. A imagem desta página é ilustrativa.',
    },
  },
  {
    slug: 'meu-perfil',
    name: 'Portfólio profissional',
    category: 'Site estático',
    kind: 'site',
    status: 'No ar',
    tone: 'published',
    tagline:
      'Este site: Astro estático, sem framework no navegador, com camadas 3D em CSS e conteúdo calculado a partir dos repositórios.',
    highlights: [
      'HTML estático com JavaScript mínimo no cliente',
      '3D em CSS, com fallback para redução de movimento',
      'Números gerados dos repositórios, não digitados',
      'Verificação de contraste e metadados no CI',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/guilhermegpo/meu-perfil' },
      { label: 'Ver site', href: 'https://guilhermegpo.github.io/meu-perfil/' },
    ],
    featured: false,
    repository: 'https://github.com/guilhermegpo/meu-perfil',
    caseStudy: {
      context:
        'O portfólio é o produto que apresenta os demais projetos e precisa ele mesmo demonstrar critério de engenharia.',
      problem:
        'Portfólios de framework entregam o conteúdo só depois do JavaScript rodar, repetem tecnologias sem provar uso e costumam afirmar números que ninguém consegue verificar.',
      objective:
        'Um site rápido, acessível e indexável, com identidade própria e com conteúdo que possa ser rastreado até um repositório.',
      responsibility: [
        'Identidade visual e sistema de design',
        'Implementação dos componentes, do 3D em CSS e da navegação',
        'Coletor de evidências dos repositórios e verificação automatizada',
        'Publicação contínua no GitHub Pages',
      ],
      architecture: {
        summary:
          'Astro gera HTML em build. O navegador recebe CSS inline e um único módulo pequeno de interação; nenhum framework é hidratado.',
        layers: [
          { name: 'Conteúdo', detail: 'Dados tipados em src/data; números vindos de um JSON gerado a partir dos repositórios.' },
          { name: 'Apresentação', detail: 'Componentes Astro com CSS com escopo e tokens de design.' },
          { name: 'Interação', detail: 'Um módulo TypeScript: navegação, revelação ao rolar, tilt e parallax com requestAnimationFrame.' },
          { name: 'Verificação', detail: 'Script que mede contraste WCAG lendo os tokens do CSS, confere metadados e links internos.' },
          { name: 'Publicação', detail: 'GitHub Actions: tipos, lint, testes, build, verificação e deploy no GitHub Pages.' },
        ],
      },
      decisions: [
        {
          title: 'CSS 3D em vez de Three.js',
          body: 'A composição do hero usa perspective, preserve-3d e translateZ. O efeito pretendido não justifica uma biblioteca de centenas de kilobytes.',
        },
        {
          title: 'Números derivados, nunca digitados',
          body: 'Contagem de testes e de projetos por tecnologia é calculada por um coletor que executa as suítes e lê os manifestos dos repositórios.',
        },
        {
          title: 'Movimento é opcional',
          body: 'Tilt, parallax e animações contínuas ficam desligados com prefers-reduced-motion e em dispositivos modestos; nenhuma informação depende do mouse.',
        },
        {
          title: 'Casos com página própria',
          body: 'Cada case tem URL, título e dados estruturados, em vez de um modal que não pode ser compartilhado.',
        },
      ],
      features: [
        'Hero com composição 3D em CSS e a marca GPO',
        'Cartões de projeto com tilt em desktop e destaque por rolagem em toque',
        'Cases individuais com problema, decisões e aprendizados',
        'Stack e métricas calculadas dos repositórios',
        'SEO completo: canonical, Open Graph, Twitter, JSON-LD e sitemap',
      ],
      challenges: [
        {
          challenge: 'Profundidade 3D sem custo de performance.',
          solution: 'Apenas transform e opacity, um laço requestAnimationFrame que para quando nada muda e pausa fora da viewport.',
        },
        {
          challenge: 'Efeito por cursor que não existe em telas de toque.',
          solution: 'Em toque, o cartão em destaque na rolagem ganha luz e profundidade; o tilt por ponteiro nem é carregado.',
        },
      ],
      results: [
        'Site publicado com verificação automatizada de contraste, metadados e links a cada alteração.',
        'Sem dependência de terceiros em tempo de execução: fontes e imagens próprias.',
      ],
      learnings: [
        'Restringir o que o site pode afirmar ao que o repositório prova deixa o conteúdo mais curto e mais confiável.',
      ],
      status: 'No ar, em evolução contínua.',
    },
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

/** Produtos da família Apps Meu, na ordem em que aparecem na vitrine. */
export const appsMeu = ['meu-financeiro', 'meu-chamado', 'meu-treino']
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => project !== undefined);

/** Todo projeto com página própria: case completo ou vitrine enxuta. */
export const hasPage = (project: Project): boolean => Boolean(project.caseStudy ?? project.showcase);

export const projectBySlug = (slug: string): Project => {
  const found = projects.find((project) => project.slug === slug);
  if (!found) throw new Error(`Projeto desconhecido: ${slug}`);
  return found;
};

/** Sinais técnicos verificáveis exibidos no cartão, calculados da evidência. */
export function projectSignals(slug: string): string[] {
  if (!(slug in evidence.projects)) return [];
  const e = projectEvidence(slug);
  const signals: string[] = [];
  if (e.testCases > 0) signals.push(`${formatNumber(e.testCases)} testes`);
  if (e.adrs > 0) signals.push(`${e.adrs} ADRs`);
  if (e.policies > 0) signals.push(`${e.policies} políticas RLS`);
  return signals;
}

const CARD_STACK_HIDDEN = new Set(['Vite', 'Prettier', 'ESLint', 'Dart', 'Flutter Test', 'Vitest']);
const CATEGORY_PRIORITY = ['Mobile', 'Frontend', 'Backend', 'Banco de dados', 'DevOps', 'Ferramentas'];

/** Tecnologias detectadas no projeto, ordenadas por relevância. */
export function projectStack(slug: string, { all = false } = {}): string[] {
  return evidence.technologies
    .filter((t) => t.projects.includes(slug))
    .filter((t) => all || !CARD_STACK_HIDDEN.has(t.name))
    .sort((a, b) => CATEGORY_PRIORITY.indexOf(a.category) - CATEGORY_PRIORITY.indexOf(b.category))
    .map((t) => t.name);
}
