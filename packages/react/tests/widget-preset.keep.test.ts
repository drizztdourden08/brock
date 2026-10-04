/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isWidgetOpen, placementOf, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { LayoutNode } from '@drizztdourden08/tessera/composites';
import { buildWidgetMenuEntries } from '../src/widgets/build-widget-menu-entries';
import { resetLayoutEntry } from '../src/widgets/reset-layout-entry';
import { defineLayoutPreset } from '../src/widgets/define-layout-preset';
import { defineWidget } from '../src/widgets/define-widget';
import { presetLayout } from '../src/widgets/preset-layout';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgets } from '../src/widgets/widgets';

const session = (id: string) => defineWidget({ id, label: id, render: () => null, defaultVisibility: 'context-only', popOut: true });
const SESSION = ['players', 'hints', 'room', 'log', 'console', 'spoiler'].map(session);
const NOTES = defineWidget({ id: 'notes', label: 'Notes', render: () => null, defaultSide: 'right', defaultOpen: true });
const DEFINITIONS = [...SESSION, NOTES];

const ARCHIPELIA = defineLayoutPreset({
  rows: [['players', 'hints', 'room'], ['main'], ['log', 'console']],
  sizes: [0.34, 0.32, 0.34],
});

const shape = (node: LayoutNode): unknown => {
  if (node.kind === 'main') return 'main';
  if (node.kind === 'pane') return node.widgets;
  return { [node.axis]: node.children.map(shape), sizes: node.sizes.map((size) => Math.round(size * 100) / 100) };
};

const store = () => useWidgetLayoutStore.getState();

describe('presetLayout', () => {
  it('builds Archipelia three rows around the main view', () => {
    const layout = presetLayout(ARCHIPELIA, SESSION);
    expect(shape(layout.dock)).toEqual({
      column: [
        { row: [['players'], ['hints'], ['room']], sizes: [0.33, 0.33, 0.33] },
        'main',
        { row: [['log'], ['console']], sizes: [0.5, 0.5] },
      ],
      sizes: [0.34, 0.32, 0.34],
    });
    expect(isWidgetOpen(layout, 'spoiler')).toBe(false);
    expect(layout.floating).toEqual([]);
    expect(layout.popped).toEqual([]);
  });

  it('tabs a cell of several ids into one pane and honours the widths of a row', () => {
    const preset = defineLayoutPreset({ rows: [['main', ['log', 'console']]], widths: [[3, 1]] });
    expect(shape(presetLayout(preset, SESSION).dock)).toEqual({ row: ['main', ['log', 'console']], sizes: [0.75, 0.25] });
  });

  it('drops unknown and repeated ids and adds the main view when no row names it', () => {
    const preset = defineLayoutPreset({ rows: [['players', 'ghost', 'players'], ['nobody']] });
    expect(shape(presetLayout(preset, SESSION).dock)).toEqual({ column: [['players'], 'main'], sizes: [0.5, 0.5] });
  });

  it('opens a defaultOpen widget the preset does not place on its default side', () => {
    const layout = presetLayout(ARCHIPELIA, DEFINITIONS);
    expect(placementOf(layout, 'notes')).toBe('docked');
    expect(widgetsIn(layout.dock)).toContain('notes');
    expect(placementOf(presetLayout(null, DEFINITIONS), 'notes')).toBe('docked');
  });
});

describe('the layout store with a preset', () => {
  beforeEach(() => {
    store().setPreset(null);
    store().setDefinitions(DEFINITIONS);
    store().replace(null);
  });

  it('applies the preset to a profile with no saved layout and keeps a saved one', () => {
    store().setPreset(ARCHIPELIA);
    store().replace(undefined);
    expect(widgetsIn(store().layout.dock)).toEqual(['players', 'hints', 'room', 'log', 'console', 'notes']);
    const saved = presetLayout(null, SESSION);
    store().replace(saved);
    expect(store().layout).toBe(saved);
  });

  it('resets every placement to the preset, closing floating and popped widgets', () => {
    store().setPreset(ARCHIPELIA);
    store().replace(undefined);
    widgets.close('players');
    widgets.popOut('spoiler');
    expect(placementOf(store().layout, 'spoiler')).toBe('popped');
    widgets.reset();
    expect(store().layout.popped).toEqual([]);
    expect(placementOf(store().layout, 'players')).toBe('docked');
    expect(isWidgetOpen(store().layout, 'spoiler')).toBe(false);
  });

  it('resets to the defaultOpen widgets alone when the app has no preset', () => {
    widgets.open('log');
    widgets.reset();
    expect(widgetsIn(store().layout.dock)).toEqual(['notes']);
  });
});

describe('the Reset layout menu entry', () => {
  it('is a plain entry that resets the layout, kept apart from the widget toggles', () => {
    const reset = vi.fn();
    const entry = resetLayoutEntry(reset);
    expect(entry).toMatchObject({ label: 'Reset layout', icon: 'rotate-ccw' });
    expect(entry.checked).toBeUndefined();
    entry.onClick?.();
    expect(reset).toHaveBeenCalledTimes(1);
    expect(buildWidgetMenuEntries([NOTES], presetLayout(null, []), () => undefined, false).map((item) => item.label)).toEqual(['Notes']);
  });
});
