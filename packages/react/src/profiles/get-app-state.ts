/* @layer renderer-shell @kind logic */
import type { AppState } from '@drizztdourden08/brock-core';
import { getAppState as readAppState } from '@drizztdourden08/brock-core';
import { getPlatform } from '../platform/get-platform';

const getAppState = (): Promise<AppState> => readAppState(getPlatform().files);

export { getAppState };
