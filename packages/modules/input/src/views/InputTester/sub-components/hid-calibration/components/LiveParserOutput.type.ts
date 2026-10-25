/* @layer renderer-shell @kind types */
import type { DeviceProfile } from '../../../../../device-profile';
import type { ControllerInputState } from '../../../../../controller-input/controller-input-store';

interface LiveParserOutputProps {
  profile: DeviceProfile | null;
  state: ControllerInputState | null;
}

export type { LiveParserOutputProps };
