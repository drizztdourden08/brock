/* @layer renderer-components @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ControllerDeviceGroup } from '../../../runtime/controller-device-groups.type';
import { padDisplayName } from '../../../controller-names/pad-display-name';
import type { PadNavEntry } from '../ControllerPage.type';

const padNavEntries = (
  groups: readonly ControllerDeviceGroup[],
  inDiagnostics: boolean,
  text: (value: Text) => string,
): PadNavEntry[] =>
  groups.flatMap((group) =>
    group.ports.map((port) => {
      const name = padDisplayName(port.entry);
      const label = group.isAdapter ? text(msg('input:pads.port', { name, port: port.portNumber })) : name;
      return {
        id: port.deviceKey,
        label: inDiagnostics ? text(msg('input:pads.inDiagnostics', { label })) : label,
        connected: port.entry.status === 'ready',
        inDiagnostics,
      };
    }),
  );

export { padNavEntries };
