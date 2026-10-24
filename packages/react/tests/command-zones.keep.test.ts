/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commandZone } from '../src/commands/command-zone';
import { commands } from '../src/commands/commands';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { useCommandStore } from '../src/commands/useCommandStore';

const key = (init: KeyboardEventInit): KeyboardEvent => new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });

const focusIn = (...zones: string[]): void => {
  document.body.replaceChildren();
  let parent: HTMLElement = document.body;
  for (const name of zones) {
    const inner = document.createElement('div');
    for (const [attribute, value] of Object.entries(commandZone(name))) inner.setAttribute(attribute, value);
    parent.append(inner);
    parent = inner;
  }
  const target = document.createElement('button');
  parent.append(target);
  target.focus();
};

const press = (init: KeyboardEventInit, route: string | null = null): void => {
  document.addEventListener('keydown', (each) => dispatchCommand(each, route), { once: true });
  document.dispatchEvent(key(init));
};

describe('focus zones', () => {
  const ran: string[] = [];
  const run = (id: string) => () => { ran.push(id); };
  let unregister = (): void => {};

  beforeEach(() => {
    ran.length = 0;
    useCommandStore.setState({ sources: [], overrides: {}, mac: false, persist: null });
    unregister = commands.register([
      { id: 'any-delete', label: 'Delete anywhere', chord: 'Delete', run: run('any-delete') },
      { id: 'list-delete', label: 'Delete item', chord: 'Delete', zone: 'list', run: run('list-delete') },
      { id: 'canvas-delete', label: 'Clear selection', chord: 'Delete', zone: 'canvas', run: run('canvas-delete') },
      { id: 'screen-delete', label: 'Delete in editor', chord: 'Delete', scope: 'editor', run: run('screen-delete') },
      { id: 'canvas-pan', label: 'Pan', chord: 'H', zone: 'canvas', run: run('canvas-pan') },
    ]);
  });

  afterEach(() => {
    unregister();
    document.body.replaceChildren();
  });

  it('marks an element with a data attribute', () => {
    expect(commandZone('canvas')).toEqual({ 'data-command-zone': 'canvas' });
  });

  it('fires the command of the zone that holds the focus', () => {
    focusIn('list');
    press({ key: 'Delete' });
    focusIn('canvas');
    press({ key: 'Delete' });
    expect(ran).toEqual(['list-delete', 'canvas-delete']);
  });

  it('holds a zoned command when the focus is outside its zone', () => {
    focusIn();
    press({ key: 'h' });
    expect(ran).toEqual([]);
    focusIn('canvas');
    press({ key: 'h' });
    expect(ran).toEqual(['canvas-pan']);
  });

  it('ranks the zone first, then the screen, then the rest', () => {
    focusIn();
    press({ key: 'Delete' }, 'editor');
    focusIn('list');
    press({ key: 'Delete' }, 'editor');
    focusIn();
    press({ key: 'Delete' });
    expect(ran).toEqual(['screen-delete', 'list-delete', 'any-delete']);
  });

  it('counts every enclosing zone, the innermost first', () => {
    focusIn('canvas', 'list');
    press({ key: 'Delete' });
    focusIn('list', 'canvas');
    press({ key: 'Delete' });
    expect(ran).toEqual(['list-delete', 'canvas-delete']);
  });
});

describe('zones and conflicts', () => {
  let unregister = (): void => {};

  beforeEach(() => {
    useCommandStore.setState({ sources: [], overrides: {}, mac: false, persist: null });
    unregister = commands.register([
      { id: 'a', label: 'A', chord: 'Delete', zone: 'list', run: () => {} },
      { id: 'b', label: 'B', chord: 'Delete', zone: 'canvas', run: () => {} },
      { id: 'c', label: 'C', chord: 'Delete', zone: 'canvas', scope: 'editor', run: () => {} },
      { id: 'd', label: 'D', chord: 'Delete', zone: 'canvas', run: () => {} },
    ]);
  });

  afterEach(() => unregister());

  it('reports no conflict for one chord in different zones', () => {
    expect(commands.conflicts()).toEqual([{ chord: 'Delete', ids: ['b', 'c', 'd'] }]);
  });
});
