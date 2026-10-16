/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub/hub.type';
import { preloadOf } from '../../lazy/preload-of';
import type { Preloadable } from '../../lazy/lazy.type';
import type { BackdropEntry, BucketEntry } from './screen-tree.type';

const joined = <T extends Preloadable>(target: T, art: () => Promise<unknown>): T => {
  const own = target.preload;
  return { ...target, preload: own === undefined ? art : () => Promise.all([own(), art()]) };
};

const pageWith = (page: HubPage, art: () => Promise<unknown>): HubPage => ({
  ...joined(page, art),
  ...(page.tabs === undefined ? {} : { tabs: page.tabs.map((tab) => joined(tab, art)) }),
  ...(page.subs === undefined ? {} : { subs: page.subs.map((sub) => joined(sub, art)) }),
});

const withBackdropPreload = (hub: HubDef, entries: readonly BucketEntry[]): HubDef => {
  const file = entries.find((entry): entry is BackdropEntry => entry.kind === 'backdrop');
  const art = file === undefined ? undefined : preloadOf(file.component);
  if (art === undefined) return hub;
  return {
    ...hub,
    home: pageWith(hub.home, art),
    groups: hub.groups.map((group) => ({ ...group, pages: group.pages.map((page) => pageWith(page, art)) })),
  };
};

export { withBackdropPreload };
