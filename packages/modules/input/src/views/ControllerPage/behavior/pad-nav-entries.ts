/* @layer renderer-components @kind logic */
import type { ControllerDeviceGroup } from '../../../runtime/controller-device-groups.type';
import { padDisplayName } from '../../../controller-names/pad-display-name';
import type { PadNavEntry } from '../ControllerPage.type';

const padNavEntries = (groups: readonly ControllerDeviceGroup[]): PadNavEntry[] =>
  groups.flatMap((group) =>
    group.ports.map((port) => {
      const name = padDisplayName(port.entry);
      return {
        id: port.deviceKey,
        label: group.isAdapter ? `${name} (port ${port.portNumber})` : name,
        connected: port.entry.status === 'ready',
      };
    }),
  );

export { padNavEntries };
