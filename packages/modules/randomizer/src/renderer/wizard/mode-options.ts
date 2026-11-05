/* @layer renderer-shell @kind logic */
import type { RandomizerModeId } from '../../augment';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerGameMode } from '../../contract/randomizer-game-mode.type';
import type { ModeOption } from './mode-options.type';
import { MODE_LABELS, MODE_RANKS } from './wizard.constants';

const builtInModes = (): RandomizerGameMode[] =>
  (Object.keys(MODE_LABELS) as RandomizerModeId[]).map((id) => ({
    id,
    label: MODE_LABELS[id] ?? id,
    rank: MODE_RANKS[id] ?? 0,
  }));

const mergedModes = (game: RandomizerGame<unknown> | null): RandomizerGameMode[] => {
  const byId = new Map<RandomizerModeId, RandomizerGameMode>();
  for (const mode of [...builtInModes(), ...(game?.modes ?? [])]) byId.set(mode.id, mode);
  return [...byId.values()];
};

const modeOptions = (game: RandomizerGame<unknown> | null): ModeOption[] =>
  mergedModes(game)
    .filter((mode) => mode.id !== 'online' || game?.archipelago !== undefined)
    .sort((a, b) => a.rank - b.rank)
    .map((mode) => ({ value: mode.id, label: game?.labels?.modes?.[mode.id] ?? mode.label }));

export { modeOptions };
