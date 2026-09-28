/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { registerSecretsHandlers } from './handlers';
import { getSecrets } from './secrets-main';

const secretsMain: MainModule = {
  id: 'secrets',
  dataDirs: ['secrets'],
  register: (ctx) => {
    registerSecretsHandlers(ctx, getSecrets(ctx));
  },
  onWillQuit: (ctx) => {
    getSecrets(ctx).signIn.cancelAll();
  },
};

export default secretsMain;
export { secretsMain, getSecrets };
export { createSecretStore } from './secret-store';
export type { SecretStore } from './secret-store.type';
export { createDeviceSignIn } from './device-sign-in';
export { DEFAULT_POLL_MS, DEFAULT_TTL_MS } from './device-sign-in.constants';
export type { DeviceSignIn, CodeListener } from './device-sign-in.type';
export type { SecretsMain } from './secrets-main.type';
export type { SignInProviders } from './sign-in-providers.type';
export type {
  SecretMeta, SignInStatus, SignInFailure, SignInResult, SignInBegin, SignInPoll,
  DeviceSignInOptions, SignInProvider,
} from '../secrets.type';
