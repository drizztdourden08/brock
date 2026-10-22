/* @layer renderer-shell @kind logic */
import { groupsOf } from '../../groups-of';
import type { WindowDef, WindowItem } from '../../window.type';

const enabledItems = (def: WindowDef): WindowItem[] => groupsOf(def).flatMap((group) => group.items).filter((item) => item.disabled !== true);

const activeItem = (def: WindowDef, ...wanted: readonly unknown[]): WindowItem => {
  const items = enabledItems(def);
  const named = [...wanted, def.initial].map((id) => items.find((item) => item.id === id));
  const found = named.find((item) => item !== undefined) ?? items[0];
  if (found === undefined) throw new Error('defineWindow: every nav item is disabled.');
  return found;
};

export { activeItem };
