/* @layer renderer-shell @kind logic */
import type { Capabilities } from '@drizztdourden08/brock-core';
import { updaterApi } from './updater-api';

const selfUpdateHost = (capabilities?: Pick<Capabilities, 'selfUpdate'>): boolean =>
  updaterApi() !== null && (capabilities?.selfUpdate ?? true);

export { selfUpdateHost };
