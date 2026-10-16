/* @layer renderer-shell @kind logic */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import { VIEW_MARKER_GROUP, VIEW_MENU_KEY, VIEW_PLACE_FIELDS } from './menu-config.constants';
import type { MenuEntryOverride, MenuForest, MenuIssue, MenuNode } from './menu-config.type';
import { menuMoves } from './menu-moves';

const plant = (forest: MenuForest, override: MenuEntryOverride | undefined): MenuNode | null => {
  if (override === undefined || forest.byKey.has(VIEW_MENU_KEY) || !VIEW_PLACE_FIELDS.some((field) => override[field] !== undefined)) return null;
  const node: MenuNode = { item: { key: VIEW_MENU_KEY, label: TESSERA_STRINGS.windows.view }, container: VIEW_MARKER_GROUP, override: {} };
  forest.nodes.push(node);
  forest.byKey.set(VIEW_MENU_KEY, node);
  menuMoves.attach(forest, node, VIEW_MARKER_GROUP);
  return node;
};

const settle = (forest: MenuForest, node: MenuNode | null, issues: MenuIssue[]): void => {
  if (node === null || typeof node.container === 'string') return;
  const list = forest.lists.get(node.container) ?? [];
  list.splice(list.indexOf(node), 1);
  issues.push({ key: VIEW_MENU_KEY, message: 'menu.entries.view places View inside a submenu, but View sits at the top level of the menu, so it stays where the title bar puts it' });
};

const viewMarker = { plant, settle };

export { viewMarker };
