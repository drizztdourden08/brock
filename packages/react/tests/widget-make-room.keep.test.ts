/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { MAIN_NODE, createDefaultLayout } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { defineWidget } from '../src/widgets/define-widget';
import { readKitViews } from '../src/widgets/kits/read-kit-views';
import { presetLayout } from '../src/widgets/preset-layout';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';

const LOGS = defineWidget({ id: 'logs', label: 'Logs', render: () => null });
const NOTES = defineWidget({ id: 'notes', label: 'Notes', render: () => null });

const panesOf = (node: LayoutNode): Extract<LayoutNode, { kind: 'pane' }>[] => {
  if (node.kind === 'pane') return [node];
  return node.kind === 'split' ? node.children.flatMap(panesOf) : [];
};

const savedBeforeMakeRoom = (overlay: 'notes' | null = null): unknown => ({
  ...createDefaultLayout(),
  dock: {
    kind: 'split', axis: 'row', sizes: [0.2, 0.6, 0.2], children: [
      { kind: 'pane', key: 'left', widgets: ['logs'], active: 'logs' },
      MAIN_NODE,
      { kind: 'pane', key: 'right', widgets: ['notes'], active: 'notes', ...(overlay === 'notes' ? { makeRoom: false } : {}) },
    ],
  },
});

const roomOf = (layout: WidgetLayout): Record<string, boolean | undefined> =>
  Object.fromEntries(panesOf(layout.dock).map((pane) => [pane.key, pane.makeRoom]));

describe('docked panes make room by default', () => {
  beforeEach(() => {
    useWidgetLayoutStore.getState().replace(null);
    useWidgetLayoutStore.getState().setDefinitions([LOGS, NOTES]);
  });

  it('loads a saved layout whose panes have no makeRoom with every pane making room', () => {
    useWidgetLayoutStore.getState().replace(savedBeforeMakeRoom());
    expect(roomOf(useWidgetLayoutStore.getState().layout)).toEqual({ left: true, right: true });
  });

  it('keeps a pane saved with makeRoom false as an overlay', () => {
    useWidgetLayoutStore.getState().replace(savedBeforeMakeRoom('notes'));
    expect(roomOf(useWidgetLayoutStore.getState().layout)).toEqual({ left: true, right: false });
  });

  it('loads a saved kit view the same way', () => {
    const views = readKitViews({ tools: { layout: savedBeforeMakeRoom(), hidden: [] } });
    expect(views.tools && roomOf(views.tools.layout)).toEqual({ left: true, right: true });
  });

  it('builds every pane of a layout preset making room', () => {
    const layout = presetLayout({ rows: [['logs', 'main', 'notes']] }, [LOGS, NOTES]);
    const panes = panesOf(layout.dock);
    expect(panes).toHaveLength(2);
    expect(panes.every((pane) => pane.makeRoom === true)).toBe(true);
  });
});
