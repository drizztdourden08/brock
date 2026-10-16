/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { shortcutTarget } from '../src/app/BrockApp/behavior/shortcut-target';
import { useMenuHiddenStore } from '../src/menu/useMenuHiddenStore';
import { createScreenRegistry } from '../src/screens/create-screen-registry';
import { defineScreen } from '../src/screens/define-screen';

const registry = createScreenRegistry([
  defineScreen({ id: 'library', title: 'Library', shortcut: 'Mod+L', render: () => null }),
  defineScreen({ id: 'tools', title: 'Tools', render: () => null }),
]);
const routes = [{ target: 'tools/notes', shortcut: 'Mod+N' }];
const allowed = (): boolean => true;
const chord = (key: string): KeyboardEvent => new KeyboardEvent('keydown', { key, ctrlKey: true });

afterEach(() => {
  useMenuHiddenStore.getState().setRoutes(new Set());
});

describe('shortcuts of an entry the menu config hides', () => {
  it('open while the entry is only out of the menu', () => {
    expect(shortcutTarget(chord('l'), registry, routes, allowed)).toBe('library');
    expect(shortcutTarget(chord('n'), registry, routes, allowed)).toBe('tools/notes');
  });

  it('do nothing once the entry is hidden', () => {
    useMenuHiddenStore.getState().setRoutes(new Set(['library', 'tools/notes']));
    expect(shortcutTarget(chord('l'), registry, routes, allowed)).toBeUndefined();
    expect(shortcutTarget(chord('n'), registry, routes, allowed)).toBeUndefined();
  });
});
