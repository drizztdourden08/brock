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

const open = (reset: () => void): void => {
  catalog.entries = menuEntries([{ key: 'widgets', label: 'Widgets', children: [resetLayoutEntry(reset)] }], new Set());
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => {
    root?.render(createElement(Harness));
    usePaletteStore.getState().show();
    usePaletteStore.getState().setQuery('reset');
  });
};

const press = (key: string): void => {
  const input = document.querySelector('input');
  act(() => { input?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })); });
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

  it('asks on Enter, cancels on Escape with the palette left open, and resets on the check', () => {
    const reset = vi.fn();
    open(reset);
    press('Enter');
    expect(reset).not.toHaveBeenCalled();
    expect(button('Cancel')).not.toBeNull();
    press('Escape');
    expect(button('Cancel')).toBeNull();
    expect(usePaletteStore.getState().open).toBe(true);
    press('Enter');
    act(() => button('Reset layout')?.click());
    expect(reset).toHaveBeenCalledTimes(1);
    expect(usePaletteStore.getState().open).toBe(false);
  });

  it('asks on a press of the button, and the X cancels', () => {
    const reset = vi.fn();
    open(reset);
    act(() => button('Reset layout')?.click());
    expect(reset).not.toHaveBeenCalled();
    act(() => button('Cancel')?.click());
    expect(button('Cancel')).toBeNull();
    expect(reset).not.toHaveBeenCalled();
    press('Escape');
    expect(usePaletteStore.getState().open).toBe(false);
  });
});
