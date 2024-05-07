import {Injectable} from '@angular/core';
import {Signs} from '../../../../enums/signs';
import {AiStrategyBase} from './ai-strategy-base';

@Injectable()
export class RandomStrategy extends AiStrategyBase {
  override description = `Random - pick randomly from Rock, Paper, or Scissors with equal probability.`;

  override getAiSign(): Promise<Signs> {
    return this.getSign();
  }

  override fallbackFn(): Signs {
    return this.getRandomSign();
  }
}
