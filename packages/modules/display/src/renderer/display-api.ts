/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { DisplayApi } from '../display.type';
import { androidDisplayApi } from './android/android-display-api';

const displayApi = (): DisplayApi | null => hostApi()?.display ?? androidDisplayApi();

export { displayApi };
