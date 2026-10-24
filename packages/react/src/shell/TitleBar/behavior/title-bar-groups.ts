/* @layer renderer-shell @kind logic */
import type { MenuGroup, WindowTitleBarViewPlace } from '@drizztdourden08/tessera/composites';
import { BAR_MARKER_KEYS, TUCKED_ROWS, VIEW_MENU_KEY } from '../../../menu/menu-config.constants';
import type { MenuEntry, MenuItem } from '../../../menu/menu.type';
import { tidySeparators } from '../../../menu/tidy-separators';
import { toMenuGroups } from '../../../menu/to-menu-groups';
import type { MenuResolver } from '../../../menu/to-menu-groups.type';
import { LAST_GROUP_ID, QUIT_KEY } from '../TitleBar.constants';
import { MENU_GROUP_ID } from '../../../menu/menu.constants';
import { isEndEntry } from './is-end-entry';
import type { TitleBarMenu, TuckedPlaces } from './title-bar-menu.type';

const isLast = (entry: MenuEntry): boolean => entry !== 'separator' && isEndEntry(entry);

const markerOf = (entry: MenuEntry): MenuItem | null => (entry !== 'separator' && BAR_MARKER_KEYS.has(entry.key) ? entry : null);

const quitApart = (entries: readonly MenuEntry[]): MenuEntry[] => {
  const at = entries.findIndex((entry) => entry !== 'separator' && entry.key === QUIT_KEY);
  if (at <= 0 || entries[at - 1] === 'separator') return [...entries];
  return [...entries.slice(0, at), 'separator', ...entries.slice(at)];
};

const splitGroups = (entries: readonly MenuEntry[]): [string, MenuEntry[]][] => {
  let split = entries.length;
  while (split > 0 && isLast(entries[split - 1] ?? 'separator')) split -= 1;
  if (split === entries.length || split === 0) return [[MENU_GROUP_ID, [...entries]]];
  return [[MENU_GROUP_ID, tidySeparators(entries.slice(0, split))], [LAST_GROUP_ID, quitApart(entries.slice(split))]];
};

const placeAt = (group: string, at: number, length: number): WindowTitleBarViewPlace => {
  if (at === 0) return { group, position: 'start' };
  return { group, position: at >= length ? 'end' : at };
};

const takeMarkers = (lists: [string, MenuEntry[]][]): { places: Map<string, WindowTitleBarViewPlace>; viewEntries: MenuEntry[] } => {
  const places = new Map<string, WindowTitleBarViewPlace>();
  const viewEntries: MenuEntry[] = [];
  for (const list of lists) {
    const [group, entries] = list;
    const found: [MenuItem, number][] = [];
    const kept: MenuEntry[] = [];
    for (const entry of entries) {
      const marker = markerOf(entry);
      if (marker === null) kept.push(entry);
      else found.push([marker, kept.length]);
    }
    if (found.length === 0) continue;
    list[1] = tidySeparators(kept);
    for (const [marker, at] of found) places.set(marker.key, placeAt(group, at, list[1].length));
    viewEntries.push(...found.flatMap(([marker]) => (marker.key === VIEW_MENU_KEY ? marker.children ?? [] : [])));
  }
  return { places, viewEntries };
};

const tuckedPlaces = (places: ReadonlyMap<string, WindowTitleBarViewPlace>): TuckedPlaces | undefined => {
  const rows = Object.entries(TUCKED_ROWS).flatMap(([row, key]) => {
    const place = places.get(key);
    return place === undefined ? [] : [[row, place] as const];
  });
  return rows.length === 0 ? undefined : Object.fromEntries(rows);
};

const titleBarGroups = (entries: readonly MenuEntry[], resolve: MenuResolver): TitleBarMenu => {
  const lists = splitGroups(entries);
  const { places, viewEntries } = takeMarkers(lists);
  const groups = lists.flatMap(([id, list]): MenuGroup[] => toMenuGroups(list, resolve).map((group) => ({ ...group, id })));
  const view = places.get(VIEW_MENU_KEY);
  const tucked = tuckedPlaces(places);
  const viewItems = toMenuGroups(tidySeparators(viewEntries), resolve).flatMap((group) => group.items);
  return { groups, ...(view === undefined ? {} : { view }), ...(tucked === undefined ? {} : { tucked }), ...(viewItems.length === 0 ? {} : { viewItems }) };
};

export { titleBarGroups };
