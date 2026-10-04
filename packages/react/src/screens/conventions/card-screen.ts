/* @layer renderer-shell @kind logic */
import { defineScreen } from '../define-screen';
import { renderCard } from '../kinds/render-card';
import type { ScreenDef } from '../screen.type';
import { entryLabel } from './entry-label';
import { iconNode } from './icon-node';
import { KIND_ICONS } from './screens.constants';
import { screenMetaFields } from './screen-meta-fields';
import type { BaseEntry, CardEntry } from './screen-tree.type';

const cardScreen = (entry: CardEntry | BaseEntry): ScreenDef => defineScreen({
  id: entry.id,
  title: entryLabel(entry),
  icon: iconNode(entry.meta?.icon ?? KIND_ICONS[entry.kind]),
  layer: entry.kind === 'card' ? 'fullscreen' : 'own',
  ...screenMetaFields(entry.meta),
  ...(entry.kind === 'base' ? { header: 'none', menu: false } : {}),
  render: renderCard(entry.component),
});

export { cardScreen };
