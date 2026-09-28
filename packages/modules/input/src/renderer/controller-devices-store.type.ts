/* @layer renderer-shell @kind types */
import type { DeviceEntry, InputStatus } from '../device.type';

interface ControllerDevicesStore {
  entries: DeviceEntry[];
  status: InputStatus;
  loaded: boolean;
  rescanPending: boolean;
  refresh: () => Promise<void>;
  rescan: () => Promise<void>;
  addMapping: (mapping: string) => Promise<boolean>;
}

export type { ControllerDevicesStore };
