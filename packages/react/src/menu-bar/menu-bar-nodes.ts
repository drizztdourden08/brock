/* @layer renderer-shell @kind logic */
import type { MenuItem, MenuNode } from '@drizztdourden08/tessera/composites';
import { commands } from '../commands/commands';
import { commandBlock } from '../commands/command-block';
import { commandVisible } from '../commands/command-visible';
import type { CommandDef } from '../commands/command.type';
import { MENU_SEPARATOR } from '../menu/menu.constants';
import { hasItem } from './has-item';
import { MENU_BAR_SEPARATOR } from './menu-bar.constants';
import type { MenuBarEntry, MenuBarView } from './menu-bar.type';

const itemOf = (def: CommandDef, view: MenuBarView): MenuItem => ({
  id: def.id,
  label: def.label,
  icon: def.icon,
  shortcut: view.chords(def.id)?.[0],
  disabled: commandBlock(def) !== null,
  onSelect: () => {
    void commands.run(def.id);
  },
});

const nodeOf = (entry: MenuBarEntry, path: string, view: MenuBarView): MenuNode | null => {
  if (entry === MENU_BAR_SEPARATOR) return MENU_SEPARATOR;
  if (typeof entry === 'string') {
    const def = view.defs.get(entry);
    return def === undefined || !commandVisible(def) ? null : itemOf(def, view);
  }
  const id = `${path}/${entry.label}`;
  const children = menuBarNodes(entry.entries, id, view);
  return hasItem(children) ? { id, label: entry.label, children } : null;
};

const menuBarNodes = (entries: readonly MenuBarEntry[], path: string, view: MenuBarView): MenuNode[] =>
  entries.flatMap((entry) => nodeOf(entry, path, view) ?? []);

export { menuBarNodes };
