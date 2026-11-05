/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { MsuHostApi } from '../ipc/msu-host-api.type';

const msuApi = (): MsuHostApi | null => hostApi()?.msu ?? null;

export { msuApi };
