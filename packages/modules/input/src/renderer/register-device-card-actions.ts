/* @layer renderer-shell @kind logic */
import type { DeviceCardAction } from './device-card-action.type';
import { useDeviceCardActionStore } from './useDeviceCardActionStore';

const registerDeviceCardActions = (actions: readonly DeviceCardAction[]): (() => void) =>
  useDeviceCardActionStore.getState().add(actions);

export { registerDeviceCardActions };
