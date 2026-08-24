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
    focus: 'Desenvolvimento de sistema interno',
    period: 'ago/2023 — jun/2026',
    location: 'Guarulhos, SP',
    summary:
      'Desenvolvi e implantei uma aplicação web interna para gestão de cursos, atuando em todas as etapas: levantamento de requisitos com os usuários, mapeamento dos fluxos existentes, desenvolvimento, modelagem do banco de dados, implantação e suporte.',
    achievements: [
      'Levantamento de requisitos e mapeamento de fluxos junto aos usuários da área',
      'Desenvolvimento da aplicação web e modelagem do banco de dados relacional',
      'Implantação em ambiente real e suporte aos usuários após a entrega',
      'Documentação do sistema e dos processos para continuidade da operação',
    ],
    stack: ['React', 'TypeScript', 'TanStack Router', 'Supabase', 'PostgreSQL'],
    caseStudy: 'sistema-ila-fab',
  },
  {
    organization: 'Torre Contabilidade LTDA',
    role: 'Auxiliar Fiscal',
    period: 'fev/2022 — jul/2023',
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
