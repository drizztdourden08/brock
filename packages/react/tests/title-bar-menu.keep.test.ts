/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { MenuEntry } from '../src/menu/menu.type';
import { titleBarGroups } from '../src/shell/TitleBar/behavior/title-bar-groups';
import { withoutActionEntries } from '../src/shell/TitleBar/behavior/without-action-entries';

const MENU: MenuEntry[] = [
  { key: 'home', label: 'Home', screen: 'settings' },
  'separator',
  { key: 'section:advanced', label: 'Advanced', children: [{ key: 'report-bug', label: 'Report a bug' }] },
  { key: 'section:tools', label: 'Tools', children: [{ key: 'pads', label: 'Controllers' }, { key: 'report-bug', label: 'Report a bug' }] },
  'separator',
  { key: 'updater:check', label: 'Check for updates' },
  { key: 'about', label: 'About', screen: 'about' },
  { key: 'quit', label: 'Quit' },
];

const resolve = { openScreen: () => undefined };

describe('withoutActionEntries', () => {
  it('drops the entries a title bar action holds and the submenus they leave empty', () => {
    expect(withoutActionEntries(MENU, ['report-bug', 'updater:check', 'search'])).toEqual([
      { key: 'home', label: 'Home', screen: 'settings' },
      'separator',
      { key: 'section:tools', label: 'Tools', children: [{ key: 'pads', label: 'Controllers' }] },
      'separator',
      { key: 'about', label: 'About', screen: 'about' },
      { key: 'quit', label: 'Quit' },
    ]);
  });

  it('keeps the menu as it is without actions', () => {
    expect(withoutActionEntries(MENU, [])).toEqual(MENU);
  });
});

describe('titleBarGroups', () => {
  it('puts the trailing Quit in a group of its own, below where the bar adds its group', () => {
    const groups = titleBarGroups(MENU, resolve);
    expect(groups.map((group) => group.id)).toEqual(['menu', 'menu-end']);
    expect(groups[1]?.items.map((node) => ('id' in node ? node.id : 'separator'))).toEqual(['quit']);
  });

  it('keeps one group when the menu has no Quit at the end', () => {
    expect(titleBarGroups(MENU.slice(0, -1), resolve).map((group) => group.id)).toEqual(['menu']);
  });
});
