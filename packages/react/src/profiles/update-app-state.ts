/* @layer renderer-shell @kind logic */
import type { AppState, AppStateChange } from '@drizztdourden08/brock-core';
import { updateAppState as changeAppState } from '@drizztdourden08/brock-core';
import { getPlatform } from '../platform/get-platform';

const updateAppState = (change: AppStateChange): Promise<AppState> => changeAppState(getPlatform().files, change);

export { updateAppState };
