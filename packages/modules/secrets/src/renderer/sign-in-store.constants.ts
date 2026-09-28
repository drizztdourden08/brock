/* @layer renderer-shell @kind constants */
import type { SignInFailure } from '../secrets.type';
import type { SignInEntry } from './sign-in-store.type';

const FAILURE_TEXT: Record<SignInFailure, string> = {
  denied: 'The device was refused.',
  expired: 'The code expired before it was confirmed.',
  cancelled: '',
  unavailable: 'Sign-in needs the desktop app.',
  error: 'The sign-in failed.',
};

const SIGN_IN_IDLE: SignInEntry = { state: 'signed-out', userCode: null, lastError: null };

export { FAILURE_TEXT, SIGN_IN_IDLE };
