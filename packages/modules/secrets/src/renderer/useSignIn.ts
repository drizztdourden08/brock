/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { UseSignInResult } from './use-sign-in.type';
import { SIGN_IN_IDLE } from './sign-in-store.constants';
import { useSignInStore } from './useSignInStore';

const useSignIn = (providerId: string): UseSignInResult => {
  const entry = useSignInStore((s) => s.entries[providerId] ?? SIGN_IN_IDLE);
  const beginFor = useSignInStore((s) => s.begin);
  const cancelFor = useSignInStore((s) => s.cancel);
  const signedInFor = useSignInStore((s) => s.markSignedIn);
  const signedOutFor = useSignInStore((s) => s.markSignedOut);

  const begin = useCallback(() => beginFor(providerId), [beginFor, providerId]);
  const cancel = useCallback(() => cancelFor(providerId), [cancelFor, providerId]);
  const markSignedIn = useCallback(() => signedInFor(providerId), [signedInFor, providerId]);
  const markSignedOut = useCallback(() => signedOutFor(providerId), [signedOutFor, providerId]);

  return { ...entry, begin, cancel, markSignedIn, markSignedOut };
};

export { useSignIn };
