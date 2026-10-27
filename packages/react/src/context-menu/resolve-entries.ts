/* @layer renderer-shell @kind logic */
import type { MenuItem, MenuNode } from '@drizztdourden08/tessera/composites';
import { chordKeys } from '../commands/chord-keys';
import { chordsOf } from '../commands/chords-of';
import { commands } from '../commands/commands';
import { CONTEXT_MENU_SEPARATOR, MAX_SUBMENU_DEPTH } from './context-menu.constants';
import { entryData } from './entry-data';
import type { ContextMenuAction, ContextMenuCommand, ContextMenuEntry, ContextMenuSubmenu, ContextMenuView } from './context-menu.type';
import { flagOf } from './flag-of';
import { itemState } from './item-state';

const shortcutOf = (id: string, view: ContextMenuView): Pick<MenuItem, 'shortcut'> => {
  const def = view.defs.get(id);
  const chord = def === undefined ? undefined : chordsOf(def, view.state)[0];
  const keys = chord === undefined ? [] : chordKeys(chord, view.state.mac);
  return keys.length === 0 ? {} : { shortcut: keys };
};

const commandItem = (entry: ContextMenuCommand, view: ContextMenuView, path: string): MenuNode[] => {
  const def = view.defs.get(entry.command);
  if (def === undefined) return [];
  return [{
    id: `${path}:${def.id}`,
    label: entry.label ?? def.label,
    ...entryData(def.id),
    ...(def.icon === undefined ? {} : { icon: def.icon }),
    ...shortcutOf(def.id, view),
    ...itemState(entry, def),
    onSelect: () => { void commands.run(def.id, { ...view.context, args: entry.args }); },
  }];
};

const actionItem = (entry: ContextMenuAction, view: ContextMenuView, path: string): MenuNode[] => [{
  id: path,
  label: entry.label,
  ...entryData(entry.label),
  ...(entry.icon === undefined ? {} : { icon: entry.icon }),
  ...itemState(entry),
  onSelect: () => entry.run(view.context),
}];

const submenuItem = (entry: ContextMenuSubmenu, view: ContextMenuView, path: string, depth: number): MenuNode[] => {
  if (depth >= MAX_SUBMENU_DEPTH) return [];
  const children = resolveEntries(entry.items, view, path, depth + 1);
  if (children.length === 0) return [];
  return [{ id: path, label: entry.label, ...entryData(entry.label), ...(entry.icon === undefined ? {} : { icon: entry.icon }), disabled: entry.disabled === true, children }];
};

const resolveEntry = (entry: ContextMenuEntry, view: ContextMenuView, path: string, depth: number): MenuNode[] => {
  if (entry === CONTEXT_MENU_SEPARATOR) return [{ separator: true }];
  if (typeof entry === 'string') return commandItem({ command: entry }, view, path);
  if (flagOf(entry.hidden) === true) return [];
  if ('command' in entry) return commandItem(entry, view, path);
  return 'run' in entry ? actionItem(entry, view, path) : submenuItem(entry, view, path, depth);
};

const resolveEntries = (entries: readonly ContextMenuEntry[], view: ContextMenuView, path = 'menu', depth = 0): MenuNode[] =>
  entries.flatMap((entry, index) => resolveEntry(entry, view, `${path}.${index}`, depth));

export { resolveEntries };
