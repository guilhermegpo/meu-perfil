/**
 * Práticas de engenharia.
 *
 * Agrupadas em quatro temas em vez de listadas como onze palavras soltas.
 * Cada linha aponta para algo que existe e pode ser conferido nos
 * repositórios públicos — não é declaração de intenção.
 */
export interface Practice {
  readonly title: string;
  readonly body: string;
  readonly items: readonly string[];
}

export const practices: readonly Practice[] = [
  {
    title: 'Versionamento e revisão',
    body: 'Nada entra em uma branch permanente sem passar por pull request com verificação automática.',
    items: [
      'Branch protection em main e develop',
      'Pull request com status checks obrigatórios',
      'Conventional Commits',
      'Versionamento semântico, com pré-versões',
    ],
  },
  {
    title: 'Automação',
    body: 'A verificação roda sozinha em cada pull request, no runner limpo — não só na minha máquina.',
    items: [
      'GitHub Actions em todo PR',
      'Formatação, tipos, testes e build',
      'Publicação contínua a cada merge',
    ],
  },
  {
    title: 'Verificação',
    body: 'Teste automatizado onde a lógica quebra em silêncio, e verificação própria onde a ferramenta pronta não cobre.',
    items: [
      '28 testes automatizados no Meu Chamado',
      'Script que mede contraste WCAG lendo os tokens do CSS',
      'Validação de metadados e de links internos no build',
    ],
  },
  {
    title: 'Decisões e limites',
    body: 'Escolha de arquitetura relevante vira registro escrito, com contexto, alternativas e consequências.',
    items: [
      'ADRs versionados junto ao código',
      'Privacy by design: nenhum dado real em repositório público',
      'Acessibilidade tratada como requisito, não como ajuste final',
    ],
  },
];
