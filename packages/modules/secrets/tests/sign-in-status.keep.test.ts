/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { signInStatus } from '../src/main/sign-in-status';
import { applySignedIn } from '../src/renderer/apply-signed-in';

const stored = new Set(['api-token']);
const has = (name: string): Promise<boolean> => Promise.resolve(stored.has(name));

describe('signInStatus', () => {
  it('reads the token secret a provider names', async () => {
    expect(await signInStatus({ tokenSecret: 'api-token' }, has)).toBe(true);
    expect(await signInStatus({ tokenSecret: 'other-token' }, has)).toBe(false);
  });

  it('prefers the provider check over the token secret', async () => {
    expect(await signInStatus({ tokenSecret: 'api-token', isSignedIn: () => false }, has)).toBe(false);
  });

  it('knows nothing about a provider that names neither, or whose check throws', async () => {
    expect(await signInStatus({}, has)).toBeNull();
    expect(await signInStatus({ isSignedIn: () => Promise.reject(new Error('offline')) }, has)).toBeNull();
  });
});

describe('applySignedIn', () => {
  it('starts a provider with a stored token signed in and leaves a running sign-in alone', () => {
    const waiting = { state: 'waiting' as const, userCode: 'ABCD', lastError: null };
    const next = applySignedIn({ second: waiting }, { account: true, second: false, third: false });
    expect(next.account?.state).toBe('signed-in');
    expect(next.second).toBe(waiting);
    expect(next.third?.state).toBe('signed-out');
  });
});
