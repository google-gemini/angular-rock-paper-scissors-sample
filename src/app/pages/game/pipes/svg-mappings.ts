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
