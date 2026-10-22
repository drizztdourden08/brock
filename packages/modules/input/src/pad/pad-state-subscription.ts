/* @layer core @kind logic */
import type { DeviceEntry } from '../device.type';
import type { PadStateListener } from './controller-slot.type';
import { padStateOf } from './pad-state-of';
import type { PadStateSources } from './pad-state-subscription.type';

const padStateSubscription =
  ({ onState, onDevices, list }: PadStateSources) =>
  (listener: PadStateListener): (() => void) => {
    const devices = new Map<string, DeviceEntry>();
    const remember = (entries: readonly DeviceEntry[]): void => {
      devices.clear();
      for (const entry of entries) devices.set(entry.deviceKey, entry);
    };
    let active = true;
    const stopDevices = onDevices(remember);
    list().then((entries) => { if (active && devices.size === 0) remember(entries); }, () => undefined);
    const stopState = onState((deviceKey, buttons, axes) => listener(deviceKey, padStateOf(buttons, axes, devices.get(deviceKey))));
    return () => {
      active = false;
      stopDevices();
      stopState();
    };
  };

export { padStateSubscription };
