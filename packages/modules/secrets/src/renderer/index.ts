/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';

const secretsRenderer: RendererModule = {
  id: 'secrets',
};

export default secretsRenderer;
export { secretsRenderer };
export { secretsApi } from './secrets-api';
export { requireSecretsApi } from './require-secrets-api';
export { useSecretsStore } from './useSecretsStore';
export type { SecretsState } from './secrets-store.type';
export { useSignInStore } from './useSignInStore';
export type { SignInState, SignInEntry, SignInStoreState } from './sign-in-store.type';
export { useSignIn } from './useSignIn';
export type { UseSignInResult } from './use-sign-in.type';
export type { SecretMeta, SecretsApi, SignInFailure, SignInResult } from '../secrets.type';
