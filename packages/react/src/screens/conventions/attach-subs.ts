/* @layer renderer-shell @kind logic */
import type { HubPage } from '../../hub/hub.type';
import { subPage } from './sub-page';
import type { BucketDef } from './screens-config.type';
import type { PlacedPage, SubEntry } from './screen-tree.type';

const withSubs = (bucket: BucketDef, page: HubPage, group: string | null, subs: readonly SubEntry[]): HubPage => {
  const own = subs.filter((sub) => sub.page === page.id && (sub.group ?? null) === group);
  return own.length === 0 ? page : { ...page, subs: own.map((sub) => subPage(bucket, sub)) };
};

const attachSubs = (bucket: BucketDef, placed: readonly PlacedPage[], subs: readonly SubEntry[]): PlacedPage[] =>
  placed.map((entry) => ({ ...entry, page: withSubs(bucket, entry.page, entry.group, subs) }));

export { attachSubs };
