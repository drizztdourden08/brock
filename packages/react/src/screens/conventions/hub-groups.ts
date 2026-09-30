/* @layer renderer-shell @kind logic */
import type { HubGroup } from '../../hub/hub.type';
import { byOrder } from './by-order';
import type { BucketDef } from './screens-config.type';
import { groupLabel } from './group-label';
import type { PlacedPage } from './screen-tree.type';

const groupIds = (bucket: BucketDef, placed: readonly PlacedPage[]): (string | null)[] => {
  const declared = (bucket.groups ?? []).map((group) => group.id);
  const found = placed.map((entry) => entry.group).filter((id): id is string => id !== null && !declared.includes(id)).sort();
  return [...new Set<string | null>([null, ...declared, ...found])];
};

const pagesIn = (placed: readonly PlacedPage[], id: string | null) =>
  placed
    .filter((entry) => entry.group === id)
    .map((entry) => ({ order: entry.order, label: entry.page.label, page: entry.page }))
    .sort(byOrder)
    .map((entry) => entry.page);

const hubGroups = (bucket: BucketDef, placed: readonly PlacedPage[]): HubGroup[] =>
  groupIds(bucket, placed)
    .map((id) => ({ id: id ?? bucket.id, label: groupLabel(bucket, id), pages: pagesIn(placed, id) }))
    .filter((group) => group.pages.length > 0);

export { hubGroups };
