/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createToolbarLayout, toolbarIdsOf } from '@drizztdourden08/tessera/composites';
import { commands } from '../src/commands/commands';
import type { CommandRunResult } from '../src/commands/command.type';
import { useCommandStore } from '../src/commands/useCommandStore';
import { ContextMenuHost } from '../src/context-menu/ContextMenuHost';
import type { ContextMenuCommand, ContextMenuSubmenu } from '../src/context-menu/context-menu.type';
import { resolveEntries } from '../src/context-menu/resolve-entries';
import { useContextMenuStore } from '../src/context-menu/useContextMenuStore';
import { createAppLog } from '../src/log/create-app-log';
import type { MenuItem } from '../src/menu/menu.type';
import { buildToolbarMenuEntries } from '../src/toolbars/build-toolbar-menu-entries';
import { defineToolbar } from '../src/toolbars/define-toolbar';
import { hostClaim } from '../src/toolbars/host-claim';
import { toolbarCommands } from '../src/toolbars/toolbar-commands';
import { toolbarContextEntries } from '../src/toolbars/toolbar-context-entries';
import { ToolbarHost } from '../src/toolbars/ToolbarHost';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';
import { useToolbarSurface } from '../src/toolbars/useToolbarSurface';
import { item, rightClick } from './context-menu-harness';
import { registerFresh } from './command-fixtures';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const make = (id: string, defaultSide: 'top' | 'bottom' | 'left' | 'right') =>
  defineToolbar({ id, label: id === 'tools' ? 'Tools' : id, defaultSide, render: () => createElement('i', { className: `${id}-bar`, tabIndex: 0 }) });

const TOOLS = make('tools', 'left');
const OPTIONS = make('options', 'top');
const store = () => useToolbarLayoutStore.getState();
const context = { point: { x: 0, y: 0 }, target: null, trigger: 'pointer', data: 'tools' } as const;
const runAsync = (id: string, args?: unknown): Promise<CommandRunResult> => commands.run(id, { ...context, args });
const run = (id: string, args?: unknown): void => { void runAsync(id, args); };

const Surface = () => {
  useToolbarSurface();
  return createElement('div', null, createElement(ToolbarHost, { toolbars: [TOOLS, OPTIONS], children: createElement('b') }), createElement(ContextMenuHost));
};

let root: Root | null = null;
let unregister = (): void => undefined;

beforeEach(() => {
  hostClaim.reset();
  createAppLog();
  unregister = registerFresh([]);
  store().setDefinitions([]);
  store().setLayout(createToolbarLayout([]));
});

afterEach(() => {
  act(() => {
    useContextMenuStore.getState().hide();
    root?.unmount();
  });
  root = null;
  unregister();
  document.body.replaceChildren();
});

const mount = (): void => {
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(createElement(Surface)));
};

const sideOf = (id: string): string | undefined => (['top', 'bottom', 'left', 'right'] as const).find((side) => toolbarIdsOf(store().layout, side).includes(id));

describe('the toolbar commands', () => {
  beforeEach(() => {
    unregister = registerFresh([...toolbarCommands]);
    store().setDefinitions([TOOLS, OPTIONS]);
  });

  it('hides a toolbar from its id', async () => {
    await expect(runAsync('toolbar.hide', 'options')).resolves.toEqual({ ok: true });
    expect(store().layout.hidden).toContain('options');
  });

  it('toggles the labels of a toolbar and saves the flag in the layout', () => {
    run('toolbar.labels', 'tools');
    expect(store().layout.labels).toEqual({ tools: false });
    run('toolbar.labels', 'tools');
    expect(store().layout.labels).toEqual({ tools: true });
  });

  it('moves a toolbar to a side, and ignores arguments it cannot read', () => {
    run('toolbar.moveTo', { id: 'tools', side: 'bottom' });
    expect(sideOf('tools')).toBe('bottom');
    const before = store().layout;
    run('toolbar.moveTo', { id: 'tools', side: 'middle' });
    run('toolbar.moveTo', 'tools');
    run('toolbar.hide');
    run('toolbar.labels', 7);
    expect(store().layout).toBe(before);
  });
});

describe('the toolbar context menu entries', () => {
  beforeEach(() => {
    unregister = registerFresh([...toolbarCommands]);
    store().setDefinitions([TOOLS, OPTIONS]);
  });

  it('lists labels, a Move to radio group with the current side checked, and Hide', () => {
    const [labels, columns, move, separator, hide] = toolbarContextEntries(context) as [ContextMenuCommand, ContextMenuSubmenu, ContextMenuSubmenu, string, ContextMenuCommand];
    expect(columns.label).toBe('Columns');
    expect(labels).toMatchObject({ command: 'toolbar.labels', args: 'tools', checked: true });
    expect(separator).toBe('separator');
    expect(hide).toMatchObject({ command: 'toolbar.hide', args: 'tools' });
    expect(move.items).toMatchObject([
      { label: 'Top', kind: 'radio', checked: false },
      { label: 'Bottom', kind: 'radio', checked: false },
      { label: 'Left', kind: 'radio', checked: true },
      { label: 'Right', kind: 'radio', checked: false },
    ]);
  });

  it('reads the labels flag from the layout', () => {
    run('toolbar.labels', 'tools');
    expect(toolbarContextEntries(context)[0]).toMatchObject({ checked: false });
  });

  it('is empty without a toolbar id', () => {
    expect(toolbarContextEntries({ ...context, data: undefined })).toEqual([]);
  });

  it('disables a side with no room and says why in the entry description', () => {
    const sides = ['top', 'bottom', 'left', 'right'] as const;
    store().setDefinitions(sides.flatMap((side) => [make(`${side}-a`, side), make(`${side}-b`, side)]));
    const [, move] = toolbarContextEntries({ ...context, data: 'top-a' }) as [ContextMenuCommand, ContextMenuSubmenu];
    const view = { defs: new Map(commands.list().map((def) => [def.id, def])), state: useCommandStore.getState(), context };
    const [submenu] = resolveEntries([move], view);
    const children = submenu !== undefined && 'children' in submenu ? submenu.children ?? [] : [];
    const left = children.find((child) => 'label' in child && child.label === 'Left');
    expect(left).toMatchObject({ disabled: true, description: 'No room on that side', ariaDescription: 'No room on that side', data: { 'data-menu-entry': 'toolbar.moveTo' } });
    expect(children.find((child) => 'label' in child && child.label === 'Top')).toMatchObject({ disabled: false, checked: true });
  });
});

describe('a right click on a docked toolbar', () => {
  beforeEach(mount);

  it('opens the menu built from the commands, named after the toolbar', () => {
    const bar = document.querySelector('.tools-bar');
    expect(bar?.closest('[data-context-menu="brock.toolbar"]')).not.toBeNull();
    rightClick(bar as Element, 20, 30);
    expect(useContextMenuStore.getState().open?.label).toBe('Tools toolbar');
    expect(item('Show labels')?.getAttribute('aria-checked')).toBe('true');
    expect(item('Show labels')?.getAttribute('data-menu-entry')).toBe('toolbar.labels');
    expect(item('Move to')).toBeDefined();
    expect(item('Hide toolbar')?.getAttribute('data-menu-entry')).toBe('toolbar.hide');
  });

  it('runs the command for the toolbar that was clicked', () => {
    rightClick(document.querySelector('.options-bar') as Element, 5, 5);
    act(() => item('Hide toolbar')?.click());
    expect(store().layout.hidden).toEqual(['options']);
    expect(useContextMenuStore.getState().open).toBeNull();
  });

  it('toggles the labels from the menu and shows the new state on the next open', () => {
    rightClick(document.querySelector('.tools-bar') as Element, 5, 5);
    act(() => item('Show labels')?.click());
    expect(store().layout.labels).toEqual({ tools: false });
    rightClick(document.querySelector('.tools-bar') as Element, 5, 5);
    expect(item('Show labels')?.getAttribute('aria-checked')).toBe('false');
  });
});

describe('the Toolbars menu bar entry', () => {
  const entries = (): MenuItem[] => {
    const [menu] = buildToolbarMenuEntries({ definitions: store().definitions, layout: store().layout, toggle: store().toggle, words: { menu: 'Toolbars', reset: 'Reset toolbars' }, reset: store().reset });
    return (menu?.children ?? []).filter((child): child is MenuItem => child !== 'separator');
  };
  const options = (id: string): MenuItem[] => (entries().find((entry) => entry.key === `toolbar-${id}-options`)?.children ?? []).filter((child): child is MenuItem => child !== 'separator');

  beforeEach(() => {
    unregister = registerFresh([...toolbarCommands]);
    store().setDefinitions([TOOLS, OPTIONS, make('extra', 'top')]);
    store().toggle('extra');
  });

  it('keeps the check items and Reset, and adds a submenu for each shown toolbar', () => {
    expect(entries().map((entry) => entry.key)).toEqual([
      'toolbar-tools', 'toolbar-options', 'toolbar-extra', 'toolbar-tools-options', 'toolbar-options-options', 'toolbars-reset',
    ]);
    expect(options('tools').map((entry) => entry.key)).toEqual([
      'toolbar-tools-labels', 'toolbar-tools-move-top', 'toolbar-tools-move-bottom', 'toolbar-tools-move-left', 'toolbar-tools-move-right', 'toolbar-tools-hide',
    ]);
    expect(options('tools').map((entry) => entry.checked)).toEqual([true, false, false, true, false, undefined]);
  });

  it('runs the same commands as the context menu', () => {
    options('tools')[0]?.onClick?.();
    expect(store().layout.labels).toEqual({ tools: false });
    options('tools')[2]?.onClick?.();
    expect(sideOf('tools')).toBe('bottom');
    options('options')[5]?.onClick?.();
    expect(store().layout.hidden).toContain('options');
    expect(entries().some((entry) => entry.key === 'toolbar-options-options')).toBe(false);
  });
});
