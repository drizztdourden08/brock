/* @layer renderer-shell @kind logic */
import type { AppIpcApi, AppIpcMaps } from '@drizztdourden08/brock-core';
import { HOST_API_GLOBAL } from './host.constants';
import { windowGlobal } from './window-global';

const hostApi = <M extends AppIpcMaps = Record<never, never>>(): AppIpcApi<M> | null =>
  (windowGlobal.read(HOST_API_GLOBAL) ?? null) as AppIpcApi<M> | null;

export { hostApi };
