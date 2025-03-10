// src/components/RuleIndexViewer.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import RuleIndexService from '@/services/RuleIndexService';
import { RuleIndexItem } from '@/types';

const RuleIndexViewer: React.FC = () => {
  const [ruleIndex, setRuleIndex] = useState<RuleIndexItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    RuleIndexService.fetchRuleIndex()
      .then((data) => {
        setRuleIndex(data);
      })
      .catch((err) => {
        setError('Failed to load rule index');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Detection Rules ({ruleIndex?.length})
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Platforms</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ruleIndex?.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.name}</TableCell>
              <TableCell>{rule.description}</TableCell>
              <TableCell>
                {Array.isArray(rule.platforms) ? rule.platforms.join(', ') : rule.platforms}
              </TableCell>
              <TableCell>{rule.severity}</TableCell>
              <TableCell>{rule.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default RuleIndexViewer;
