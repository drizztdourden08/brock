/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub/hub.type';
import { menuPathTo } from '../menu/menu-path-to';
import type { ReviewEnv } from '../review.type';
import { opensBucket } from './opens-bucket';

const bucketRoute = ({ screenTree }: ReviewEnv, hub: HubDef): string | null => {
  if (screenTree?.home === hub.id) return 'Home and Escape';
  return screenTree?.settingsBucket === hub.id ? 'the settings gear' : null;
};

const isUnlinked = (env: ReviewEnv, hub: HubDef): boolean =>
  hub.switcher === false && bucketRoute(env, hub) === null && menuPathTo(env.menu, (item) => opensBucket(hub.id)(item.screen)) === null;

export { bucketRoute, isUnlinked };
