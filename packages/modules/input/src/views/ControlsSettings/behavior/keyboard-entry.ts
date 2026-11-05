/* @layer renderer-components @kind logic */
import type { DetectedDevice } from '../../../bindings';
import type { ControlsLabels } from '../ControlsSettings.type';
import type { DeviceListEntry } from '../sub-components/DeviceRow.type';
import { deviceIconUrl } from './device-icon-url';

const keyboardEntry = (device: DetectedDevice, labels: ControlsLabels): DeviceListEntry => {
  const { id, displayName, deviceFamily, sdlType } = device;
  return {
    key: id,
    drag: { id, displayName, sdlType, vendorId: null, productId: null },
    family: deviceFamily,
    iconSrc: deviceIconUrl({ sdlType, family: deviceFamily }),
    meta: labels.statusConnected,
    ready: true,
    unavailable: false,
  };
};

export { keyboardEntry };
