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

import {Injectable, inject} from '@angular/core';
import {Signs} from '../../../../enums/signs';
import {GameHandler} from '../game-handler.service';
import {AiStrategyBase} from './ai-strategy-base';

@Injectable()
export class MarkovStrategy extends AiStrategyBase {
  override description: string = `Strategy uses a Markov chain to predict the player's next decision based on their previous decisions. For example, if the player tends to play Paper after playing Rock and their last move was Rock, we can guess that Paper is likely their next move.`;

  private markovChain: {[k: string]: {[s: string]: {occurrences: number}}} = {};

  private readonly gameHandler = inject(GameHandler);

  async getAiSign(): Promise<Signs> {
    const pastPlayerMoves = this.gameHandler
      .pastPlayerMoves()
      .map((gesture) => gesture.name)
      .join(', ');
    const lastPlayed = this.getLastPlayed();

    this.buildMarkovChain(lastPlayed);

    const additionalInformation = `${pastPlayerMoves.length > 0 ? `Recent player moves were (from oldest to newest) [${pastPlayerMoves}]` : ``}.
      ${this.buildPromptBasedOnMarkovChain()}`;

    return this.getSign(additionalInformation);
  }

  override fallbackFn(): Signs {
    let nextLikely;

    // Add to markov chain from previous moves
    const lastPlayed = this.getLastPlayed();

    this.buildMarkovChain(lastPlayed);

    if (
      this.gameHandler.pastPlayerMoves().length > 1 &&
      lastPlayed &&
      this.markovChain[lastPlayed]
    ) {
      for (const key in this.markovChain[lastPlayed]) {
        if (!nextLikely) {
          nextLikely = key;
        } else {
          if (
            this.markovChain[lastPlayed][key].occurrences >
            this.markovChain[lastPlayed][nextLikely].occurrences
          ) {
            nextLikely = key;
          }
        }
      }
    }
    if (!nextLikely) {
      // Couldn't predict from the chain, pick randomly
      return this.getRandomSign();
    } else {
      return this.getWinningSign(nextLikely as Signs);
    }
  }

  private buildPromptBasedOnMarkovChain(): string {
    let prompt = '';

    const precedingMovements = Object.keys(this.markovChain);

    for (const precedingMoveSign of precedingMovements) {
      const precedingMove = this.markovChain[precedingMoveSign];

      const nextMoves = Object.keys(precedingMove);

      for (const nextMoveSign of nextMoves) {
        const nextMove = precedingMove[nextMoveSign];
        prompt += `After playing ${precedingMoveSign}, the player played ${nextMoveSign} ${nextMove.occurrences} times.\n`;
      }
    }

    return prompt;
  }

  private getLastPlayed(): Signs | undefined {
    return this.gameHandler.pastPlayerMoves().length
      ? this.gameHandler.pastPlayerMoves()[this.gameHandler.pastPlayerMoves().length - 1].name
      : undefined;
  }

  private buildMarkovChain(lastPlayed: Signs | undefined): void {
    if (this.gameHandler.pastPlayerMoves().length >= 2 && lastPlayed) {
      const pastMove =
        this.gameHandler.pastPlayerMoves()[this.gameHandler.pastPlayerMoves().length - 2].name;
      if (!this.markovChain[pastMove]) {
        this.markovChain[pastMove] = {};
      }
      if (!this.markovChain[pastMove][lastPlayed]) {
        this.markovChain[pastMove][lastPlayed] = {occurrences: 1};
      } else {
        this.markovChain[pastMove][lastPlayed].occurrences =
          this.markovChain[pastMove][lastPlayed].occurrences + 1;
      }
    }
  }
}
