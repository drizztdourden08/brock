/* @layer electron-main @kind logic */
import { memoByContext } from '@drizztdourden08/brock-electron/context';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { SecretsMain } from './secrets-main.type';
import { createSecretStore } from './secret-store';
import { createSignInProviders } from './sign-in-providers';

const createSecretsMain = (ctx: MainContext): SecretsMain => {
  const store = createSecretStore(ctx);
  const signIn = createSignInProviders(ctx, store.has);
  return { ...store, signIn, registerSignInProvider: signIn.register };
};

const getSecrets = memoByContext<MainContext, SecretsMain>(createSecretsMain);

export { getSecrets };
