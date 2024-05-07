import {Pipe, PipeTransform} from '@angular/core';
import {GameStatuses} from '../../../enums/game-statuses';
import {GAME_STATUS_SVG_MAPPINGS} from './svg-mappings';

@Pipe({
  name: 'gameStatusToSvgPaths',
  standalone: true,
})
export class GameStatusToSvgPaths implements PipeTransform {
  transform(gameStatus: GameStatuses): string[] {
    return GAME_STATUS_SVG_MAPPINGS[gameStatus];
  }
}
