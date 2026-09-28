/* @layer renderer-shell @kind types */
import type { SignInResult } from '../secrets.type';

type SignInState = 'signed-out' | 'waiting' | 'signed-in';

interface SignInEntry {
  state: SignInState;
  userCode: string | null;
  lastError: string | null;
}

interface SignInStoreState {
  entries: Record<string, SignInEntry>;
  begin: (providerId: string) => Promise<SignInResult>;
  cancel: (providerId: string) => Promise<void>;
  markSignedOut: (providerId: string) => void;
  markSignedIn: (providerId: string) => void;
}

export type { SignInState, SignInEntry, SignInStoreState };
