import {Routes} from '@angular/router';
import {ComputerStrategies} from '../../enums/computer-strategies';
import {AI_STRATEGY} from './providers/ai-strategy';
import {RandomStrategy} from './services/ai-strategies/random-strategy.service';
import {ConditionalStrategy} from './services/ai-strategies/conditional-strategy.service';
import {MarkovStrategy} from './services/ai-strategies/markov-strategy.service';
import {AnticipateStrategy} from './services/ai-strategies/anticipate-strategy.service';

export const routes: Routes = [
  {
    path: ComputerStrategies.Random,
    loadComponent: () => import('./game.component').then((c) => c.GameComponent),
    providers: [
      {
        provide: AI_STRATEGY,
        useClass: RandomStrategy,
      },
    ],
  },
  {
    path: ComputerStrategies.Conditional,
    loadComponent: () => import('./game.component').then((c) => c.GameComponent),
    providers: [
      {
        provide: AI_STRATEGY,
        useClass: ConditionalStrategy,
      },
    ],
  },
  {
    path: ComputerStrategies.Markov,
    loadComponent: () => import('./game.component').then((c) => c.GameComponent),
    providers: [
      {
        provide: AI_STRATEGY,
        useClass: MarkovStrategy,
      },
    ],
  },
  {
    path: ComputerStrategies.Anticipate,
    loadComponent: () => import('./game.component').then((c) => c.GameComponent),
    providers: [
      {
        provide: AI_STRATEGY,
        useClass: AnticipateStrategy,
      },
    ],
  },
];
