/* @layer renderer-shell @kind logic */
import type { AppIpcApi, AppIpcMaps } from '@drizztdourden08/brock-core';
import { hostApi } from './host-api';

const requireHostApi = <M extends AppIpcMaps = Record<never, never>>(): AppIpcApi<M> => {
  const api = hostApi<M>();
  if (!api) throw new Error('window.api is not installed on this host');
  return api;
};

export { requireHostApi };
