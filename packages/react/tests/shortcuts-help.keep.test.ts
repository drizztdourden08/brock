/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { ScreenDef } from '../src/screens/screen.type';
import { collectShortcuts } from '../src/shortcuts-help/collect-shortcuts';
import { shortcutKeys } from '../src/shortcuts-help/shortcut-keys';

const screen = (id: string, title: string, shortcut?: string): ScreenDef => ({ id, title, icon: null, render: () => null, shortcut });

describe('shortcutKeys', () => {
  it('turns a chord into Tessera keycaps', () => {
    expect(shortcutKeys('Mod+Comma')).toEqual(['ctrl', ',']);
    expect(shortcutKeys('Ctrl+Shift+p')).toEqual(['ctrl', 'shift', 'P']);
    expect(shortcutKeys('Alt+Enter')).toEqual(['alt', 'enter']);
    expect(shortcutKeys('Mod+/')).toEqual(['ctrl', '/']);
    expect(shortcutKeys('F5')).toEqual(['F5']);
  });
});

describe('collectShortcuts', () => {
  const sources = {
    screens: [screen('settings', 'Settings', 'Mod+Comma'), screen('about', 'About')],
    routes: [{ shortcut: 'mod+comma', target: 'settings' }, { shortcut: 'Mod+R', target: 'play/rooms' }],
    labelOf: (target: string) => (target === 'play/rooms' ? 'Rooms' : target),
    fullscreen: true,
  };

  it('lists the framework shortcuts, then each screen and page once', () => {
    const [general, own] = collectShortcuts(sources);
    expect(general?.rows.map((row) => row.shortcut)).toEqual(['Mod+K', 'Esc', 'Alt+Enter', 'Mod+/']);
    expect(own?.rows).toEqual([{ label: 'Settings', shortcut: 'Mod+Comma' }, { label: 'Rooms', shortcut: 'Mod+R' }]);
  });

  it('leaves fullscreen out when the window has no fullscreen control', () => {
    const [general] = collectShortcuts({ ...sources, fullscreen: false });
    expect(general?.rows.map((row) => row.shortcut)).not.toContain('Alt+Enter');
  });
});
