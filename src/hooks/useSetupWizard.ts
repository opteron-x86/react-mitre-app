// src/hooks/useSetupWizard.ts
import { useState, useCallback, useEffect } from 'react';
import { RepositoryConfig, IndexingOptions, IndexingResult, IndexingStatus } from '../components/SetupWizard/types';

/**
 * Custom hook to manage the setup wizard state and API interactions
 */
export const useSetupWizard = () => {
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingProgress, setIndexingProgress] = useState(0);
  const [indexingError, setIndexingError] = useState<string | undefined>(undefined);
  const [indexingResult, setIndexingResult] = useState<IndexingResult | undefined>(undefined);
  const [indexingStatus, setIndexingStatus] = useState<IndexingStatus | undefined>(undefined);
  const [indexJobId, setIndexJobId] = useState<string | undefined>(undefined);

  /**
   * Start the indexing process with the provided configuration
   */
  const startIndexing = useCallback(
    async (repositoryConfig: RepositoryConfig, indexingOptions: IndexingOptions) => {
      try {
        setIsIndexing(true);
        setIndexingProgress(0);
        setIndexingError(undefined);

        // Make API call to start indexing
        // Replace with your actual API endpoint
        const response = await fetch('/api/indexing/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repositoryConfig: {
              ...repositoryConfig,
              // Don't store access token in result object for security
              accessToken: repositoryConfig.accessToken ? '[PROVIDED]' : '',
            },
            indexingOptions,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to start indexing process');
        }

        const data = await response.json();
        setIndexJobId(data.jobId);

        // Simulate progress updates
        // In a real implementation, you would poll an API endpoint to get progress updates
        simulateIndexingProgress(data.jobId);
      } catch (error) {
        console.error('Error starting indexing:', error);
        setIndexingError(error instanceof Error ? error.message : 'Unknown error occurred');
        setIsIndexing(false);
      }
    },
    []
  );

  /**
   * Simulate progress updates for development/testing
   * In production, this would be replaced with actual API polling
   */
  const simulateIndexingProgress = useCallback((jobId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate successful completion
        setIndexingProgress(100);
        setIsIndexing(false);
        setIndexingResult({
          rulesIndexed: Math.floor(Math.random() * 100) + 50, // Random number between 50-150
          techniquesCovered: Math.floor(Math.random() * 50) + 30, // Random number between 30-80
          completedAt: new Date().toISOString(),
          indexId: jobId,
          indexUrl: `/api/indexes/${jobId}`,
        });
        
        setIndexingStatus({
          status: 'completed',
          progress: 100,
          currentStage: 'Completed',
          message: 'Indexing completed successfully',
          updatedAt: new Date().toISOString(),
        });
      } else {
        setIndexingProgress(progress);
        
        // Update status with a stage message based on progress
        let currentStage = 'Initializing';
        if (progress > 10 && progress <= 30) {
          currentStage = 'Cloning repository';
        } else if (progress > 30 && progress <= 60) {
          currentStage = 'Scanning for detection rules';
        } else if (progress > 60 && progress <= 80) {
          currentStage = 'Parsing rule content';
        } else if (progress > 80) {
          currentStage = 'Building MITRE ATT&CK mappings';
        }
        
        setIndexingStatus({
          status: 'in-progress',
          progress,
          currentStage,
          updatedAt: new Date().toISOString(),
        });
      }
    }, 1000);

    // Clean up the interval if the component unmounts
    return () => clearInterval(interval);
  }, []);

  /**
   * Poll for indexing status updates
   * This would be used in a real implementation to get updates from the server
   */
  const pollIndexingStatus = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/indexing/status/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to get indexing status');
      }

      const data: IndexingStatus = await response.json();
      setIndexingStatus(data);
      setIndexingProgress(data.progress);

      if (data.status === 'completed') {
        setIsIndexing(false);
        // Fetch the result after completion
        fetchIndexingResult(jobId);
      } else if (data.status === 'failed') {
        setIsIndexing(false);
        setIndexingError(data.message || 'Indexing failed');
      }
    } catch (error) {
      console.error('Error polling indexing status:', error);
    }
  }, []);

  /**
   * Fetch the result of a completed indexing job
   */
  const fetchIndexingResult = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/indexing/result/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to get indexing result');
      }

      const data: IndexingResult = await response.json();
      setIndexingResult(data);
    } catch (error) {
      console.error('Error fetching indexing result:', error);
    }
  }, []);

  // Clean up when the component unmounts
  useEffect(() => {
    return () => {
      // Any cleanup needed
    };
  }, []);

  return {
    isIndexing,
    indexingProgress,
    indexingError,
    indexingResult,
    indexingStatus,
    startIndexing,
    pollIndexingStatus,
    fetchIndexingResult,
  };
};