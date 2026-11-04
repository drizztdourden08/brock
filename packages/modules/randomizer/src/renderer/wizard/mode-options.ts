/* @layer renderer-shell @kind logic */
import type { RandomizerModeId } from '../../augment';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { ModeOption } from './mode-options.type';
import { MODE_LABELS } from './wizard.constants';

const modeLabel = (game: RandomizerGame<unknown> | null, id: RandomizerModeId): string => game?.labels?.modes?.[id] ?? MODE_LABELS[id] ?? id;

const modeOptions = (game: RandomizerGame<unknown> | null): ModeOption[] =>
  (Object.keys(MODE_LABELS) as RandomizerModeId[])
    .filter((id) => id !== 'online' || game?.archipelago !== undefined)
    .map((id) => ({ value: id, label: modeLabel(game, id) }));

export { modeOptions };
