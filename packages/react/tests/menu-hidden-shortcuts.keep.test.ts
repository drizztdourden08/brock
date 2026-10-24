/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { routeCommands } from '../src/app/BrockApp/behavior/route-commands';
import { findCommand } from '../src/commands/find-command';
import { useMenuHiddenStore } from '../src/menu/useMenuHiddenStore';
import { createScreenRegistry } from '../src/screens/create-screen-registry';
import { defineScreen } from '../src/screens/define-screen';

const registry = createScreenRegistry([
  defineScreen({ id: 'library', title: 'Library', icon: 'folder', shortcut: 'Mod+L', render: () => null }),
  defineScreen({ id: 'tools', title: 'Tools', icon: 'folder', render: () => null }),
]);
const shortcuts = [{ target: 'tools/notes', shortcut: 'Mod+N' }];
const defs = routeCommands({ registry, shortcuts, allowed: () => true, labelOf: (target) => target });
const state = { sources: [{ key: 'routes', rank: 2, defs }], overrides: {}, mac: false, persist: null };
const chord = (key: string): KeyboardEvent => new KeyboardEvent('keydown', { key, ctrlKey: true });
const targetOf = (key: string): string | undefined => findCommand(chord(key), state, { route: null, typing: false, zones: [] })?.id;

afterEach(() => {
  useMenuHiddenStore.getState().setRoutes(new Set());
});

describe('shortcuts of an entry the menu config hides', () => {
  it('open while the entry is only out of the menu', () => {
    expect(targetOf('l')).toBe('open:library');
    expect(targetOf('n')).toBe('open:tools/notes');
  });

  it('do nothing once the entry is hidden', () => {
    useMenuHiddenStore.getState().setRoutes(new Set(['library', 'tools/notes']));
    expect(targetOf('l')).toBeUndefined();
    expect(targetOf('n')).toBeUndefined();
  });
});
