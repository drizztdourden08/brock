/* @layer renderer-components @kind logic */
import type { ControllerDeviceGroup } from '../../../renderer';
import type { DetectedDevice } from '../../../bindings';
import type { ControlsLabels } from '../ControlsSettings.type';
import type { DeviceListEntry } from '../sub-components/DeviceRow.type';
import { deviceIconUrl } from './device-icon-url';
import { firstPort } from './first-port';

const extraDeviceEntry = (device: DetectedDevice, labels: ControlsLabels): DeviceListEntry => {
  const { id, displayName, deviceFamily, sdlType, vendorId, productId } = device;
  return {
    key: id,
    drag: { id, displayName, sdlType, vendorId, productId },
    family: deviceFamily,
    iconSrc: deviceIconUrl({ sdlType, family: deviceFamily }),
    meta: labels.statusConnected,
    ready: true,
    unavailable: false,
  };
};

const extraDeviceEntries = (
  extras: readonly DetectedDevice[],
  groups: readonly ControllerDeviceGroup[],
  labels: ControlsLabels,
): DeviceListEntry[] => {
  const taken = new Set(groups.map((group) => firstPort(group).deviceKey));
  return extras.filter((d) => !taken.has(d.id)).map((d) => extraDeviceEntry(d, labels));
};

export { extraDeviceEntries };
