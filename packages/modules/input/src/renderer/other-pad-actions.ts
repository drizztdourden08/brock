/* @layer renderer-shell @kind logic */
import type { ShownDeviceCardAction } from './device-card-action.type';
import { REPORT_ACTION_ID } from './input-renderer.constants';

const otherPadActions = (shown: readonly ShownDeviceCardAction[]): ShownDeviceCardAction[] =>
  shown.filter(({ action }) => action.id !== REPORT_ACTION_ID);

export { otherPadActions };
