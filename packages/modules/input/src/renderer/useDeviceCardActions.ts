/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { DeviceCardAction } from './device-card-action.type';
import { registerDeviceCardActions } from './register-device-card-actions';

const useDeviceCardActions = (actions: readonly DeviceCardAction[]): void => {
  useEffect(() => registerDeviceCardActions(actions), [actions]);
};

export { useDeviceCardActions };
