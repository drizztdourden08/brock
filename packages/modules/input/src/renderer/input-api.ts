/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { InputApi } from '../input-api.type';

const inputApi = (): InputApi | null => hostApi()?.input ?? null;

export { inputApi };
