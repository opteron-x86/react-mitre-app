// src/services/IndexingService.ts
import { RepositoryConfig, IndexingOptions, IndexingResult, IndexingStatus } from '../components/SetupWizard/types';

/**
 * Service class for handling rule indexing API interactions
 */
class IndexingService {
  private baseUrl: string;
  
  constructor() {
    // Get the base URL from environment variables or use default
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  /**
   * Start a new indexing job with the provided configuration
   * @param repositoryConfig Repository configuration
   * @param indexingOptions Indexing options
   * @returns Job details from the API
   */
  async startIndexingJob(
    repositoryConfig: RepositoryConfig,
    indexingOptions: IndexingOptions
  ): Promise<{ jobId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/indexing/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repositoryConfig: {
            ...repositoryConfig,
            // For security, don't include the actual token in logs/response objects
            accessToken: repositoryConfig.accessToken ? '[PROVIDED]' : '',
          },
          indexingOptions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start indexing job');
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting indexing job:', error);
      throw error;
    }
  }

  /**
   * Get the status of an ongoing indexing job
   * @param jobId ID of the indexing job
   * @returns Current status of the indexing job
   */
  async getIndexingStatus(jobId: string): Promise<IndexingStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/indexing/status/${jobId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get indexing status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching indexing status:', error);
      throw error;
    }
  }

  /**
   * Get the result of a completed indexing job
   * @param jobId ID of the completed indexing job
   * @returns Result of the indexing job
   */
  async getIndexingResult(jobId: string): Promise<IndexingResult> {
    try {
      const response = await fetch(`${this.baseUrl}/indexing/result/${jobId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get indexing result');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching indexing result:', error);
      throw error;
    }
  }

  /**
   * Cancel an ongoing indexing job
   * @param jobId ID of the indexing job to cancel
   * @returns Result of the cancellation request
   */
  async cancelIndexingJob(jobId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/indexing/cancel/${jobId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel indexing job');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error canceling indexing job:', error);
      throw error;
    }
  }

  /**
   * Check if the application requires setup
   * @returns Whether setup is required
   */
  async checkSetupRequired(): Promise<{ setupRequired: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/setup/status`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check setup status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking setup status:', error);
      throw error;
    }
  }

  /**
   * Get a list of all previous indexing jobs
   * @returns Array of previous indexing jobs
   */
  async getIndexingHistory(): Promise<Array<{
    jobId: string;
    startedAt: string;
    completedAt?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/indexing/history`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get indexing history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching indexing history:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new IndexingService();