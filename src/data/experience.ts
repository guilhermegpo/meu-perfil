/**
 * Experiência profissional.
 *
 * Duas decisões conscientes sobre como isto é apresentado:
 *
 *  - A **organização** é o título da entrada, e o cargo formal aparece na
 *    linha de apoio. Para quem recruta em tecnologia, "desenvolvimento de
 *    sistema interno no ILA" comunica mais rápido do que o cargo formal —
 *    que continua registrado, corretamente, logo abaixo.
 *  - Nada de informação militar sensível: sem unidade operacional, sem
 *    efetivo, sem detalhe de missão. Só o que descreve o trabalho técnico.
 */
export interface ExperienceEntry {
  readonly organization: string;
  readonly role: string;
  /** Resumo do trabalho, exibido ao lado do cargo. Opcional. */
  readonly focus?: string;
  readonly period: string;
  readonly location: string;
  readonly summary: string;
  readonly achievements: readonly string[];
  readonly stack?: readonly string[];
  /** Slug do case detalhado em `/projetos/`, quando existe. */
  readonly caseStudy?: string;
}

export const experience: readonly ExperienceEntry[] = [
  {
    organization: 'Instituto de Logística da Aeronáutica — ILA/FAB',
    role: 'Soldado Temporário',
    focus: 'Desenvolvimento e implantação de aplicação interna',
    period: '08/2023 — 06/2026',
    location: 'Guarulhos, SP',
    summary:
      'Desenvolvi e implantei uma aplicação web interna para apoiar o planejamento, a coordenação e o gerenciamento de cursos, atuando no levantamento de requisitos, no mapeamento de fluxos, no desenvolvimento, na documentação e no suporte aos usuários.',
    achievements: [
      'Levantamento de requisitos e mapeamento de fluxos junto aos usuários da área',
      'Desenvolvimento da aplicação web com React, TypeScript e TanStack Router',
      'Uso de Supabase e PostgreSQL para persistência e consulta das informações',
      'Implantação da aplicação e suporte aos usuários após a entrega',
      'Documentação do sistema e dos processos para continuidade da operação',
      'Padronização de registros e melhoria dos processos de consulta e rastreabilidade',
    ],
    stack: ['React', 'TypeScript', 'TanStack Router', 'Supabase', 'PostgreSQL'],
    caseStudy: 'sistema-ila-fab',
  },
  {
    organization: 'Torre Contabilidade LTDA',
    role: 'Auxiliar Fiscal',
    period: '02/2022 — 07/2023',
    location: 'São Paulo, SP',
    summary:
      'Rotina fiscal com prazos legais rígidos e alto volume de informação. Experiência que formou a base de organização e rigor com dados que hoje aplico em desenvolvimento.',
    achievements: [
      'Tratamento e conferência de informações fiscais sob prazos inegociáveis',
      'Organização de documentos e rotinas recorrentes',
      'Atendimento e comunicação com clientes e equipe',
    ],
  },
];
