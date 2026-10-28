/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createToolbarLayout, isToolbarShown, isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { INITIAL_CONTEXTS } from '../src/contexts/contexts.constants';
import { useContextsStore } from '../src/contexts/useContextsStore';
import { useShowFlagsStore } from '../src/screens/show/useShowFlagsStore';
import type { ShowContext } from '../src/screens/show/show.type';
import { defineToolbar } from '../src/toolbars/define-toolbar';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';
import { WidgetFace } from '../src/widgets/WidgetFace';
import { defineWidget } from '../src/widgets/define-widget';
import { forcedWidgets } from '../src/widgets/forced-widgets';
import { forgetFocusMode } from '../src/widgets/forget-focus-mode';
import { layout } from '../src/widgets/layout-facade';
import { useForcedWidgetStore } from '../src/widgets/useForcedWidgetStore';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { useWidgetTitleStore } from '../src/widgets/useWidgetTitleStore';
import { widgetAvailable } from '../src/widgets/widget-available';
import { widgetPrefSection } from '../src/widgets/widget-pref-section';
import { widgetPrefSource } from '../src/widgets/widget-pref-source';
import { widgetSettingsTabs } from '../src/widgets/widget-settings-tabs';
import { widgetMainRect } from '../src/widgets/widget-main-rect';
import { widgets } from '../src/widgets/widgets';
import { useWidgetPrefStore } from '../src/stores/useWidgetPrefStore';
import { showHarness } from './show-harness';

const make = (id: string, extra: Partial<Parameters<typeof defineWidget>[0]> = {}) => defineWidget({ id, label: id.toUpperCase(), render: () => null, ...extra });
const mode = (name: string) => ({ when: ({ flags }: ShowContext): boolean => flags.mode === name });
const setMode = (name: string | null): void => {
  act(() => useShowFlagsStore.getState().put('test', name === null ? {} : { mode: name }));
};

const SHEET = make('sheet', { when: mode('sheet') });
const MULTI = make('multi', { contexts: ['surface', 'map'] });
const BOTH = make('both', { contexts: ['surface'], when: mode('sheet') });
const PLAIN = make('plain');
const PREFS = make('layers', {
  prefs: [{ key: 'thumb', label: 'Thumbnail size', description: 'Size of the layer thumbnails.', control: { kind: 'choice', options: [{ value: 's', label: 'S' }, { value: 'l', label: 'L' }] }, default: 's' }],
});
const EMPTY = make('tiles', { context: 'tiles', empty: () => createElement('p', null, 'Open a tileset'), render: () => createElement('p', null, 'Tiles') });
const DEFINITIONS = [SHEET, MULTI, BOTH, PLAIN, PREFS, EMPTY];
const store = () => useWidgetLayoutStore.getState();
const availableIn = (snapshot: readonly { id: string; available: boolean }[], id: string): boolean => snapshot.find((each) => each.id === id)?.available ?? false;
const faced = () => createElement(PlatformProvider, null, createElement(WidgetFace, { def: EMPTY }));

beforeEach(() => {
  widgetMainRect.current = { x: 0, y: 0, width: 1000, height: 600 };
  store().setPreset(null);
  store().replace(null);
  store().setDefinitions(DEFINITIONS);
  useContextsStore.setState({ contexts: INITIAL_CONTEXTS });
  useWidgetTitleStore.setState({ titles: {} });
  useWidgetPrefStore.setState({ byWidget: {} });
  useForcedWidgetStore.setState({ ids: [], pending: [] });
  forgetFocusMode();
});

afterEach(() => {
  widgetMainRect.current = null;
  showHarness.resetShow();
});

describe('W1 widget when and contexts', () => {
  it('makes a widget with a rule, a context list or both context-only by default', () => {
    for (const def of [SHEET, MULTI, BOTH]) expect(def.defaultVisibility).toBe('context-only');
    expect(PLAIN.defaultVisibility).toBe('always');
  });

  it('follows the rule as the show flags change', () => {
    expect(widgetAvailable(SHEET, INITIAL_CONTEXTS, null)).toBe(false);
    setMode('sheet');
    expect(widgetAvailable(SHEET, INITIAL_CONTEXTS, null)).toBe(true);
    setMode(null);
    expect(widgetAvailable(SHEET, INITIAL_CONTEXTS, null)).toBe(false);
  });

  it('is available when any listed context is active, and keeps the single context', () => {
    expect(widgetAvailable(MULTI, INITIAL_CONTEXTS, null)).toBe(false);
    expect(widgetAvailable(MULTI, { map: { active: true } }, null)).toBe(true);
    expect(widgetAvailable(MULTI, { surface: { active: true } }, null)).toBe(true);
    expect(widgetAvailable(EMPTY, { tiles: { active: true } }, null)).toBe(true);
    expect(widgetAvailable(PLAIN, INITIAL_CONTEXTS, null)).toBe(true);
  });

  it('needs both the context and the rule when both are given', () => {
    const surface = { surface: { active: true } };
    expect(widgetAvailable(BOTH, surface, null)).toBe(false);
    setMode('sheet');
    expect(widgetAvailable(BOTH, surface, null)).toBe(true);
    expect(widgetAvailable(BOTH, INITIAL_CONTEXTS, null)).toBe(false);
  });

  it('reports the rule in widgets.list available', () => {
    const entry = () => widgets.list().find((each) => each.id === 'sheet');
    expect(entry()?.available).toBe(false);
    setMode('sheet');
    expect(entry()?.available).toBe(true);
  });

  it('notifies a subscriber when a rule flips', () => {
    const seen: boolean[] = [];
    const stop = widgets.subscribe((snapshot) => seen.push(availableIn(snapshot, 'sheet')));
    setMode('sheet');
    stop();
    expect(seen).toEqual([true]);
  });
});

describe('W2 widgets.setTitle and the empty state', () => {
  it('sets, reads back and clears a dynamic title', () => {
    widgets.setTitle('plain', 'Plain (3)');
    expect(widgets.list().find((each) => each.id === 'plain')?.label).toBe('Plain (3)');
    widgets.setTitle('plain', null);
    expect(widgets.list().find((each) => each.id === 'plain')?.label).toBe('PLAIN');
  });

  it('throws for an unknown id and ignores a blank title', () => {
    expect(() => widgets.setTitle('nope', 'x')).toThrow(/Unknown widget "nope"/);
    widgets.setTitle('plain', '   ');
    expect(useWidgetTitleStore.getState().titles).toEqual({});
  });

  it('draws the empty state while a forced widget has no context, and the body once it has', () => {
    const host = showHarness.render(faced());
    expect(host.textContent).toBe('Tiles');
    forcedWidgets.force(['tiles']);
    act(() => useForcedWidgetStore.setState({ ids: ['tiles'] }));
    expect(showHarness.render(faced()).textContent).toBe('Open a tileset');
    act(() => useContextsStore.getState().set('tiles', { active: true }));
    expect(showHarness.render(faced()).textContent).toBe('Tiles');
  });
});

describe('W8 widget scoped settings', () => {
  it('reads the default, then the stored value, and writes through the widget prefs', () => {
    const source = widgetPrefSource(PREFS);
    expect(source.get('thumb')).toBe('s');
    void source.set('thumb', 'l');
    expect(useWidgetPrefStore.getState().byWidget.layers).toEqual({ thumb: 'l' });
    expect(source.get('thumb')).toBe('l');
  });

  it('tells a subscriber about a change to its own widget only', () => {
    const source = widgetPrefSource(PREFS);
    let calls = 0;
    const stop = source.subscribe?.(() => {
      calls += 1;
    });
    useWidgetPrefStore.getState().setPref('other', 'x', 1);
    useWidgetPrefStore.getState().setPref('layers', 'thumb', 'l');
    stop?.();
    expect(calls).toBe(1);
  });

  it('builds one Settings section per widget with settings and no tab without any', () => {
    expect(widgetPrefSection(PLAIN)).toBeNull();
    const section = widgetPrefSection(PREFS);
    expect(section).toMatchObject({ id: 'widget-layers', title: 'LAYERS' });
    expect(section?.items?.[0]).toMatchObject({ key: 'thumb', label: 'Thumbnail size' });
    expect(section?.items?.[0]).not.toHaveProperty('default');
    expect(widgetSettingsTabs([PLAIN])).toEqual([]);
    const [tab] = widgetSettingsTabs(DEFINITIONS);
    expect(tab?.sections?.({}).map((each) => each.id)).toEqual(['widget-layers']);
  });
});

describe('W7 layout.focusMode', () => {
  const BARS = [defineToolbar({ id: 'tools', label: 'Tools', defaultSide: 'left', render: () => null })];

  beforeEach(() => {
    useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
    useToolbarLayoutStore.getState().setDefinitions(BARS);
  });

  it('hides every widget and toolbar, and restores both exactly', () => {
    widgets.dock('plain', { side: 'right', size: 300 });
    const before = store().layout;
    const barsBefore = useToolbarLayoutStore.getState().layout;
    expect(layout.focusMode(true)).toBe(true);
    expect(isWidgetOpen(store().layout, 'plain')).toBe(false);
    expect(isToolbarShown(useToolbarLayoutStore.getState().layout, 'tools')).toBe(false);
    expect(layout.isFocusMode()).toBe(true);
    expect(layout.focusMode(false)).toBe(false);
    expect(store().layout).toBe(before);
    expect(useToolbarLayoutStore.getState().layout).toBe(barsBefore);
  });

  it('is idempotent and toggles with no argument', () => {
    layout.focusMode(true);
    layout.focusMode(true);
    layout.focusMode(false);
    expect(layout.isFocusMode()).toBe(false);
    expect(layout.focusMode()).toBe(true);
    expect(layout.focusMode()).toBe(false);
  });

  it('reports each change to a subscriber', () => {
    const seen: boolean[] = [];
    const stop = layout.subscribeFocusMode((on) => seen.push(on));
    layout.focusMode(true);
    layout.focusMode(false);
    stop();
    expect(seen).toEqual([true, false]);
  });
});
