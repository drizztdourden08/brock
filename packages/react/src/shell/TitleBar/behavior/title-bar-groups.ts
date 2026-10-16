/* @layer renderer-shell @kind logic */
import type { MenuGroup, WindowTitleBarViewPlace } from '@drizztdourden08/tessera/composites';
import { VIEW_MENU_KEY } from '../../../menu/menu-config.constants';
import type { MenuEntry } from '../../../menu/menu.type';
import { tidySeparators } from '../../../menu/tidy-separators';
import { toMenuGroups } from '../../../menu/to-menu-groups';
import type { MenuResolver } from '../../../menu/to-menu-groups.type';
import { LAST_GROUP_ID } from '../TitleBar.constants';
import { MENU_GROUP_ID } from '../../../menu/menu.constants';
import { isEndEntry } from './is-end-entry';
import type { TitleBarMenu } from './title-bar-menu.type';

const isLast = (entry: MenuEntry): boolean => entry !== 'separator' && isEndEntry(entry);

const isView = (entry: MenuEntry): boolean => entry !== 'separator' && entry.key === VIEW_MENU_KEY;

const splitGroups = (entries: readonly MenuEntry[]): [string, MenuEntry[]][] => {
  let split = entries.length;
  while (split > 0 && isLast(entries[split - 1] ?? 'separator')) split -= 1;
  if (split === entries.length || split === 0) return [[MENU_GROUP_ID, [...entries]]];
  return [[MENU_GROUP_ID, tidySeparators(entries.slice(0, split))], [LAST_GROUP_ID, entries.slice(split)]];
};

const takeView = (lists: [string, MenuEntry[]][]): WindowTitleBarViewPlace | undefined => {
  for (const list of lists) {
    const [group, entries] = list;
    const at = entries.findIndex(isView);
    if (at < 0) continue;
    list[1] = tidySeparators(entries.filter((_, index) => index !== at));
    if (at === 0) return { group, position: 'start' };
    return { group, position: at >= list[1].length ? 'end' : at };
  }
  return undefined;
};

const titleBarGroups = (entries: readonly MenuEntry[], resolve: MenuResolver): TitleBarMenu => {
  const lists = splitGroups(entries);
  const view = takeView(lists);
  const groups = lists.flatMap(([id, list]): MenuGroup[] => toMenuGroups(list, resolve).map((group) => ({ ...group, id })));
  return view === undefined ? { groups } : { groups, view };
};

export { titleBarGroups };
