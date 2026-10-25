/* @layer renderer-shell @kind types */
import type { ControllerBusType, DeviceStatus } from '../../device.type';

interface ControllerPortRowProps {
  portNumber: number;
  status: DeviceStatus;
  busType?: ControllerBusType;
  hasRumble?: boolean;
  hasGyro?: boolean;
  liveHint?: string;
}

export type { ControllerPortRowProps };
