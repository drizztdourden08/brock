/* @layer renderer-shell @kind logic */
import type { IpcApi } from '@drizztdourden08/brock-core';
import { hostApi } from './host-api';

const requireHostApi = (): IpcApi => {
  const api = hostApi();
  if (!api) throw new Error('window.api is not installed on this host');
  return api;
};

export { requireHostApi };
