/* @layer renderer-shell @kind logic */
import type { SecretsApi } from '../secrets.type';
import { secretsApi } from './secrets-api';

const requireSecretsApi = (): SecretsApi => {
  const api = secretsApi();
  if (!api) throw new Error('window.api.secrets is not installed: add the secrets module to the preload.');
  return api;
};

export { requireSecretsApi };
