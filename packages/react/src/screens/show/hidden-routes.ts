/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub/hub.type';
import { joinRoute } from '../../navigation/join-route';
import type { ScreenDef } from '../screen.type';
import { isShown } from './is-shown';
import type { ShowContext } from './show.type';

const hubHidden = (hub: HubDef, show?: ShowContext): string[] => {
  if (!isShown(hub.show, show)) return [hub.id];
  return [hub.home, ...hub.groups.flatMap((group) => group.pages)].filter((page) => !isShown(page.show, show)).map((page) => joinRoute(hub.id, page.id));
};

const hiddenRoutes = (hubs: readonly HubDef[], screens: readonly ScreenDef[], show?: ShowContext): ReadonlySet<string> =>
  new Set([...hubs.flatMap((hub) => hubHidden(hub, show)), ...screens.filter((screen) => !isShown(screen.show, show)).map((screen) => screen.id)]);

export { hiddenRoutes };
