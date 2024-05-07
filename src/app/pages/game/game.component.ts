import {
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {drawHandOnVideoCanvas} from './helpers/hand-renderer';
import {GestureResult, lookForGesture} from './helpers/fingerpose-handler';
import {Signs} from '../../enums/signs';
import '@tensorflow/tfjs-backend-webgl';
import {LoadingComponent} from '../../components/loading/loading.component';
import {GameStatuses} from '../../enums/game-statuses';
import {AI_STRATEGY} from './providers/ai-strategy';
import {AiStrategy} from './interfaces/ai-strategy';
import {AnticipateStrategy} from './services/ai-strategies/anticipate-strategy.service';
import {AudioHandler} from './services/audio-handler.service';
import {GameHandler} from './services/game-handler.service';
import {GlobalScore} from './services/global-score.service';
import {RouterLink} from '@angular/router';
import {GameStatusToSvgPaths} from './pipes/game-status-to-svg-paths.pipe';
import {HandposeManager} from './services/handpose-manager.service';
import * as handpose from '@tensorflow-models/handpose';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {combineLatest, filter} from 'rxjs';
import {Countdown} from './enums/countdown';

export const DEFAULT_COUNTDOWN: Countdown = Countdown.ROCK; // 'rock', 'paper', 'scissors', 'go'

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameStatusToSvgPaths, LoadingComponent, RouterLink, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnDestroy, OnInit {
  private readonly audioHandler = inject(AudioHandler);
  private readonly computerStrategy = inject<AiStrategy>(AI_STRATEGY);
  private readonly destroyRef = inject(DestroyRef);
  private readonly gameHandler = inject(GameHandler);
  private readonly globalScore = inject(GlobalScore);
  private readonly handposeManager = inject(HandposeManager);

  protected stream: MediaStream | undefined;
  protected model: handpose.HandPose | undefined;

  protected canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  protected video = viewChild<ElementRef<HTMLVideoElement>>('video');

  protected readonly countdown = signal(0);
  protected readonly isLoadingCamera = signal(true);
  protected readonly isLoadingTensorflowFailed = signal(false);
  protected readonly freezeVideo = signal(false);

  protected readonly playerSign = signal<GestureResult | null>(null);
  protected readonly computerSign = signal<Signs | null>(null);
  protected readonly playerGestureConfidence = computed(() =>
    this.playerSign()?.score ? this.playerSign()!.score * 10 : 0,
  );
  private readonly nextComputerSign = signal<Signs | null>(null);

  private readonly nextComputerSign$ = toObservable(this.nextComputerSign);
  private readonly playerSign$ = toObservable(this.playerSign);

  protected readonly gameStatus = this.gameHandler.gameStatus;
  protected readonly computerScore = this.gameHandler.computerScore;
  protected readonly playerScore = this.gameHandler.playerScore;

  //global scores
  protected readonly computerGlobalScore = this.globalScore.computerScore;
  protected readonly playerGlobalScore = this.globalScore.playerScore;

  hasResult = computed(
    () =>
      this.gameStatus() === GameStatuses.ComputerWin ||
      this.gameStatus() === GameStatuses.PlayerWin ||
      this.gameStatus() === GameStatuses.Draw,
  );

  //enums
  Countdown = Countdown;
  GameStatuses = GameStatuses;
  Signs = Signs;

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadWebCam();
  }

  ngOnInit(): void {
    combineLatest([this.nextComputerSign$, this.playerSign$])
      .pipe(
        filter(([computerSign, playerSign]) => !!computerSign && !!playerSign),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([computerSign]) => {
        this.computerSign.set(computerSign);
        this.gameHandler.getResultOfRecentGame(this.playerSign(), this.computerSign());
      });
  }

  ngOnDestroy(): void {
    this.gameHandler.destroy();
  }

  async startCountdown(): Promise<void> {
    this.reset();
    this.gameStatus.set(GameStatuses.GetReady);
    this.countdown.set(DEFAULT_COUNTDOWN);
    this.audioHandler.playAudio('countdown');
    setTimeout(() => {
      this.incrementCountdown();
    }, 1000);
  }

  private loadWebCam() {
    navigator.mediaDevices
      .getUserMedia({video: true})
      .then((stream) => {
        this.stream = stream;
        return this.handposeManager.load();
      })
      .then((model) => {
        this.model = model;
        drawHandOnVideoCanvas(
          this.freezeVideo,
          this.gameHandler,
          this.video(),
          this.canvas(),
          this.stream,
          model,
          this.computerStrategy,
        );
        this.isLoadingCamera.set(false);
      })
      .catch((err) => {
        this.isLoadingTensorflowFailed.set(true);
        console.error(err);
      });
  }

  private incrementCountdown() {
    this.countdown.update((countdown) => --countdown);
    if (this.countdown() > 0) {
      this.audioHandler.playAudio('countdown');

      // Ask Gemini two seconds before the end of the countdown for the proposed sign.
      // Reason: to receive a response from the API before the countdown ends
      // It will be displayed on `Scissors` message in countdown.
      if (this.countdown() === Countdown.SCISSORS) {
        this.computerStrategy.getAiSign().then((sign) => {
          this.nextComputerSign.set(sign);
        });
      }

      setTimeout(() => this.incrementCountdown(), 1000);
    } else {
      this.freezeVideo.set(true);
      const playerGesture = lookForGesture(this.gameHandler.latestPosition());

      if (playerGesture) {
        this.playerSign.set(playerGesture);
      } else {
        // Reset game if player doesn't show Rock, Paper or Scissors
        this.reset();
      }
    }
  }

  private reset() {
    this.resetVariables();
    drawHandOnVideoCanvas(
      this.freezeVideo,
      this.gameHandler,
      this.video(),
      this.canvas(),
      this.stream,
      this.model,
      this.computerStrategy,
    );
  }

  private resetVariables() {
    this.freezeVideo.set(false);
    this.countdown.set(DEFAULT_COUNTDOWN);
    this.gameStatus.set(GameStatuses.LetsPlay);
    this.playerSign.set(null);
    this.computerSign.set(null);
    this.nextComputerSign.set(null);

    if (this.computerStrategy instanceof AnticipateStrategy) {
      this.computerStrategy.reset();
    }
  }
}
