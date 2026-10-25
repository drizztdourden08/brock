/* @layer renderer-shell @kind types */
import type { ControllerBusType } from '../../device.type';

interface ControllerCapabilityBadgesProps {
  busType?: ControllerBusType;
  hasRumble?: boolean;
  hasGyro?: boolean;
}

export type { ControllerCapabilityBadgesProps };
