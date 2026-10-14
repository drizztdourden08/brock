/* @layer renderer-shell @kind logic */
import type { SignInEntry } from './sign-in-store.type';
import { SIGN_IN_IDLE } from './sign-in-store.constants';

const applySignedIn = (entries: Record<string, SignInEntry>, signedIn: Record<string, boolean>): Record<string, SignInEntry> => {
  const next = { ...entries };
  for (const [providerId, isIn] of Object.entries(signedIn)) {
    const entry = next[providerId] ?? SIGN_IN_IDLE;
    if (entry.state === 'waiting') continue;
    next[providerId] = { ...entry, state: isIn ? 'signed-in' : 'signed-out' };
  }
  return next;
};

export { applySignedIn };
