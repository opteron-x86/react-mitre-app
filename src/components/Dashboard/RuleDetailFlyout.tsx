// src/components/Dashboard/RuleDetailFlyout.tsx
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Paper,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Rule } from '@/types';

interface RuleDetailFlyoutProps {
  rule: Rule | null;
  open: boolean;
  onClose: () => void;
  onViewInExplorer: (ruleId: string) => void;
}

/**
 * A flyout panel that displays detailed information about a selected rule
 */
const RuleDetailFlyout: React.FC<RuleDetailFlyoutProps> = ({
  rule,
  open,
  onClose,
  onViewInExplorer,
}) => {
  if (!rule) return null;

  // Format related techniques as chips
  const renderTechniques = (techniques: string[] | string) => {
    // Ensure techniques is an array
    const techArray = Array.isArray(techniques) ? techniques : (techniques ? [techniques] : []);
    
    if (techArray.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No related techniques specified.
        </Typography>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {techArray.map((tech) => (
          <Chip key={tech} label={tech} size="small" />
        ))}
      </Box>
    );
  };

  // Format platforms as chips
  const renderPlatforms = (platforms: string[] | string) => {
    // Ensure platforms is an array
    const platformArray = Array.isArray(platforms) ? platforms : (platforms ? [platforms] : []);
    
    if (platformArray.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No platforms specified.
        </Typography>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {platformArray.map((platform) => (
          <Chip key={platform} label={platform} size="small" />
        ))}
      </Box>
    );
  };

  // Returns a formatted chip variant based on severity
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
        variant="filled"
        sx={{ minWidth: 70, fontWeight: 'medium', mt: 1 }}
      />
    );
  };

  // Returns a formatted chip variant based on status
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
        variant="filled"
        sx={{ minWidth: 80, mt: 1 }}
      />
    );
  };

  // Safely render false positives
  const renderFalsePositives = () => {
    // Check if falsePositives exists and is an array
    if (!rule.falsePositives || !Array.isArray(rule.falsePositives) || rule.falsePositives.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          No false positives documented.
        </Typography>
      );
    }
    
    return (
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {rule.falsePositives.map((fp, idx) => (
          <li key={idx}>
            <Typography variant="body2">{fp}</Typography>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 450, md: 500 }, p: 0 }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h6">Rule Details</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* Content */}
      <Box sx={{ p: 2, height: 'calc(100% - 60px)', overflow: 'auto' }}>
        {/* Rule Name and Key Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {rule.name}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Severity</Typography>
              {getSeverityChip(rule.severity)}
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              {getStatusChip(rule.status)}
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">Validated</Typography>
              <Chip 
                label={rule.validated ? 'Yes' : 'No'} 
                color={rule.validated ? 'success' : 'default'} 
                size="small"
                variant={rule.validated ? 'filled' : 'outlined'}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </Box>
        
        {/* Description */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2">{rule.description}</Typography>
        </Paper>
        
        {/* Detection Details */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Detection Details
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Rule Type</Typography>
              <Typography variant="body2">{rule.ruleType}</Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">Detection Source</Typography>
              <Typography variant="body2">{rule.detectionSource}</Typography>
            </Box>
          </Box>
          
          {/* Query if available */}
          {rule.query && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">Query</Typography>
              <Paper 
                sx={{ 
                  p: 1.5, 
                  mt: 1, 
                  bgcolor: 'grey.900', 
                  color: 'grey.100',
                  fontFamily: 'monospace',
                  maxHeight: 200,
                  overflow: 'auto'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {rule.query}
                </Typography>
              </Paper>
            </Box>
          )}
          
          {/* Query Frequency and Period if available */}
          {(rule.queryFrequency || rule.queryPeriod) && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
              {rule.queryFrequency && (
                <Box>
                  <Typography variant="body2" color="text.secondary">Query Frequency</Typography>
                  <Typography variant="body2">{rule.queryFrequency}</Typography>
                </Box>
              )}
              
              {rule.queryPeriod && (
                <Box>
                  <Typography variant="body2" color="text.secondary">Query Period</Typography>
                  <Typography variant="body2">{rule.queryPeriod}</Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>
        
        {/* Platforms */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Platforms
          </Typography>
          {renderPlatforms(rule.platforms)}
        </Paper>
        
        {/* Related Techniques */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Related Techniques
          </Typography>
          {renderTechniques(rule.relatedTechniques)}
        </Paper>
        
        {/* False Positives */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Potential False Positives
          </Typography>
          {renderFalsePositives()}
        </Paper>
        
        {/* Metadata */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Metadata
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Authors</Typography>
              <Typography variant="body2">
                {Array.isArray(rule.authors) ? rule.authors.join(', ') : rule.authors || 'Unknown'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">File</Typography>
              <Typography variant="body2">{rule.file || 'Unknown'}</Typography>
            </Box>
            
            {rule.date && (
              <Box>
                <Typography variant="body2" color="text.secondary">Creation Date</Typography>
                <Typography variant="body2">
                  {new Date(rule.date).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            
            {rule.modifiedDate && (
              <Box>
                <Typography variant="body2" color="text.secondary">Modified Date</Typography>
                <Typography variant="body2">
                  {new Date(rule.modifiedDate).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            
            {rule.lastCommitId && (
              <Box>
                <Typography variant="body2" color="text.secondary">Last Commit ID</Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {rule.lastCommitId}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      
      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Button 
          variant="outlined" 
          startIcon={<OpenInNewIcon />}
          fullWidth
          onClick={() => onViewInExplorer(rule.id)}
        >
          View in Rule Explorer
        </Button>
      </Box>
    </Drawer>
  );
};

export default RuleDetailFlyout;