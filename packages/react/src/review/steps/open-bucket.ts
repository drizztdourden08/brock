/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub/hub.type';
import { nav } from '../../navigation/nav';
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import { click } from '../dom/click';
import { waitFor } from '../dom/wait-for';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import { SELECTORS } from '../review.constants';
import type { ReviewEnv } from '../review.type';

const switchPill = (title: string): HTMLElement | undefined =>
  [...document.querySelectorAll<HTMLElement>(SELECTORS.switchItem)].find((item) => item.textContent.trim() === title);

const opensBucket = (id: string) => (screen: string | undefined): boolean =>
  screen === id || screen?.startsWith(`${id}${ROUTE_SEPARATOR}`) === true;

const openBucket = async (env: ReviewEnv, hub: HubDef): Promise<string | null> => {
  const path = menuPathTo(env.menu, (item) => opensBucket(hub.id)(item.screen));
  if (path && await pickMenuPath(path)) return `the menu entry ${path.join(' > ')}`;
  const other = env.screenTree?.hubs.find((candidate) => candidate.id !== hub.id);
  if (!other) return null;
  nav.open(other.id);
  const pill = await waitFor(() => switchPill(hub.title));
  if (!pill) return null;
  click(pill);
  return 'the bucket switch';
};

export { openBucket };
