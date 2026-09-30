/* @layer renderer-shell @kind logic */
import type { HubTab } from '../../hub/hub.type';
import { renderPage } from '../kinds/render-page';
import { byOrder } from './by-order';
import { entryLabel } from './entry-label';
import { entryOrder } from './entry-order';
import { iconNode } from './icon-node';
import { KIND_ICONS, UNORDERED } from './screens.constants';
import type { BucketDef } from './screens-config.type';
import type { OrderedTab, PlacedPage, TabEntry } from './screen-tree.type';
import { titleCase } from './title-case';

const orderedTab = (bucket: BucketDef, entry: TabEntry): OrderedTab => ({
  id: entry.id,
  label: entryLabel(entry),
  order: entryOrder(entry),
  render: renderPage(entry.component, bucket),
});

const hubTab = (tab: OrderedTab): HubTab => ({ id: tab.id, label: tab.label, render: tab.render });

const folderOf = (entry: TabEntry): string => `${entry.group ?? ''}/${entry.page}`;

const tabPages = (bucket: BucketDef, entries: readonly TabEntry[]): PlacedPage[] =>
  [...new Set(entries.map(folderOf))].flatMap((folder) => {
    const members = entries.filter((entry) => folderOf(entry) === folder);
    const tabs = members.map((entry) => orderedTab(bucket, entry)).sort(byOrder).map(hubTab);
    const [first] = members;
    const [lead] = tabs;
    if (first === undefined || lead === undefined) return [];
    return [{
      group: first.group ?? null,
      order: UNORDERED,
      page: { id: first.page, label: titleCase(first.page), icon: iconNode(KIND_ICONS.tab), tabs, render: lead.render },
    }];
  });

export { tabPages };
