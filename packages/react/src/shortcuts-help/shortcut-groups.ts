/* @layer renderer-shell @kind logic */
import { chordsOf } from '../commands/chords-of';
import { GENERAL_GROUP } from '../commands/commands.constants';
import type { CommandGroupsView } from '../commands/command.type';
import { ESCAPE_ROW } from './shortcuts-help.constants';
import type { ShortcutGroup, ShortcutRow } from './shortcuts-help.type';

const shortcutGroups = ({ groups, state }: CommandGroupsView): ShortcutGroup[] =>
  groups.map((group) => {
    const seen = new Set<string>();
    const rows = group.commands.flatMap((def): ShortcutRow[] => {
      const shortcut = chordsOf(def, state)[0];
      if (shortcut === undefined || seen.has(shortcut)) return [];
      seen.add(shortcut);
      return [{ label: def.label, shortcut }];
    });
    return { title: group.title, rows: group.title === GENERAL_GROUP ? [...rows, ESCAPE_ROW] : rows };
  }).filter((group) => group.rows.length > 0);

export { shortcutGroups };
