/* @layer renderer-shell @kind logic */
import { defineScreen } from '../define-screen';
import { renderCard } from '../kinds/render-card';
import type { ScreenDef } from '../screen.type';
import { entryLabel } from './entry-label';
import { iconNode } from './icon-node';
import { KIND_ICONS } from './screens.constants';
import type { CardEntry } from './screen-tree.type';

const cardScreen = (entry: CardEntry): ScreenDef => defineScreen({
  id: entry.id,
  title: entryLabel(entry),
  icon: iconNode(entry.meta?.icon ?? KIND_ICONS[entry.kind]),
  layer: entry.kind === 'layer' ? 'own' : 'fullscreen',
  devOnly: entry.meta?.devOnly ?? false,
  requiresProfile: entry.meta?.requiresProfile ?? true,
  shortcut: entry.meta?.shortcut,
  render: renderCard(entry.component),
});

export { cardScreen };
