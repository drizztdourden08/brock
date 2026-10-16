/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub/hub.type';
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import type { ScreenDef } from '../screen.type';
import { menuOrderOf } from './menu-order-of';
import { menuOverrideOf } from './menu-override-of';
import { menuPath } from './menu-path';
import { placeMenuItems } from './place-menu-items';
import { BUCKET_KEY_PREFIX, BUILT_IN_SCREEN_IDS, SCREEN_KEY_PREFIX } from './screens.constants';
import type { BucketDef, ScreenMenu, ScreensConfig } from './screens-config.type';
import type { PlacedMenuItem } from './screen-tree.type';

const placedByDefault = (menu: ScreenMenu | undefined): boolean => menu === undefined || menuOverrideOf(menu) !== null;

const placesEntry = (menu: ScreenMenu | undefined): boolean => {
  const override = menuOverrideOf(menu);
  return override !== null && (override.parent !== undefined || override.group !== undefined || override.before !== undefined || override.after !== undefined);
};

const pageItem = (bucket: BucketDef, page: HubPage, home: boolean): MenuItem => ({
  key: `${BUCKET_KEY_PREFIX}${bucket.id}:${page.id}`,
  label: page.label,
  icon: page.icon,
  shortcut: page.shortcut ?? (home ? bucket.shortcut : undefined),
  bucket: bucket.id,
  page: page.id,
  devOnly: page.devOnly,
  show: page.show,
  ...menuOverrideOf(page.menu),
});

const pagesOf = (hub: HubDef): HubPage[] => [hub.home, ...hub.groups.flatMap((group) => group.pages)];

const menuSorted = (pages: readonly HubPage[], home: HubPage): HubPage[] => {
  if (!pages.some((page) => page.menuOrder !== undefined)) return [...pages];
  const rest = pages.filter((page) => page !== home).sort((a, b) => menuOrderOf(a) - menuOrderOf(b));
  return pages.includes(home) ? [home, ...rest] : rest;
};

const bucketEntries = (bucket: BucketDef, hub: HubDef | undefined, home: string): MenuItem[] => {
  const key = `${BUCKET_KEY_PREFIX}${bucket.id}`;
  if (bucket.menu === 'hidden' || hub === undefined) return [];
  if (bucket.menu === 'entry') return bucket.id === home ? [] : [{ key, label: bucket.title, icon: bucket.icon, shortcut: bucket.shortcut, screen: bucket.id, show: hub.show }];
  const pages = menuSorted(pagesOf(hub).filter((page) => placedByDefault(page.menu)), hub.home);
  return [{ key, label: bucket.title, icon: bucket.icon, show: hub.show, children: pages.map((page) => pageItem(bucket, page, page === hub.home)) }];
};

const screenItem = (screen: ScreenDef): MenuItem => ({
  key: `${SCREEN_KEY_PREFIX}${screen.id}`,
  label: screen.title,
  icon: screen.icon,
  shortcut: screen.shortcut,
  screen: screen.id,
  devOnly: screen.devOnly,
  show: screen.show,
  ...menuOverrideOf(screen.menu),
});

const pagePlacements = (config: ScreensConfig, hubs: readonly HubDef[]): PlacedMenuItem[] => config.buckets.flatMap((bucket) => {
  const hub = hubs.find((candidate) => candidate.id === bucket.id);
  return hub === undefined ? [] : pagesOf(hub).flatMap((page) => {
    const path = menuPath(page.menu) ?? (bucket.menu !== 'submenu' && placesEntry(page.menu) ? [] : null);
    return path === null ? [] : [{ path, item: pageItem(bucket, page, page === hub.home), order: menuOrderOf(page) }];
  });
});

const screenPlacements = (screens: readonly ScreenDef[]): PlacedMenuItem[] => screens.flatMap((screen) => {
  const path = menuPath(screen.menu);
  return path === null ? [] : [{ path, item: screenItem(screen), order: menuOrderOf(screen) }];
});

const deriveMenu = (config: ScreensConfig, hubs: readonly HubDef[], screens: readonly ScreenDef[]): MenuEntry[] => {
  const listed = screens.filter((screen) => !BUILT_IN_SCREEN_IDS.includes(screen.id) && placedByDefault(screen.menu));
  const buckets = config.buckets.flatMap((bucket) => bucketEntries(bucket, hubs.find((hub) => hub.id === bucket.id), config.home));
  const iconOf = (label: string) => config.buckets.find((bucket) => bucket.title.toLowerCase() === label.toLowerCase())?.icon;
  return [...placeMenuItems(buckets, [...pagePlacements(config, hubs), ...screenPlacements(screens)], iconOf), ...listed.map(screenItem)];
};

export { deriveMenu };
