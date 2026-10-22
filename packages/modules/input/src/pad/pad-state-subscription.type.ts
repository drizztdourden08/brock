/* @layer core @kind types */
import type { ControllerStateListener, DeviceEntry } from '../device.type';

interface PadStateSources {
  onState: (listener: ControllerStateListener) => () => void;
  onDevices: (listener: (devices: DeviceEntry[]) => void) => () => void;
  list: () => Promise<DeviceEntry[]>;
}

export type { PadStateSources };
