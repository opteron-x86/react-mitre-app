// src/utils/normalizeTechnique.ts

/**
 * Normalizes a technique identifier by:
 * - Removing an "attack." prefix if present.
 * - Converting the result to uppercase.
 * 
 * For example, "attack.t1071.004" becomes "T1071.004".
 */
export const normalizeTechniqueId = (id: string): string => {
    let norm = id.trim().toUpperCase();
    if (norm.startsWith('ATTACK.')) {
      norm = norm.substring(7);
    }
    return norm;
  };
  