/* @layer renderer-shell @kind logic */
import type { ControllerBusType, ControllerConnectionState } from '../../device.type';

const busOfConnection = (state: ControllerConnectionState): ControllerBusType => {
  if (state === 'wired') return 'usb';
  if (state === 'wireless') return 'bluetooth';
  return 'unknown';
};

export { busOfConnection };
