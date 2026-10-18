/* @layer renderer-shell @kind logic */
import type { ScreenParams } from '../navigation/navigation.type';
import { resolveHubPage } from './Hub/behavior/resolve-hub-page';
import type { HubDef } from './hub.type';

const hubBackLabel = (hub: HubDef, target: ScreenParams): string => {
  const { page, sub } = resolveHubPage([hub.home, ...hub.groups.flatMap((group) => group.pages)], hub.home, target);
  return sub?.label ?? page.label;
};

export { hubBackLabel };
