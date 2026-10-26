/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commands } from '../src/commands/commands';
import { useCommandStore } from '../src/commands/useCommandStore';
import type { ContextMenuContext, ContextMenuEntry } from '../src/context-menu/context-menu.type';
import { resolveEntries } from '../src/context-menu/resolve-entries';
import { entries, mountMenus, unmountMenus } from './context-menu-harness';

const context: ContextMenuContext = { point: { x: 1, y: 2 }, target: null, trigger: 'pointer', data: 'd' };
const view = () => ({ defs: new Map(commands.list().map((def) => [def.id, def])), state: useCommandStore.getState(), context });

beforeEach(mountMenus);
afterEach(unmountMenus);

describe('resolving entries from commands', () => {
  it('takes the label, shortcut, enabled and checked state from the command', () => {
    const [copy, , grid, arrange, off] = resolveEntries(entries, view());
    expect(copy).toMatchObject({ label: 'Copy pixels', shortcut: ['ctrl', 'C'], disabled: false });
    expect(grid).toMatchObject({ label: 'Show grid', kind: 'check', checked: true });
    expect(arrange).toMatchObject({ label: 'Arrange', children: [{ label: 'Bring to front' }] });
    expect(off).toMatchObject({ label: 'Paste pixels', disabled: true });
  });

  it('draws a separator and skips a command that is not registered', () => {
    expect(resolveEntries(entries, view())[1]).toEqual({ separator: true });
    expect(resolveEntries(['missing.command'], view())).toEqual([]);
  });

  it('shows the rebound chord', () => {
    commands.remap('canvas.copy', ['Mod+Shift+K']);
    expect(resolveEntries(entries, view())[0]).toMatchObject({ shortcut: ['ctrl', 'shift', 'K'] });
  });

  it('lets an entry override the label, the checked state, the kind and the reason, and hide itself', () => {
    const nodes = resolveEntries([
      { command: 'canvas.copy', label: 'Copy sprite 4', checked: () => false, kind: 'radio', reason: 'Nothing selected' },
      { command: 'canvas.grid', hidden: () => true },
      { command: 'canvas.front', kind: 'confirm', confirm: 'Sure?' },
    ], view());
    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toMatchObject({ label: 'Copy sprite 4', kind: 'radio', checked: false, description: 'Nothing selected' });
    expect(nodes[1]).toMatchObject({ kind: 'confirm', confirm: 'Sure?' });
  });

  it('allows a plain entry with no command that gets the context', () => {
    const seenContexts: ContextMenuContext[] = [];
    const [node] = resolveEntries([{ label: 'Open folder', run: (each) => { seenContexts.push(each); } }], view());
    expect(node).toMatchObject({ label: 'Open folder' });
    if (node !== undefined && 'onSelect' in node) node.onSelect?.();
    expect(seenContexts).toEqual([context]);
  });

  it('keeps two levels of sub-menus and drops a third', () => {
    const deep: ContextMenuEntry[] = [{ label: 'A', items: [{ label: 'B', items: [{ label: 'C', items: ['canvas.copy'] }, 'canvas.front'] }] }];
    const [a] = resolveEntries(deep, view());
    expect(a).toMatchObject({ label: 'A', children: [{ label: 'B', children: [{ label: 'Bring to front' }] }] });
  });
});
