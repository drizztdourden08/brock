/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { entryFacts } from '../src/main/widgets/entry-facts';
import { manipulationRules } from '../src/main/widgets/manipulation-rules';
import { planResize } from '../src/main/widgets/plan-resize';
import { NO_ASPECT_LOCK } from '../src/main/window/aspect-lock.constants';
import { ratioBounds } from '../src/main/window/ratio-bounds';

const MIN = { width: 240, height: 160 };
const SNAPPING = manipulationRules(false, true);
const CTRL = manipulationRules(true, true);
const WIDE = { ratio: 16 / 9, extraHeight: 0 };
const box = (x: number, y: number, width: number, height: number): WidgetWindowBounds => ({ x, y, width, height });
const near = (id: string, bounds: WidgetWindowBounds) => ({ id, bounds, min: MIN });

const resize = (id: string, drag: { from: WidgetWindowBounds; to: WidgetWindowBounds; edge: string }, others: { id: string; bounds: WidgetWindowBounds }[], lock = NO_ASPECT_LOCK) =>
  planResize({ id, current: drag.from, proposed: drag.to, edge: drag.edge, others: others.map((o) => near(o.id, o.bounds)), rules: SNAPPING, min: MIN, lock });

describe('a snapped pair side by side', () => {
  const a = box(100, 100, 300, 400);
  const b = box(400, 100, 300, 400);
  const others = [{ id: 'b', bounds: b }];

  it('moves the facing edge of the neighbour when the shared right edge moves, and nothing else', () => {
    const result = resize('a', { from: a, to: { ...a, width: 340 }, edge: 'right' }, others);
    expect(result.bounds).toEqual({ ...a, width: 340 });
    expect(result.moves).toEqual([{ id: 'b', bounds: box(440, 100, 260, 400) }]);
  });

  it('leaves the neighbour alone when the outer left edge moves', () => {
    const result = resize('a', { from: a, to: { ...a, x: 60, width: 340 }, edge: 'left' }, others);
    expect(result).toEqual({ bounds: box(60, 100, 340, 400), moves: [] });
  });

  it('leaves the neighbour alone when the top edge moves, though both tops line up', () => {
    const result = resize('a', { from: a, to: { ...a, y: 60, height: 440 }, edge: 'top' }, others);
    expect(result).toEqual({ bounds: box(100, 60, 300, 440), moves: [] });
  });

  it('leaves the neighbour alone when the bottom edge moves, though both bottoms line up', () => {
    const result = resize('a', { from: a, to: { ...a, height: 440 }, edge: 'bottom' }, others);
    expect(result).toEqual({ bounds: box(100, 100, 300, 440), moves: [] });
  });

  it('moves the facing edge of the left window when the right window drags the shared edge', () => {
    const result = resize('b', { from: b, to: { ...b, x: 360, width: 340 }, edge: 'left' }, [{ id: 'a', bounds: a }]);
    expect(result.moves).toEqual([{ id: 'a', bounds: box(100, 100, 260, 400) }]);
  });

  it('resizes the dragged window alone while Ctrl is held', () => {
    const result = planResize({ id: 'a', current: a, proposed: { ...a, width: 340 }, edge: 'right', others: [near('b', b)], rules: CTRL, min: MIN, lock: NO_ASPECT_LOCK });
    expect(result).toEqual({ bounds: { ...a, width: 340 }, moves: [] });
  });
});

describe('a snapped pair stacked', () => {
  const top = box(100, 100, 300, 200);
  const bottom = box(100, 300, 300, 200);
  const others = [{ id: 'bottom', bounds: bottom }];

  it('moves the top edge of the lower window when the shared bottom edge moves', () => {
    const result = resize('top', { from: top, to: { ...top, height: 240 }, edge: 'bottom' }, others);
    expect(result.moves).toEqual([{ id: 'bottom', bounds: box(100, 340, 300, 160) }]);
  });

  it('leaves the lower window alone when the left, right or top edge moves', () => {
    expect(resize('top', { from: top, to: { ...top, x: 60, width: 340 }, edge: 'left' }, others).moves).toEqual([]);
    expect(resize('top', { from: top, to: { ...top, width: 340 }, edge: 'right' }, others).moves).toEqual([]);
    expect(resize('top', { from: top, to: { ...top, y: 60, height: 240 }, edge: 'top' }, others).moves).toEqual([]);
  });

  it('still snaps the dragged edge to the neighbour', () => {
    const result = resize('top', { from: top, to: { ...top, width: 306 }, edge: 'right' }, others);
    expect(result).toEqual({ bounds: top, moves: [] });
  });
});

describe('the main window aspect lock', () => {
  const main = box(100, 100, 800, 450);
  const widget = box(900, 100, 300, 450);

  it('never applies to a widget window', () => {
    const result = resize('logs', { from: widget, to: { ...widget, width: 400 }, edge: 'right' }, [{ id: 'main', bounds: main }], WIDE);
    expect(result).toEqual({ bounds: { ...widget, width: 400 }, moves: [] });
  });

  it('never bends the locked main window to a widget dragging the edge they share', () => {
    const result = resize('logs', { from: widget, to: { ...widget, x: 860, width: 340 }, edge: 'left' }, [{ id: 'main', bounds: main }], WIDE);
    expect(result).toEqual({ bounds: box(860, 100, 340, 450), moves: [] });
  });

  it('lets a widget move the facing edge of the main window when no lock is set', () => {
    const result = resize('logs', { from: widget, to: { ...widget, x: 860, width: 340 }, edge: 'left' }, [{ id: 'main', bounds: main }]);
    expect(result.moves).toEqual([{ id: 'main', bounds: box(100, 100, 760, 450) }]);
  });

  it('keeps the main window in proportion, and only the flush facing edge follows', () => {
    const below = box(100, 550, 800, 300);
    const result = resize('main', { from: main, to: { ...main, width: 960 }, edge: 'right' }, [{ id: 'below', bounds: below }], WIDE);
    expect(result.bounds).toEqual(box(100, 100, 960, 540));
    expect(result.moves).toEqual([{ id: 'below', bounds: box(100, 640, 800, 210) }]);
  });

  it('leaves the main window free when no lock is set', () => {
    expect(ratioBounds(main, { ...main, width: 960 }, 'right', NO_ASPECT_LOCK)).toEqual({ ...main, width: 960 });
  });
});

describe('pin migration', () => {
  it('turns a saved "with app" pin into sync with the main window', () => {
    expect(entryFacts({ pin: 'with-app', sync: false })).toMatchObject({ pin: 'off', sync: true, taskbar: false });
  });

  it('keeps on top and off as they were', () => {
    expect(entryFacts({ pin: 'top', sync: false })).toMatchObject({ pin: 'top', sync: false, taskbar: true });
    expect(entryFacts({})).toMatchObject({ pin: 'off', sync: true });
  });
});
