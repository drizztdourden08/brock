/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import { resolveShellMenu } from '../src/app/BrockApp/behavior/resolve-shell-menu';
import type { MenuBuildInput } from '../src/app/BrockApp/BrockApp.type';
import type { MenuConfig } from '../src/menu/menu-config.type';
import type { MenuEntry } from '../src/menu/menu.type';
import { searchableMenu } from '../src/menu/searchable-menu';
import { viewHidden } from '../src/menu/view-hidden';
import { visibleMenu } from '../src/menu/visible-menu';
import { menuExpectation } from '../src/review/menu/menu-expectation';
import { withoutTuckedRows } from '../src/review/menu/without-tucked-rows';
import { titleBarGroups } from '../src/shell/TitleBar/behavior/title-bar-groups';
import { tuckedRows } from '../src/shell/TitleBar/behavior/tucked-rows';

const noop = (): void => undefined;

const BASE: MenuBuildInput = {
  appMenu: [{ key: 'section:tools', label: 'Tools', children: [{ key: 'notes', label: 'Notes', screen: 'notes' }] }],
  moduleMenu: [],
  widgets: [],
  homeScreen: 'settings',
  hasCredits: false,
  developerTools: false,
  onQuit: noop,
  onDevConsole: noop,
  onReportBug: noop,
  onShortcuts: noop,
};

const withView = (entries: NonNullable<MenuConfig['entries']>, more: Partial<MenuBuildInput> = {}): MenuBuildInput => ({ ...BASE, ...more, menuConfig: { entries } });
const keys = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));
const bar = (input: MenuBuildInput) => titleBarGroups(visibleMenu(resolveShellMenu(input).entries), { openScreen: noop });
const ids = (input: MenuBuildInput): string[][] => bar(input).groups.map((group) => group.items.map((node) => ('id' in node ? node.id : '|')));
const messages = (input: MenuBuildInput): string[] => resolveShellMenu(input).issues.map((issue) => issue.message);

describe('the View entry of the menu config', () => {
  it('keeps the title bar default when View is untouched or only renamed', () => {
    for (const input of [BASE, withView({ view: { label: 'Window' } })]) {
      expect(bar(input).view).toBeUndefined();
      expect(messages(input)).toEqual([]);
      expect(ids(input).flat()).not.toContain('view');
    }
  });

  it('places View in a group of the title bar menu at the index the config gives', () => {
    expect(bar(withView({ view: { group: 'end', order: -1 } })).view).toEqual({ group: 'menu-end', position: 'start' });
    expect(bar(withView({ view: { after: 'about' } })).view).toEqual({ group: 'menu-end', position: 1 });
    expect(bar(withView({ view: { group: 'end' } })).view).toEqual({ group: 'menu-end', position: 'end' });
    expect(bar(withView({ view: { after: 'home' } })).view).toEqual({ group: 'menu', position: 1 });
    expect(bar(withView({ view: { order: 1 } })).view).toEqual({ group: 'menu', position: 'end' });
    expect(ids(withView({ view: { after: 'about' } }))).toEqual([['home', 'profiles', 'section:tools', '|', 'section:advanced'], ['about', 'quit']]);
  });

  it('lets other entries sit beside a moved View', () => {
    const input = withView({ view: { group: 'end', order: -1 }, about: { before: 'view' } });
    expect(bar(input).view).toEqual({ group: 'menu-end', position: 1 });
    expect(messages(input)).toEqual([]);
  });

  it('hides View with hidden or inMenu false, keeping it out of every menu Brock hands on', () => {
    for (const view of [{ hidden: true }, { inMenu: false }]) {
      const input = withView({ view });
      expect(viewHidden(input.menuConfig)).toBe(true);
      expect(bar(input).view).toBeUndefined();
      expect(resolveShellMenu(input).overrides.map((record) => record.key)).toEqual(['view']);
    }
    expect(viewHidden(withView({ view: { label: 'Window' } }).menuConfig)).toBe(false);
  });

  it('never lists the View marker in the search palette or in buildMenu', () => {
    const input = withView({ view: { group: 'main' } });
    expect(keys(visibleMenu(resolveShellMenu(input).entries))).toContain('view');
    expect(keys(searchableMenu(resolveShellMenu(input).entries))).not.toContain('view');
    expect(keys(buildMenu(input))).not.toContain('view');
  });

  it('reports a parent and a place inside a submenu, and keeps the default place', () => {
    expect(messages(withView({ view: { parent: 'section:tools' } }))).toEqual(['menu.entries.view sets parent, but the View sub-menu sits at the top level of the menu and takes no parent']);
    const inside = withView({ view: { before: 'notes' } });
    expect(messages(inside)).toEqual(['menu.entries.view places View inside a submenu, but View sits at the top level of the menu, so it stays where the title bar puts it']);
    expect(bar(inside).view).toBeUndefined();
  });

  it('drops the View expectation of the review when View is hidden', () => {
    const controls = { pin: true, fullscreen: true };
    expect(menuExpectation([], 'settings', { controls }).view).toBe('View');
    expect(menuExpectation([], 'settings', { controls, viewHidden: true }).view).toBeNull();
  });
});

describe('the Pin on top and Full screen menu keys', () => {
  const rows = (input: MenuBuildInput) => tuckedRows(input.menuConfig, bar(input).tucked);

  it('leave the tucked rows to Tessera when untouched', () => {
    expect(bar(withView({ view: { hidden: true } })).tucked).toBeUndefined();
    expect(rows(withView({ view: { hidden: true } }))).toEqual({});
  });

  it('rename a row in both states, and set its text while pinned or in full screen', () => {
    const input = withView({ view: { hidden: true }, 'window-pin': { label: 'Keep on top', activeLabel: 'Stop keeping on top' }, 'window-fullscreen': { label: 'Fill the screen' } });
    expect(messages(input)).toEqual([]);
    expect(bar(input).tucked).toBeUndefined();
    expect(rows(input)).toEqual({ pin: { label: 'Keep on top', activeLabel: 'Stop keeping on top' }, fullscreen: { label: 'Fill the screen' } });
  });

  it('place a row by group, order, before and after, counted in the effective menu without the markers', () => {
    expect(bar(withView({ view: { hidden: true }, 'window-pin': { after: 'about' } })).tucked).toEqual({ pin: { group: 'menu-end', position: 1 } });
    expect(bar(withView({ view: { hidden: true }, 'window-pin': { group: 'end', order: -1 }, 'window-fullscreen': { group: 'end', order: -1 } })).tucked)
      .toEqual({ pin: { group: 'menu-end', position: 'start' }, fullscreen: { group: 'menu-end', position: 'start' } });
    expect(bar(withView({ view: { hidden: true }, 'window-fullscreen': { after: 'home' } })).tucked).toEqual({ fullscreen: { group: 'menu', position: 1 } });
    const input = withView({ view: { hidden: true }, 'window-pin': { label: 'Keep on top', group: 'main' }, about: { before: 'window-pin' } });
    expect(messages(input)).toEqual([]);
    expect(rows(input)).toEqual({ pin: { group: 'menu', position: 4, label: 'Keep on top' } });
    expect(ids(input)).toEqual([['home', 'profiles', 'section:tools', 'about', '|', 'section:advanced'], ['quit']]);
  });

  it('hide a row with hidden or inMenu false', () => {
    const input = withView({ view: { hidden: true }, 'window-pin': { hidden: true, group: 'main' }, 'window-fullscreen': { inMenu: false } });
    expect(bar(input).tucked).toBeUndefined();
    expect(rows(input)).toEqual({ pin: { hidden: true }, fullscreen: { hidden: true } });
  });

  it('keep their markers out of the search palette and buildMenu, and leave View counted without them', () => {
    const input = withView({ view: { after: 'about' }, 'window-pin': { group: 'end', order: -1 } });
    expect(bar(input).view).toEqual({ group: 'menu-end', position: 1 });
    expect(keys(searchableMenu(resolveShellMenu(input).entries))).not.toContain('window-pin');
    expect(keys(buildMenu(input))).not.toContain('window-pin');
  });

  it('report a place inside a submenu, and an activeLabel on any other key', () => {
    expect(messages(withView({ view: { hidden: true }, 'window-fullscreen': { before: 'notes' } })))
      .toEqual(['menu.entries["window-fullscreen"] places Full screen inside a submenu, but Full screen sits at the top level of the menu, so it stays where the title bar puts it']);
    expect(messages(withView({ about: { activeLabel: 'Shown' } }))).toEqual(['the menu entry "about" sets activeLabel "Shown", which only "window-pin" and "window-fullscreen" take']);
  });

  it('leave the review reading the drawn menu without the tucked rows while View is hidden', () => {
    const item = (label: string) => ({ label, hasIcon: true, isSection: false });
    const snapshot = { open: true, items: ['Credits', 'About', 'Keep on top', 'Fullscreen', 'Quit'].map(item) };
    const config = { entries: { view: { hidden: true }, 'window-pin': { label: 'Keep on top', after: 'about' } } };
    expect(withoutTuckedRows(snapshot, config).items.map((entry) => entry.label)).toEqual(['Credits', 'About', 'Quit']);
    expect(withoutTuckedRows(snapshot, { entries: { 'window-pin': { label: 'Keep on top' } } })).toBe(snapshot);
  });
});
