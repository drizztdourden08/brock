/* @layer renderer-shell @kind logic */
import type { ArchipelagoConnection, RandomizerProfileConfig } from '../../../augment';
import type { RandomizerGame } from '../../../contract/randomizer-game.type';

const patchedRandomizer = (
  current: RandomizerProfileConfig,
  fields: ArchipelagoConnection,
  game: RandomizerGame<unknown> | null,
): RandomizerProfileConfig => {
  const merged = { ...current, ...fields };
  return game?.archipelago?.patched?.(merged) ?? merged;
};

export { patchedRandomizer };
