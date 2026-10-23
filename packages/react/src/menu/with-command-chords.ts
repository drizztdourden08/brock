/* @layer renderer-shell @kind logic */
import { commands } from '../commands/commands';
import type { ChordLookup } from '../commands/command.type';
import { openCommandId } from '../commands/open-command-id';
import type { MenuEntry, MenuItem } from './menu.type';

const commandOf = (item: MenuItem): string | undefined => item.command ?? (item.screen === undefined ? undefined : openCommandId(item.screen));

const withCommand = (item: MenuItem, lookup: ChordLookup): MenuItem => {
  const id = commandOf(item);
  const chords = id === undefined ? undefined : lookup(id);
  if (id === undefined || chords === undefined) return item;
  const runs = item.command !== undefined && item.onClick === undefined && item.screen === undefined;
  return { ...item, shortcut: chords[0], ...(runs ? { onClick: () => { commands.run(id); } } : {}) };
};

const withCommandChords = (entries: readonly MenuEntry[], lookup: ChordLookup): MenuEntry[] =>
  entries.map((entry): MenuEntry => {
    if (entry === 'separator') return entry;
    const item = withCommand(entry, lookup);
    return item.children ? { ...item, children: withCommandChords(item.children, lookup) } : item;
  });

export { withCommandChords };
