/* @layer renderer-shell @kind logic */
import type { RandomizerModeId } from '../../augment';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import { MODE_LABELS } from './wizard.constants';

interface ModeOption {
  value: string;
  label: string;
}

const modeLabel = (game: RandomizerGame<unknown> | null, id: RandomizerModeId): string => game?.labels?.modes?.[id] ?? MODE_LABELS[id] ?? id;

const modeOptions = (game: RandomizerGame<unknown> | null): ModeOption[] =>
  (Object.keys(MODE_LABELS) as RandomizerModeId[])
    .filter((id) => id !== 'online' || game?.archipelago !== undefined)
    .map((id) => ({ value: id, label: modeLabel(game, id) }));

export { modeOptions };
