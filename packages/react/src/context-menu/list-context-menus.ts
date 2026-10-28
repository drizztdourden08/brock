/* @layer renderer-shell @kind logic */
import { commands } from '../commands/commands';
import { commandIds } from './command-ids';
import type { ContextMenuConfig, ContextMenuContext, ContextMenuEntry, ListedContextMenu } from './context-menu.type';
import { entriesOf } from './entries-of';
import { findZoneElement } from './find-zone-element';
import { zonesAt } from './zones-at';
import { useContextMenuStore } from './useContextMenuStore';

const probe = (zone: string): ContextMenuContext => {
  const element = findZoneElement(zone);
  return { point: { x: 0, y: 0 }, target: element ?? document.body, trigger: 'keyboard', data: zonesAt(element)[0]?.data };
};

const entriesFor = (zone: string, config: ContextMenuConfig): readonly ContextMenuEntry[] => {
  try {
    return entriesOf(config, probe(zone));
  } catch {
    return [];
  }
};

const listContextMenus = (): ListedContextMenu[] => {
  const registered = new Set(commands.list({ includeHidden: true }).map((def) => def.id));
  const { known, menus } = useContextMenuStore.getState();
  return Object.entries({ ...known, ...menus }).map(([zone, config]) => {
    const entries = entriesFor(zone, config);
    const ids = commandIds(entries);
    return { zone, entries, commands: ids, missing: ids.filter((id) => !registered.has(id)), mounted: zone in menus };
  });
};

export { listContextMenus };
