/* @layer renderer-shell @kind logic */
import { currentRun } from '../../../session';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';

const samplerWanted = (game: RegisteredGame | null): boolean => {
  const tracker = game?.tracker;
  if (game === null || tracker === undefined || tracker.subscribe !== undefined) return false;
  return game.core.state().status === 'running' && currentRun().kind === 'normal';
};

export { samplerWanted };
