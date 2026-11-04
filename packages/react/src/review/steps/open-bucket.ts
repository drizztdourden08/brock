/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub/hub.type';
import { nav } from '../../navigation/nav';
import { isShown } from '../../screens/show/is-shown';
import { click } from '../dom/click';
import { waitFor } from '../dom/wait-for';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import { SELECTORS } from '../review.constants';
import type { ReviewEnv } from '../review.type';
import { bucketRoute } from './bucket-route';
import { opensBucket } from './opens-bucket';

const switchPill = (title: string): HTMLElement | undefined =>
  [...document.querySelectorAll<HTMLElement>(SELECTORS.switchItem)].find((item) => item.textContent.trim() === title);

const openByRoute = (hub: HubDef, route: string | null): string | null => {
  if (route === null) return null;
  nav.open(hub.id);
  return route;
};

const openBucket = async (env: ReviewEnv, hub: HubDef): Promise<string | null> => {
  const path = menuPathTo(env.menu, (item) => opensBucket(hub.id)(item.screen));
  if (path && await pickMenuPath(path)) return `the menu entry ${path.join(' > ')}`;
  const route = bucketRoute(env, hub);
  const other = hub.switcher === false ? undefined : env.screenTree?.hubs.find((candidate) => candidate.id !== hub.id && isShown(candidate.show));
  if (!other) return openByRoute(hub, route);
  nav.open(other.id);
  const pill = await waitFor(() => switchPill(hub.title));
  if (!pill) return openByRoute(hub, route);
  click(pill);
  return 'the bucket switch';
};

export { openBucket };
