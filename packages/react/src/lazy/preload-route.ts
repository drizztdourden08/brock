/* @layer renderer-shell @kind logic */
import { HUB_DEFS } from '../hub/hub.constants';
import type { HubDef, HubPage } from '../hub/hub.type';
import type { ScreenRegistry } from '../screens/screen-registry.type';
import type { Preloadable } from './lazy.type';

const ignore = (): void => {};

const start = (target: Preloadable | undefined): void => {
  target?.preload?.().catch(ignore);
};

const pageOf = (hub: HubDef, id: string): HubPage | undefined => [hub.home, ...hub.groups.flatMap((group) => group.pages)].find((page) => page.id === id);

const preloadRoute = (registry: ScreenRegistry, route: string): void => {
  const [id = '', pageId, tabId] = route.split('/');
  const screen = registry.get(id);
  const hub = screen ? HUB_DEFS.get(screen) : undefined;
  if (!hub || pageId === undefined) {
    start(screen);
    return;
  }
  const page = pageOf(hub, pageId);
  start(page?.tabs?.find((tab) => tab.id === tabId) ?? page);
};

export { preloadRoute };
