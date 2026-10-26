/* @layer renderer-shell @kind test */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { vi } from 'vitest';
import { shellCommands } from '../src/app/BrockApp/behavior/shell-commands';
import type { CommandContext } from '../src/commands/command.type';
import { BROCK_COMMANDS } from '../src/commands/commands.constants';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { blockContextMenus } from '../src/context-menu/block-context-menus';
import { contextMenuZone } from '../src/context-menu/context-menu-zone';
import { ContextMenuHost } from '../src/context-menu/ContextMenuHost';
import type { ContextMenuConfig, ContextMenuContext, ContextMenuEntry } from '../src/context-menu/context-menu.type';
import { useContextMenu } from '../src/context-menu/useContextMenu';
import { useContextMenuStore } from '../src/context-menu/useContextMenuStore';
import { registerFresh } from './command-fixtures';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const ran: CommandContext[] = [];
const seen = { builds: 0, veto: false, allow: true, before: [] as ContextMenuContext[] };
const run = (context?: CommandContext) => { if (context !== undefined) ran.push(context); };

const defs = [
  { id: 'canvas.copy', label: 'Copy pixels', chord: 'Mod+C', run },
  { id: 'canvas.grid', label: 'Show grid', checked: () => true, run },
  { id: 'canvas.front', label: 'Bring to front', run },
  { id: 'canvas.off', label: 'Paste pixels', when: () => false, run },
  ...shellCommands(undefined).filter((def) => def.id === BROCK_COMMANDS.contextMenu),
];

const entries: ContextMenuEntry[] = [
  { command: 'canvas.copy', args: { mode: 'all' } },
  'separator',
  'canvas.grid',
  { label: 'Arrange', items: ['canvas.front', 'missing.command'] },
  'canvas.off',
];

const canvasConfig: ContextMenuConfig = {
  entries: () => {
    seen.builds += 1;
    return entries;
  },
  label: (context) => `Actions for ${JSON.stringify(context.data)}`,
  anchor: () => ({ x: 3, y: 4, data: { cell: 9 } }),
  shouldOpen: () => !seen.veto,
  beforeOpen: (context) => {
    seen.before.push(context);
    return seen.allow;
  },
};

const listEntries: ContextMenuEntry[] = ['canvas.copy'];
const rowEntries: ContextMenuEntry[] = ['canvas.front'];

const Harness = () => {
  useContextMenu('canvas', canvasConfig);
  useContextMenu('list', listEntries);
  useContextMenu('row', { entries: rowEntries, inherit: 'parent' });
  useContextMenu('form', listEntries);
  useContextMenu('formtyping', listEntries);
  useContextMenu('release', { entries: listEntries, openOn: 'release-without-drag' });
  return createElement(
    'div',
    null,
    createElement('div', { id: 'canvas', ...contextMenuZone('canvas', { focusable: true, data: { sprite: 4 } }) }),
    createElement(
      'div',
      { id: 'list', ...contextMenuZone('list', { focusable: true }) },
      createElement('div', { id: 'row', ...contextMenuZone('row', { data: { id: 7 } }) }),
      createElement('div', { id: 'native', 'data-native-menu': '' }),
    ),
    createElement('div', contextMenuZone('form'), createElement('input', { id: 'plain' })),
    createElement('div', contextMenuZone('formtyping', { typing: true }), createElement('input', { id: 'opted' })),
    createElement('div', { id: 'release', ...contextMenuZone('release') }),
    createElement('div', { id: 'outside', tabIndex: 0 }),
    createElement(ContextMenuHost),
  );
};

const state: { root: Root | null; unregister: () => void } = { root: null, unregister: () => {} };

const mountMenus = (): void => {
  ran.length = 0;
  Object.assign(seen, { builds: 0, veto: false, allow: true, before: [] });
  state.unregister = registerFresh(defs);
  const host = document.createElement('div');
  document.body.append(host);
  state.root = createRoot(host);
  act(() => state.root?.render(createElement(Harness)));
};

const rerenderMenus = (): void => act(() => state.root?.render(createElement(Harness)));

const unmountMenus = (): void => {
  vi.useRealTimers();
  act(() => {
    blockContextMenus(false);
    useContextMenuStore.getState().hide();
    state.root?.unmount();
  });
  state.root = null;
  state.unregister();
  document.body.innerHTML = '';
};

const byId = (id: string): HTMLElement => {
  const found = document.getElementById(id);
  if (found === null) throw new Error(`${id} is missing`);
  return found;
};

const pointer = (type: string, target: Element, init: PointerEventInit): void => {
  act(() => { target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerType: 'mouse', ...init })); });
};

const contextmenu = (target: Element, x = 0, y = 0): MouseEvent => {
  const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y });
  act(() => { target.dispatchEvent(event); });
  return event;
};

const rightClick = (target: Element, x: number, y: number): MouseEvent => {
  pointer('pointerdown', target, { button: 2, clientX: x, clientY: y });
  return contextmenu(target, x, y);
};

const press = (init: KeyboardEventInit): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  document.addEventListener('keydown', (each) => dispatchCommand(each, null), { once: true });
  act(() => { document.activeElement?.dispatchEvent(event); });
  return event;
};

const item = (label: string): HTMLElement | undefined =>
  [...document.querySelectorAll<HTMLElement>('[role^="menuitem"]')].find((candidate) => candidate.textContent.includes(label));

const opened = () => useContextMenuStore.getState().open;

const openPoint = () => opened()?.point ?? null;

const rectOf = (id: string, left: number, bottom: number): HTMLElement => {
  const element = byId(id);
  Object.assign(element, { getBoundingClientRect: () => ({ left, bottom }) });
  return element;
};

export { byId, contextmenu, entries, item, mountMenus, openPoint, opened, pointer, press, ran, rectOf, rerenderMenus, rightClick, seen, unmountMenus };
