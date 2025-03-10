// src/services/RuleIndexService.ts
import axios, { AxiosResponse } from 'axios';
import { RulesIndex } from '@/types';

class RuleIndexService {
  private indexUrl: string;
  private cachedIndex: RulesIndex | null = null;
  private cacheKey = 'rulesIndexCache';
  private cacheTimeKey = 'rulesIndexCacheTime';
  private cacheDuration = 3600000; // 1 hour in milliseconds

  constructor() {
    this.indexUrl = import.meta.env.VITE_RULE_INDEX_URL;
    if (!this.indexUrl) {
      console.warn('Rule index URL is not defined in environment variables.');
    }
  }

  /**
   * Fetch API data with retry logic
   * @param url The URL to fetch data from
   * @param maxRetries Maximum number of retry attempts
   * @param timeout Request timeout in milliseconds
   * @returns Axios response object
   */
  private async fetchWithRetry(url: string, maxRetries = 3, timeout = 10000): Promise<AxiosResponse> {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to fetch from ${url}`);
        const response = await axios.get(url, { timeout });
        return response;
      } catch (error) {
        console.warn(`Attempt ${attempt} failed:`, error);
        lastError = error;
        
        if (attempt < maxRetries) {
          // Wait before retrying (with exponential backoff)
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Read data from localStorage cache
   * @returns Cached RulesIndex or null if no valid cache exists
   */
  private readFromCache(): RulesIndex | null {
    try {
      const cachedData = localStorage.getItem(this.cacheKey);
      const cacheTimestamp = localStorage.getItem(this.cacheTimeKey);
      
      if (cachedData && cacheTimestamp) {
        // Check if cache is still valid
        const cacheTime = parseInt(cacheTimestamp, 10);
        const now = Date.now();
        const cacheAge = now - cacheTime;
        
        if (cacheAge < this.cacheDuration) {
          console.log('Using cached rules data');
          return JSON.parse(cachedData);
        } else {
          console.log('Cache expired, fetching fresh data');
        }
      }
    } catch (cacheError) {
      console.warn('Error reading from cache:', cacheError);
    }
    
    return null;
  }

  /**
   * Write data to localStorage cache
   * @param data RulesIndex data to cache
   */
  private writeToCache(data: RulesIndex): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(data));
      localStorage.setItem(this.cacheTimeKey, Date.now().toString());
      console.log('Rules data cached successfully');
    } catch (storageError) {
      console.warn('Failed to cache rules data:', storageError);
    }
  }

  /**
   * Create a minimal valid index object for fallback
   * @returns Empty but valid RulesIndex object
   */
  private createEmptyIndex(): RulesIndex {
    return {
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

  /**
   * Fetch the rules index data
   * Uses a two-step process to retrieve data from a presigned URL
   * Implements caching, validation, and retry logic
   * @returns Promise resolving to RulesIndex object
   */
  async fetchIndex(): Promise<RulesIndex> {
    // Return cached instance if available
    if (this.cachedIndex) {
      console.log('Using cached instance');
      return this.cachedIndex;
    }
    
    // Try to load from localStorage cache
    const cachedData = this.readFromCache();
    if (cachedData) {
      this.cachedIndex = cachedData;
      return cachedData;
    }
    
    // Proceed with API fetch if no valid cache exists
    try {
      console.log('Fetching presigned URL from:', this.indexUrl);
      
      // Step 1: Get the presigned URL
      const presignedResponse = await this.fetchWithRetry(this.indexUrl);
      
      if (!presignedResponse.data || !presignedResponse.data.url) {
        console.error('Invalid presigned URL response:', presignedResponse.data);
        throw new Error('Failed to obtain presigned URL for rules index');
      }
      
      const presignedUrl = presignedResponse.data.url;
      console.log('Obtained presigned URL for rules data');
      
      // Step 2: Fetch the actual data using the presigned URL
      console.log('Fetching rules data from presigned URL');
      const dataResponse = await this.fetchWithRetry(presignedUrl, 3, 15000);
      
      // Validate the response data
      if (!dataResponse.data) {
        throw new Error('Empty response from rules data endpoint');
      }
      
      const rulesData = dataResponse.data;
      console.log('Successfully fetched rules data');
      
      // Ensure the data has the expected structure
      const index: RulesIndex = {
        metadata: rulesData.metadata || {
          totalRules: 0,
          uniqueRuleCount: 0,
          techniqueCount: 0,
          generatedAt: new Date().toISOString(),
          sourceABranch: '',
          sourceBBranch: '',
          sources: []
        },
        rules: Array.isArray(rulesData.rules) ? rulesData.rules : [],
        techniqueIndex: rulesData.techniqueIndex || {}
      };
      
      console.log(`Processed index with ${index.rules.length} rules and ${Object.keys(index.techniqueIndex).length} techniques`);
      
      // Cache the validated data
      this.cachedIndex = index;
      this.writeToCache(index);
      
      return index;
    } catch (error) {
      console.error('Error fetching or processing rules index:', error);
      
      // Return a minimal valid index object instead of throwing
      const emptyIndex = this.createEmptyIndex();
      return emptyIndex;
    }
  }

  /**
   * Clear both in-memory and localStorage cache
   */
  clearCache(): void {
    this.cachedIndex = null;
    localStorage.removeItem(this.cacheKey);
    localStorage.removeItem(this.cacheTimeKey);
    console.log('Rules index cache cleared');
  }
}

export default new RuleIndexService();