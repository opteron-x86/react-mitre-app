// src/components/RuleTable.tsx
import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Typography,
} from '@mui/material';
import { Rule } from '@/types';

interface RuleTableProps {
  rules: Rule[];
}

/**
 * RuleTable renders a table showing detection rule details.
 */
const RuleTable: React.FC<RuleTableProps> = ({ rules }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        Detection Rules
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Platforms</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Related Techniques</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.name}</TableCell>
              <TableCell>{rule.description}</TableCell>
              <TableCell>
                {Array.isArray(rule.platforms) ? rule.platforms.join(', ') : rule.platforms}
              </TableCell>
              <TableCell>{rule.severity}</TableCell>
              <TableCell>{rule.status}</TableCell>
              <TableCell>{rule.relatedTechniques.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RuleTable;
