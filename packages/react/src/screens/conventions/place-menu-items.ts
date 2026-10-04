/* @layer renderer-shell @kind logic */
import type { MenuItem } from '../../menu/menu.type';
import { byOrder } from './by-order';
import { MENU_GROUP_ICON, MENU_KEY_PREFIX } from './screens.constants';
import type { MenuIconOf as IconOf, PlacedMenuItem } from './screen-tree.type';

const sameLabel = (a: string, b: string): boolean => a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0;

const asParent = (item: MenuItem): MenuItem =>
  (item.children ? item : { key: `${item.key}:menu`, label: item.label, icon: item.icon, devOnly: item.devOnly, children: [item] });

const parentIn = (list: MenuItem[], label: string, key: string, iconOf: IconOf): MenuItem => {
  const at = list.findIndex((item) => sameLabel(item.label, label));
  const found = at === -1 ? { key, label, icon: iconOf(label) ?? MENU_GROUP_ICON, children: [] } : asParent(list.at(at) ?? { key, label });
  if (at === -1) list.push(found);
  else list.splice(at, 1, found);
  return found;
};

const childrenOf = (item: MenuItem): MenuItem[] => {
  const kids = (item.children ?? []).filter((entry): entry is MenuItem => entry !== 'separator');
  item.children = kids;
  return kids;
};

const placeOne = (top: MenuItem[], placed: PlacedMenuItem, iconOf: IconOf): void => {
  let list = top;
  let key = MENU_KEY_PREFIX;
  for (const label of placed.path) {
    key = `${key}/${label.toLowerCase()}`;
    list = childrenOf(parentIn(list, label, key, iconOf));
  }
  list.push(placed.item);
};

const clone = (items: readonly MenuItem[]): MenuItem[] => items.map((item) => (item.children ? { ...item, children: [...item.children] } : { ...item }));

const placeMenuItems = (items: readonly MenuItem[], placed: readonly PlacedMenuItem[], iconOf: IconOf): MenuItem[] => {
  const top = clone(items);
  const sorted = placed.map((entry) => ({ ...entry, label: entry.item.label })).sort(byOrder);
  for (const entry of sorted) placeOne(top, entry, iconOf);
  return top;
};

export { placeMenuItems };
