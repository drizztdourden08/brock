/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import type { MenuBuildInput } from '../src/app/BrockApp/BrockApp.type';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { useMenuHooks } from '../src/menu/useMenuHooks';

const noop = (): void => undefined;

const BASE: MenuBuildInput = {
  appMenu: [], moduleMenu: [], widgets: [], homeScreen: 'settings', hasCredits: false, developerTools: false,
  onQuit: noop, onDevConsole: noop, onReportBug: noop, onShortcuts: noop,
};

const keys = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));
const item = (entries: readonly MenuEntry[], key: string): MenuItem | undefined =>
  entries.find((entry): entry is MenuItem => entry !== 'separator' && entry.key === key);

describe('an app submenu named like a Brock section', () => {
  it('joins the section instead of making a second Advanced', () => {
    const appAdvanced: MenuItem = {
      key: 'menu:/advanced', label: 'Advanced', icon: 'folder',
      children: [{ key: 'screen:hud-layout', label: 'HUD layout', screen: 'hud-layout' }, 'separator', { key: 'screen:calibration', label: 'Calibration', screen: 'calibration' }],
    };
    const menu = buildMenu({ ...BASE, appMenu: [appAdvanced], moduleMenu: [{ key: 'pads', label: 'Controllers', section: 'advanced', screen: 'pads' }] });
    expect(keys(menu)).toEqual(['home', 'profiles', '|', 'section:advanced', '|', 'about', 'quit']);
    expect(keys(item(menu, 'section:advanced')?.children ?? [])).toEqual(['screen:hud-layout', 'screen:calibration', 'pads', 'keyboard-shortcuts', 'report-bug']);
  });

  it('matches the section label in any case, and leaves a submenu with another name alone', () => {
    const menu = buildMenu({
      ...BASE,
      appMenu: [
        { key: 'menu:/advanced', label: 'ADVANCED', children: [{ key: 'tools', label: 'Tools', onClick: noop }] },
        { key: 'menu:/hosting', label: 'Hosting', children: [{ key: 'host', label: 'Host a game', onClick: noop }] },
      ],
    });
    expect(keys(menu)).toEqual(['home', 'profiles', 'menu:/hosting', '|', 'section:advanced', '|', 'about', 'quit']);
    expect(keys(item(menu, 'section:advanced')?.children ?? [])[0]).toBe('tools');
  });

  it('joins a section a module or the app files entries under, such as Help', () => {
    const menu = buildMenu({
      ...BASE,
      appMenu: [{ key: 'menu:/help', label: 'Help', children: [{ key: 'manual', label: 'Manual', onClick: noop }] }],
      moduleMenu: [{ key: 'docs', label: 'Docs', section: 'help', onClick: noop }],
    });
    expect(keys(item(menu, 'section:help')?.children ?? [])).toEqual(['manual', 'docs']);
    expect(item(menu, 'menu:/help')).toBeUndefined();
  });
});

const resolved = (entries: readonly MenuEntry[]): MenuEntry[] => {
  const found: { menu: MenuEntry[] } = { menu: [] };
  const Probe = () => {
    found.menu = useMenuHooks(entries);
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  return found.menu;
};

describe('a menu entry with a disabled hook', () => {
  it('is disabled while the hook says so, and a static disabled still wins', () => {
    const state = { running: false };
    const useNotRunning = (): boolean => !state.running;
    const entries: MenuEntry[] = [
      { key: 'save', label: 'Save state', useDisabled: useNotRunning, onClick: noop },
      { key: 'tools', label: 'Tools', children: [{ key: 'reset', label: 'Reset', useDisabled: useNotRunning, onClick: noop }, { key: 'off', label: 'Off', disabled: true, useDisabled: () => false }] },
    ];
    const disabledIn = (menu: readonly MenuEntry[]): Record<string, boolean | undefined> => {
      const tools = item(menu, 'tools')?.children ?? [];
      return { save: item(menu, 'save')?.disabled, reset: item(tools, 'reset')?.disabled, off: item(tools, 'off')?.disabled };
    };
    expect(disabledIn(resolved(entries))).toEqual({ save: true, reset: true, off: true });
    state.running = true;
    expect(disabledIn(resolved(entries))).toEqual({ save: false, reset: false, off: true });
  });
});
