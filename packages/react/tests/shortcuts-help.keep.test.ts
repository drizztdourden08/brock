/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { chordKeys } from '../src/commands/chord-keys';
import { commandGroups } from '../src/commands/command-groups';
import type { CommandDef } from '../src/commands/command.type';
import { GENERAL_GROUP, SCREENS_GROUP } from '../src/commands/commands.constants';
import { shortcutGroups } from '../src/shortcuts-help/shortcut-groups';

const run = (): void => {};
const command = (id: string, label: string, chord: string | undefined, group: string): CommandDef => ({ id, label, chord, group, run });

describe('chordKeys', () => {
  it('turns a chord into Tessera keycaps', () => {
    expect(chordKeys('Mod+Comma', false)).toEqual(['ctrl', ',']);
    expect(chordKeys('Ctrl+Shift+p', false)).toEqual(['ctrl', 'shift', 'P']);
    expect(chordKeys('Alt+Enter', false)).toEqual(['alt', 'enter']);
    expect(chordKeys('Mod+/', false)).toEqual(['ctrl', '/']);
    expect(chordKeys('F5', false)).toEqual(['F5']);
    expect(chordKeys('Esc', false)).toEqual(['esc']);
  });

  it('shows the platform modifier', () => {
    expect(chordKeys('Mod+K', true)).toEqual(['cmd', 'K']);
  });
});

describe('shortcutGroups', () => {
  const defs = [
    command('brock.search', 'Search', 'Mod+K', GENERAL_GROUP),
    command('open:settings', 'Settings', 'Mod+Comma', SCREENS_GROUP),
    command('open:settings/home', 'Settings home', 'mod+comma', SCREENS_GROUP),
    command('open:play/rooms', 'Rooms', 'Mod+R', SCREENS_GROUP),
    command('open:about', 'About', undefined, SCREENS_GROUP),
    command('save', 'Save', 'Mod+S', 'File'),
  ];
  const state = { sources: [{ key: 'all', rank: 0, defs }], overrides: {}, mac: false };

  it('lists General first with Escape, the app groups, then each screen chord once', () => {
    const groups = shortcutGroups({ groups: commandGroups(defs), state });
    expect(groups.map((group) => group.title)).toEqual([GENERAL_GROUP, 'File', SCREENS_GROUP]);
    expect(groups[0]?.rows.map((row) => row.shortcut)).toEqual(['Mod+K', 'Esc']);
    expect(groups[2]?.rows).toEqual([{ label: 'Settings', shortcut: 'Mod+,' }, { label: 'Rooms', shortcut: 'Mod+R' }]);
  });

  it('shows a remapped chord and leaves out a cleared one', () => {
    const remapped = { ...state, overrides: { save: ['Mod+Shift+S'], 'brock.search': [] } };
    const groups = shortcutGroups({ groups: commandGroups(defs), state: remapped });
    expect(groups[0]?.rows.map((row) => row.shortcut)).toEqual(['Esc']);
    expect(groups[1]?.rows).toEqual([{ label: 'Save', shortcut: 'Mod+Shift+S' }]);
  });
});
