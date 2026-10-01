/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { SettingsTabPage } from '../../hub/SettingsTabPage/SettingsTabPage';
import { joinRoute } from '../../navigation/join-route';
import { renderPage } from '../kinds/render-page';
import { entryLabel } from './entry-label';
import { entryOrder } from './entry-order';
import { iconNode } from './icon-node';
import { KIND_ICONS } from './screens.constants';
import type { BucketDef } from './screens-config.type';
import type { FreePageEntry, PageEntry, PlacedPage, SettingsEntry } from './screen-tree.type';

const contentPage = (bucket: BucketDef, entry: PageEntry | FreePageEntry | SettingsEntry): PlacedPage => ({
  group: entry.group ?? null,
  order: entryOrder(entry),
  page: {
    id: entry.id,
    label: entryLabel(entry),
    icon: iconNode(entry.meta?.icon ?? KIND_ICONS[entry.kind]),
    devOnly: entry.meta?.devOnly,
    shortcut: entry.meta?.shortcut,
    render: entry.kind !== 'settings'
      ? renderPage(entry.component, bucket)
      : () => createElement(SettingsTabPage, { tabId: joinRoute(entry.bucket, entry.id) }),
  },
});

export { contentPage };
