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
