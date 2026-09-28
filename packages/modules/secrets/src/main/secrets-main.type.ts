/* @layer electron-main @kind types */
import type { SignInProvider } from '../secrets.type';
import type { SecretStore } from './secret-store.type';
import type { SignInProviders } from './sign-in-providers.type';

interface SecretsMain extends SecretStore {
  registerSignInProvider: (provider: SignInProvider) => () => void;
  signIn: SignInProviders;
}

export type { SecretsMain };
