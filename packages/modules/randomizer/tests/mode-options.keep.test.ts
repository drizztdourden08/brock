/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { RandomizerGame } from '../src/contract/randomizer-game.type';
import { modeOptions } from '../src/renderer/wizard/mode-options';

const gameWith = (extra: Partial<RandomizerGame<unknown>>): RandomizerGame<unknown> =>
  ({ id: 'toy', ...extra }) as RandomizerGame<unknown>;

describe('modeOptions', { tags: ['critical'] }, () => {
  it('lists only local without a game', () => {
    expect(modeOptions(null)).toEqual([{ value: 'local', label: 'Local' }]);
  });

  it('merges game modes, overrides a built in and sorts by rank', () => {
    const game = gameWith({
      archipelago: {} as RandomizerGame<unknown>['archipelago'],
      modes: [
        { id: 'online', label: 'Lobby', rank: 50 },
        { id: 'local', label: 'Solo', rank: 200 },
      ],
    });
    expect(modeOptions(game)).toEqual([
      { value: 'online', label: 'Lobby' },
      { value: 'local', label: 'Solo' },
    ]);
  });

  it('keeps labels.modes as a label override', () => {
    expect(modeOptions(gameWith({ labels: { modes: { local: 'Offline' } } }))).toEqual([{ value: 'local', label: 'Offline' }]);
  });
});
