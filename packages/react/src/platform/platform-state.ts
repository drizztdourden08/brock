/* @layer renderer-shell @kind logic */
import type { Platform } from '@drizztdourden08/brock-core';
import type { ModulePorts } from './platform.type';

const platformState: { platform: Platform | null; ports: ModulePorts } = { platform: null, ports: {} };

export { platformState };
