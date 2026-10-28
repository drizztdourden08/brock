/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { contextMenu } from '../src/context-menu/context-menu-api';
import { useContextMenuStore } from '../src/context-menu/useContextMenuStore';

const opened = () => useContextMenuStore.getState().open;

const mark = (parent: Element, id: string, zone?: string): HTMLElement => {
  const element = document.createElement('div');
  element.id = id;
  if (zone !== undefined) {
    element.setAttribute('data-context-menu', zone);
    element.setAttribute('data-context-menu-data', JSON.stringify({ zone }));
  }
  parent.append(element);
  return element;
};

const el = (id: string): HTMLElement => {
  const found = document.getElementById(id);
  if (found === null) throw new Error(`${id} is missing`);
  return found;
};

beforeEach(() => {
  const list = mark(document.body, 'list', 'list');
  mark(list, 'row');
  mark(document.body, 'outside');
  useContextMenuStore.setState({ menus: { list: { entries: ['list.copy'] } }, open: null, blocked: false });
});

afterEach(() => {
  useContextMenuStore.setState({ menus: {}, known: {}, open: null });
  document.body.replaceChildren();
});

describe('context menus with a selection', () => {
  it('hands the selection given at open to the menu context as a set', () => {
    expect(contextMenu.open('list', undefined, { selection: ['a', 'b', 'a'] })).toBe(true);
    expect(opened()?.context.selection).toEqual(new Set(['a', 'b']));
  });

  it('reads the selection from the zone config when none is given', () => {
    useContextMenuStore.setState({ menus: { list: { entries: ['list.copy'], selection: ({ data }) => [JSON.stringify(data)] } } });
    contextMenu.open('list');
    expect(opened()?.context.selection).toEqual(new Set(['{"zone":"list"}']));
  });

  it('leaves the selection out when nothing supplies one', () => {
    contextMenu.open('list');
    expect(opened()?.context.selection).toBeUndefined();
  });
});

describe('opening a menu at an element', () => {
  it('opens the menu of the nearest zone with the given data and selection', () => {
    expect(contextMenu.openAt(el('row'), { id: 9 }, { selection: ['r1'] })).toBe(true);
    expect(opened()?.context.data).toEqual({ id: 9 });
    expect(opened()?.context.trigger).toBe('keyboard');
    expect(opened()?.context.selection).toEqual(new Set(['r1']));
    expect(opened()?.context.target === el('row')).toBe(true);
  });

  it('opens nothing for an element outside every zone and closes on request', () => {
    expect(contextMenu.openAt(el('outside'))).toBe(false);
    contextMenu.openAt(el('row'));
    expect(opened() === null).toBe(false);
    contextMenu.close();
    expect(opened() === null).toBe(true);
  });
});
