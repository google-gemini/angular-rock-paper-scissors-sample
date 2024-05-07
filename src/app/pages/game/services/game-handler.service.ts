import {Injectable, inject, signal} from '@angular/core';
import {GestureResult} from '../helpers/fingerpose-handler';
import {Signs} from '../../../enums/signs';
import {GameStatuses} from '../../../enums/game-statuses';
import {AudioHandler} from './audio-handler.service';
import {GlobalScore} from './global-score.service';

@Injectable({
  providedIn: 'root',
})
export class GameHandler {
  private readonly audioHandler = inject(AudioHandler);
  private readonly globalScore = inject(GlobalScore);

  readonly gameStatus = signal(GameStatuses.LetsPlay);
  readonly latestPosition = signal<number[][] | null>(null);

  readonly pastPlayerMoves = signal<GestureResult[]>([]);
  readonly playerLosingStreak = signal(0);
  readonly playerWinningStreak = signal(0);

  readonly computerScore = signal(0);
  readonly playerScore = signal(0);

  getResultOfRecentGame(humanPlayerSign: GestureResult | null, computerSign: Signs | null): void {
    if (!humanPlayerSign || !computerSign) {
      return;
    }
    this.pastPlayerMoves.update((moves) => [...moves, humanPlayerSign]);

    if (humanPlayerSign.name === computerSign) {
      this.gameStatus.set(GameStatuses.Draw);
      this.audioHandler.playAudio('tie');
      this.playerLosingStreak.set(0);
      this.playerWinningStreak.set(0);
    } else if (
      (humanPlayerSign.name == Signs.Rock && computerSign == Signs.Scissors) ||
      (humanPlayerSign.name == Signs.Paper && computerSign == Signs.Rock) ||
      (humanPlayerSign.name == Signs.Scissors && computerSign == Signs.Paper)
    ) {
      this.gameStatus.set(GameStatuses.PlayerWin);
      this.playerScore.set(this.playerScore() + 1);
      this.playerLosingStreak.set(0);
      this.playerWinningStreak.update((streak) => ++streak);
      this.audioHandler.playAudio('win');
      this.globalScore.playerWin();
    } else {
      this.gameStatus.set(GameStatuses.ComputerWin);
      this.computerScore.set(this.computerScore() + 1);
      this.playerLosingStreak.update((streak) => ++streak);
      this.playerWinningStreak.set(0);
      this.audioHandler.playAudio('lose');
      this.globalScore.computerWin();
    }
  }

  destroy() {
    this.gameStatus.set(GameStatuses.LetsPlay);
    this.latestPosition.set(null);
    this.pastPlayerMoves.set([]);
    this.playerLosingStreak.set(0);
    this.computerScore.set(0);
    this.playerScore.set(0);
  }
}
