/**
 * Evidências geradas a partir dos repositórios (`npm run evidence`).
 *
 * Este módulo só tipa e expõe o JSON. Nenhum número do site é escrito à mão:
 * contagens de projetos por tecnologia, total de testes e afins vêm daqui.
 */
import raw from './evidence.generated.json';

export interface TechnologyEvidence {
  readonly category: string;
  readonly name: string;
  /** Ids de projeto (ver `projects.ts`) em que a tecnologia foi detectada. */
  readonly projects: readonly string[];
  readonly count: number;
}

export interface ProjectEvidence {
  readonly migrations: number;
  readonly sqlFunctions: number;
  readonly policies: number;
  readonly adrs: number;
  readonly testCases: number;
  readonly testFiles: number;
  readonly tags: number;
  readonly commits: number;
  /** Versão declarada no manifesto do projeto (pubspec), quando existe. */
  readonly version: string | null;
}

export interface Evidence {
  readonly generatedAt: string;
  readonly metrics: {
    readonly projectsAnalyzed: number;
    readonly automatedTests: number;
    readonly testedProjects: number;
    readonly mobileApps: number;
    readonly webSystems: number;
    readonly technologies: number;
    readonly adrs: number;
  };
  readonly projects: Readonly<Record<string, ProjectEvidence>>;
  readonly technologies: readonly TechnologyEvidence[];
}

export const evidence = raw as Evidence;

/** Evidência de um projeto; falha no build se o id não existir no JSON. */
export function projectEvidence(id: string): ProjectEvidence {
  const found = evidence.projects[id];
  if (!found) throw new Error(`Sem evidência para o projeto "${id}". Rode npm run evidence.`);
  return found;
}

/** Formata milhar no padrão pt-BR. */
export const formatNumber = (n: number): string => n.toLocaleString('pt-BR');
