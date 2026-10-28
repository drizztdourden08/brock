/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { MAIN_NODE, createDefaultLayout, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { LayoutNode } from '@drizztdourden08/tessera/composites';
import { defineLayoutPreset } from '../src/widgets/define-layout-preset';
import { defineWidget } from '../src/widgets/define-widget';
import { presetLayout } from '../src/widgets/preset-layout';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgets } from '../src/widgets/widgets';

const side = (id: string, order?: number, defaultSide: 'left' | 'right' = 'right') =>
  defineWidget({ id, label: id, render: () => null, defaultSide, ...(order === undefined ? {} : { order }) });

const PROJECT = side('project', 1);
const VIEW = side('view', 2);
const NOTES = side('notes');
const LOGS = side('logs');
const MID = side('mid', 1.5);
const DEFINITIONS = [PROJECT, VIEW, NOTES, LOGS, MID];

const store = () => useWidgetLayoutStore.getState();

const stackOf = (node: LayoutNode): string[] => {
  if (node.kind !== 'split') return [];
  const last = node.children.at(-1);
  if (node.axis === 'row' && last?.kind === 'pane') return [last.widgets[0] ?? ''];
  if (node.axis === 'row' && last?.kind === 'split') return last.children.flatMap((child) => (child.kind === 'pane' ? child.widgets : []));
  return node.children.flatMap(stackOf);
};

describe('widget order in a dock column', () => {
  beforeEach(() => {
    store().setDefinitions(DEFINITIONS);
    store().replace(null);
  });

  it('puts View under Project even when View opens first', () => {
    widgets.open('view');
    widgets.open('project');
    expect(stackOf(store().layout.dock)).toEqual(['project', 'view']);
  });

  it('slots a widget between two that are already there', () => {
    widgets.open('view');
    widgets.open('project');
    widgets.open('mid');
    expect(stackOf(store().layout.dock)).toEqual(['project', 'mid', 'view']);
  });

  it('keeps open order when no widget has an order', () => {
    widgets.open('notes');
    widgets.open('logs');
    expect(stackOf(store().layout.dock)).toEqual(['notes', 'logs']);
  });

  it('puts ordered widgets before the ones without an order, which keep open order', () => {
    widgets.open('notes');
    widgets.open('logs');
    widgets.open('view');
    expect(stackOf(store().layout.dock)).toEqual(['view', 'notes', 'logs']);
    widgets.open('project');
    expect(stackOf(store().layout.dock)).toEqual(['project', 'view', 'notes', 'logs']);
  });

  it('leaves the column a user arranged alone and only places the new widget', () => {
    store().replace({
      ...createDefaultLayout(),
      dock: {
        kind: 'split', axis: 'row', sizes: [0.7, 0.3], children: [
          MAIN_NODE,
          {
            kind: 'split', axis: 'column', sizes: [0.5, 0.5], children: [
              { kind: 'pane', key: 'a', widgets: ['view'], active: 'view' },
              { kind: 'pane', key: 'b', widgets: ['project'], active: 'project' },
            ],
          },
        ],
      },
    });
    widgets.open('notes');
    expect(stackOf(store().layout.dock)).toEqual(['view', 'project', 'notes']);
    widgets.open('mid');
    expect(stackOf(store().layout.dock)).toEqual(['view', 'project', 'mid', 'notes']);
  });

  it('orders default-open widgets a preset does not place', () => {
    const open = [defineWidget({ ...VIEW, defaultOpen: true }), defineWidget({ ...PROJECT, defaultOpen: true })];
    const layout = presetLayout(defineLayoutPreset({ rows: [['main']] }), open);
    expect(stackOf(layout.dock)).toEqual(['project', 'view']);
    expect(widgetsIn(layout.dock)).toContain('view');
  });

  it('keeps the order of a preset that lists the widgets', () => {
    const layout = presetLayout(defineLayoutPreset({ rows: [['main', { column: ['view', 'project'] }]] }), [PROJECT, VIEW]);
    expect(stackOf(layout.dock)).toEqual(['view', 'project']);
  });
});
