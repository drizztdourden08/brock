/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import { BAR_MARKER_KEYS, GROWN_SUBMENU_ICON, KEY_WORD_BREAK } from './menu-config.constants';
import type { MenuConfig, MenuForest, MenuGrows, MenuNode } from './menu-config.type';
import type { MenuItem } from './menu.type';

const labelOfKey = (key: string): string => {
  const words = key.split(KEY_WORD_BREAK).filter((word) => word !== '').join(' ');
  return words === '' ? key : `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
};

const parentOf = (config: MenuConfig | undefined, item: MenuItem): unknown => {
  const entries: unknown = config?.entries;
  const raw = isRecord(entries) ? entries[item.key] : undefined;
  const given = isRecord(raw) ? raw.parent : undefined;
  return given === undefined ? item.parent : given;
};

const plantSubmenu = (forest: MenuForest, beside: MenuNode, key: string): void => {
  const made: MenuNode = { item: { key, label: labelOfKey(key), icon: GROWN_SUBMENU_ICON }, container: beside.container, override: {} };
  const list = forest.lists.get(beside.container) ?? [];
  list.splice(Math.max(list.indexOf(beside), 0), 0, made);
  forest.lists.set(beside.container, list);
  forest.lists.set(made, []);
  forest.planted.set(made, 1);
  forest.byKey.set(key, made);
  forest.nodes.push(made);
};

const growParents = (forest: MenuForest, config: MenuConfig | undefined, grows: MenuGrows | undefined): string[] => {
  if (grows === undefined) return [];
  const grown: string[] = [];
  for (const node of [...forest.nodes]) {
    if (node.item === null) continue;
    const parent = parentOf(config, node.item);
    if (typeof parent !== 'string' || parent === '' || forest.byKey.has(parent) || BAR_MARKER_KEYS.has(parent) || !grows(node.item.key, parent)) continue;
    plantSubmenu(forest, node, parent);
    grown.push(parent);
  }
  return grown;
};

export { growParents };
