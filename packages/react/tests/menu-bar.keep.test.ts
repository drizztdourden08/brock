/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commands } from '../src/commands/commands';
import { useCommandStore } from '../src/commands/useCommandStore';
import { MenuBar } from '../src/menu-bar/MenuBar';
import type { MenuBarMenu } from '../src/menu-bar/menu-bar.type';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const save = vi.fn();
const ready = { current: true };

const MENUS: readonly MenuBarMenu[] = [
  { id: 'file', label: 'File', entries: ['file.new', 'file.save', 'separator', { label: 'Export', entries: ['file.png'] }] },
  { id: 'edit', label: 'Edit', entries: ['edit.undo', 'missing.command'] },
  { id: 'empty', label: 'Empty', entries: ['missing.command'] },
];

const state: { root: Root | null; removal: (() => void) | null } = { root: null, removal: null };

const mount = (menus: readonly MenuBarMenu[] = MENUS): void => {
  document.body.innerHTML = '<div id="host"></div>';
  state.root = createRoot(document.getElementById('host') as HTMLElement);
  act(() => state.root?.render(createElement(MenuBar, { menus })));
};

const buttons = (): HTMLButtonElement[] => [...document.querySelectorAll<HTMLButtonElement>('[data-menu-bar-button]')];

const items = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter((item) => !item.hasAttribute('data-menu-bar-button'));

const press = (target: Element, key: string): void => {
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  });
};

const tapAlt = (): void => {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Alt', altKey: true, bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Alt', bubbles: true, cancelable: true }));
  });
};

const open = (index: number): void => {
  act(() => buttons()[index]?.click());
};

beforeEach(() => {
  useCommandStore.setState({ sources: [], overrides: {}, mac: false });
  ready.current = true;
  save.mockClear();
  state.removal = commands.register([
    { id: 'file.new', label: 'New', chord: 'Mod+N', run: () => undefined },
    { id: 'file.save', label: 'Save', chord: 'Mod+S', when: () => ready.current, run: save },
    { id: 'file.png', label: 'PNG image', run: () => undefined },
    { id: 'edit.undo', label: 'Undo', chord: 'Mod+Z', run: () => undefined },
  ]);
});

afterEach(() => {
  act(() => state.root?.unmount());
  state.root = null;
  state.removal?.();
  document.body.replaceChildren();
});

describe('MenuBar', () => {
  it('draws one button per declared menu and leaves out a menu with no known command', () => {
    mount();
    expect(buttons().map((button) => button.textContent)).toEqual(['File', 'Edit']);
    expect(document.querySelector('[role="menubar"]')).not.toBeNull();
    expect(items()).toHaveLength(0);
  });

  it('opens a menu from its declaration with the label and the chord of each command', () => {
    mount();
    open(0);
    const labels = items().map((item) => item.textContent);
    expect(labels[0]).toContain('New');
    expect(labels[1]).toContain('Save');
    expect(labels[2]).toContain('Export');
    expect(items()[0]?.textContent).toContain('Ctrl');
    expect(items()[0]?.textContent).toContain('N');
  });

  it('shows a remapped chord at once', () => {
    mount();
    act(() => commands.remap('file.save', ['Mod+Shift+S']));
    open(0);
    expect(items()[1]?.textContent).toContain('Shift');
  });

  it('disables an entry while its command when() is false, and runs it otherwise', () => {
    mount();
    ready.current = false;
    open(0);
    const [, saveItem] = items();
    expect(saveItem?.getAttribute('aria-disabled') === 'true' || saveItem?.hasAttribute('disabled')).toBe(true);
    act(() => saveItem?.click());
    expect(save).not.toHaveBeenCalled();
  });

  it('runs the command of an entry and closes the menu', () => {
    mount();
    open(0);
    act(() => items()[1]?.click());
    expect(save).toHaveBeenCalledTimes(1);
    expect(items()).toHaveLength(0);
  });

});

describe('MenuBar keyboard', () => {
  it('opens the first menu on a tap of Alt and closes it on the next', () => {
    mount();
    tapAlt();
    expect(buttons()[0]?.getAttribute('aria-expanded')).toBe('true');
    tapAlt();
    expect(items()).toHaveLength(0);
  });

  it('does not open on Alt used with another key', () => {
    mount();
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Alt', altKey: true, bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', altKey: true, bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Alt', bubbles: true }));
    });
    expect(items()).toHaveLength(0);
  });

  it('moves between menus with the arrow keys and closes on Escape', () => {
    mount();
    open(0);
    press(items()[0] as HTMLElement, 'ArrowRight');
    expect(buttons()[1]?.getAttribute('aria-expanded')).toBe('true');
    expect(items()[0]?.textContent).toContain('Undo');
    press(items()[0] as HTMLElement, 'ArrowLeft');
    expect(buttons()[0]?.getAttribute('aria-expanded')).toBe('true');
    press(items()[0] as HTMLElement, 'Escape');
    expect(items()).toHaveLength(0);
  });

  it('moves focus along the bar with the arrow keys and opens a menu with the down arrow', () => {
    mount();
    const [file, edit] = buttons();
    act(() => file?.focus());
    press(file as HTMLElement, 'ArrowRight');
    expect(document.activeElement).toBe(edit);
    press(edit as HTMLElement, 'ArrowDown');
    expect(edit?.getAttribute('aria-expanded')).toBe('true');
  });
});
