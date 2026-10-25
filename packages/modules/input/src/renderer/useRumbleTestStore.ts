/* @layer renderer-shell @kind hook */
import { createRegistryStore } from './create-registry-store';
import type { RumbleTest } from './rumble-test.type';

const useRumbleTestStore = createRegistryStore<RumbleTest>();

export { useRumbleTestStore };
