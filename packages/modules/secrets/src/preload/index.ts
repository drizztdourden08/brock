/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { SecretsApi } from '../secrets.type';

const buildSecretsApi = ({ invoke, subscribe }: BridgeTools): SecretsApi => ({
  set: (name, value, label) => invoke('secrets:set', name, value, label),
  has: (name) => invoke('secrets:has', name),
  list: () => invoke('secrets:list'),
  delete: (name) => invoke('secrets:delete', name),
  canStore: () => invoke('secrets:canStore'),
  signIn: {
    begin: (providerId) => invoke('secrets:signIn:begin', providerId),
    cancel: (providerId) => invoke('secrets:signIn:cancel', providerId),
    onCode: (listener) => subscribe('secrets:signIn:code', listener),
  },
});

const secretsPreload: PreloadNamespace = {
  id: 'secrets',
  build: buildSecretsApi,
};

export default secretsPreload;
export { secretsPreload, buildSecretsApi };
export type { SecretsApi, SecretsSignInApi, SecretMeta, SignInResult } from '../secrets.type';
