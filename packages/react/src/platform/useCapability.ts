/* @layer renderer-shell @kind hook */
import type { Capabilities } from '@drizztdourden08/brock-core';
import { capabilityOf } from './capability-of';
import { usePlatform } from './usePlatform';

const useCapability = (key: keyof Capabilities): boolean => capabilityOf(usePlatform().capabilities, key);

export { useCapability };
