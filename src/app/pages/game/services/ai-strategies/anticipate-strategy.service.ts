import {Injectable} from '@angular/core';
import {Signs} from '../../../../enums/signs';
import {AiStrategyBase} from './ai-strategy-base';

@Injectable()
export class AnticipateStrategy extends AiStrategyBase {
  override description =
    'The anticipate strategy will share with you what the sign was showed by player during countdown.';
  private anticipation: {[k: string]: number} = {
    'Rock': 0,
    'Paper': 0,
    'Scissors': 0,
  };

  override getAiSign(): Promise<Signs> {
    const mostAnticipated = this.getMostAnticipatedSign();

    const anticipationData = `Player during countdown showed mostly ${mostAnticipated}. Please respond with sign which will beat ${mostAnticipated}`;

    return this.getSign(anticipationData);
  }

  override fallbackFn(): Signs {
    const mostAnticipated = this.getMostAnticipatedSign();
    return this.getWinningSign(mostAnticipated);
  }

  reset(): void {
    this.anticipation = {
      'Rock': 0,
      'Paper': 0,
      'Scissors': 0,
    };
  }

  increaseAnticipateScoreForSign(sign: Signs): void {
    this.anticipation[sign] = this.anticipation[sign] + 1;
  }

  private getMostAnticipatedSign(): Signs {
    let mostAnticipated = Signs.Rock;
    if (
      this.anticipation[Signs.Paper] > this.anticipation[Signs.Rock] &&
      this.anticipation[Signs.Paper] > this.anticipation[Signs.Scissors]
    ) {
      mostAnticipated = Signs.Paper;
    } else if (
      this.anticipation[Signs.Scissors] > this.anticipation[Signs.Rock] &&
      this.anticipation[Signs.Scissors] > this.anticipation[Signs.Paper]
    ) {
      mostAnticipated = Signs.Scissors;
    }
    return mostAnticipated;
  }
}
