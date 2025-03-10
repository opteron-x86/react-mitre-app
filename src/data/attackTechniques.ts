// src/data/attackTechniques.ts
import axios from 'axios';
import { normalizeTechniqueId } from '@/utils/normalizeTechnique';
import { TACTIC_TITLE, getTacticIndex } from '@/data/tacticOrder';
import { Technique } from '@/types';

interface KillChainPhase {
  kill_chain_name?: string;
  phase_name: string;
}

interface ExternalReference {
  source_name?: string;
  url?: string;
  external_id?: string;
}

interface STIXObject {
  type: string;
  id: string;
  name: string;
  description?: string;
  kill_chain_phases?: KillChainPhase[];
  x_mitre_is_subtechnique?: boolean;
  x_mitre_platforms?: string[];
  x_mitre_detection?: string;
  x_mitre_data_sources?: string[];
  x_mitre_version?: string;
  modified?: string;
  external_references?: ExternalReference[];
}

interface STIXBundle {
  objects: STIXObject[];
}

/**
 * Loads and normalizes enterprise ATT&CK techniques from the STIX JSON bundle.
 * The normalized externalId is stored as the T-code in a consistent format (e.g. "T1071.004").
 */
export async function loadTechniques(): Promise<Technique[]> {
  const url = import.meta.env.VITE_ENTERPRISE_ATTACK_URL;
  if (!url) {
    throw new Error('Enterprise ATT&CK URL is not defined in environment variables.');
  }

  const response = await axios.get<STIXBundle>(url);
  const stixBundle = response.data;

  if (!stixBundle.objects || !Array.isArray(stixBundle.objects)) {
    throw new Error('Invalid STIX bundle format.');
  }

  const stixTechniques = stixBundle.objects.filter(
    (obj) => obj.type === 'attack-pattern' && Array.isArray(obj.kill_chain_phases),
  ) as STIXObject[];

  const techniques: Technique[] = stixTechniques.map((obj) => {
    let externalId = obj.id;
    if (Array.isArray(obj.external_references)) {
      const mitreRef = obj.external_references.find((ref) => ref.source_name === 'mitre-attack');
      if (mitreRef?.external_id) {
        externalId = mitreRef.external_id;
      }
    }
    // Apply global normalization:
    externalId = normalizeTechniqueId(externalId);

    // Find the primary tactic and convert to title case.
    let rawTactic = 'none';
    let tacticTitle = 'None';
    if (obj.kill_chain_phases) {
      const validPhase = obj.kill_chain_phases
        .filter((phase) => phase.kill_chain_name === 'mitre-attack')
        .sort((a, b) => getTacticIndex(a.phase_name) - getTacticIndex(b.phase_name))[0];
      if (validPhase) {
        rawTactic = validPhase.phase_name;
        tacticTitle = TACTIC_TITLE[rawTactic] || rawTactic;
      }
    }

    return {
      id: obj.id,             // Original STIX id (for React keys, etc.)
      externalId,             // Normalized T-code (e.g., "T1071.004")
      name: obj.name,
      tactic: rawTactic,      // e.g., "credential-access"
      tacticTitle,            // e.g., "Credential Access"
      isSubtechnique: !!obj.x_mitre_is_subtechnique || externalId.includes('.'),
      description: obj.description,
      detection: obj.x_mitre_detection,
      platforms: obj.x_mitre_platforms || [],
      dataSources: obj.x_mitre_data_sources || [],
      modified: obj.modified,
      version: obj.x_mitre_version,
    };
  });

  return techniques;
}
