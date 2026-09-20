/**
 * Stack por categoria, calculada a partir dos repositórios.
 *
 * Nada é digitado à mão: `scripts/collect-evidence.mjs` detecta cada
 * tecnologia nos arquivos do projeto (dependências, manifestos, migrations,
 * workflows) e o site só agrupa e conta. Se a tecnologia não tem evidência,
 * não aparece — e por isso não há percentual de habilidade: o que é
 * verificável é onde a tecnologia foi usada, não "quanto" se sabe dela.
 *
 * Práticas de engenharia (CI, ADRs, testes) têm seção própria em
 * `engineering.ts`; aqui entra só tecnologia.
 */
import { evidence, type TechnologyEvidence } from './evidence';

export interface StackGroup {
  readonly title: string;
  readonly items: readonly TechnologyEvidence[];
}

const ORDER = ['Frontend', 'Mobile', 'Backend', 'Banco de dados', 'DevOps', 'Ferramentas'] as const;

export const stackGroups: readonly StackGroup[] = ORDER.map((title) => ({
  title,
  items: evidence.technologies
    .filter((t) => t.category === title)
    .slice()
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR')),
})).filter((group) => group.items.length > 0);

/** "1 projeto" / "3 projetos". */
export const projectCountLabel = (count: number): string =>
  `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
