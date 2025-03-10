// src/services/AttackService.ts
import RuleIndexService from '@/services/RuleIndexService';
import { Rule } from '@/types';

class AttackService {
  // If you had any logic in AttackService, keep it or unify it here.
  // Otherwise, simply delegate to RuleIndexService.

  async fetchRules(): Promise<Rule[]> {
    // Return the flattened array of rules from S3
    return RuleIndexService.fetchRuleIndex();
  }
}

export default new AttackService();
