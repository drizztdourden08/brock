/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { dnd } from '../src/dnd/dnd';
import { useDragSource } from '../src/dnd/useDragSource';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const Item = dnd.type<string>('item');

const pointer = (type: string, x: number, y: number): Event => Object.assign(new Event(type, { cancelable: true, bubbles: true }), { button: 0, pointerId: 1, clientX: x, clientY: y });

interface Props {
  payload: string;
  disabled: boolean;
}

const roots: Root[] = [];

const mount = (initial: Props): { element: () => HTMLElement; render: (props: Props) => void } => {
  const Harness = (props: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    useDragSource(ref, { type: Item, payload: props.payload, disabled: props.disabled });
    return createElement('div', { ref }, createElement('img', { id: 'inner' }));
  };
  const host = document.body.appendChild(document.createElement('div'));
  const root = createRoot(host);
  roots.push(root);
  const render = (props: Props): void => {
    act(() => root.render(createElement(Harness, props)));
  };
  render(initial);
  return { element: () => host.firstElementChild as HTMLElement, render };
};

const drag = (element: HTMLElement): void => {
  element.dispatchEvent(pointer('pointerdown', 0, 0));
  window.dispatchEvent(pointer('pointermove', 40, 40));
};

const drop = (): void => {
  window.dispatchEvent(pointer('pointerup', 40, 40));
};

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  document.body.innerHTML = '';
});

describe('a drag source reads its options live', () => {
  it('stops dragging when disabled changes after mount', () => {
    const view = mount({ payload: 'a', disabled: false });
    view.render({ payload: 'a', disabled: true });
    drag(view.element());
    expect(dnd.session()).toBeNull();
    drop();
  });

  it('starts dragging when a source that mounted disabled becomes enabled', () => {
    const view = mount({ payload: 'a', disabled: true });
    view.render({ payload: 'a', disabled: false });
    drag(view.element());
    expect(dnd.session()).toEqual({ type: 'item', payload: 'a' });
    drop();
  });

  it('delivers the payload of the latest render', () => {
    const view = mount({ payload: 'first', disabled: false });
    view.render({ payload: 'second', disabled: false });
    drag(view.element());
    expect(dnd.session()).toEqual({ type: 'item', payload: 'second' });
    drop();
  });

  it('reads the latest options of a plain dnd.source with getters', () => {
    const element = document.createElement('div');
    const state = { payload: 'one', disabled: false };
    dnd.source(element, { type: Item, get payload() { return state.payload; }, get disabled() { return state.disabled; } });
    state.payload = 'two';
    drag(element);
    expect(dnd.session()).toEqual({ type: 'item', payload: 'two' });
    drop();
  });
});

describe('the browser drag of inner content', () => {
  it('is prevented for a dragstart that starts on an inner image', () => {
    const view = mount({ payload: 'a', disabled: false });
    const image = view.element().querySelector('#inner') as HTMLElement;
    const event = new Event('dragstart', { cancelable: true, bubbles: true });
    image.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('stops preventing once the source is removed', () => {
    const element = document.createElement('div');
    const stop = dnd.source(element, { type: Item, payload: 'a' });
    stop();
    const event = new Event('dragstart', { cancelable: true, bubbles: true });
    element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
