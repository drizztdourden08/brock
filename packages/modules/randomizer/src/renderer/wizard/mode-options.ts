/* @layer renderer-shell @kind logic */
import type { ShowContext } from '@drizztdourden08/brock-react';
import type { RandomizerModeId } from '../../augment';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerGameMode } from '../../contract/randomizer-game-mode.type';
import type { ModeOption } from './mode-options.type';
import { truthyFlagKeys } from '../truthy-flag-keys';
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

const onlineAllowed = (game: RandomizerGame<unknown> | null, ctx: ShowContext): boolean =>
  game?.archipelago !== undefined && game.archipelago.visible?.(truthyFlagKeys(ctx.flags)) !== false;

const modeOptions = (game: RandomizerGame<unknown> | null, ctx: ShowContext): ModeOption[] =>
  mergedModes(game)
    .filter((mode) => mode.id !== 'online' || onlineAllowed(game, ctx))
    .filter((mode) => mode.when?.(ctx) !== false)
    .sort((a, b) => a.rank - b.rank)
    .map((mode) => ({ value: mode.id, label: game?.labels?.modes?.[mode.id] ?? mode.label }));

export { modeOptions };
