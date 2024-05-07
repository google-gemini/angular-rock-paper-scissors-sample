import {Signs} from '../../../enums/signs';

export interface AiStrategy {
  /**
   * Ask Gemini to propose sign based on strategy.
   */
  getAiSign(): Promise<Signs>;
  /**
   * Fallback function in case when Gemini API failed.
   */
  fallbackFn(): Signs;
}
