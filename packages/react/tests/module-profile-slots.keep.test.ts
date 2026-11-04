/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { composeProfileHooks } from '@drizztdourden08/brock-core';
import type { FileStore, Profile, ProfileStoreHooks } from '@drizztdourden08/brock-core';
import { composeLockCauses } from '../src/settings/lock-causes/compose-lock-causes';
import { LOCK_CAUSE_ORDER } from '../src/settings/lock-causes/lock-cause-order.constants';
import type { LockCauseProvider } from '../src/settings/lock-causes/lock-cause-provider.type';
import { resolveProfileMode } from '../src/profiles/modes/resolve-profile-mode';
import type { ProfileModeDef } from '../src/profiles/modes/profile-mode.type';

const providerOf = (id: string, order: number, cause: string | null): LockCauseProvider => ({ id, order, causeOf: () => cause });

const modeOf = (id: string, rank: number, hit: boolean): ProfileModeDef => ({ id, label: id, monogram: id.slice(0, 2).toUpperCase(), rank, matches: () => hit });

describe('M1 module profile slots', { tags: ['critical'] }, () => {
  it('orders lock causes by order, ties by registration, and the first non-null wins', () => {
    const merged = composeLockCauses([
      providerOf('parity', LOCK_CAUSE_ORDER.parity, 'parity'),
      providerOf('module', LOCK_CAUSE_ORDER.module, 'randomizer'),
      providerOf('developer', LOCK_CAUSE_ORDER.developer, null),
    ]);
    expect(merged?.('any', {})).toBe('randomizer');
    const tied = composeLockCauses([providerOf('first', 300, 'first'), providerOf('second', 300, 'second')]);
    expect(tied?.('any', {})).toBe('first');
    const none = composeLockCauses([providerOf('a', 0, null)]);
    expect(none?.('any', {})).toBeNull();
    expect(composeLockCauses([])).toBeUndefined();
  });

  it('keeps the legacy single function behaviour when it is the only provider', () => {
    const legacy = composeLockCauses([{ id: 'app', order: LOCK_CAUSE_ORDER.app, causeOf: (key: string) => (key === 'locked' ? 'host' : null) }]);
    expect(legacy?.('locked', {})).toBe('host');
    expect(legacy?.('free', {})).toBeNull();
  });

  it('picks the highest rank that matches and falls back to rank 0', () => {
    const profile = { id: 'p', name: 'p' } as Profile;
    const modes = [modeOf('vanilla', 0, true), modeOf('safe', 10, false), modeOf('random', 5, true)];
    expect(resolveProfileMode(modes, profile, null)?.id).toBe('random');
    expect(resolveProfileMode([modeOf('vanilla', 0, true), modeOf('safe', 10, false)], profile, null)?.id).toBe('vanilla');
    expect(resolveProfileMode([modeOf('none', 3, false)], profile, null)).toBeNull();
  });

  it('merges profile hooks in list order with the app last', async () => {
    const calls: string[] = [];
    const first = { romFile: 'a.sfc', language: 'module' };
    const second = { language: 'app' };
    const moduleHooks: ProfileStoreHooks = { build: () => first, patchable: ['x', 'y'], onCreate: async () => { calls.push('module'); await Promise.resolve(); } };
    const appHooks: ProfileStoreHooks = { build: () => second, patchable: ['y', 'z'], onCreate: async () => { calls.push('app'); await Promise.resolve(); } };
    const composed = composeProfileHooks([moduleHooks, undefined, appHooks]);
    expect(composed.build?.({ name: 'n' })).toEqual({ romFile: 'a.sfc', language: 'app' });
    expect([...(composed.patchable ?? [])].sort()).toEqual(['x', 'y', 'z']);
    await composed.onCreate?.({ id: 'p', name: 'n' } as Profile, {} as FileStore);
    expect(calls).toEqual(['module', 'app']);
  });
});
