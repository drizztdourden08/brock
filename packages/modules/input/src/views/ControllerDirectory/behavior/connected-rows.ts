/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../../../device.type';
import type { MappingEntry } from '../../../mapping/mapping-entry.type';
import { padDisplayName } from '../../../controller-names/pad-display-name';
import type { DirectoryRow } from '../ControllerDirectory.type';
import { deviceInputs } from './device-inputs';
import { mappingOf } from './mapping-of';
import { vidPidKey } from './vid-pid-key';

const connectedRows = (devices: readonly DeviceEntry[], mappings: readonly MappingEntry[]): DirectoryRow[] =>
  devices.map((device) => {
    const mapping = mappingOf(device, mappings);
    return {
      id: `connected:${device.deviceKey}`,
      name: padDisplayName(device),
      vidPid: vidPidKey(device.vendorId, device.productId),
      family: device.family ?? mapping?.family ?? 'generic',
      source: mapping?.source ?? 'none',
      inputs: mapping?.inputCount ?? deviceInputs(device),
      group: 'Connected',
      connectedKey: device.deviceKey,
    };
  });

export { connectedRows };
