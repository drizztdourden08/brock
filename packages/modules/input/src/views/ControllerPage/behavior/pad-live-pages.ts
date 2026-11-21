/* @layer renderer-components @kind logic */
import { createElement } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { LiveBadge, LivePage } from '@drizztdourden08/brock-react';
import type { ControllerDeviceGroup } from '../../../runtime/controller-device-groups.type';
import { ControllerPage } from '../ControllerPage';
import type { PadNavEntry } from '../ControllerPage.type';
import { noPadsPage } from './no-pads-page';
import { openDiagnostics } from './open-diagnostics';
import { padNavEntries } from './pad-nav-entries';

const padBadge = (entry: PadNavEntry): LiveBadge | undefined => {
  if (entry.inDiagnostics) return undefined;
  return entry.connected ? 'ok' : 'warn';
};

const padLivePages = (
  groups: readonly ControllerDeviceGroup[],
  inDiagnostics: boolean,
  text: (value: Text) => string,
): LivePage[] => {
  const entries = padNavEntries(groups, inDiagnostics, text);
  if (entries.length === 0) return [noPadsPage(text)];
  return entries.map((entry): LivePage => ({
    key: entry.id,
    title: entry.label,
    badge: padBadge(entry),
    render: () => createElement(ControllerPage, { key: entry.id, deviceKey: entry.id, onRunDiagnostics: openDiagnostics }),
  }));
};

export { padLivePages };
