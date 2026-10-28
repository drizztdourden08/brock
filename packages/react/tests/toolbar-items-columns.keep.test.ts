/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createToolbarLayout } from '@drizztdourden08/tessera/composites';
import { commands } from '../src/commands/commands';
import type { ContextMenuCommand, ContextMenuEntry, ContextMenuSubmenu } from '../src/context-menu/context-menu.type';
import { createAppLog } from '../src/log/create-app-log';
import { defineToolbar } from '../src/toolbars/define-toolbar';
import { hostClaim } from '../src/toolbars/host-claim';
import { toolbarCommands } from '../src/toolbars/toolbar-commands';
import { toolbarContextEntries } from '../src/toolbars/toolbar-context-entries';
import { toolbars } from '../src/toolbars/toolbars';
import { ToolbarHost } from '../src/toolbars/ToolbarHost';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';
import { registerFresh } from './command-fixtures';
import { mode, setMode } from './rule-mode-fixture';
import { showHarness } from './show-harness';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const ITEMS = [{ id: 'pencil', label: 'Pencil' }, { id: 'eraser', label: 'Eraser' }, { id: 'fill', label: 'Fill' }];
const TOOLS = defineToolbar({ id: 'tools', label: 'Tools', defaultSide: 'left', items: ITEMS, render: () => null });
const TOP = defineToolbar({ id: 'top', label: 'Top', defaultSide: 'top', render: () => null });
const store = () => useToolbarLayoutStore.getState();
const context = { point: { x: 0, y: 0 }, target: null, trigger: 'pointer', data: 'tools' } as const;
const run = (id: string, args?: unknown): void => { void commands.run(id, { ...context, args }); };

let unregister = (): void => undefined;

beforeEach(() => {
  unregister = registerFresh([...toolbarCommands]);
  store().setDefinitions([]);
  store().setLayout(createToolbarLayout([]));
  store().setDefinitions([TOOLS, TOP]);
});

afterEach(() => {
  unregister();
});

describe('toolbar item visibility and columns in the layout', () => {
  it('saves hidden item ids and the column count per toolbar, and reads them back through the slot fields', () => {
    toolbars.items('tools', ['eraser']);
    toolbars.columns('tools', 2);
    expect(store().layout.items).toEqual({ tools: ['eraser'] });
    expect(store().layout.columns).toEqual({ tools: 2 });
    expect(toolbars.list().find((each) => each.id === 'tools')).toMatchObject({ hiddenItems: ['eraser'], columns: 2 });
    expect(toolbars.list().find((each) => each.id === 'top')).toMatchObject({ hiddenItems: [], columns: null });
  });

  it('clears the entries when the lists are emptied', () => {
    toolbars.items('tools', ['fill']);
    toolbars.columns('tools', 'auto');
    toolbars.items('tools', []);
    toolbars.columns('tools', null);
    expect(store().layout.items).toBeUndefined();
    expect(store().layout.columns).toBeUndefined();
  });

  it('rejects an unknown toolbar, an unknown item and a bad column count', () => {
    expect(() => toolbars.items('nope', [])).toThrow('Unknown toolbar "nope"');
    expect(() => toolbars.items('tools', ['pencil', 'ghost'])).toThrow('Unknown item "ghost" in toolbar "tools". Known items: pencil, eraser, fill.');
    expect(() => toolbars.columns('tools', 3 as never)).toThrow('columns must be');
    expect(store().layout.items).toBeUndefined();
  });

  it('keeps them through a save and a load of the layout', () => {
    toolbars.items('tools', ['pencil']);
    toolbars.columns('tools', 'auto');
    const saved: unknown = JSON.parse(JSON.stringify(store().layout));
    store().replace(saved);
    expect(store().layout.items).toEqual({ tools: ['pencil'] });
    expect(store().layout.columns).toEqual({ tools: 'auto' });
  });

  it('drops them on Reset toolbars', () => {
    toolbars.items('tools', ['pencil']);
    toolbars.reset();
    expect(store().layout.items).toBeUndefined();
  });
});

describe('the item and columns commands', () => {
  it('toggles an item in the hidden list', () => {
    run('toolbar.item', { id: 'tools', item: 'pencil' });
    expect(store().layout.items).toEqual({ tools: ['pencil'] });
    run('toolbar.item', { id: 'tools', item: 'pencil' });
    expect(store().layout.items).toBeUndefined();
  });

  it('sets the columns and ignores arguments it cannot read', () => {
    run('toolbar.columns', { id: 'tools', columns: 2 });
    expect(store().layout.columns).toEqual({ tools: 2 });
    const before = store().layout;
    run('toolbar.columns', { id: 'tools', columns: 5 });
    run('toolbar.columns', 'tools');
    run('toolbar.item', 'tools');
    run('toolbar.item', { id: 'tools' });
    expect(store().layout).toBe(before);
  });
});

describe('the toolbar context menu items and columns', () => {
  it('lists each item as a check, ticked while shown', () => {
    toolbars.items('tools', ['eraser']);
    const entry = toolbarContextEntries(context).find((each) => typeof each === 'object' && 'label' in each && each.label === 'Items') as ContextMenuSubmenu;
    expect(entry.items).toMatchObject([
      { command: 'toolbar.item', label: 'Pencil', args: { id: 'tools', item: 'pencil' }, kind: 'check', checked: true },
      { label: 'Eraser', checked: false },
      { label: 'Fill', checked: true },
    ]);
  });

  it('lists the column choices as a radio group, one column until a choice is saved', () => {
    const pick = (): ContextMenuSubmenu => toolbarContextEntries(context).find((each) => typeof each === 'object' && 'label' in each && each.label === 'Columns') as ContextMenuSubmenu;
    expect((pick().items as ContextMenuCommand[]).map((each) => [each.label, each.checked])).toEqual([['1 column', true], ['2 columns', false], ['Auto', false]]);
    toolbars.columns('tools', 'auto');
    expect((pick().items as ContextMenuCommand[]).map((each) => each.checked)).toEqual([false, false, true]);
  });

  it('leaves out Items for a toolbar with no item list and Columns for a horizontal one', () => {
    const nameOf = (each: ContextMenuEntry): string => {
      if (typeof each === 'string') return each;
      return 'command' in each ? each.command : each.label;
    };
    const labels = toolbarContextEntries({ ...context, data: 'top' }).map(nameOf);
    expect(labels).toEqual(['toolbar.labels', 'Move to', 'separator', 'toolbar.hide']);
  });
});

describe('P-184 a toolbar ruled out by when', () => {
  const PENCIL = defineToolbar({ id: 'pencil', label: 'Pencil', defaultSide: 'top', render: () => createElement('i', { className: 'pencil-bar' }), when: mode('sheet') });
  const LEFT = defineToolbar({ id: 'left-tools', label: 'Left', defaultSide: 'left', render: () => createElement('i', { className: 'left-bar' }) });
  let root: Root | null = null;

  beforeEach(() => {
    hostClaim.reset();
    createAppLog();
    store().setDefinitions([PENCIL, LEFT]);
  });

  afterEach(() => {
    act(() => root?.unmount());
    root = null;
    document.body.replaceChildren();
    showHarness.resetShow();
  });

  const mount = (): void => {
    const host = document.body.appendChild(document.createElement('div'));
    root = createRoot(host);
    act(() => root?.render(createElement(ToolbarHost, { children: createElement('b') })));
  };

  it('draws no bar, no border and no lane for it, keeps the saved layout, and draws it when the rule passes', () => {
    const saved = store().layout;
    mount();
    expect(document.querySelector('.pencil-bar')).toBeNull();
    expect(document.querySelectorAll('.toolbar-dock__bar')).toHaveLength(1);
    expect(document.querySelector('.toolbar-dock__lane[data-side="top"]')).toBeNull();
    expect(document.querySelectorAll('.toolbar-dock__lane')).toHaveLength(1);
    expect(store().layout).toBe(saved);
    setMode('sheet');
    expect(document.querySelectorAll('.toolbar-dock__bar')).toHaveLength(2);
    expect(document.querySelector('.toolbar-dock__lane[data-side="top"] .pencil-bar')).not.toBeNull();
    setMode(null);
    expect(document.querySelector('.toolbar-dock__lane[data-side="top"]')).toBeNull();
    expect(store().layout).toBe(saved);
  });
});

