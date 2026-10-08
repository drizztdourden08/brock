/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CommandPalette } from '@drizztdourden08/tessera/composites';
import type { PaletteItem } from '../src/palette/PaletteHost/PaletteHost.type';
import { usePaletteShortcut } from '../src/palette/PaletteHost/behavior/usePaletteShortcut';
import { useSearchPalette } from '../src/palette/PaletteHost/behavior/useSearchPalette';
import { usePaletteStore } from '../src/palette/usePaletteStore';
import { menuEntries } from '../src/search/catalog/menu-entries';
import type { SearchEntry } from '../src/search/search.type';
import { resetLayoutEntry } from '../src/widgets/reset-layout-entry';

const catalog = vi.hoisted((): { entries: SearchEntry[] } => ({ entries: [] }));

vi.mock('../src/search/useSearchIndex', () => ({ useSearchIndex: () => catalog.entries }));
vi.mock('../src/palette/PaletteHost/behavior/usePaletteScope', () => ({ usePaletteScope: () => null }));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const NO_ACTIONS: never[] = [];

const Harness = () => {
  usePaletteShortcut();
  const model = useSearchPalette(NO_ACTIONS, NO_ACTIONS);
  return createElement(CommandPalette<PaletteItem>, {
    open: model.open, onClose: model.close, query: model.query, onQueryChange: model.setQuery, groups: model.groups, onSelect: model.runItem,
    activeIndex: model.activeIndex,
  });
};

let root: Root | null = null;

afterEach(() => {
  act(() => {
    root?.unmount();
    usePaletteStore.getState().hide();
  });
  root = null;
  document.body.innerHTML = '';
});

const open = (reset: () => void, onCancel?: () => void): void => {
  const entry = resetLayoutEntry(reset);
  catalog.entries = menuEntries([{ key: 'widgets', label: 'Widgets', children: [onCancel ? { ...entry, onCancel } : entry] }], new Set());
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => {
    root?.render(createElement(Harness));
    usePaletteStore.getState().show();
    usePaletteStore.getState().setQuery('reset');
  });
};

const press = (key: string, target: Element | null = document.querySelector('input')): void => {
  act(() => { target?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })); });
};

const button = (label: string): HTMLButtonElement | null => document.querySelector(`button[aria-label="${label}"]`);

describe('Reset layout in the search palette', () => {
  it('carries a compact ConfirmIconButton in its row, from the confirm of its menu entry', () => {
    open(vi.fn());
    expect(catalog.entries[0]).toMatchObject({ label: 'Reset layout', confirm: true });
    const action = document.querySelector('.command-palette-row__action .confirm-icon-btn');
    expect(action?.classList.contains('confirm-icon-btn--xs')).toBe(true);
    expect(button('Reset layout')).not.toBeNull();
  });

  it('asks on Enter, cancels on Escape from outside the search box with the palette and its text left, and resets on the check', () => {
    const reset = vi.fn();
    open(reset);
    press('Enter');
    expect(reset).not.toHaveBeenCalled();
    expect(button('Cancel')).not.toBeNull();
    press('Escape', document.body);
    expect(button('Cancel')).toBeNull();
    expect(usePaletteStore.getState()).toMatchObject({ open: true, query: 'reset', asking: null });
    press('Enter');
    act(() => button('Reset layout')?.click());
    expect(reset).toHaveBeenCalledTimes(1);
    expect(usePaletteStore.getState().open).toBe(false);
  });

  it('asks on a press of the button, the X cancels, then Escape clears the text and closes', () => {
    const reset = vi.fn();
    open(reset);
    act(() => button('Reset layout')?.click());
    expect(reset).not.toHaveBeenCalled();
    act(() => button('Cancel')?.click());
    expect(button('Cancel')).toBeNull();
    expect(reset).not.toHaveBeenCalled();
    press('Escape');
    expect(usePaletteStore.getState()).toMatchObject({ open: true, query: '' });
    press('Escape');
    expect(usePaletteStore.getState().open).toBe(false);
  });

  it('keeps asking from the button through onAsk and onCancel, and tells the menu entry its question closed', () => {
    const cancelled = vi.fn();
    open(vi.fn(), cancelled);
    act(() => button('Reset layout')?.click());
    expect(usePaletteStore.getState().asking).not.toBeNull();
    expect(button('Cancel')).not.toBeNull();
    act(() => button('Cancel')?.click());
    expect(usePaletteStore.getState().asking).toBeNull();
    expect(cancelled).toHaveBeenCalledTimes(1);
    expect(usePaletteStore.getState().open).toBe(true);
  });
});
