/* @layer renderer-shell @kind logic */
import type { IpcApi } from '@drizztdourden08/brock-core';
import type { ApiWindow } from './host-api.type';

const hostApi = (): IpcApi | null =>
  typeof window === 'undefined' ? null : ((window as ApiWindow).api ?? null);

export { hostApi };
