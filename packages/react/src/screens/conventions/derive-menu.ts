/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub/hub.type';
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import type { ScreenDef } from '../screen.type';
import { BUCKET_KEY_PREFIX, BUILT_IN_SCREEN_IDS, SCREEN_KEY_PREFIX } from './screens.constants';
import type { BucketDef, ScreensConfig } from './screens-config.type';

const pageItem = (bucket: BucketDef, page: HubPage, home: boolean): MenuItem => ({
  key: `${BUCKET_KEY_PREFIX}${bucket.id}:${page.id}`,
  label: page.label,
  icon: page.icon,
  shortcut: page.shortcut ?? (home ? bucket.shortcut : undefined),
  bucket: bucket.id,
  page: page.id,
  devOnly: page.devOnly,
});

const bucketEntries = (bucket: BucketDef, hub: HubDef | undefined, home: string): MenuItem[] => {
  const key = `${BUCKET_KEY_PREFIX}${bucket.id}`;
  if (bucket.menu === 'hidden' || hub === undefined) return [];
  if (bucket.menu === 'entry') return bucket.id === home ? [] : [{ key, label: bucket.title, icon: bucket.icon, shortcut: bucket.shortcut, screen: bucket.id }];
  const pages = [hub.home, ...hub.groups.flatMap((group) => group.pages)];
  return [{ key, label: bucket.title, icon: bucket.icon, children: pages.map((page) => pageItem(bucket, page, page === hub.home)) }];
};

const screenItem = (screen: ScreenDef): MenuItem => ({
  key: `${SCREEN_KEY_PREFIX}${screen.id}`,
  label: screen.title,
  icon: screen.icon,
  shortcut: screen.shortcut,
  screen: screen.id,
  devOnly: screen.devOnly,
});

const deriveMenu = (config: ScreensConfig, hubs: readonly HubDef[], screens: readonly ScreenDef[]): MenuEntry[] => [
  ...config.buckets.flatMap((bucket) => bucketEntries(bucket, hubs.find((hub) => hub.id === bucket.id), config.home)),
  ...screens.filter((screen) => !BUILT_IN_SCREEN_IDS.includes(screen.id)).map(screenItem),
];

export { deriveMenu };
