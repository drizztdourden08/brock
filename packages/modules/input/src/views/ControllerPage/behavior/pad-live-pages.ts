/* @layer renderer-components @kind logic */
import { createElement } from 'react';
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

const padLivePages = (groups: readonly ControllerDeviceGroup[], inDiagnostics = false): LivePage[] => {
  const entries = padNavEntries(groups, inDiagnostics);
  if (entries.length === 0) return [noPadsPage()];
  return entries.map((entry): LivePage => ({
    key: entry.id,
    title: entry.label,
    badge: padBadge(entry),
    render: () => createElement(ControllerPage, { key: entry.id, deviceKey: entry.id, onRunDiagnostics: openDiagnostics }),
  }));
};

export { padLivePages };
