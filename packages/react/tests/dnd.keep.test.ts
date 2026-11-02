/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dnd } from '../src/dnd/dnd';
import { setDragOutHost } from '../src/dnd/set-drag-out-host';
import type { DropFeedback } from '../src/dnd/dnd.type';
import { FakeElement, dragWorld, installDragWorld, pointer } from './dnd-fixtures';

beforeEach(() => {
  installDragWorld();
});

afterEach(() => {
  vi.unstubAllGlobals();
  setDragOutHost(null);
});

const Asset = dnd.type<{ id: string }>('asset');
const Layer = dnd.type<number>('layer');

const press = (el: FakeElement, x = 0, y = 0): void => {
  el.dispatchEvent(pointer('pointerdown', x, y));
};
const move = (x: number, y: number): void => {
  dragWorld.win.dispatchEvent(pointer('pointermove', x, y));
};
const release = (x: number, y: number): void => {
  dragWorld.win.dispatchEvent(pointer('pointerup', x, y));
};

describe('K1 a typed drag between two widgets', { tags: ['critical'] }, () => {
  it('hands the payload to the target that accepts its type, with feedback along the way', () => {
    const source = new FakeElement();
    const target = new FakeElement();
    const seen: DropFeedback<{ id: string }>[] = [];
    const drops: unknown[] = [];
    const ended: unknown[] = [];
    dnd.source(source, { type: Asset, payload: () => ({ id: 'sprite-7' }), onEnd: (end) => ended.push(end.dropped) });
    dnd.target(target, {
      accepts: Asset,
      onDrop: (payload, info) => drops.push([payload, info.index, info.type]),
      feedback: (feedback) => seen.push(feedback),
      index: (point) => Math.floor(point.y / 10),
    });

    press(source, 5, 5);
    move(6, 6);
    expect(dnd.session()).toBeNull();
    move(40, 25);
    expect(dnd.session()).toEqual({ type: 'asset', payload: { id: 'sprite-7' } });
    expect(dragWorld.root.attributes.get('data-dragging')).toBe('asset');
    dragWorld.stack = [target];
    move(50, 25);
    expect(target.attributes.get('data-drop')).toBe('over');
    move(50, 35);
    release(50, 35);

    expect(seen.map((f) => [f.phase, f.accepted, f.index])).toEqual([['enter', true, 2], ['over', true, 3], ['drop', true, 3]]);
    expect(drops).toEqual([[{ id: 'sprite-7' }, 3, 'asset']]);
    expect(ended).toEqual([true]);
    expect(target.attributes.has('data-drop')).toBe(false);
    expect(dnd.session()).toBeNull();
    expect(dragWorld.root.attributes.has('data-dragging')).toBe(false);
  });
});

describe('K1 targets that refuse or compete', { tags: ['critical'] }, () => {
  it('marks a target that does not accept the type and never drops on it', () => {
    const source = new FakeElement();
    const target = new FakeElement();
    const seen: string[] = [];
    const onDrop = vi.fn();
    dnd.source(source, { type: Asset, payload: { id: 'a' } });
    dnd.target(target, { accepts: Layer, onDrop, feedback: (f) => seen.push(`${f.phase}:${f.accepted}`) });
    dragWorld.stack = [target];
    press(source);
    move(30, 30);
    expect(target.attributes.get('data-drop')).toBe('reject');
    release(30, 30);
    expect(onDrop).not.toHaveBeenCalled();
    expect(seen).toEqual(['enter:false', 'leave:false']);
  });

  it('lets a target ask about the payload first, and prefers an outer target that accepts', () => {
    const source = new FakeElement();
    const inner = new FakeElement();
    const outer = new FakeElement();
    const innerDrop = vi.fn();
    const outerDrop = vi.fn();
    dnd.source(source, { type: Layer, payload: 3 });
    dnd.target(inner, { accepts: Layer, canDrop: (layer) => layer > 5, onDrop: innerDrop });
    dnd.target(outer, { accepts: [Layer], onDrop: outerDrop });
    dragWorld.stack = [inner, outer];
    press(source);
    move(20, 20);
    release(20, 20);
    expect(innerDrop).not.toHaveBeenCalled();
    expect(outerDrop).toHaveBeenCalledWith(3, expect.objectContaining({ type: 'layer' }));
  });
});

describe('K1 cancelling and thresholds', { tags: ['critical'] }, () => {
  it('cancels on Escape and leaves nothing marked', () => {
    const source = new FakeElement();
    const target = new FakeElement();
    const onDrop = vi.fn();
    dnd.source(source, { type: Asset, payload: { id: 'a' } });
    dnd.target(target, { accepts: Asset, onDrop });
    dragWorld.stack = [target];
    press(source);
    move(30, 30);
    dragWorld.win.dispatchEvent(Object.assign(new Event('keydown'), { key: 'Escape' }));
    release(30, 30);
    expect(onDrop).not.toHaveBeenCalled();
    expect(target.attributes.has('data-drop')).toBe(false);
    expect(dnd.session()).toBeNull();
  });

  it('does not start a drag below the move threshold, and stops listening once disposed', () => {
    const source = new FakeElement();
    const target = new FakeElement();
    const onDrop = vi.fn();
    const stopSource = dnd.source(source, { type: Asset, payload: { id: 'a' } });
    dnd.target(target, { accepts: Asset, onDrop });
    dragWorld.stack = [target];
    press(source, 10, 10);
    move(11, 11);
    release(11, 11);
    expect(onDrop).not.toHaveBeenCalled();
    stopSource();
    press(source, 10, 10);
    move(90, 90);
    release(90, 90);
    expect(onDrop).not.toHaveBeenCalled();
  });
});

describe('K1 dragging out of the window', { tags: ['critical'] }, () => {
  it('answers false until the main-process side registers a host', async () => {
    expect(await dnd.dragOut(['C:\\art\\a.png'])).toBe(false);
    const start = vi.fn(() => Promise.resolve(true));
    setDragOutHost({ start });
    expect(await dnd.dragOut(['C:\\art\\a.png'])).toBe(true);
    expect(await dnd.dragOut([])).toBe(false);
    expect(start).toHaveBeenCalledTimes(1);
  });
});
