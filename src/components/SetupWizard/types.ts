// src/components/SetupWizard/types.ts

/**
 * Repository configuration options
 */
export interface RepositoryConfig {
    /** The URL of the repository to index */
    repositoryUrl: string;
    /** The branch to index */
    branch: string;
    /** Optional access token for private repositories */
    accessToken: string;
    /** Repository provider type */
    repositoryType: 'github' | 'gitlab' | 'bitbucket' | 'azure-devops' | 'local';
    /** Specific paths within the repository to scan for rules */
    rulePaths: string[];
  }
  
  /**
   * Options for the indexing process
   */
  export interface IndexingOptions {
    /** Whether to include subdirectories when scanning for rules */
    includeSubdirectories: boolean;
    /** File patterns to include (e.g. '*.yml', '*.json') */
    filePatterns: string[];
    /** Patterns to exclude from indexing */
    excludePatterns: string[];
    /** How often to update the index */
    updateFrequency: 'once' | 'hourly' | 'daily' | 'weekly';
  }
  
  /**
   * Result of the indexing process
   */
  export interface IndexingResult {
    /** Number of rules successfully indexed */
    rulesIndexed: number;
    /** Number of techniques covered by the indexed rules */
    techniquesCovered: number;
    /** Timestamp when the indexing was completed */
    completedAt: string;
    /** ID of the indexing job for reference */
    indexId: string;
    /** URL to the generated index file */
    indexUrl?: string;
  }
  
  /**
   * Status of an ongoing indexing operation
   */
  export interface IndexingStatus {
    /** Current status of the indexing job */
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    /** Progress percentage (0-100) */
    progress: number;
    /** Current stage of indexing */
    currentStage?: string;
    /** Status message, especially useful for errors */
    message?: string;
    /** Timestamp when the status was last updated */
    updatedAt: string;
  }