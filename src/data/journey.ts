/**
 * Trajetória — formação e experiência.
 *
 * Sem datas específicas de incorporação ou dados pessoais: apenas o estágio
 * de cada etapa. Nada aqui descreve experiência profissional em
 * desenvolvimento de software, porque ela ainda não existe.
 */
export type JourneyStatus = 'atual' | 'concluído';

export interface JourneyEntry {
  readonly title: string;
  readonly organization: string;
  readonly status: JourneyStatus;
  readonly description: string;
}

export const journey: readonly JourneyEntry[] = [
  {
    title: 'Desenvolvimento de produtos próprios',
    organization: 'Projetos pessoais',
    status: 'atual',
    description:
      'Construção do Meu Chamado e deste portfólio, aplicando controle de versão, commits convencionais, documentação de arquitetura e integração contínua.',
  },
  {
    title: 'Análise e Desenvolvimento de Sistemas',
    organization: 'Ensino superior',
    status: 'atual',
    description:
      'Graduação em andamento, com foco em lógica de programação, estruturas de dados, banco de dados e engenharia de software.',
  },
  {
    title: 'Serviço militar',
    organization: 'Força Aérea Brasileira',
    status: 'atual',
    description:
      'Rotina em ambiente que exige disciplina operacional, cumprimento de procedimento e responsabilidade sobre processos.',
  },
  {
    title: 'Curso técnico em Tecnologia da Informação',
    organization: 'Microlins',
    status: 'concluído',
    description:
      'Formação técnica inicial em informática e fundamentos de tecnologia da informação.',
  },
];
