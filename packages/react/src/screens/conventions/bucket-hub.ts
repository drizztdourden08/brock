/* @layer renderer-shell @kind logic */
import type { HubDef, HubGroup, HubPage } from '../../hub/hub.type';
import { contentPage } from './content-page';
import { heroPage } from './hero-page';
import { hubGroups } from './hub-groups';
import { iconNode } from './icon-node';
import type { BucketDef } from './screens-config.type';
import type { BucketEntry, FreePageEntry, HeroEntry, PageEntry, PageMetaEntry, SettingsEntry, TabEntry } from './screen-tree.type';
import { tabPages } from './tab-pages';

const withoutPage = (groups: readonly HubGroup[], page: HubPage): HubGroup[] =>
  groups.map((group) => ({ ...group, pages: group.pages.filter((candidate) => candidate !== page) })).filter((group) => group.pages.length > 0);

const bucketHub = (bucket: BucketDef, entries: readonly BucketEntry[]): HubDef => {
  const hero = entries.find((entry): entry is HeroEntry => entry.kind === 'hero');
  const content = entries.filter((entry): entry is PageEntry | FreePageEntry | SettingsEntry => entry.kind === 'page' || entry.kind === 'custom' || entry.kind === 'settings');
  const tabs = entries.filter((entry): entry is TabEntry => entry.kind === 'tab');
  const metas = entries.filter((entry): entry is PageMetaEntry => entry.kind === 'page-meta');
  const groups = hubGroups(bucket, [...content.map((entry) => contentPage(bucket, entry)), ...tabPages(bucket, tabs, metas)]);
  const home = hero ? heroPage(bucket, hero) : groups.at(0)?.pages.at(0);
  if (home === undefined) throw new Error(`Bucket "${bucket.id}" has no screens: add src/screens/${bucket.id}/home.hero.tsx or a page.`);
  return {
    id: bucket.id,
    title: bucket.title,
    icon: iconNode(bucket.icon),
    shortcut: bucket.shortcut,
    home,
    groups: hero ? groups : withoutPage(groups, home),
    search: { placeholder: `Search ${bucket.title}` },
  };
};

export { bucketHub };
