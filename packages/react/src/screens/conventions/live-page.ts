/* @layer renderer-shell @kind logic */
import { entryLabel } from './entry-label';
import { entryOrder } from './entry-order';
import { iconNode } from './icon-node';
import type { LiveEntry, PlacedPage } from './screen-tree.type';

const livePage = (entry: LiveEntry): PlacedPage => ({
  group: entry.group ?? null,
  order: entryOrder(entry),
  page: {
    id: entry.id,
    label: entryLabel(entry),
    icon: iconNode(entry.meta.icon),
    devOnly: entry.meta.devOnly,
    bare: entry.meta.bare,
    showHeader: entry.meta.showHeader,
    order: entry.meta.order,
    menu: false,
    render: () => null,
    live: { usePages: entry.usePages, meta: entry.meta },
  },
});

export { livePage };
