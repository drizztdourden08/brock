/* @layer renderer-components @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { DetectedDevice } from '../../../bindings';
import type { ControlsLabels } from '../ControlsSettings.type';
import type { DeviceListEntry } from '../sub-components/DeviceRow.type';
import { deviceIconUrl } from './device-icon-url';

const keyboardEntry = (device: DetectedDevice, labels: ControlsLabels, text: (value: Text) => string): DeviceListEntry => {
  const { id, deviceFamily, sdlType } = device;
  const displayName = text(msg('input:device.keyboard'));
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
