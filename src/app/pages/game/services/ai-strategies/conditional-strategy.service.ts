import {Injectable, inject} from '@angular/core';
import {GameHandler} from '../game-handler.service';
import {AiStrategyBase} from './ai-strategy-base';
import {Signs} from '../../../../enums/signs';

@Injectable()
export class ConditionalStrategy extends AiStrategyBase {
  override description = `
    It's based on the assumption that the player is using the popular win-stay, lose-shift strategy, and chooses Rock, Paper, or Scissors based on what would beat their approach.
    If a player wins once, it's likely that they'll repeat the same action as before (so you should propose a sign that will defeat the last move the player made). If a player has lost two or more times, will most likely play the move that allowed you to win in the previous move.
  `;
  private readonly gameHandler = inject(GameHandler);

  override getAiSign(): Promise<Signs> {
    const playerLosingStreak = this.gameHandler.playerLosingStreak();
    const playerWinningStreak = this.gameHandler.playerWinningStreak();
    const pastPlayerMoves = this.gameHandler.pastPlayerMoves().map((gesture) => gesture.name);

    const additionalInformation = `Player lost ${playerLosingStreak} recent games. Player won ${playerWinningStreak} recent games. ${pastPlayerMoves.length > 0 ? `Last player move was ${pastPlayerMoves[pastPlayerMoves.length - 1]}. All player moves were (from oldest to newest) [${pastPlayerMoves.join(', ')}]` : ``}`;

    return this.getSign(additionalInformation);
  }

  override fallbackFn(): Signs {
    // This strategy is called "win-stay, lose-shift"
    // If a player wins once, it's likely that they'll repeat the same action as before
    if (
      this.gameHandler.playerLosingStreak() == 0 &&
      this.gameHandler.pastPlayerMoves().length > 0
    ) {
      return this.getWinningSign(
        this.gameHandler.pastPlayerMoves()[this.gameHandler.pastPlayerMoves().length - 1].name,
      );
    }
    // If a player has lost two or more times, they're most likely to shift to the play that would have beaten what they just lost to
    else if (
      this.gameHandler.playerLosingStreak() > 1 &&
      this.gameHandler.pastPlayerMoves().length > 0
    ) {
      return this.gameHandler.pastPlayerMoves()[this.gameHandler.pastPlayerMoves().length - 1].name;
    } else {
      return this.getRandomSign();
    }
  }
}
