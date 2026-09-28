/* @layer renderer-shell @kind types */
import type { SignInResult } from '../secrets.type';
import type { SignInState } from './sign-in-store.type';

interface UseSignInResult {
  state: SignInState;
  userCode: string | null;
  lastError: string | null;
  begin: () => Promise<SignInResult>;
  cancel: () => Promise<void>;
  markSignedIn: () => void;
  markSignedOut: () => void;
}

export type { UseSignInResult };
