/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { MenuItem } from '../src/menu/menu.type';
import { withCommandChords } from '../src/menu/with-command-chords';
import { withActionChord } from '../src/title-bar/with-action-chord';

const chords: Readonly<Record<string, readonly string[]>> = { 'file.save': ['Mod+Alt+S'], 'open:library': ['Mod+L'], 'brock.search': [] };
const lookup = (id: string): readonly string[] | undefined => chords[id];

describe('menus read the current chord from the registry', () => {
  it('shows the chord of a command entry and runs it', () => {
    const [save] = withCommandChords([{ key: 'save', label: 'Save', command: 'file.save' }], lookup) as MenuItem[];
    expect(save?.shortcut).toBe('Mod+Alt+S');
    expect(save?.onClick).toBeTypeOf('function');
  });

  it('shows the chord of a screen route and keeps an unknown entry as it is', () => {
    const entries = withCommandChords([
      { key: 'library', label: 'Library', screen: 'library', shortcut: 'Mod+B' },
      { key: 'notes', label: 'Notes', screen: 'notes', shortcut: 'Mod+N' },
    ], lookup) as MenuItem[];
    expect(entries.map((entry) => entry.shortcut)).toEqual(['Mod+L', 'Mod+N']);
  });

  it('gives a title bar action the remapped chord, or none once cleared', () => {
    const search = { id: 'search', label: 'Search', icon: 'search' as const, onSelect: () => {} };
    expect(withActionChord(search, lookup).shortcut).toBeUndefined();
    expect(withActionChord(search, () => ['Mod+P']).shortcut).toBe('Mod+P');
  });
});
