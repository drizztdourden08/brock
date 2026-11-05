/* @layer renderer-shell @kind test */
import type { FileStore, Profile } from '@drizztdourden08/brock-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RandomizerModeId, RandomizerProfileConfig } from '../src/augment';
import { joinedRoll } from '../src/contract/joined-roll';
import type { RandomizerGame } from '../src/contract/randomizer-game.type';
import { useRandomizerGameStore } from '../src/renderer/game-registry/behavior/useRandomizerGameStore';
import { randomizerProfileHooks } from '../src/renderer/profile-hooks/randomizer-profile-hooks';

vi.mock('@drizztdourden08/brock-react', () => ({
  getPlatform: () => {
    throw new Error('a joined roll writes no placement');
  },
}));

const LOBBY = 'lobby' as string as RandomizerModeId;
const SEAT_VALUES = { lobby: 'abc', seat: 2 };
const JOIN_RESULT = { lobbyId: 'abc', seat: 2 };

const roll = vi.fn<RandomizerGame<unknown>['roll']>(() => joinedRoll(JOIN_RESULT));
const onJoined = vi.fn();

const hooks: Partial<RandomizerGame<unknown>> = { roll, onJoined };

const register = (): void => useRandomizerGameStore.getState().register({ id: 'toy', ...hooks } as RandomizerGame<unknown>);

const configFor = (mode: RandomizerModeId): RandomizerProfileConfig => ({ mode, seed: 'seed', options: {} });

const build = (config: RandomizerProfileConfig) =>
  randomizerProfileHooks.build?.({ name: 'Run', randomizer: config, randomizerConnection: SEAT_VALUES });

describe('roll for any mode', { tags: ['critical'] }, () => {
  afterEach(() => {
    vi.clearAllMocks();
    useRandomizerGameStore.setState({ game: null });
  });

  it('rolls a custom mode with the mode and the connection values', async () => {
    register();
    const config = configFor(LOBBY);
    await build(config);
    const [rolled, ctx] = roll.mock.calls[0] ?? [];
    expect(rolled).toBe(config);
    expect(ctx).toMatchObject({ mode: LOBBY, connection: SEAT_VALUES });
    expect(typeof ctx?.onProgress).toBe('function');
  });

  it('does not roll online', async () => {
    register();
    await build(configFor('online'));
    expect(roll).not.toHaveBeenCalled();
  });

  it('hands the join result to onJoined once the profile exists', async () => {
    register();
    const config = configFor(LOBBY);
    const built = await build(config);
    await randomizerProfileHooks.onCreate?.({ id: 'p1', name: 'Run', ...built } as Profile, {} as FileStore);
    expect(onJoined).toHaveBeenCalledWith(JOIN_RESULT, { profileId: 'p1', config });
  });
});
