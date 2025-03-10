// src/components/Dashboard/RuleExplorer.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  SelectChangeEvent,
  Pagination,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { Rule } from '@/types';
import { FilterState } from './GlobalFilters';
import RuleDetailFlyout from './RuleDetailFlyout';

// Define column data structure
type Order = 'asc' | 'desc';
type ColumnKey = 'name' | 'description' | 'platforms' | 'severity' | 'status' | 'relatedTechniques';

interface Column {
  id: ColumnKey;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

interface RuleExplorerProps {
  rules: Rule[];
  filterState: FilterState;
  selectedRuleId?: string | null;
  onRuleSelected?: () => void;
}

/**
 * Returns a formatted chip variant based on severity
 */
const getSeverityChip = (severity: string) => {
  const color = 
    severity.toLowerCase() === 'high' ? 'error' :
    severity.toLowerCase() === 'medium' ? 'warning' :
    severity.toLowerCase() === 'low' ? 'success' : 'default';
  
  return (
    <Chip 
      label={severity} 
      color={color} 
      size="small" 
      variant="outlined"
      sx={{ minWidth: 70, fontWeight: 'medium' }}
    />
  );
};

/**
 * Returns a formatted chip variant based on status
 */
const getStatusChip = (status: string) => {
  const color = 
    status.toLowerCase() === 'production' ? 'success' :
    status.toLowerCase() === 'test' ? 'info' :
    status.toLowerCase() === 'deprecated' ? 'error' : 'default';
  
  return (
    <Chip 
      label={status} 
      color={color} 
      size="small"
      sx={{ minWidth: 80 }}
    />
  );
};

/**
 * Format related techniques to be displayed as chips
 */
const formatTechniques = (techniques: string[]) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {techniques.slice(0, 3).map((tech) => (
        <Chip 
          key={tech} 
          label={tech} 
          size="small" 
          sx={{ fontSize: '0.7rem' }}
        />
      ))}
      {techniques.length > 3 && (
        <Chip 
          label={`+${techniques.length - 3} more`} 
          size="small" 
          variant="outlined"
          sx={{ fontSize: '0.7rem' }}
        />
      )}
    </Box>
  );
};

/**
 * Format platforms to be displayed as chips
 */
const formatPlatforms = (platforms: string[] | string) => {
  const platformArray = typeof platforms === 'string' ? [platforms] : platforms;
  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {platformArray.map((platform) => (
        <Chip 
          key={platform} 
          label={platform} 
          size="small" 
          sx={{ fontSize: '0.7rem' }}
        />
      ))}
    </Box>
  );
};

// Define columns
const columns: Column[] = [
  { 
    id: 'name', 
    label: 'Rule Name', 
    minWidth: 220 
  },
  { 
    id: 'platforms', 
    label: 'Platforms', 
    minWidth: 120,
    format: (value) => formatPlatforms(value)
  },
  { 
    id: 'severity', 
    label: 'Severity', 
    minWidth: 100,
    align: 'center',
    format: (value) => getSeverityChip(value)
  },
  { 
    id: 'status', 
    label: 'Status', 
    minWidth: 100,
    align: 'center',
    format: (value) => getStatusChip(value)
  },
  {
    id: 'relatedTechniques',
    label: 'Related Techniques',
    minWidth: 180,
    format: (value) => formatTechniques(value)
  },
];

/**
 * Rule Explorer component for browsing and exploring rules
 */
const RuleExplorer: React.FC<RuleExplorerProps> = ({ 
  rules, 
  filterState, 
  selectedRuleId, 
  onRuleSelected 
}) => {
  // State for sorting
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<ColumnKey>('name');
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for selected rule and flyout
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [showFlyout, setShowFlyout] = useState(false);
  
  // State for local filtering (in addition to global filters)
  const [localFilter, setLocalFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Refs for scrolling
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const selectedRowRef = useRef<HTMLTableRowElement>(null);
  
  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filterState, localFilter, severityFilter, statusFilter]);
  
  // Effect to handle initial rule selection from props
  useEffect(() => {
    if (selectedRuleId) {
      // Find the rule object
      const rule = rules.find(r => r.id === selectedRuleId);
      
      if (rule) {
        // Clear filters to make sure the rule is visible
        setLocalFilter('');
        setSeverityFilter('');
        setStatusFilter('');
        
        // Find the index in the unfiltered rules
        const ruleIndex = rules.findIndex(r => r.id === selectedRuleId);
        
        // Calculate which page it should be on
        const targetPage = Math.floor(ruleIndex / rowsPerPage);
        setPage(targetPage);
        
        // Set the selected rule
        setSelectedRule(rule);
        setShowFlyout(true);
        
        // Schedule scrolling after render
        setTimeout(() => {
          if (selectedRowRef.current && tableContainerRef.current) {
            // Scroll the container to the row
            selectedRowRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            
            // Notify parent that we've handled the selection
            if (onRuleSelected) {
              onRuleSelected();
            }
          }
        }, 300);
      }
    }
  }, [selectedRuleId, rules, rowsPerPage, onRuleSelected]);
  
  // Filter rules based on global and local filters
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      // Apply global filters (from FilterState)
      if (filterState.validatedOnly && !rule.validated) {
        return false;
      }
      
      // Filter by related techniques (if technique filters are active)
      if (filterState.selectedTactics.length > 0 || 
          filterState.ruleExistence ||
          filterState.searchText) {
        // We'd need a technique mapping here, but let's keep all rules for now
        // This would be properly implemented with technique data integration
      }
      
      // Apply local filters
      // Text search
      if (localFilter) {
        const searchLower = localFilter.toLowerCase();
        if (!rule.name.toLowerCase().includes(searchLower) && 
            !rule.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Severity filter
      if (severityFilter && rule.severity.toLowerCase() !== severityFilter.toLowerCase()) {
        return false;
      }
      
      // Status filter
      if (statusFilter && rule.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      
      return true;
    });
  }, [rules, filterState, localFilter, severityFilter, statusFilter]);
  
  // Get sorted rules
  const sortedRules = useMemo(() => {
    const stabilizedArray = filteredRules.map((rule, index) => [rule, index] as [Rule, number]);
    
    stabilizedArray.sort((a, b) => {
      const ruleA = a[0];
      const ruleB = b[0];
      
      // Handle special cases for formatting
      if (orderBy === 'relatedTechniques') {
        const lengthA = Array.isArray(ruleA.relatedTechniques) ? ruleA.relatedTechniques.length : 0;
        const lengthB = Array.isArray(ruleB.relatedTechniques) ? ruleB.relatedTechniques.length : 0;
        
        return (order === 'asc' ? 1 : -1) * (lengthA - lengthB);
      }
      
      if (orderBy === 'platforms') {
        const platformsA = Array.isArray(ruleA.platforms) ? ruleA.platforms.join(', ') : ruleA.platforms || '';
        const platformsB = Array.isArray(ruleB.platforms) ? ruleB.platforms.join(', ') : ruleB.platforms || '';
        
        return (order === 'asc' ? 1 : -1) * platformsA.localeCompare(platformsB);
      }
      
      // Default comparison for other fields
      const valueA = String(ruleA[orderBy] || '');
      const valueB = String(ruleB[orderBy] || '');
      
      return (order === 'asc' ? 1 : -1) * valueA.localeCompare(valueB);
    });
    
    return stabilizedArray.map((item) => item[0]);
  }, [filteredRules, order, orderBy]);
  
  // Get the data for the current page
  const paginatedRules = sortedRules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Check if the selected rule is in the current filtered/sorted/paginated set
  const selectedRuleInCurrentView = selectedRule && paginatedRules.some(rule => rule.id === selectedRule.id);
  
  // Event handlers
  const handleSort = (property: ColumnKey) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleRowClick = (rule: Rule) => {
    setSelectedRule(rule);
    setShowFlyout(true);
  };
  
  const handleCloseFlyout = () => {
    setShowFlyout(false);
  };
  
  const handleSeverityFilterChange = (event: SelectChangeEvent) => {
    setSeverityFilter(event.target.value);
    setPage(0); // Reset to first page
  };
  
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset to first page
  };
  
  const handleLocalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilter(event.target.value);
    setPage(0); // Reset to first page
  };
  
  const handleClearFilters = () => {
    setLocalFilter('');
    setSeverityFilter('');
    setStatusFilter('');
    setPage(0);
  };
  
  // Extract unique values for filters
  const severities = [...new Set(rules.map(rule => rule.severity))];
  const statuses = [...new Set(rules.map(rule => rule.status))];
  
  // Handle viewing a rule in the rule explorer (for internal navigation within the explorer)
  const handleViewRuleInExplorer = (ruleId: string) => {
    // Find the rule in our data
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      setSelectedRule(rule);
      setShowFlyout(true);
    }
  };
  
  return (
    <>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Detection Rules ({filteredRules.length})</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography variant="body2">Rule Filters</Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Rule selection notification */}
        {selectedRule && !selectedRuleInCurrentView && (
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            }
          >
            The selected rule is not visible with current filters or pagination.
          </Alert>
        )}
        
        {/* Local filter controls */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            label="Search Rules"
            value={localFilter}
            onChange={handleLocalFilterChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 220, flex: 1 }}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: localFilter ? (
                <IconButton 
                  size="small" 
                  onClick={() => setLocalFilter('')}
                  aria-label="clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : null
            }}
          />
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="severity-filter-label">Severity</InputLabel>
            <Select
              labelId="severity-filter-label"
              value={severityFilter}
              label="Severity"
              onChange={handleSeverityFilterChange}
              size="small"
            >
              <MenuItem value="">All</MenuItem>
              {severities.map((severity) => (
                <MenuItem key={severity} value={severity.toLowerCase()}>
                  {severity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
              size="small"
            >
              <MenuItem value="">All</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status.toLowerCase()}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {(localFilter || severityFilter || statusFilter) && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
            >
              Clear Filters
            </Button>
          )}
        </Box>
        
        {/* Rules table */}
        <TableContainer ref={tableContainerRef}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRules.map((rule) => {
                const isSelected = selectedRule && selectedRule.id === rule.id;
                
                return (
                  <TableRow 
                    key={rule.id}
                    hover 
                    onClick={() => handleRowClick(rule)}
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { bgcolor: 'action.hover' },
                      bgcolor: isSelected ? 'action.selected' : 'inherit'
                    }}
                    ref={isSelected ? selectedRowRef : undefined}
                  >
                    {columns.map((column) => {
                      const value = rule[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              
              {paginatedRules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      No rules match the current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredRules.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          />
          
          {/* Add page selector for direct navigation */}
          {filteredRules.length > rowsPerPage && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Go to page:
              </Typography>
              <Pagination 
                count={Math.ceil(filteredRules.length / rowsPerPage)} 
                page={page + 1}
                onChange={(event, newPage) => setPage(newPage - 1)}
                size="small"
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Rule Detail Flyout */}
      <RuleDetailFlyout
        rule={selectedRule}
        open={showFlyout}
        onClose={handleCloseFlyout}
        onViewInExplorer={handleViewRuleInExplorer}
      />
    </>
  );
};

export default RuleExplorer;