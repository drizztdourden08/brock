/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import { resolveShellMenu } from '../src/app/BrockApp/behavior/resolve-shell-menu';
import type { MenuBuildInput } from '../src/app/BrockApp/BrockApp.type';
import type { MenuConfig } from '../src/menu/menu-config.type';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { hiddenMenuRoutes } from '../src/menu/hidden-menu-routes';
import { searchableMenu } from '../src/menu/searchable-menu';
import { visibleMenu } from '../src/menu/visible-menu';

const noop = (): void => undefined;

const BASE: MenuBuildInput = {
  appMenu: [
    { key: 'bucket:library', label: 'Library', screen: 'library' },
    { key: 'bucket:tools', label: 'Tools', children: [{ key: 'bucket:tools:notes', label: 'Notes', bucket: 'tools', page: 'notes' }, { key: 'bucket:tools:clock', label: 'Clock', bucket: 'tools', page: 'clock' }] },
  ],
  moduleMenu: [{ key: 'check-updates', label: 'Check for updates', onClick: noop }],
  widgets: [],
  homeScreen: 'hub',
  hasCredits: true,
  developerTools: false,
  onQuit: noop,
  onDevConsole: noop,
  onReportBug: noop,
  onShortcuts: noop,
};

const withConfig = (entries: NonNullable<MenuConfig['entries']>): MenuBuildInput => ({ ...BASE, menuConfig: { entries } });
const keys = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));
const item = (entries: readonly MenuEntry[], key: string): MenuItem | undefined => {
  for (const entry of entries) {
    if (entry === 'separator') continue;
    if (entry.key === key) return entry;
    const inside = entry.children ? item(entry.children, key) : undefined;
    if (inside) return inside;
  }
  return undefined;
};
const messages = (input: MenuBuildInput): string[] => resolveShellMenu(input).issues.map((issue) => issue.message);

const DEFAULT_KEYS = ['home', 'profiles', 'settings', 'bucket:library', 'bucket:tools', '|', 'section:advanced', '|', 'check-updates', 'credits', 'about', 'quit'];

describe('menu config', () => {
  it('keeps the detected menu when nothing is configured, Credits, About and Quit last', () => {
    expect(keys(buildMenu(BASE))).toEqual(DEFAULT_KEYS);
    expect(resolveShellMenu(BASE).issues).toEqual([]);
    expect(item(buildMenu(BASE), 'about')?.group).toBe('end');
  });

  it('renames an entry by its key', () => {
    expect(item(buildMenu(withConfig({ settings: { label: 'Preferences' } })), 'settings')?.label).toBe('Preferences');
  });

  it('takes an entry out of the menu with inMenu false and keeps it for search, routes and shortcuts', () => {
    const resolved = resolveShellMenu(withConfig({ 'bucket:library': { inMenu: false } }));
    expect(keys(visibleMenu(resolved.entries))).not.toContain('bucket:library');
    expect(keys(searchableMenu(resolved.entries))).toContain('bucket:library');
    expect(hiddenMenuRoutes(resolved.entries).size).toBe(0);
  });

  it('hides an entry from the menu, the search and the shortcuts with hidden', () => {
    const resolved = resolveShellMenu(withConfig({ 'bucket:library': { hidden: true }, 'bucket:tools': { hidden: true } }));
    expect(keys(visibleMenu(resolved.entries))).not.toContain('bucket:library');
    expect(keys(searchableMenu(resolved.entries))).not.toContain('bucket:library');
    expect([...hiddenMenuRoutes(resolved.entries)]).toEqual(['library', 'tools/notes', 'tools/clock']);
  });

  it('moves an entry before or after another, across groups', () => {
    expect(keys(buildMenu(withConfig({ 'check-updates': { before: 'about' } })))).toEqual(
      ['home', 'profiles', 'settings', 'bucket:library', 'bucket:tools', '|', 'section:advanced', '|', 'credits', 'check-updates', 'about', 'quit'],
    );
    expect(item(buildMenu(withConfig({ 'check-updates': { before: 'about' } })), 'check-updates')?.group).toBe('end');
    expect(keys(buildMenu(withConfig({ settings: { after: 'bucket:tools' } }))).slice(0, 5)).toEqual(['home', 'profiles', 'bucket:library', 'bucket:tools', 'settings']);
  });

  it('orders a list like CSS order: 0 by default, ties keep the detected order', () => {
    expect(keys(buildMenu(withConfig({ 'bucket:tools': { order: -1 } }))).slice(0, 3)).toEqual(['bucket:tools', 'home', 'profiles']);
    expect(keys(buildMenu(withConfig({ home: { order: 1 } }))).slice(0, 5)).toEqual(['profiles', 'settings', 'bucket:library', 'bucket:tools', 'home']);
  });

  it('moves a top-level entry to another group', () => {
    const menu = buildMenu(withConfig({ profiles: { group: 'modules' } }));
    expect(keys(menu)).toEqual(['home', 'settings', 'bucket:library', 'bucket:tools', '|', 'section:advanced', '|', 'check-updates', 'profiles', 'credits', 'about', 'quit']);
  });

  it('re-parents an entry into a submenu and lifts one out', () => {
    const into = buildMenu(withConfig({ 'bucket:library': { parent: 'bucket:tools' } }));
    expect(keys(item(into, 'bucket:tools')?.children ?? [])).toEqual(['bucket:tools:notes', 'bucket:tools:clock', 'bucket:library']);
    const out = buildMenu(withConfig({ 'bucket:tools:clock': { parent: null } }));
    expect(keys(out).slice(0, 6)).toEqual(['home', 'profiles', 'settings', 'bucket:library', 'bucket:tools', 'bucket:tools:clock']);
    expect(keys(buildMenu(withConfig({ 'report-bug': { parent: null, group: 'end', before: 'quit' } }))).slice(-3)).toEqual(['about', 'report-bug', 'quit']);
  });

  it('drops a submenu every entry left', () => {
    const menu = buildMenu(withConfig({ 'bucket:tools:notes': { parent: null }, 'bucket:tools:clock': { hidden: true } }));
    expect(item(menu, 'bucket:tools')).toBeUndefined();
    expect(item(menu, 'bucket:tools:notes')).toBeDefined();
  });

});

describe('menu config sources, issues and profile locks', () => {
  it('takes the overrides of the entry itself, which the app config overrides field by field', () => {
    const input: MenuBuildInput = { ...BASE, appMenu: [{ key: 'bucket:library', label: 'Library', screen: 'library', inMenu: false, order: -1 }], menuConfig: { entries: { 'bucket:library': { inMenu: true } } } };
    const menu = buildMenu(input);
    expect(keys(menu)[0]).toBe('bucket:library');
    expect(item(menu, 'bucket:library')?.inMenu).toBe(true);
  });

  it('reports bad references and never throws', () => {
    expect(messages(withConfig({ libary: { hidden: true } }))).toEqual(['menu.entries names "libary", but no menu entry has that key']);
    expect(messages(withConfig({ library: { hidden: true } }))[0]).toContain('did you mean "bucket:library"');
    expect(messages(withConfig({ settings: { before: 'about', after: 'quit' } }))).toEqual(['the menu entry "settings" sets both before and after; before is used']);
    expect(messages(withConfig({ settings: { parent: 'about' } }))).toEqual(['the menu entry "settings" names the parent "about", which is not a submenu']);
    expect(messages(withConfig({ settings: { label: 3, colour: 'red' } as never }))).toEqual([
      'the menu entry "settings" label must be a non-empty text',
      'the menu entry "settings" has an unknown field "colour"',
    ]);
    expect(messages(withConfig({ 'bucket:tools': { parent: 'bucket:tools:notes' } }))[0]).toContain('is not a submenu');
  });

  it('reports a before and after loop and leaves its entries in place', () => {
    const input = withConfig({ settings: { before: 'profiles' }, profiles: { before: 'settings' } });
    expect(messages(input)).toEqual(['the menu entries profiles > settings > profiles name each other in before and after, so none of them moves']);
    expect(keys(buildMenu(input))).toEqual(DEFAULT_KEYS);
  });

  it('does not report a key that a show rule or developer tools hide right now', () => {
    expect(messages(withConfig({ 'dev-console': { label: 'Console' } }))).toEqual([]);
  });

  it('disables the entries that need a profile while none is active, with the reason', () => {
    const locked = (route: string): boolean => route !== 'profiles' && route !== 'about' && route !== 'credits';
    const menu = buildMenu({ ...BASE, locked });
    expect(item(menu, 'bucket:library')).toMatchObject({ disabled: true, description: 'Pick or create a profile first' });
    expect(item(menu, 'bucket:tools:notes')).toMatchObject({ disabled: true });
    expect(item(menu, 'profiles')?.disabled).toBeUndefined();
    expect(item(menu, 'check-updates')?.disabled).toBeUndefined();
  });
});
