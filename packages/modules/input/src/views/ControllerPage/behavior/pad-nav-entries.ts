/* @layer renderer-components @kind logic */
import type { ControllerDeviceGroup } from '../../../runtime/controller-device-groups.type';
import { padDisplayName } from '../../../controller-names/pad-display-name';
import { IN_DIAGNOSTICS_SUFFIX } from '../ControllerPage.constants';
import type { PadNavEntry } from '../ControllerPage.type';

const padNavEntries = (groups: readonly ControllerDeviceGroup[], inDiagnostics = false): PadNavEntry[] =>
  groups.flatMap((group) =>
    group.ports.map((port) => {
      const name = padDisplayName(port.entry);
      const label = group.isAdapter ? `${name} (port ${port.portNumber})` : name;
      return {
        id: port.deviceKey,
        label: inDiagnostics ? `${label}${IN_DIAGNOSTICS_SUFFIX}` : label,
        connected: port.entry.status === 'ready',
        inDiagnostics,
      };
    }),
  );

export { padNavEntries };
