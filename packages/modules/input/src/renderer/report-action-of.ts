/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../device.type';
import type { DeviceCardAction } from './device-card-action.type';
import { REPORT_ACTION_ID } from './input-renderer.constants';
import { shownDeviceCardActions } from './shown-device-card-actions';

const reportActionOf = (registered: readonly DeviceCardAction[], entry: DeviceEntry): DeviceCardAction | null =>
  shownDeviceCardActions(registered, [], entry).find((shown) => shown.action.id === REPORT_ACTION_ID && !shown.disabled)?.action ?? null;

export { reportActionOf };
