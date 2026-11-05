/* @layer renderer-components @kind logic */
import { controllerCardInfo } from '../../../renderer';
import type { ControllerDeviceGroup } from '../../../renderer';
import { BUS_NAME } from '../ControlsSettings.constants';
import type { ControlsLabels } from '../ControlsSettings.type';
import type { DeviceListEntry } from '../sub-components/DeviceRow.type';
import { deviceIconUrl } from './device-icon-url';
import { firstPort } from './first-port';

const readyPorts = (group: ControllerDeviceGroup): number =>
  group.ports.filter((port) => port.entry.status === 'ready').length;

const groupMeta = (group: ControllerDeviceGroup, ready: number, labels: ControlsLabels): string => {
  const bus = BUS_NAME[group.busType];
  if (group.isAdapter) return `${ready}/${group.ports.length} ${labels.statusConnected}`;
  const status = ready > 0 ? labels.statusConnected : labels.statusNotConnected;
  return bus ? `${status}, ${bus}` : status;
};

const controllerGroupEntry = (group: ControllerDeviceGroup, labels: ControlsLabels): DeviceListEntry => {
  const { entry, deviceKey } = firstPort(group);
  const { displayName, deviceFamily, sdlType, vendorId, productId } = controllerCardInfo(entry);
  const id = group.isAdapter ? `adapter-${vendorId}-${productId}` : deviceKey;
  const ready = readyPorts(group);
  return {
    key: id,
    drag: { id, displayName, sdlType, vendorId, productId },
    family: deviceFamily,
    iconSrc: deviceIconUrl({ sdlType: group.isAdapter ? null : sdlType, family: deviceFamily }),
    meta: groupMeta(group, ready, labels),
    ready: ready > 0,
    unavailable: group.ports.some((port) => port.entry.status === 'unavailable'),
  };
};

export { controllerGroupEntry };
