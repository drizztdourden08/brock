/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { SignInResult } from '../secrets.type';
import type { SignInEntry, SignInStoreState } from './sign-in-store.type';
import { FAILURE_TEXT, SIGN_IN_IDLE } from './sign-in-store.constants';
import { secretsApi } from './secrets-api';

const failureText = (result: Extract<SignInResult, { ok: false }>): string | null => {
  const text = result.message ?? FAILURE_TEXT[result.reason];
  return text.length > 0 ? text : null;
};

let unsubscribeCode: (() => void) | null = null;

const useSignInStore = create<SignInStoreState>()((set, get) => {
  const entryOf = (providerId: string): SignInEntry => get().entries[providerId] ?? SIGN_IN_IDLE;

  const patch = (providerId: string, next: Partial<SignInEntry>): void =>
    set((s) => ({ entries: { ...s.entries, [providerId]: { ...entryOf(providerId), ...next } } }));

  const listenForCodes = (): void => {
    if (unsubscribeCode) return;
    unsubscribeCode = secretsApi()?.signIn.onCode((providerId, userCode) => patch(providerId, { userCode })) ?? null;
  };

  return {
    entries: {},

    begin: async (providerId) => {
      if (entryOf(providerId).state === 'waiting') return { ok: false, reason: 'cancelled' };
      const api = secretsApi();
      if (!api) {
        const result: SignInResult = { ok: false, reason: 'unavailable' };
        patch(providerId, { ...SIGN_IN_IDLE, lastError: failureText(result) });
        return result;
      }
      listenForCodes();
      patch(providerId, { state: 'waiting', userCode: null, lastError: null });
      const result = await api.signIn.begin(providerId);
      if (result.ok) patch(providerId, { state: 'signed-in', userCode: null, lastError: null });
      else patch(providerId, { state: 'signed-out', userCode: null, lastError: failureText(result) });
      return result;
    },

    cancel: async (providerId) => {
      await secretsApi()?.signIn.cancel(providerId);
    },

    markSignedOut: (providerId) => patch(providerId, SIGN_IN_IDLE),

    markSignedIn: (providerId) => patch(providerId, { state: 'signed-in', userCode: null, lastError: null }),
  };
});

export { useSignInStore };
