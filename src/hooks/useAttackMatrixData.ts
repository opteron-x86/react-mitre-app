// src/hooks/useAttackMatrixData.ts
import { useMemo, useState, useCallback } from 'react';
import { Technique, Rule, TechniqueWithSubtechniques } from '@/types';

export type DisplayMode = 't-code' | 'name' | 'both';

export const useAttackMatrixData = (techniques: Technique[], rules: Rule[]) => {
  // State for expanded technique cards
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Toggle technique expansion
  const handleToggleExpand = useCallback((techniqueId: string) => {
    setExpanded((prev) => ({ ...prev, [techniqueId]: !prev[techniqueId] }));
  }, []);

  // Group techniques by tactic and nest subtechniques
  const groupedTechniques = useMemo(() => {
    const groups: Record<string, TechniqueWithSubtechniques[]> = {};
    const parentMap: Record<string, TechniqueWithSubtechniques> = {};

    // Create parent entries
    techniques.forEach((tech) => {
      if (!tech.isSubtechnique) {
        parentMap[tech.externalId] = { ...tech, subtechniques: [] };
      }
    });

    // Assign subtechniques to parents
    techniques.forEach((tech) => {
      if (tech.isSubtechnique) {
        const parentCode = tech.externalId.split('.')[0];
        if (parentMap[parentCode]) {
          parentMap[parentCode].subtechniques!.push(tech as TechniqueWithSubtechniques);
        } else {
          parentMap[tech.externalId] = { ...tech, subtechniques: [] };
        }
      }
    });

    // Group by tactic
    Object.values(parentMap).forEach((parent) => {
      const tactic = parent.tactic;
      if (!groups[tactic]) {
        groups[tactic] = [];
      }
      groups[tactic].push(parent);
    });

    // Sort each group
    Object.keys(groups).forEach((tactic) => {
      groups[tactic].sort((a, b) => a.externalId.localeCompare(b.externalId));
    });

    return groups;
  }, [techniques]);

  // Utility to render technique labels with consistent formatting
  const renderTechniqueLabel = useCallback(
    (tech: Technique) => `${tech.externalId} - ${tech.name}`,
    []
  );

  return {
    // Data processing results
    expanded,
    groupedTechniques,
    filteredGroups: groupedTechniques, // In this version, filteredGroups is the same as groupedTechniques
    
    // Utility functions
    handleToggleExpand,
    renderTechniqueLabel,
  };
};