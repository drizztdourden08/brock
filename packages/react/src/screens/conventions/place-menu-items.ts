/* @layer renderer-shell @kind logic */
import type { MenuItemDef } from '../../menu/menu.type';
import { byOrder } from './by-order';
import { MENU_GROUP_ICON, MENU_KEY_PREFIX } from './screens.constants';
import type { MenuIconOf as IconOf, PlacedMenuItem } from './screen-tree.type';

const sameLabel = (a: string, b: string): boolean => a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0;

const asParent = (item: MenuItemDef): MenuItemDef =>
  (item.children ? item : { key: `${item.key}:menu`, label: item.label, icon: item.icon, devOnly: item.devOnly, children: [item] });

const parentIn = (list: MenuItemDef[], label: string, key: string, iconOf: IconOf): MenuItemDef => {
  const at = list.findIndex((item) => typeof item.label === 'string' && sameLabel(item.label, label));
  const found = at === -1 ? { key, label, icon: iconOf(label) ?? MENU_GROUP_ICON, children: [] } : asParent(list.at(at) ?? { key, label });
  if (at === -1) list.push(found);
  else list.splice(at, 1, found);
  return found;
};

const childrenOf = (item: MenuItemDef): MenuItemDef[] => {
  const kids = (item.children ?? []).filter((entry): entry is MenuItemDef => entry !== 'separator');
  item.children = kids;
  return kids;
};

const placeOne = (top: MenuItemDef[], placed: PlacedMenuItem, iconOf: IconOf): void => {
  let list = top;
  let key = MENU_KEY_PREFIX;
  for (const label of placed.path) {
    key = `${key}/${label.toLowerCase()}`;
    list = childrenOf(parentIn(list, label, key, iconOf));
  }
  list.push(placed.item);
};

const clone = (items: readonly MenuItemDef[]): MenuItemDef[] => items.map((item) => (item.children ? { ...item, children: [...item.children] } : { ...item }));

const placeMenuItems = (items: readonly MenuItemDef[], placed: readonly PlacedMenuItem[], iconOf: IconOf): MenuItemDef[] => {
  const top = clone(items);
  const sorted = placed.map((entry) => ({ ...entry, label: entry.item.label })).sort(byOrder);
  for (const entry of sorted) placeOne(top, entry, iconOf);
  return top;
};

export { placeMenuItems };
