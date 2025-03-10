import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Rule } from '@/types';
import { Technique } from '@/types';
import { TACTIC_TITLE } from '@/data/tacticOrder';

type DisplayMode = 't-code' | 'name' | 'both';

interface TechniqueWithSubtechniques extends Technique {
  subtechniques?: TechniqueWithSubtechniques[];
}

interface AttackMatrixProps {
  rules: Rule[];
  techniques: Technique[];
}

const AttackMatrix: React.FC<AttackMatrixProps> = ({ rules, techniques }) => {
  // -----------------------------
  // Filter States
  // -----------------------------
  const [selectedTactics, setSelectedTactics] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('both');
  const [ruleExistence, setRuleExistence] = useState<boolean>(false);
  const [validatedOnly, setValidatedOnly] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleToggleExpand = (techniqueId: string) => {
    setExpanded((prev) => ({ ...prev, [techniqueId]: !prev[techniqueId] }));
  };

  // -----------------------------
  // Derive All Tactics, Platforms & Data Sources (from techniques)
  // -----------------------------
  const allTactics = useMemo(() => {
    const setOfTactics = new Set<string>();
    techniques.forEach((tech) => setOfTactics.add(tech.tactic));
    return Array.from(setOfTactics);
  }, [techniques]);

  const allPlatforms = useMemo(() => {
    const platformsSet = new Set<string>();
    techniques.forEach((tech) => {
      if (tech.platforms && Array.isArray(tech.platforms)) {
        tech.platforms.forEach((p) => platformsSet.add(p));
      }
    });
    return Array.from(platformsSet);
  }, [techniques]);

  const allDataSources = useMemo(() => {
    const dsSet = new Set<string>();
    techniques.forEach((tech) => {
      if (tech.dataSources && Array.isArray(tech.dataSources)) {
        tech.dataSources.forEach((ds) => dsSet.add(ds));
      }
    });
    return Array.from(dsSet);
  }, [techniques]);

  // -----------------------------
  // Group by Tactic & Nest Subtechniques
  // -----------------------------
  const groupedTechniques = useMemo(() => {
    const groups: Record<string, TechniqueWithSubtechniques[]> = {};
    const parentMap: Record<string, TechniqueWithSubtechniques> = {};

    // Create parent entries for non-subtechniques
    techniques.forEach((tech) => {
      if (!tech.isSubtechnique) {
        parentMap[tech.externalId] = { ...tech, subtechniques: [] };
      }
    });

    // Assign subtechniques to their parent based on externalId (portion before the dot)
    techniques.forEach((tech) => {
      if (tech.isSubtechnique) {
        const parentCode = tech.externalId.split('.')[0];
        if (parentMap[parentCode]) {
          parentMap[parentCode].subtechniques!.push(tech as TechniqueWithSubtechniques);
        } else {
          // If no parent exists, treat as its own parent.
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

    // Sort each group by externalId
    Object.keys(groups).forEach((tactic) => {
      groups[tactic].sort((a, b) => a.externalId.localeCompare(b.externalId));
    });

    return groups;
  }, [techniques]);

  // -----------------------------
  // Filtering Logic
  // -----------------------------
  // Wrap filterTechnique in useCallback so its reference is stable.
  const filterTechnique = useCallback(
    (tech: Technique) => {
      // Filter by tactic selection
      if (selectedTactics.length > 0 && !selectedTactics.includes(tech.tactic)) {
        return false;
      }
      // Filter by search text (externalId and name)
      const s = searchText.toLowerCase();
      if (s) {
        const inExternal = tech.externalId.toLowerCase().includes(s);
        const inName = tech.name.toLowerCase().includes(s);
        if (!inExternal && !inName) {
          return false;
        }
      }
      // Filter by rule existence and validation (still using rules)
      if (ruleExistence) {
        const matching = rules.filter((rule) => {
          const related = Array.isArray(rule.relatedTechniques)
            ? rule.relatedTechniques
            : [rule.relatedTechniques];
          return related.includes(tech.externalId);
        });
        if (matching.length === 0) return false;
      }
      if (validatedOnly) {
        const matching = rules.filter((rule) => {
          const related = Array.isArray(rule.relatedTechniques)
            ? rule.relatedTechniques
            : [rule.relatedTechniques];
          return related.includes(tech.externalId) && rule.validated;
        });
        if (matching.length === 0) return false;
      }
      // Filter by platform (from technique.platforms)
      if (selectedPlatforms.length > 0) {
        if (!tech.platforms || !tech.platforms.some((p) => selectedPlatforms.includes(p))) {
          return false;
        }
      }
      // Filter by data source (from technique.dataSources)
      if (selectedDataSources.length > 0) {
        if (!tech.dataSources || !tech.dataSources.some((ds) => selectedDataSources.includes(ds))) {
          return false;
        }
      }
      return true;
    },
    [
      selectedTactics,
      searchText,
      ruleExistence,
      validatedOnly,
      selectedPlatforms,
      selectedDataSources,
      rules,
    ],
  );

  const filteredGroups = useMemo(() => {
    const result: Record<string, TechniqueWithSubtechniques[]> = {};
    Object.keys(groupedTechniques).forEach((tactic) => {
      const parents = groupedTechniques[tactic].filter(
        (p) =>
          filterTechnique(p) ||
          (p.subtechniques && p.subtechniques.some((sub) => filterTechnique(sub))),
      );
      if (parents.length > 0) {
        result[tactic] = parents;
      }
    });
    return result;
  }, [groupedTechniques, filterTechnique]);

  const renderTechniqueLabel = (tech: Technique) => {
    switch (displayMode) {
      case 't-code':
        return tech.externalId;
      case 'name':
        return tech.name;
      case 'both':
      default:
        return `${tech.externalId} - ${tech.name}`;
    }
  };

  // -----------------------------
  // Render Component
  // -----------------------------
  return (
    <Box>
      {/* Filters */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Tactic Filter */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="tactic-filter-label">Tactic</InputLabel>
          <Select
            labelId="tactic-filter-label"
            multiple
            value={selectedTactics}
            label="Tactic"
            onChange={(e) => {
              const val = e.target.value;
              setSelectedTactics(typeof val === 'string' ? val.split(',') : val);
            }}
          >
            {allTactics.map((t) => (
              <MenuItem key={t} value={t}>
                {TACTIC_TITLE[t] || t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Platform Filter */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="platform-filter-label">Platform</InputLabel>
          <Select
            labelId="platform-filter-label"
            multiple
            value={selectedPlatforms}
            label="Platform"
            onChange={(e) => {
              const val = e.target.value;
              setSelectedPlatforms(typeof val === 'string' ? val.split(',') : val);
            }}
          >
            {allPlatforms.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Data Sources Filter */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="datasource-filter-label">Data Sources</InputLabel>
          <Select
            labelId="datasource-filter-label"
            multiple
            value={selectedDataSources}
            label="Data Sources"
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDataSources(typeof val === 'string' ? val.split(',') : val);
            }}
          >
            {allDataSources.map((ds) => (
              <MenuItem key={ds} value={ds}>
                {ds}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Display Mode */}
        <FormControl component="fieldset">
          <Typography variant="subtitle2">Display Mode</Typography>
          <RadioGroup
            row
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
          >
            <FormControlLabel value="t-code" control={<Radio />} label="T-code" />
            <FormControlLabel value="name" control={<Radio />} label="Name" />
            <FormControlLabel value="both" control={<Radio />} label="Both" />
          </RadioGroup>
        </FormControl>

        {/* Rule Existence and Validation */}
        <FormControlLabel
          control={<Checkbox checked={ruleExistence} onChange={(e) => setRuleExistence(e.target.checked)} />}
          label="Only with Rule"
        />
        <FormControlLabel
          control={<Checkbox checked={validatedOnly} onChange={(e) => setValidatedOnly(e.target.checked)} />}
          label="Only Validated Rule"
        />

        {/* Search */}
        <TextField label="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      </Box>

      {/* Layout for Tactics */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%' }}>
        {Object.keys(filteredGroups).map((tactic) => (
          <Box key={tactic} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Paper sx={{ p: 1 }}>
              <Typography
                variant="h6"
                align="center"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}
              >
                {TACTIC_TITLE[tactic] || tactic}
              </Typography>

              {filteredGroups[tactic].map((parent) => (
                <Box
                  key={parent.id}
                  sx={{
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">{renderTechniqueLabel(parent)}</Typography>
                    {parent.subtechniques && parent.subtechniques.length > 0 && (
                      <IconButton size="small" onClick={() => handleToggleExpand(parent.externalId)}>
                        <ExpandMoreIcon
                          sx={{
                            transform: expanded[parent.externalId] ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                          }}
                        />
                      </IconButton>
                    )}
                  </Box>

                  {parent.subtechniques && parent.subtechniques.length > 0 && (
                    <Collapse in={expanded[parent.externalId]} timeout="auto">
                      <Box sx={{ pl: 2, mt: 1 }}>
                        {parent.subtechniques.filter(filterTechnique).map((sub) => (
                          <Typography key={sub.id} variant="body2" sx={{ mb: 0.5 }}>
                            {renderTechniqueLabel(sub)}
                          </Typography>
                        ))}
                      </Box>
                    </Collapse>
                  )}
                </Box>
              ))}
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AttackMatrix;
