// src/data/tacticOrder.ts

/**
 * The official MITRE ATT&CK order of tactics (enterprise) as of v13:
 * https://attack.mitre.org/tactics/enterprise/
 */
export const TACTIC_ORDER: string[] = [
    'reconnaissance',
    'resource-development',
    'initial-access',
    'execution',
    'persistence',
    'privilege-escalation',
    'defense-evasion',
    'credential-access',
    'discovery',
    'lateral-movement',
    'collection',
    'command-and-control',
    'exfiltration',
    'impact',
  ];
  
  /**
   * Title-cased tactic names.
   */
  export const TACTIC_TITLE: Record<string, string> = {
    'reconnaissance': 'Reconnaissance',
    'resource-development': 'Resource Development',
    'initial-access': 'Initial Access',
    'execution': 'Execution',
    'persistence': 'Persistence',
    'privilege-escalation': 'Privilege Escalation',
    'defense-evasion': 'Defense Evasion',
    'credential-access': 'Credential Access',
    'discovery': 'Discovery',
    'lateral-movement': 'Lateral Movement',
    'collection': 'Collection',
    'command-and-control': 'Command and Control',
    'exfiltration': 'Exfiltration',
    'impact': 'Impact',
  };
  
  /**
   * Return the index of a tactic in the official order, or a large number if not found.
   */
  export function getTacticIndex(tactic: string): number {
    const idx = TACTIC_ORDER.indexOf(tactic);
    return idx === -1 ? 999 : idx;
  }
  