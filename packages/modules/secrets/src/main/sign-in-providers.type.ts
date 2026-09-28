/* @layer electron-main @kind types */
import type { SignInProvider, SignInResult } from '../secrets.type';

interface SignInProviders {
  register: (provider: SignInProvider) => () => void;
  begin: (providerId: string) => Promise<SignInResult>;
  cancel: (providerId: string) => void;
  cancelAll: () => void;
}

export type { SignInProviders };
