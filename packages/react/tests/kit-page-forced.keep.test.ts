/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultLayout, isWidgetOpen, visibleLayoutOf } from '@drizztdourden08/tessera/composites';
import type { WidgetGates } from '@drizztdourden08/tessera/composites';
import { defineWidgetKit } from '../src/widgets/kits/define-widget-kit';
import { kitStatus } from '../src/widgets/kits/kit-status';
import { useWidgetKitStore } from '../src/widgets/kits/useWidgetKitStore';
import { defineWidget } from '../src/widgets/define-widget';
import { forcedWidgets } from '../src/widgets/forced-widgets';
import { useForcedWidgetStore } from '../src/widgets/useForcedWidgetStore';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgetPersistence } from '../src/widgets/widget-persistence';
import { widgets } from '../src/widgets/widgets';
import { useKitStage } from '../src/widgets/WidgetHost/behavior/useKitStage';
import { useWidgetGates } from '../src/widgets/WidgetHost/behavior/useWidgetGates';
import type { KitStage, StageProps } from '../src/widgets/WidgetHost/WidgetHost.type';
import type { WidgetDef } from '../src/widgets/widget.type';

vi.mock('../src/app/useDeveloperTools', () => ({ useDeveloperTools: () => false }));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const widget = (id: string, extra: Partial<WidgetDef> = {}) => defineWidget({ id, label: id, defaultSide: 'right', render: () => null, ...extra });

const PROBE = defineWidgetKit({ id: 'probe', label: 'Probe', overlays: [{ id: 'grid', label: 'Grid', render: () => null }] });
const BENCH = defineWidgetKit({ id: 'bench', label: 'Bench', devOnly: true, requires: { context: 'scene', reason: 'Open a scene.' } });
const MEMBERS = [widget('trace', { kit: 'probe', popOut: true }), widget('watch', { kit: 'probe', popOut: true, defaultVisibility: 'context-only' }), widget('meter', { kit: 'bench' })];
const NORMAL = [widget('notes'), widget('debugger', { devOnly: true })];

const noop = (): undefined => undefined;
const normalProps = (pageOpen: boolean): StageProps => ({
  definitions: NORMAL, layout: createDefaultLayout(), onLayoutChange: noop, contextActive: true, pageOpen, children: { notes: 'n', trace: 't', watch: 'w', meter: 'm' },
});

let root: Root | null = null;
const seen: { stage: KitStage | null; gates: WidgetGates<WidgetDef> | null } = { stage: null, gates: null };

const Stage = (props: { pageOpen: boolean }) => {
  seen.stage = useKitStage(normalProps(props.pageOpen), () => ({}));
  return null;
};

const Gates = () => {
  seen.gates = useWidgetGates(NORMAL, null);
  return null;
};

const draw = (element: ReturnType<typeof createElement>): void => {
  if (!root) {
    document.body.innerHTML = '<div id="host"></div>';
    root = createRoot(document.getElementById('host') as HTMLElement);
  }
  act(() => root?.render(element));
};

const stage = (): KitStage => {
  if (!seen.stage) throw new Error('the stage never drew');
  return seen.stage;
};

beforeEach(() => {
  useWidgetKitStore.setState({ kits: [], members: [], active: null, views: {} });
  useWidgetKitStore.getState().setKits([PROBE, BENCH], MEMBERS);
  useWidgetLayoutStore.setState({ definitions: NORMAL, layout: createDefaultLayout(), externalDrag: null });
  useForcedWidgetStore.setState({ ids: [], pending: [] });
});

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  seen.stage = null;
  seen.gates = null;
});

describe('a page over an open kit', () => {
  it('hides the kit layer and its widgets while a page is open, keeps the kit open, and brings it back as it was', () => {
    widgets.open('trace');
    widgets.popOut('trace');
    widgets.open('watch');
    widgets.popOut('watch');
    draw(createElement(Stage, { pageOpen: false }));
    const before = stage().props.layout;
    expect(stage().layer).not.toBeNull();
    expect(Object.keys(stage().props.children).sort()).toEqual(['trace', 'watch']);
    expect(stage().popped.map((p) => p.id).sort()).toEqual(['trace', 'watch']);

    draw(createElement(Stage, { pageOpen: true }));
    expect(useWidgetKitStore.getState().active).toBe('probe');
    expect(stage().layer).toBeNull();
    expect(stage().props.pageOpen).toBe(true);
    expect(Object.keys(stage().props.children)).toEqual([]);
    expect(stage().popped.map((p) => p.id)).toEqual(['trace']);
    expect(stage().props.layout).toBe(before);

    draw(createElement(Stage, { pageOpen: false }));
    expect(stage().layer).not.toBeNull();
    expect(Object.keys(stage().props.children).sort()).toEqual(['trace', 'watch']);
    expect(stage().props.layout).toBe(before);
  });
});

describe('forced widgets', () => {
  it('opens a forced widget once its definition is known and lets it past the developer gate', () => {
    useWidgetLayoutStore.setState({ definitions: [] });
    widgets.force(['debugger']);
    expect(isWidgetOpen(useWidgetLayoutStore.getState().layout, 'debugger')).toBe(false);
    useWidgetLayoutStore.setState({ definitions: NORMAL });
    forcedWidgets.apply();
    const { layout } = useWidgetLayoutStore.getState();
    expect(isWidgetOpen(layout, 'debugger')).toBe(true);
    draw(createElement(Gates));
    const gates = seen.gates;
    if (!gates) throw new Error('no gates');
    expect(gates.forcedIds).toEqual(['debugger']);
    expect(isWidgetOpen(visibleLayoutOf(layout, gates), 'debugger')).toBe(true);
    expect(isWidgetOpen(visibleLayoutOf(layout, { ...gates, forcedIds: [] }), 'debugger')).toBe(false);
  });

  it('opens the kit of a forced kit widget past its developer and context gates, and again after a profile loads', async () => {
    expect(kitStatus(BENCH, {}, false, true)).toEqual({ shown: true, reason: null });
    widgets.force(['meter']);
    expect(useWidgetKitStore.getState().active).toBe('bench');
    draw(createElement(Stage, { pageOpen: false }));
    expect(useWidgetKitStore.getState().active).toBe('bench');
    expect(Object.keys(stage().props.children)).toEqual(['meter']);
    await widgetPersistence.load(null);
    expect(useWidgetKitStore.getState().active).toBe('bench');
  });
});
