/* @layer renderer-shell @kind logic */
import type { AppIpcApi, AppIpcMaps } from '@drizztdourden08/brock-core';
import type { ApiWindow } from './host-api.type';

const hostApi = <M extends AppIpcMaps = Record<never, never>>(): AppIpcApi<M> | null =>
  typeof window === 'undefined' ? null : (((window as ApiWindow).api ?? null) as AppIpcApi<M> | null);

export { hostApi };
