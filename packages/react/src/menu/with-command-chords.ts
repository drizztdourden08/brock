/* @layer renderer-shell @kind logic */
import type { ChordLookup, CommandDescription } from '../commands/command.type';
import { openCommandId } from '../commands/open-command-id';
import { runWithPicker } from '../palette/run-with-picker';
import type { MenuEntry, MenuItem } from './menu.type';
import type { DescribeLookup } from './with-command-chords.type';

const commandOf = (item: MenuItem): string | undefined => item.command ?? (item.screen === undefined ? undefined : openCommandId(item.screen));

const gated = (item: MenuItem, described: CommandDescription): MenuItem => {
  if (described.enabled) return item;
  const reason = described.reason ?? undefined;
  return { ...item, disabled: true, ...(reason === undefined ? {} : { description: reason }) };
};

const gateByCommand = (item: MenuItem, describe: DescribeLookup | undefined): MenuItem | null => {
  if (item.command === undefined || describe === undefined) return item;
  const described = describe(item.command);
  return described.visible ? gated(item, described) : null;
};

const withCommand = (item: MenuItem, lookup: ChordLookup, describe: DescribeLookup | undefined): MenuItem | null => {
  const id = commandOf(item);
  const chords = id === undefined ? undefined : lookup(id);
  if (id === undefined || chords === undefined) return item;
  const runs = item.command !== undefined && item.onClick === undefined && item.screen === undefined;
  return gateByCommand({ ...item, shortcut: chords[0], ...(runs ? { onClick: () => { void runWithPicker(id); } } : {}) }, describe);
};

const withCommandChords = (entries: readonly MenuEntry[], lookup: ChordLookup, describe?: DescribeLookup): MenuEntry[] =>
  entries.flatMap((entry): MenuEntry[] => {
    if (entry === 'separator') return [entry];
    const item = withCommand(entry, lookup, describe);
    if (item === null) return [];
    return [item.children ? { ...item, children: withCommandChords(item.children, lookup, describe) } : item];
  });

export { withCommandChords };
