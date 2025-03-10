// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Alert,
  Container,
} from '@mui/material';
import RuleIndexService from '@/services/RuleIndexService';
import { RulesIndex, Technique, Rule } from '@/types';
import { loadTechniques } from '@/data/attackTechniques';
import { useAuthContext } from '@/hooks/useAuthContext';

// Import components
import GlobalFilters, { FilterState } from '@/components/Dashboard/GlobalFilters';
import ModularInsightsPanel from '@/components/Dashboard/ModularInsightsPanel';
import MatrixContainer from '@/components/Dashboard/MatrixContainer';
import RuleExplorer from '@/components/Dashboard/RuleExplorer';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import ProtectedFeatureIndicator from '@/components/Auth/ProtectedFeatureIndicator';

// Tab indices
const ATTACK_MATRIX_TAB = 0;
const DETECTION_RULES_TAB = 1;

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  
  // Data state
  const [index, setIndex] = useState<RulesIndex | null>(null);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [warnings, setWarnings] = useState<string[]>([]);

  // UI state
  const [tab, setTab] = useState<number>(ATTACK_MATRIX_TAB);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Filter state for the Attack Matrix
  const [filterState, setFilterState] = useState<FilterState>({
    selectedTactics: [],
    selectedPlatforms: [],
    selectedDataSources: [],
    ruleExistence: false,
    validatedOnly: false,
    searchText: '',
  });

  // Configure which visualizations to use
  // The summary visualization is now the first one in the insights panel
  const activeVisualizations = [
    'summary-overview',
    'metrics-overview',
    'coverage-distribution',
    'coverage-ranking'
  ];

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Attempt to load data from cache first
        const cachedIndex = RuleIndexService.readFromCache?.() || null;
        let fetchedIndex: RulesIndex | null = null;
        let fetchedTechniques: Technique[] = [];
        const newWarnings: string[] = [];

        if (cachedIndex) {
          console.log('Using cached index data');
          fetchedIndex = cachedIndex;
        } else {
          try {
            fetchedIndex = await RuleIndexService.fetchIndex();
            
            if (!fetchedIndex) {
              newWarnings.push('Rules index data is missing or invalid.');
            } else if (!Array.isArray(fetchedIndex.rules)) {
              newWarnings.push('Rules array is missing or invalid.');
              fetchedIndex.rules = [];
            }
          } catch (indexError) {
            console.error('Error fetching index:', indexError);
            newWarnings.push('Failed to load rules index data.');
            fetchedIndex = RuleIndexService.createEmptyIndex?.() || {
              metadata: {
                totalRules: 0,
                uniqueRuleCount: 0,
                techniqueCount: 0,
                generatedAt: new Date().toISOString(),
                sourceABranch: '',
                sourceBBranch: '',
                sources: []
              },
              rules: [],
              techniqueIndex: {}
            };
          }
        }

        try {
          fetchedTechniques = await loadTechniques();
          
          if (!Array.isArray(fetchedTechniques) || fetchedTechniques.length === 0) {
            newWarnings.push('MITRE ATT&CK techniques data is missing or invalid.');
            fetchedTechniques = [];
          }
        } catch (techError) {
          console.error('Error fetching techniques:', techError);
          newWarnings.push('Failed to load MITRE ATT&CK techniques.');
          fetchedTechniques = [];
        }

        // Set state with available data
        setIndex(fetchedIndex);
        setTechniques(fetchedTechniques);
        setRules(fetchedIndex?.rules || []);
        
        if (newWarnings.length > 0) {
          setWarnings(newWarnings);
        }
      } catch (err) {
        console.error('General error in fetchData:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    
    // Only show filters on the Attack Matrix tab
    if (newValue === DETECTION_RULES_TAB) {
      setShowFilters(false);
    }
  };

  // Handler for viewing a rule in the rule explorer
  const handleViewRuleInExplorer = (ruleId: string) => {
    // Switch to the Rule Explorer tab
    setTab(DETECTION_RULES_TAB);
    // Set the selected rule ID for highlighting
    setSelectedRuleId(ruleId);
  };

  // Calculate available metadata for filters
  const allTactics = React.useMemo(() => {
    const tacticSet = new Set<string>();
    techniques.forEach((tech) => {
      if (tech.tactic) tacticSet.add(tech.tactic);
    });
    return Array.from(tacticSet);
  }, [techniques]);

  const allPlatforms = React.useMemo(() => {
    const platformSet = new Set<string>();
    techniques.forEach((tech) => {
      if (tech.platforms && Array.isArray(tech.platforms)) {
        tech.platforms.forEach((platform) => platformSet.add(platform));
      }
    });
    return Array.from(platformSet);
  }, [techniques]);

  const allDataSources = React.useMemo(() => {
    const dataSourceSet = new Set<string>();
    techniques.forEach((tech) => {
      if (tech.dataSources && Array.isArray(tech.dataSources)) {
        tech.dataSources.forEach((ds) => dataSourceSet.add(ds));
      }
    });
    return Array.from(dataSourceSet);
  }, [techniques]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography>Loading MITRE ATT&CK data...</Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Typography>
          Please check your network connection and try refreshing the page.
        </Typography>
      </Box>
    );
  }

  // Check if data is available
  const dataAvailable = index !== null && techniques.length > 0;

  // Render the Attack Matrix tab content
  const renderAttackMatrixTab = () => {
    if (!dataAvailable) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>
            Insufficient data available to display the Attack Matrix.
          </Typography>
        </Paper>
      );
    }

    return (
      <Box>
        {/* Insights Panel with Summary as first tab */}
        {index && (
          <ModularInsightsPanel
            techniques={techniques}
            rules={rules}
            index={index}
            filterState={filterState}
            visualizations={activeVisualizations}
            defaultExpanded={true}
            defaultTabIndex={0}
          />
        )}
        
        {/* Global Filters - only shown when viewing Attack Matrix and filters are enabled */}
        {showFilters && (
          <GlobalFilters
            filterState={filterState}
            setFilterState={setFilterState}
            allTactics={allTactics}
            allPlatforms={allPlatforms}
            allDataSources={allDataSources}
            isCollapsed={isFiltersCollapsed}
            toggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
          />
        )}
        
        {/* Matrix Container */}
        <MatrixContainer
          techniques={techniques}
          rules={rules}
          filterState={filterState}
          onViewRuleInExplorer={handleViewRuleInExplorer}
          showFilters={showFilters}
          toggleShowFilters={() => setShowFilters(!showFilters)}
        />
      </Box>
    );
  };

  // Render the Detection Rules tab content
  const renderDetectionRulesTab = () => {
    return (
      <ProtectedRoute>
        <RuleExplorer
          rules={rules}
          filterState={filterState}
          selectedRuleId={selectedRuleId}
          onRuleSelected={() => setSelectedRuleId(null)}
        />
      </ProtectedRoute>
    );
  };

  // Main content
  return (
    <Container maxWidth={false} disableGutters sx={{ width: '100%' }}>
      {/* Auth status message for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Authentication Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}
        </Alert>
      )}
      
      {/* Warnings section */}
      {warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Some data could not be loaded properly:</Typography>
          <ul>
            {warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      {/* Main navigation tabs */}
      <Tabs 
        value={tab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3,
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiTab-root': { fontWeight: 'medium' }
        }}
      >
        <Tab label="Attack Matrix" />
        
        {/* Use the ProtectedFeatureIndicator for the Detection Rules tab */}
        <Tab 
          label={
            <ProtectedFeatureIndicator tooltipText="Login required to access rules explorer">
              Detection Rules
            </ProtectedFeatureIndicator>
          } 
        />
      </Tabs>

      {/* Conditional rendering based on selected tab */}
      {tab === ATTACK_MATRIX_TAB ? renderAttackMatrixTab() : renderDetectionRulesTab()}
    </Container>
  );
};

export default Home;