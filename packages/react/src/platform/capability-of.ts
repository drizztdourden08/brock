/* @layer renderer-shell @kind logic */
import type { Capabilities } from '@drizztdourden08/brock-core';
import { CAPABILITY_DEFAULTS } from './capability.constants';

const capabilityOf = (capabilities: Capabilities, key: keyof Capabilities): boolean => capabilities[key] ?? CAPABILITY_DEFAULTS[key] ?? false;

export { capabilityOf };
