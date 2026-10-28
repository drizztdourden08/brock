/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { paneOf, placementOf } from '@drizztdourden08/tessera/composites';
import { useContextsStore } from '../src/contexts/useContextsStore';
import { defineLayoutPreset } from '../src/widgets/define-layout-preset';
import { defineWidget } from '../src/widgets/define-widget';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgetMainRect } from '../src/widgets/widget-main-rect';
import { widgets } from '../src/widgets/widgets';
import { resetWidgetStage } from './widget-stage-fixture';
import type { WidgetSnapshot } from '../src/widgets/widget-snapshot.type';

const make = (id: string, extra: Partial<Parameters<typeof defineWidget>[0]> = {}) => defineWidget({ id, label: id.toUpperCase(), render: () => null, popOut: true, ...extra });

const DEFINITIONS = [make('a'), make('b'), make('c'), make('f'), make('s', { context: 'session', defaultVisibility: 'context-only' })];
const TABBED = defineLayoutPreset({ rows: [[['a', 'b'], 'main']] });
const store = () => useWidgetLayoutStore.getState();
const entry = (id: string) => {
  const found = widgets.list().find((each) => each.id === id);
  if (!found) throw new Error(`no ${id}`);
  return found;
};
const near = (value: number | null, wanted: number): boolean => value !== null && Math.abs(value - wanted) <= 12;

beforeEach(() => {
  resetWidgetStage(DEFINITIONS);
});

afterEach(() => {
  widgetMainRect.current = null;
});

describe('widgets.list', () => {
  it('lists every registered widget with plain facts, closed ones with nothing placed', () => {
    expect(widgets.list().map((each) => each.id)).toEqual(['a', 'b', 'c', 'f', 's']);
    expect(entry('a')).toEqual({
      id: 'a', label: 'A', visible: false, placement: null, side: null, size: null, index: null, tab: null, rect: null, popped: false, context: 'default', available: true,
    });
  });

  it('reports a docked widget with side, size, pane index and tab', () => {
    widgets.dock('a', { side: 'left', size: 300 });
    const docked = entry('a');
    expect([docked.visible, docked.placement, docked.side, docked.index, docked.tab, docked.rect, docked.popped]).toEqual([true, 'docked', 'left', 0, 0, null, false]);
    expect(near(docked.size, 300)).toBe(true);
  });

  it('reports a floating widget with its rect and a popped one as popped', () => {
    widgets.float('f', { x: 100, y: 50, width: 320, height: 240 });
    expect(entry('f')).toMatchObject({ placement: 'floating', side: null, rect: { x: 100, y: 50, width: 320, height: 240 } });
    widgets.open('b');
    widgets.popOut('b');
    expect(entry('b')).toMatchObject({ placement: 'popped', popped: true, visible: true, rect: null });
  });

  it('marks a context widget unavailable until its context is active', () => {
    expect(entry('s').available).toBe(false);
    useContextsStore.getState().set('session', { active: true });
    expect(entry('s')).toMatchObject({ context: 'session', available: true });
  });
});

describe('widgets.dock', () => {
  it('docks to each side, opening a closed widget', () => {
    for (const side of ['left', 'right', 'top', 'bottom'] as const) {
      widgets.dock('a', { side });
      expect([entry('a').placement, entry('a').side]).toEqual(['docked', side]);
    }
  });

  it('takes a pane index among the widgets of that side', () => {
    widgets.dock('a', { side: 'left' });
    widgets.dock('b', { side: 'left' });
    widgets.dock('c', { side: 'left', index: 0 });
    expect(['c', 'a', 'b'].map((id) => entry(id).index)).toEqual([0, 1, 2]);
    widgets.dock('c', { side: 'left', index: 1 });
    expect(['a', 'c', 'b'].map((id) => entry(id).index)).toEqual([0, 1, 2]);
  });

  it('moves a floating widget into the dock and rejects a bad side, size or index', () => {
    widgets.float('a', { width: 300, height: 200 });
    widgets.dock('a', { side: 'right' });
    expect(entry('a').placement).toBe('docked');
    expect(() => widgets.dock('a', { side: 'middle' as 'left' })).toThrow(/Unknown side/);
    expect(() => widgets.dock('a', { side: 'left', size: -4 })).toThrow(/size/);
    expect(() => widgets.dock('a', { side: 'left', index: 1.5 })).toThrow(/index/);
  });
});

describe('widgets.float', () => {
  it('floats a docked widget at the rect', () => {
    widgets.dock('a', { side: 'left' });
    widgets.float('a', { x: 40, y: 30, width: 400, height: 260 });
    expect(entry('a')).toMatchObject({ placement: 'floating', side: null, rect: { x: 40, y: 30, width: 400, height: 260 } });
  });

  it('rejects a rect without a positive width and height', () => {
    expect(() => widgets.float('a', { width: 0, height: 100 })).toThrow(/positive/);
    expect(() => widgets.float('a', { width: Number.NaN, height: 100 })).toThrow(/positive/);
  });
});

describe('widgets.resize', () => {
  it('resizes a docked widget by pixels', () => {
    widgets.dock('a', { side: 'left', size: 200 });
    widgets.resize('a', 420);
    expect(near(entry('a').size, 420)).toBe(true);
  });

  it('resizes a floating widget by rect and keeps what the rect leaves out', () => {
    widgets.float('f', { x: 100, y: 50, width: 320, height: 240 });
    widgets.resize('f', { width: 500, height: 300 });
    expect(entry('f').rect).toEqual({ x: 100, y: 50, width: 500, height: 300 });
  });

  it('rejects the wrong shape for where the widget is, and a closed or popped widget', () => {
    widgets.dock('a', { side: 'left' });
    widgets.float('f', { width: 300, height: 200 });
    expect(() => widgets.resize('a', { width: 300, height: 200 })).toThrow(/docked/);
    expect(() => widgets.resize('f', 300)).toThrow(/floating/);
    expect(() => widgets.resize('c', 300)).toThrow(/not open/);
    widgets.open('b');
    widgets.popOut('b');
    expect(() => widgets.resize('b', 300)).toThrow(/own window/);
  });
});

describe('widgets.focus', () => {
  beforeEach(() => {
    store().setPreset(TABBED);
    store().reset();
  });

  it('makes a tab the active one in its pane', () => {
    const pane = () => paneOf(store().layout.dock, 'b');
    expect(pane()?.active).toBe('a');
    widgets.focus('b');
    expect(pane()?.active).toBe('b');
  });

  it('opens a closed widget and raises a floating one above the others', () => {
    widgets.focus('c');
    expect(placementOf(store().layout, 'c')).not.toBeNull();
    widgets.float('f', { width: 300, height: 200 });
    widgets.float('c', { width: 300, height: 200 });
    widgets.focus('f');
    expect(store().layout.floating.map((each) => each.id).at(-1)).toBe('f');
  });
});

describe('widgets.presets and widgets.applyPreset', () => {
  const COLUMN = defineLayoutPreset({ rows: [['a', 'main', 'b']] });

  it('lists the app preset as default and the registered ones, and applies each', () => {
    expect(widgets.presets()).toEqual([]);
    store().setPreset(TABBED);
    const forget = widgets.registerPresets({ sides: COLUMN });
    expect(widgets.presets()).toEqual(['default', 'sides']);
    widgets.applyPreset('sides');
    expect([entry('a').side, entry('b').side]).toEqual(['left', 'right']);
    widgets.applyPreset('default');
    expect([entry('a').side, entry('b').tab]).toEqual(['left', 1]);
    forget();
    expect(widgets.presets()).toEqual(['default']);
  });

  it('rejects an unknown preset and a registration over default', () => {
    expect(() => widgets.applyPreset('nope')).toThrow(/Unknown layout preset "nope"/);
    expect(() => widgets.registerPresets({ default: COLUMN })).toThrow(/default/);
  });
});

describe('widgets.subscribe', () => {
  it('sends a fresh snapshot when the layout changes, and stops after unsubscribe', () => {
    const listener = vi.fn();
    const stop = widgets.subscribe(listener);
    widgets.dock('a', { side: 'left' });
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]?.[0] as WidgetSnapshot[]).find((each) => each.id === 'a')).toMatchObject({ side: 'left' });
    widgets.focus('a');
    expect(listener).toHaveBeenCalledTimes(1);
    stop();
    widgets.close('a');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('also reports a context turning on', () => {
    const listener = vi.fn();
    const stop = widgets.subscribe(listener);
    useContextsStore.getState().set('session', { active: true });
    expect(listener).toHaveBeenCalledTimes(1);
    stop();
  });
});

describe('unknown ids', () => {
  it('are rejected by every call that takes one', () => {
    const calls = [
      () => widgets.dock('zzz', { side: 'left' }),
      () => widgets.float('zzz', { width: 10, height: 10 }),
      () => widgets.resize('zzz', 10),
      () => widgets.focus('zzz'),
    ];
    for (const call of calls) expect(call).toThrow(/Unknown widget "zzz"\. Known widgets: a, b, c, f, s\./);
  });
});
