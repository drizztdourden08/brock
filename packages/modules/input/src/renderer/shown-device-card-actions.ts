/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../device.type';
import type { DeviceCardAction, ShownDeviceCardAction } from './device-card-action.type';

const isDisabled = (action: DeviceCardAction, entry: DeviceEntry): boolean =>
  typeof action.disabled === 'function' ? action.disabled(entry) : action.disabled === true;

const shownDeviceCardActions = (
  registered: readonly DeviceCardAction[],
  given: readonly DeviceCardAction[],
  entry: DeviceEntry,
): ShownDeviceCardAction[] => {
  const byId = new Map<string, DeviceCardAction>();
  for (const action of [...registered, ...given]) byId.set(action.id, action);
  return [...byId.values()]
    .filter((action) => action.visible?.(entry) ?? true)
    .map((action) => ({ action, disabled: isDisabled(action, entry) }));
};

export { shownDeviceCardActions };
