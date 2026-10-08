/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { InputApi } from '../input-api.type';
import { androidInputApi } from './android/android-input-api';

const inputApi = (): InputApi | null => hostApi()?.input ?? androidInputApi();

export { inputApi };
