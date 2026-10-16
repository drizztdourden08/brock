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
import { titleBarGroups } from '../src/shell/TitleBar/behavior/title-bar-groups';

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

const PIN = { key: 'window-pin', label: 'Pin window on top', onClick: noop };
const FULL = { key: 'window-fullscreen', label: 'Full screen', onClick: noop };

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

describe('the Pin on top and Full screen menu entries', () => {
  it('sit where View sat, above the last group, when the shell passes them', () => {
    expect(ids({ ...BASE, windowEntries: [PIN, FULL] })).toEqual([['home', 'profiles', 'section:tools', '|', 'section:advanced', '|', 'window-pin', 'window-fullscreen'], ['about', 'quit']]);
  });

  it('take the menu config by their keys, which are known even while the entries are not shown', () => {
    const input = withView({ 'window-pin': { label: 'Keep on top', group: 'end', order: -1 }, 'window-fullscreen': { hidden: true } }, { windowEntries: [PIN, FULL] });
    expect(ids(input)[1]).toEqual(['window-pin', 'about', 'quit']);
    expect(visibleMenu(resolveShellMenu(input).entries).find((entry) => entry !== 'separator' && entry.key === 'window-pin')).toMatchObject({ label: 'Keep on top' });
    expect(messages(input)).toEqual([]);
    expect(messages(withView({ 'window-pin': { label: 'Keep on top' } }))).toEqual([]);
  });
});
