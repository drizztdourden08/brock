/* @layer renderer-shell @kind logic */
import type { RandomizerModeId } from '../../../augment';
import type { ConnectionView } from '../../../contract/connection-view.type';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';

const gameConnectionView = (game: RegisteredGame | null, mode: RandomizerModeId): ConnectionView | null => {
  const entry = game?.views?.connection?.[mode];
  if (entry === undefined) return null;
  return typeof entry === 'object' && 'Body' in entry ? entry : { Body: entry };
};

export { gameConnectionView };
