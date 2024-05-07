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

import {GameStatuses} from '../../../enums/game-statuses';

export const GAME_STATUS_SVG_MAPPINGS = {
  [GameStatuses.LetsPlay]: ['lets-play.svg'],
  [GameStatuses.GetReady]: ['get-ready.svg'],
  [GameStatuses.PlayerWin]: ['player.svg', 'win.svg'],
  [GameStatuses.ComputerWin]: ['gemini.svg', 'win.svg'],
  [GameStatuses.Draw]: ['draw.svg'],
  [GameStatuses.CantIdentifyHumanHand]: [],
};

export const SECOND_SVG_MAPPINGS = {
  ['4']: 'rock.svg',
  ['3']: 'paper.svg',
  ['2']: 'scissors.svg',
  ['1']: 'go.svg',
  ['0']: 'go.svg',
};
