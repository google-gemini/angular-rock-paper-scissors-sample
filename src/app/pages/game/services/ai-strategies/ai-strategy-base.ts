/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {inject} from '@angular/core';
import {Signs} from '../../../../enums/signs';
import {AiStrategy} from '../../interfaces/ai-strategy';
import {GeminiService} from '../gemini.service';

const TIMEOUT = 1500;
const PROMPT_DESCRIPTION_KEY = `{{description}}`;
const PROMPT_DATA_KEY = `{{data}}`;
const PROMPT_TEMPLATE = `
Imagine you're playing rock-paper-scissors with me. Select the character you want to show.

Use the following strategy:

${PROMPT_DESCRIPTION_KEY}
${PROMPT_DATA_KEY}

Answer in one word, i.e. Rock, Paper or Scissors.
`;

export abstract class AiStrategyBase implements AiStrategy {
  protected readonly geminiService = inject(GeminiService);

  abstract description: string;
  abstract getAiSign(): Promise<Signs>;
  abstract fallbackFn(): Signs;

  getPrompt(additionalData: string = ''): string {
    return PROMPT_TEMPLATE.replace(PROMPT_DESCRIPTION_KEY, this.description).replace(
      PROMPT_DATA_KEY,
      additionalData,
    );
  }

  protected async getSign(additionalData: string = ''): Promise<Signs> {
    /**
     * It will be used when:
     * - Gemini API will fail
     * - Gemini API execution will be greater than timeout
     */
    const fallbackValue = this.fallbackFn();

    try {
      const geminiRequest = this.geminiService.askGemini<Signs>(this.getPrompt(additionalData));

      const fallback = new Promise<Signs>((resolve) => {
        setTimeout(() => {
          resolve(fallbackValue);
        }, TIMEOUT);
      });

      /**
       * In case when Gemini API won't return one of the expected value `Rock`, `Paper` or `Scissors` then use fallback value.
       */
      const result = await Promise.race([geminiRequest, fallback]);

      return result ?? fallbackValue;
    } catch {
      return fallbackValue;
    }
  }

  protected getRandomSign = (): Signs => {
    const signs = Object.keys(Signs);
    return signs[Math.floor(Math.random() * 3)] as Signs;
  };

  protected getWinningSign = (signToBeat: Signs): Signs => {
    switch (signToBeat) {
      case Signs.Rock: {
        return Signs.Paper;
      }
      case Signs.Paper: {
        return Signs.Scissors;
      }
      default: {
        return Signs.Rock;
      }
    }
  };
}
