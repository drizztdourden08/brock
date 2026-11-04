/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub/hub.type';
import { menuPathTo } from '../menu/menu-path-to';
import type { ReviewEnv } from '../review.type';
import { bucketRoute } from './bucket-route';
import { opensBucket } from './opens-bucket';

const isUnlinked = (env: ReviewEnv, hub: HubDef): boolean =>
  hub.switcher === false && bucketRoute(env, hub) === null && menuPathTo(env.menu, (item) => opensBucket(hub.id)(item.screen)) === null;

export { isUnlinked };
