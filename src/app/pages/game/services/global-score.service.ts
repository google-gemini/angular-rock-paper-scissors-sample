import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalScore {
  private readonly _computerScore = signal(0);
  private readonly _playerScore = signal(0);

  computerScore = this._computerScore.asReadonly();
  playerScore = this._playerScore.asReadonly();

  computerWin(): void {
    this._computerScore.update((score) => ++score);
  }

  playerWin(): void {
    this._playerScore.update((score) => ++score);
  }
}
