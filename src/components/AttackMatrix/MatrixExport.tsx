// src/components/AttackMatrix/MatrixExport.tsx
import React from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  SxProps,
  Theme
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';
import { Technique, Rule } from '@/types';

interface MatrixExportProps {
  techniques: Technique[];
  rules: Rule[];
  filteredTechniques?: Technique[];
  sx?: SxProps<Theme>;
}

const MatrixExport: React.FC<MatrixExportProps> = ({
  techniques,
  rules,
  filteredTechniques,
  sx
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const exportCSV = () => {
    const techniquesToExport = filteredTechniques || techniques;
    
    // Create CSV header
    const headers = ['Technique ID', 'Name', 'Tactic', 'Description', 'Rules Count'];
    
    // Create CSV rows
    const rows = techniquesToExport.map((tech) => {
      // Count rules for this technique
      const ruleCount = rules.filter((rule) => {
        const related = Array.isArray(rule.relatedTechniques)
          ? rule.relatedTechniques
          : [rule.relatedTechniques];
        return related.includes(tech.externalId);
      }).length;
      
      return [
        tech.externalId,
        tech.name,
        tech.tacticTitle,
        tech.description?.replace(/"/g, '""') || '',
        ruleCount.toString(),
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'attack_matrix_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    handleClose();
  };
  
  const exportJSON = () => {
    const techniquesToExport = filteredTechniques || techniques;
    
    // Create a structure with techniques and their rules
    const exportData = techniquesToExport.map((tech) => {
      // Find rules for this technique
      const techRules = rules.filter((rule) => {
        const related = Array.isArray(rule.relatedTechniques)
          ? rule.relatedTechniques
          : [rule.relatedTechniques];
        return related.includes(tech.externalId);
      });
      
      return {
        technique: {
          id: tech.externalId,
          name: tech.name,
          tactic: tech.tactic,
          tacticTitle: tech.tacticTitle,
          description: tech.description,
          platforms: tech.platforms,
          dataSources: tech.dataSources,
        },
        rules: techRules.map((rule) => ({
          id: rule.id,
          name: rule.name,
          description: rule.description,
          severity: rule.severity,
          status: rule.status,
        })),
      };
    });
    
    // Create download link
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'attack_matrix_export.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    handleClose();
  };
  
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleClick}
        size="small"
        sx={sx}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={exportCSV}>
          <ListItemIcon>
            <TableChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={exportJSON}>
          <ListItemIcon>
            <CodeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as JSON</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MatrixExport;