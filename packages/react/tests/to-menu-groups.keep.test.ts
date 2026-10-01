/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { MenuItem as TesseraMenuItem } from '@drizztdourden08/tessera/composites';
import { toMenuGroups } from '../src/menu/to-menu-groups';
import type { MenuEntry } from '../src/menu/menu.type';

const MENU: MenuEntry[] = [
  { key: 'home', label: 'Home', icon: 'house', screen: 'home', shortcut: 'Mod+Comma' },
  'separator',
  { key: 'section:advanced', label: 'Advanced', icon: 'sliders-horizontal', children: [{ key: 'quit', label: 'Quit', onClick: () => undefined }, 'separator'] },
];

describe('toMenuGroups', () => {
  it('wraps the menu in one group with ids, separators and shortcuts', () => {
    const [group] = toMenuGroups(MENU, { openScreen: () => undefined });
    const [home, separator, advanced] = group?.items ?? [];
    expect(group?.items).toHaveLength(3);
    expect(home).toMatchObject({ id: 'home', label: 'Home', icon: 'house', shortcut: 'Mod+Comma' });
    expect(separator).toEqual({ separator: true });
    expect((advanced as TesseraMenuItem).children).toMatchObject([{ id: 'quit' }, { separator: true }]);
  });

  it('opens the screen and runs onClick on select, and leaves a bare item without one', () => {
    const opened: string[] = [];
    const clicked: string[] = [];
    const entries: MenuEntry[] = [
      { key: 'about', label: 'About', screen: 'about', onClick: () => clicked.push('about') },
      { key: 'note', label: 'Note' },
    ];
    const [about, note] = toMenuGroups(entries, { openScreen: (id) => opened.push(id) })[0]?.items as TesseraMenuItem[];
    about?.onSelect?.();
    expect(opened).toEqual(['about']);
    expect(clicked).toEqual(['about']);
    expect(note?.onSelect).toBeUndefined();
  });
});
