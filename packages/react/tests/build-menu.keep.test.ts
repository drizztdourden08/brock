/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import type { MenuBuildInput } from '../src/app/BrockApp/BrockApp.type';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';

const noop = (): void => undefined;

const BASE: MenuBuildInput = {
  appMenu: [],
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

const keys = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));
const item = (entries: readonly MenuEntry[], key: string): MenuItem | undefined =>
  entries.find((entry): entry is MenuItem => entry !== 'separator' && entry.key === key);

describe('buildMenu', () => {
  it('orders the built-ins like the reference shell', () => {
    expect(keys(buildMenu(BASE))).toEqual(['home', 'profiles', '|', 'section:advanced', '|', 'about', 'quit']);
  });

  it('opens the home screen from Home and keeps Settings when home is elsewhere', () => {
    const menu = buildMenu({ ...BASE, homeScreen: 'hub' });
    expect(item(menu, 'home')?.screen).toBe('hub');
    expect(keys(menu)).toEqual(['home', 'profiles', 'settings', '|', 'section:advanced', '|', 'about', 'quit']);
  });

  it('puts app entries after the top built-ins and module entries before Credits', () => {
    const menu = buildMenu({
      ...BASE,
      hasCredits: true,
      appMenu: [{ key: 'rooms', label: 'Rooms', screen: 'rooms' }],
      moduleMenu: [{ key: 'updates', label: 'Check for updates', onClick: noop }],
    });
    expect(keys(menu)).toEqual(['home', 'profiles', 'rooms', '|', 'section:advanced', '|', 'updates', 'credits', 'about', 'quit']);
  });

  it('groups sectioned entries into named submenus, known sections first', () => {
    const menu = buildMenu({
      ...BASE,
      appMenu: [{ key: 'data-a', label: 'A', section: 'data', onClick: noop }, { key: 'dock', label: 'Dock', section: 'widgets', onClick: noop }],
      moduleMenu: [{ key: 'pads', label: 'Controllers', section: 'advanced', screen: 'pads' }],
    });
    expect(keys(menu)).toEqual(['home', 'profiles', '|', 'section:widgets', 'section:advanced', 'section:data', '|', 'about', 'quit']);
    expect(keys(item(menu, 'section:advanced')?.children ?? [])).toEqual(['pads', 'keyboard-shortcuts', 'report-bug']);
    expect(item(menu, 'section:data')?.label).toBe('Data');
  });

  it('shows the Dev Console and dev-only entries only with developer tools', () => {
    const devEntry: MenuItem = { key: 'probe', label: 'Probe', devOnly: true, onClick: noop };
    expect(item(buildMenu({ ...BASE, appMenu: [devEntry] }), 'probe')).toBeUndefined();
    expect(keys(item(buildMenu(BASE), 'section:advanced')?.children ?? [])).toEqual(['keyboard-shortcuts', 'report-bug']);
    const dev = buildMenu({ ...BASE, appMenu: [devEntry], developerTools: true });
    expect(item(dev, 'probe')).toBeDefined();
    expect(keys(item(dev, 'section:advanced')?.children ?? [])).toEqual(['keyboard-shortcuts', 'report-bug', 'dev-console']);
  });

  it('skips a built-in whose screen the app already names', () => {
    const menu = buildMenu({ ...BASE, appMenu: [{ key: 'my-about', label: 'About us', screen: 'about' }] });
    expect(keys(menu)).toEqual(['home', 'profiles', 'my-about', '|', 'section:advanced', '|', 'quit']);
  });

  it('files widget entries under Widgets, first among the sections', () => {
    const menu = buildMenu({ ...BASE, widgets: [{ key: 'widget-logs', label: 'Logs', checked: true, onClick: noop }] });
    expect(keys(menu)).toEqual(['home', 'profiles', '|', 'section:widgets', 'section:advanced', '|', 'about', 'quit']);
    expect(keys(item(menu, 'section:widgets')?.children ?? [])).toEqual(['widget-logs']);
  });

  it('gives every built-in entry an icon', () => {
    const menu = buildMenu({ ...BASE, homeScreen: 'hub', hasCredits: true, developerTools: true });
    const items = menu.flatMap((entry) => (entry === 'separator' ? [] : [entry, ...(entry.children ?? [])]));
    expect(items.filter((entry) => entry !== 'separator' && !entry.icon)).toEqual([]);
  });
});
