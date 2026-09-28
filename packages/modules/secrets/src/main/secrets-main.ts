/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { SecretsMain } from './secrets-main.type';
import { createSecretStore } from './secret-store';
import { createSignInProviders } from './sign-in-providers';

const instances = new WeakMap<MainContext, SecretsMain>();

const createSecretsMain = (ctx: MainContext): SecretsMain => {
  const store = createSecretStore(ctx);
  const signIn = createSignInProviders(ctx);
  return { ...store, signIn, registerSignInProvider: signIn.register };
};

const getSecrets = (ctx: MainContext): SecretsMain => {
  const existing = instances.get(ctx);
  if (existing) return existing;
  const created = createSecretsMain(ctx);
  instances.set(ctx, created);
  return created;
};

export { getSecrets };
