/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import type { MenuBuildInput } from '../src/app/BrockApp/BrockApp.type';
import { useCommandGates } from '../src/commands/useCommandGates';
import { useCommandStore } from '../src/commands/useCommandStore';
import { useCommands } from '../src/commands/useCommands';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { appTitleBarSources } from '../src/title-bar/app-title-bar-sources';
import type { TitleBarItemEntry, TitleBarItemSpec } from '../src/title-bar/title-bar-item.type';
import { titleBarMenuEntry } from '../src/title-bar/title-bar-menu-entry';

const noop = (): void => undefined;

const TOOLBARS: MenuItem[] = [{ key: 'toolbars', label: 'Toolbars', icon: 'panel-top', children: [{ key: 'toolbar-main', label: 'Main', checked: true, onClick: noop }, 'separator', { key: 'toolbars-reset', label: 'Reset toolbars', onClick: noop }] }];

const shell = (extra: Partial<MenuBuildInput> = {}): MenuBuildInput => ({
  appMenu: [{ key: 'bucket:library', label: 'Library', screen: 'library' }],
  moduleMenu: [],
  widgets: [{ key: 'widget-clock', label: 'Clock', onClick: noop }],
  toolbars: TOOLBARS,
  homeScreen: 'hub',
  hasCredits: false,
  developerTools: false,
  onQuit: noop,
  onDevConsole: noop,
  onReportBug: noop,
  onShortcuts: noop,
  ...extra,
});

const keysOf = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));

const childrenOf = (entries: readonly MenuEntry[], key: string): MenuEntry[] => {
  for (const entry of entries) {
    if (entry !== 'separator' && entry.key === key) return entry.children ?? [];
  }
  return [];
};

describe('the Toolbars menu', () => {
  it('sits at level 1 next to Widgets, with the same key and contents it had under Widgets', () => {
    const menu = buildMenu(shell());
    const top = keysOf(menu);
    expect(top.indexOf('toolbars')).toBe(top.indexOf('section:widgets') + 1);
    expect(keysOf(childrenOf(menu, 'section:widgets'))).toEqual(['widget-clock']);
    expect(keysOf(childrenOf(menu, 'toolbars'))).toEqual(['toolbar-main', '|', 'toolbars-reset']);
  });

  it('is absent when no toolbar is declared', () => {
    expect(keysOf(buildMenu(shell({ toolbars: [] })))).not.toContain('toolbars');
  });

  it('can still be moved by the menu config under its old key', () => {
    const menu = buildMenu(shell({ menuConfig: { entries: { toolbars: { parent: 'section:widgets' } } } }));
    expect(keysOf(childrenOf(menu, 'section:widgets'))).toEqual(['widget-clock', 'toolbars']);
  });
});

describe('the Home entry', () => {
  it('is the first entry by default', () => {
    expect(keysOf(buildMenu(shell()))[0]).toBe('home');
  });

  it('is left out with menu.home false, and the screen it opened is no longer treated as covered', () => {
    const hidden = buildMenu(shell({ menuConfig: { home: false } }));
    expect(keysOf(hidden)).not.toContain('home');
    const settingsHome = buildMenu(shell({ homeScreen: 'settings' }));
    expect(keysOf(settingsHome)).not.toContain('settings');
    const settingsShown = buildMenu(shell({ homeScreen: 'settings', menuConfig: { home: false } }));
    expect(keysOf(settingsShown)).toContain('settings');
  });

  it('stays with menu.home true', () => {
    expect(keysOf(buildMenu(shell({ menuConfig: { home: true } })))).toContain('home');
  });
});

describe('the Profiles entry', () => {
  it('is in the menu by default', () => {
    expect(keysOf(buildMenu(shell()))).toContain('profiles');
    expect(keysOf(buildMenu(shell({ menuConfig: { profiles: true } })))).toContain('profiles');
  });

  it('is left out with menu.profiles false, and Home and Settings stay', () => {
    const hidden = keysOf(buildMenu(shell({ menuConfig: { profiles: false } })));
    expect(hidden).not.toContain('profiles');
    expect(hidden).toContain('home');
    expect(hidden).toContain('settings');
  });

  it('is left out together with Home when both are off', () => {
    const hidden = keysOf(buildMenu(shell({ menuConfig: { home: false, profiles: false } })));
    expect(hidden).not.toContain('profiles');
    expect(hidden).not.toContain('home');
  });
});

const flag = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };

const ITEMS: TitleBarItemEntry[] = [
  { id: 'host', source: { kind: 'button', label: 'Host', icon: 'server', onSelect: noop, shortcut: 'Mod+H' } },
  { id: 'undo', source: { kind: 'button', label: 'Undo', icon: 'send', onSelect: noop, disabled: true, disabledReason: 'Nothing to undo' } },
  { id: 'room', source: { kind: 'status', label: 'Room', icon: 'radio', status: 'Live', onSelect: noop } },
  { id: 'rooms', source: { kind: 'menu', label: 'Rooms', icon: 'server', items: [{ key: 'new', label: 'New room' }] } },
  { id: 'later', source: () => null },
  { id: 'volume', source: { kind: 'volume', label: 'Volume', value: 1, muted: false, onChange: noop, onMuteToggle: noop } },
];

const specOf = (id: string): TitleBarItemSpec => {
  const source = ITEMS.find((entry) => entry.id === id)?.source;
  if (source === undefined || typeof source === 'function') throw new Error(`${id} is a plain item`);
  return source;
};

const STATE = { enabled: () => true, chords: () => undefined };

describe('title bar items as menu items', () => {
  it('turns a button into an item that keeps its shortcut, and a disabled one into a disabled item with its reason', () => {
    expect(titleBarMenuEntry('host', specOf('host'), STATE)).toMatchObject({ key: 'host', label: 'Host', shortcut: 'Mod+H', disabled: false });
    expect(titleBarMenuEntry('undo', specOf('undo'), STATE)).toMatchObject({ key: 'undo', disabled: true, description: 'Nothing to undo' });
  });

  it('runs the action of an item, or its command', () => {
    const onSelect = vi.fn();
    const entry = titleBarMenuEntry('go', { kind: 'button', label: 'Go', icon: 'send', onSelect }, STATE);
    if (entry === null || entry === 'separator') throw new Error('a button makes an item');
    entry.onClick?.();
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('disables an item whose command is not enabled and shows the chord of the command', () => {
    const entry = titleBarMenuEntry('go', { kind: 'button', label: 'Go', icon: 'send', command: 'doc.go' }, { enabled: () => false, chords: () => ['Ctrl+G'] });
    expect(entry).toMatchObject({ disabled: true, shortcut: 'Ctrl+G' });
  });

  it('puts a status in as a labelled item and a menu in as a submenu', () => {
    expect(titleBarMenuEntry('room', specOf('room'), STATE)).toMatchObject({ key: 'room', label: 'Room: Live' });
    expect(titleBarMenuEntry('rooms', specOf('rooms'), STATE)).toMatchObject({ key: 'rooms', children: [{ key: 'new' }] });
  });
});

describe('title bar actions as one menu', () => {
  const drawn = (entries: readonly TitleBarItemEntry[], extra: () => void = noop): WindowTitleBarAction[] => {
    flag.IS_REACT_ACT_ENVIRONMENT = true;
    useCommandStore.setState({ sources: [], overrides: {}, mac: false, persist: null });
    useCommandGates.setState({ gates: {} });
    const seen: WindowTitleBarAction[] = [];
    const sources = appTitleBarSources(entries, [], { label: 'App', icon: 'menu' });
    const Probe = () => {
      extra();
      for (const source of sources) {
        const action = typeof source === 'function' ? source() : source;
        if (action !== null) seen.push(action);
      }
      return null;
    };
    const root = createRoot(document.createElement('div'));
    act(() => root.render(createElement(Probe)));
    act(() => root.unmount());
    return seen;
  };

  it('draws the items as one dropdown, with the volume slider kept as its own bar item', () => {
    const actions = drawn(ITEMS);
    expect(actions.map((action) => action.id)).toEqual(['volume', 'app-actions']);
    const menu = actions[1];
    if (menu?.bar !== 'dropdown') throw new Error('the actions are one dropdown');
    expect(menu).toMatchObject({ label: 'App', icon: 'menu' });
    expect(menu.groups[0]?.items.map((node) => ('id' in node ? node.id : 'separator'))).toEqual(['host', 'undo', 'room', 'rooms']);
    expect(menu.groups[0]?.items[1]).toMatchObject({ disabled: true, description: 'Nothing to undo' });
  });

  it('draws no menu when no item has anything to show', () => {
    expect(drawn([{ id: 'later', source: () => null }]).map((action) => action.id)).toEqual([]);
  });

  it('follows the enabled state of a command while the app runs', () => {
    const actions = drawn([{ id: 'undo', source: { kind: 'button', label: 'Undo', icon: 'send', command: 'doc.undo' } }], () => {
      useCommands([{ id: 'doc.undo', label: 'Undo', when: () => false, run: noop }]);
    });
    const menu = actions.at(-1);
    if (menu?.bar !== 'dropdown') throw new Error('the actions are one dropdown');
    expect(menu.groups[0]?.items[0]).toMatchObject({ id: 'undo', disabled: true });
  });

  it('keeps separate bar items without the option, as before', () => {
    const sources = appTitleBarSources(ITEMS.filter((entry) => typeof entry.source !== 'function'), []);
    expect(sources).toHaveLength(5);
  });
});
