/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { SecretsApi } from '../secrets.type';

const secretsApi = (): SecretsApi | null => hostApi()?.secrets ?? null;

export { secretsApi };
