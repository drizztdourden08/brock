/* @layer renderer-shell @kind hook */
import { createRegistryStore } from './create-registry-store';
import type { DeviceCardAction } from './device-card-action.type';

const useDeviceCardActionStore = createRegistryStore<DeviceCardAction>();

export { useDeviceCardActionStore };
