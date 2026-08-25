/**
 * Formação. Seção deliberadamente enxuta — ela confirma, não vende.
 *
 * Sem instituição onde ela não foi informada: inventar nome de faculdade é o
 * tipo de detalhe que se desfaz na primeira checagem de referência.
 */
export interface EducationEntry {
  readonly title: string;
  readonly institution?: string;
  readonly period?: string;
  readonly status: 'concluído' | 'em andamento';
  readonly note?: string;
}

export const education: readonly EducationEntry[] = [
  {
    title: 'Análise e Desenvolvimento de Sistemas — ADS',
    institution: 'Universidade Cruzeiro do Sul',
    period: '02/2022 — 07/2026',
    status: 'concluído',
    note: 'Graduação em tecnologia, com base em lógica de programação, estruturas de dados, banco de dados e engenharia de software.',
  },
  {
    title: 'Curso técnico em Tecnologia da Informação',
    institution: 'Microlins',
    status: 'concluído',
    note: 'Formação técnica inicial em informática e fundamentos de TI.',
  },
  {
    title: 'Inglês — nível intermediário',
    status: 'concluído',
    note: 'Leitura de documentação técnica e acompanhamento de material em inglês.',
  },
];
