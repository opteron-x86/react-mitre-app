// src/types/index.ts
export interface Rule {
  id: string;
  name: string;
  file: string;
  description: string;
  platforms: string[] | string;
  validated: boolean;
  severity: string;
  status: string;
  categories: string[];
  authors: string[] | string;
  date?: string | null;
  modifiedDate?: string;
  lastCommitId?: string;
  falsePositives: string[];
  relatedTechniques: string[];
  detectionSource: string;
  ruleType: string;
  query: string;
  queryFrequency?: string;
  queryPeriod?: string;
  provider?: string;
}

export interface RulesIndexMetadata {
  totalRules: number;
  uniqueRuleCount: number;
  techniqueCount: number;
  generatedAt: string;
  sourceABranch: string;
  sourceBBranch: string;
  sources: { type: string; path: string }[];
}

export interface TechniqueIndexItem {
  techniqueId: string;
  rules: Rule[];
  ruleCount: number;
}

export interface RulesIndex {
  metadata: RulesIndexMetadata;
  rules: Rule[];
  techniqueIndex: Record<string, TechniqueIndexItem>;
}

/**
 * Base Technique interface for STIX data.
 */
export interface Technique {
  id: string;
  externalId: string;
  name: string;
  tactic: string;
  tacticTitle: string;
  isSubtechnique: boolean;
  description?: string;
  detection?: string;
  platforms?: string[];
  dataSources?: string[];
  modified?: string;
  version?: string;
}

/**
 * Extended Technique interface that includes subtechniques
 */
export interface TechniqueWithSubtechniques extends Technique {
  subtechniques?: TechniqueWithSubtechniques[];
}

export interface RuleIndexItem {
  id: string; 
  name: string;
  description: string;
  platforms: string[] | string;
  severity: string;
  status: string;
}