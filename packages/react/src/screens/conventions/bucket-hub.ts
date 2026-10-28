/* @layer renderer-shell @kind logic */
import type { HubDef, HubGroup, HubPage } from '../../hub/hub.type';
import { contentPage } from './content-page';
import { heroPage } from './hero-page';
import { attachSubs } from './attach-subs';
import { bucketBackdrop } from './bucket-backdrop';
import { hubGroups } from './hub-groups';
import { iconNode } from './icon-node';
import { livePage } from './live-page';
import { showRuleOf } from '../show/show-rule-of';
import type { BucketDef } from './screens-config.type';
import type { BucketEntry, FreePageEntry, HeroEntry, LiveEntry, PageEntry, PageMetaEntry, SettingsEntry, SubEntry, TabEntry } from './screen-tree.type';
import { tabPages } from './tab-pages';
import { withBackdropPreload } from './with-backdrop-preload';

const withoutPage = (groups: readonly HubGroup[], page: HubPage): HubGroup[] =>
  groups.map((group) => ({ ...group, pages: group.pages.filter((candidate) => candidate !== page) })).filter((group) => group.pages.length > 0);

const bucketHub = (bucket: BucketDef, entries: readonly BucketEntry[]): HubDef => {
  const hero = entries.find((entry): entry is HeroEntry => entry.kind === 'hero');
  const content = entries.filter((entry): entry is PageEntry | FreePageEntry | SettingsEntry => entry.kind === 'page' || entry.kind === 'custom' || entry.kind === 'settings');
  const tabs = entries.filter((entry): entry is TabEntry => entry.kind === 'tab');
  const metas = entries.filter((entry): entry is PageMetaEntry => entry.kind === 'page-meta');
  const subs = entries.filter((entry): entry is SubEntry => entry.kind === 'sub');
  const lives = entries.filter((entry): entry is LiveEntry => entry.kind === 'live');
  const groups = hubGroups(bucket, attachSubs(bucket, [...content.map((entry) => contentPage(bucket, entry)), ...tabPages(bucket, tabs, metas), ...lives.map(livePage)], subs));
  const home = hero ? heroPage(bucket, hero) : groups.flatMap((group) => group.pages).find((page) => page.live === undefined);
  if (home === undefined) throw new Error(`Bucket "${bucket.id}" has no screens: add src/screens/${bucket.id}/home.hero.tsx or a page.`);
  return withBackdropPreload({
    id: bucket.id,
    title: bucket.title,
    icon: iconNode(bucket.icon),
    shortcut: bucket.shortcut,
    show: showRuleOf(bucket),
    switcher: bucket.switcher,
    nav: bucket.nav,
    pages: bucket.pages,
    backdrop: bucketBackdrop(bucket, entries),
    requiresProfile: bucket.requiresProfile,
    top: bucket.top,
    header: bucket.header,
    params: bucket.params,
    home,
    groups: hero ? groups : withoutPage(groups, home),
    search: { placeholder: `Search ${bucket.title}` },
  }, entries);
};

export { bucketHub };
