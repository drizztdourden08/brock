/* @layer core @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RandomizerGame } from '../src/contract/randomizer-game.type';
import { runtimeStops } from '../src/session/boot/runtime-stops';
import { startSessionRuntime } from '../src/session/boot/start-session-runtime';
import { stopActiveSession } from '../src/session/store/stop-active-session';

vi.mock('../src/session/local/local-session-factory', () => ({ createLocalSessionFactory: () => ({ kind: 'local' }) }));
vi.mock('../src/session/store/register-session-factory', () => ({ registerSessionFactory: () => undefined }));
vi.mock('../src/session/store/stop-active-session', () => ({ stopActiveSession: vi.fn() }));
vi.mock('../src/session/boot/start-pending-boot', () => ({ startPendingBoot: () => false }));

type FakeCore = {
  game: RandomizerGame;
  set: (status: string) => void;
  subscribers: () => number;
};

const fakeCore = (): FakeCore => {
  let status = 'idle';
  const listeners = new Set<() => void>();
  const core = {
    state: () => ({ status }),
    subscribe: (fn: () => void) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
  const game = Object.assign(Object.create(null), { id: 'toy', core });
  return {
    game,
    set: (next) => {
      status = next;
      listeners.forEach((fn) => fn());
    },
    subscribers: () => listeners.size,
  };
};

describe('session runtime', { tags: ['critical'] }, () => {
  beforeEach(() => {
    runtimeStops.clear();
    vi.mocked(stopActiveSession).mockClear();
  });

  it('keeps the session through a pause and stops it on idle', () => {
    const { game, set } = fakeCore();
    startSessionRuntime(game);
    set('running');
    set('paused');
    set('running');
    expect(stopActiveSession).not.toHaveBeenCalled();
    set('idle');
    expect(stopActiveSession).toHaveBeenCalledTimes(1);
  });

  it('subscribes once when started twice', () => {
    const { game, subscribers } = fakeCore();
    const first = startSessionRuntime(game);
    const second = startSessionRuntime(game);
    expect(second).toBe(first);
    expect(subscribers()).toBe(1);
    first();
    expect(subscribers()).toBe(0);
  });
});
