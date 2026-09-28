/* @layer renderer-shell @kind hook */
import type { Capabilities } from '@drizztdourden08/brock-core';
import { usePlatform } from './usePlatform';

const useCapability = (key: keyof Capabilities): boolean => usePlatform().capabilities[key];

export { useCapability };
