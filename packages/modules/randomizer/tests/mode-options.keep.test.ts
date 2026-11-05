/* @layer renderer-shell @kind test */
import type { ShowContext } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import type { RandomizerGame } from '../src/contract/randomizer-game.type';
import { modeOptions } from '../src/renderer/wizard/mode-options';

const ctx: ShowContext = { profile: null, host: 'electron', formFactor: 'desktop', flags: {}, params: {} };

const gameWith = (extra: Partial<RandomizerGame<unknown>>): RandomizerGame<unknown> =>
  ({ id: 'toy', ...extra }) as RandomizerGame<unknown>;

describe('modeOptions', { tags: ['critical'] }, () => {
  it('lists only local without a game', () => {
    expect(modeOptions(null, ctx)).toEqual([{ value: 'local', label: 'Local' }]);
  });

  it('merges game modes, overrides a built in and sorts by rank', () => {
    const game = gameWith({
      archipelago: {} as RandomizerGame<unknown>['archipelago'],
      modes: [
        { id: 'online', label: 'Lobby', rank: 50 },
        { id: 'local', label: 'Solo', rank: 200 },
      ],
    });
    expect(modeOptions(game, ctx)).toEqual([
      { value: 'online', label: 'Lobby' },
      { value: 'local', label: 'Solo' },
    ]);
  });

  it('keeps labels.modes as a label override', () => {
    const game = gameWith({ labels: { modes: { local: 'Offline' } } });
    expect(modeOptions(game, ctx)).toEqual([{ value: 'local', label: 'Offline' }]);
  });

  it('hides a game mode whose when is false', () => {
    const game = gameWith({ modes: [{ id: 'local', label: 'Local', rank: 10, when: () => false }] });
    expect(modeOptions(game, ctx)).toEqual([]);
  });

  it('hides online through an online entry with when false', () => {
    const game = gameWith({
      archipelago: {} as RandomizerGame<unknown>['archipelago'],
      modes: [{ id: 'online', label: 'Online', rank: 50, when: () => false }],
    });
    expect(modeOptions(game, ctx)).toEqual([{ value: 'local', label: 'Local' }]);
  });
});
