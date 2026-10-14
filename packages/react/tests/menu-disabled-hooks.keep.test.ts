/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { useMenuHooks } from '../src/menu/useMenuHooks';

const noop = (): void => undefined;

const entryOf = (entries: readonly MenuEntry[], key: string): MenuItem | undefined =>
  entries.find((entry): entry is MenuItem => entry !== 'separator' && entry.key === key);

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
      const tools = entryOf(menu, 'tools')?.children ?? [];
      return { save: entryOf(menu, 'save')?.disabled, reset: entryOf(tools, 'reset')?.disabled, off: entryOf(tools, 'off')?.disabled };
    };
    expect(disabledIn(resolved(entries))).toEqual({ save: true, reset: true, off: true });
    state.running = true;
    expect(disabledIn(resolved(entries))).toEqual({ save: false, reset: false, off: true });
  });
});
