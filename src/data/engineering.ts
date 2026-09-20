/**
 * Como eu construo software: práticas que aparecem no código dos projetos.
 *
 * Cada item aponta para evidência que pode ser conferida. Quando a prática só
 * existe em parte dos projetos, o texto diz em quais — e o que falta. Números
 * vêm do JSON gerado a partir dos repositórios.
 */
import { evidence, formatNumber, projectEvidence } from './evidence';

export interface Practice {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  /** Linhas de evidência, curtas e verificáveis. */
  readonly evidence: readonly string[];
}

const tech = (name: string): number => evidence.technologies.find((t) => t.name === name)?.count ?? 0;
const chamado = projectEvidence('meu-chamado');
const chaves = projectEvidence('controle-de-chaves');
const { metrics } = evidence;

export const practices: readonly Practice[] = [
  {
    id: 'architecture',
    title: 'Arquitetura',
    summary: 'Dependências apontando para o domínio e decisões registradas com as alternativas descartadas.',
    evidence: [
      `${chamado.adrs} ADRs no Meu Chamado`,
      'Camadas: apresentação, aplicação, domínio, infraestrutura',
      'Documento de arquitetura no Controle de Chaves',
    ],
  },
  {
    id: 'testing',
    title: 'Testes',
    summary: 'Teste automatizado onde a regra quebra em silêncio: invariantes, migrações e serviços.',
    evidence: [
      `${formatNumber(metrics.automatedTests)} testes em ${metrics.testedProjects} projetos`,
      `${formatNumber(chamado.testCases)} no Flutter, ${formatNumber(chaves.testCases)} no Vitest`,
      'Relógio injetável para testar virada de período',
    ],
  },
  {
    id: 'security',
    title: 'Segurança',
    summary: 'A barreira fica no banco e no armazenamento seguro, não na tela.',
    evidence: [
      `RLS em ${tech('Row Level Security')} projetos`,
      'PIN com PBKDF2 e banco local criptografado',
      'Sessão em armazenamento seguro, com biometria',
      'Nenhum segredo em repositório público',
    ],
  },
  {
    id: 'offline',
    title: 'Offline-first',
    summary: 'O banco local é a fonte de trabalho e a rede é opcional.',
    evidence: [
      'Meu Chamado: SQLite local como fonte de trabalho',
      `PWA em ${tech('PWA')} projetos`,
      'Migração de dados com verificação, backup e desfazer',
    ],
  },
  {
    id: 'rbac',
    title: 'RBAC',
    summary: 'Papéis e permissões verificados em um único ponto, com invariantes protegidas.',
    evidence: [
      'Meu Chamado: três papéis e proteção do último administrador',
      'Controle de Chaves: quatro perfis com permissões por operação',
      'Sistemas web: tabelas de papéis e permissões por usuário',
    ],
  },
  {
    id: 'database',
    title: 'Banco de dados',
    summary: 'Esquema versionado, regras transacionais e histórico que não se reescreve.',
    evidence: [
      `${chaves.migrations} migrações SQL no Controle de Chaves`,
      'Índices únicos parciais e funções com trava de linha',
      'Snapshots para preservar o histórico',
      'Migrações aditivas, compatíveis com versões instaladas',
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD',
    summary: 'A verificação roda em runner limpo, a cada pull request.',
    evidence: [
      `GitHub Actions em ${tech('GitHub Actions')} projetos`,
      'Formatação, análise, testes e build no Meu Chamado',
      'Tipos, lint, testes, build e verificação antes do deploy deste site',
      'Status checks obrigatórios por ruleset na main',
    ],
  },
  {
    id: 'versioning',
    title: 'Versionamento',
    summary: 'Cada mudança tem histórico legível e cada versão tem número.',
    evidence: [
      `Versionamento semântico, com ${chamado.tags} pré-versões marcadas`,
      'CHANGELOG no formato Keep a Changelog',
      'Conventional Commits e pull requests',
    ],
  },
  {
    id: 'documentation',
    title: 'Documentação',
    summary: 'Documentação faz parte da entrega, não do que sobra depois.',
    evidence: [
      'Modelo de ameaças e documentos de privacidade e domínio',
      'Guias de banco, segurança, release e recuperação',
      'Regra de processo: README desatualizado é defeito',
    ],
  },
  {
    id: 'ux',
    title: 'UX e acessibilidade',
    summary: 'Interface pensada para quem usa: contraste, foco, teclado e movimento reduzido.',
    evidence: [
      'Contraste WCAG medido por script a partir dos tokens do CSS',
      'Foco visível, navegação por teclado e prefers-reduced-motion',
      'Levantamento de requisitos com os usuários do sistema institucional',
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    summary: 'Medir antes de otimizar e evitar o que não se justifica.',
    evidence: [
      'Este site: HTML estático, fontes próprias, JavaScript mínimo',
      'Script de profiling no Controle de Chaves',
      'Animações só com transform e opacity',
    ],
  },
];

export interface Metric {
  readonly value: string;
  readonly label: string;
}

/** Métricas exibidas na faixa de números, todas derivadas da evidência. */
export const metricsStrip: readonly Metric[] = [
  { value: String(metrics.projectsAnalyzed), label: 'Projetos analisados' },
  { value: formatNumber(metrics.automatedTests), label: 'Testes automatizados' },
  { value: String(metrics.technologies), label: 'Tecnologias utilizadas' },
  { value: String(metrics.mobileApps), label: 'Aplicações mobile' },
  { value: String(metrics.webSystems), label: 'Sistemas web' },
];
