/* @layer renderer-shell @kind logic */
import type { HubTab } from '../../hub/hub.type';
import { renderPage } from '../kinds/render-page';
import { byOrder } from './by-order';
import { entryLabel } from './entry-label';
import { entryOrder } from './entry-order';
import { pageMetaFields } from './page-meta-fields';
import { iconNode } from './icon-node';
import { KIND_ICONS } from './screens.constants';
import type { BucketDef } from './screens-config.type';
import type { OrderedTab, PageMetaEntry, PlacedPage, TabEntry } from './screen-tree.type';

const orderedTab = (bucket: BucketDef, entry: TabEntry): OrderedTab => ({
  id: entry.id,
  label: entryLabel(entry),
  order: entryOrder(entry),
  render: renderPage(entry.component, bucket),
});

const hubTab = (tab: OrderedTab): HubTab => ({ id: tab.id, label: tab.label, render: tab.render });

const folderOf = (entry: { group?: string }, page: string): string => `${entry.group ?? ''}/${page}`;

const tabPages = (bucket: BucketDef, entries: readonly TabEntry[], metas: readonly PageMetaEntry[] = []): PlacedPage[] =>
  [...new Set(entries.map((entry) => folderOf(entry, entry.page)))].flatMap((folder) => {
    const members = entries.filter((entry) => folderOf(entry, entry.page) === folder);
    const tabs = members.map((entry) => orderedTab(bucket, entry)).sort(byOrder).map(hubTab);
    const [first] = members;
    const [lead] = tabs;
    if (first === undefined || lead === undefined) return [];
    const own: PageMetaEntry = metas.find((meta) => folderOf(meta, meta.id) === folder) ?? { kind: 'page-meta', id: first.page, bucket: bucket.id };
    return [{
      group: first.group ?? null,
      order: entryOrder(own),
      page: {
        id: first.page,
        label: entryLabel(own),
        icon: iconNode(own.meta?.icon ?? KIND_ICONS.tab),
        ...pageMetaFields(own.meta),
        tabs,
        render: lead.render,
      },
    }];
  });

export { tabPages };
