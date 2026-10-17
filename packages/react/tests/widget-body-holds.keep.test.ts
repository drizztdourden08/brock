/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultLayout } from '@drizztdourden08/tessera/composites';
import { lazyComponent } from '../src/lazy/lazy-component';
import { bodyHolds } from '../src/screenshot/body-holds';
import { defineWidget } from '../src/widgets/define-widget';
import { defineWidgetKit } from '../src/widgets/kits/define-widget-kit';
import { useWidgetKitStore } from '../src/widgets/kits/useWidgetKitStore';
import { KitOverlay } from '../src/widgets/KitLayer/sub-components/KitOverlay';
import { useForcedWidgetStore } from '../src/widgets/useForcedWidgetStore';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { WidgetBody } from '../src/widgets/WidgetBody';
import { widgets } from '../src/widgets/widgets';
import { frameHarness } from './frame-harness';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const sent: number[] = [];
let root: Root | null = null;

const widget = (id: string, kit?: string) => defineWidget({ id, label: id, defaultSide: 'right', render: () => null, ...(kit ? { kit } : {}) });
const GRID = { id: 'grid', label: 'Grid', render: () => null };
const PROBE = defineWidgetKit({ id: 'probe', label: 'Probe', overlays: [GRID] });

const { microtasks, runFrames } = frameHarness;

const draw = async (element: ReactElement): Promise<void> => {
  if (!root) {
    document.body.innerHTML = '<div id="host"></div>';
    root = createRoot(document.getElementById('host') as HTMLElement);
  }
  await act(async () => {
    root?.render(element);
    await microtasks();
  });
};

const captured = (): boolean => sent.at(-1) === 0;
const held = (): boolean => (sent.at(-1) ?? 0) > 0;

beforeEach(() => {
  sent.length = 0;
  Object.assign(window, { api: { captureHolds: (count: number) => { sent.push(count); } } });
  frameHarness.stubFrames();
  useWidgetKitStore.setState({ kits: [], members: [], active: null, views: {} });
  useWidgetKitStore.getState().setKits([PROBE], [widget('trace', 'probe')]);
  useWidgetLayoutStore.setState({ definitions: [widget('notes')], layout: createDefaultLayout(), externalDrag: null });
  useForcedWidgetStore.setState({ ids: [], pending: [] });
});

afterEach(async () => {
  act(() => root?.unmount());
  root = null;
  await runFrames(70);
  expect(bodyHolds.pending()).toBe(0);
  vi.unstubAllGlobals();
});

describe('a widget opened just before a capture', () => {
  it('holds the capture from widgets.force until its body has mounted, loaded and painted', async () => {
    let finish: () => void = () => undefined;
    const Body = lazyComponent(() => new Promise<{ default: () => ReactElement }>((resolve) => {
      finish = () => resolve({ default: () => createElement('p', { id: 'drawn' }, 'drawn') });
    }));
    widgets.force(['notes']);
    expect(sent).toEqual([1]);
    await runFrames(10);
    expect(held()).toBe(true);
    await draw(createElement(WidgetBody, { id: 'notes', label: 'Notes' }, createElement(Body)));
    expect(document.querySelector('[data-brock-loading]')).not.toBeNull();
    expect(bodyHolds.pending()).toBe(0);
    await runFrames(10);
    expect(held()).toBe(true);
    await act(async () => { finish(); await microtasks(); });
    expect(document.getElementById('drawn')).not.toBeNull();
    expect(held()).toBe(true);
    await runFrames(8);
    expect(captured()).toBe(true);
    widgets.force([]);
  });

  it('a forced kit widget holds for its body and for its kit overlay until both are drawn', async () => {
    widgets.force(['trace']);
    expect(useWidgetKitStore.getState().active).toBe('probe');
    expect(bodyHolds.pending()).toBe(2);
    await runFrames(5);
    await draw(createElement(WidgetBody, { id: 'trace', label: 'Trace' }, 'trace'));
    expect(bodyHolds.pending()).toBe(1);
    await runFrames(5);
    expect(held()).toBe(true);
    await draw(createElement('div', null, createElement(WidgetBody, { id: 'trace', label: 'Trace' }, 'trace'), createElement(KitOverlay, { overlay: GRID })));
    expect(bodyHolds.pending()).toBe(0);
    await runFrames(3);
    expect(captured()).toBe(true);
    widgets.force([]);
  });

  it('takes no hold for a widget whose body is already drawn', async () => {
    await draw(createElement(WidgetBody, { id: 'notes', label: 'Notes' }, 'notes'));
    widgets.open('notes');
    expect(sent).toEqual([]);
  });

  it('lets go on the next frames when the widget did not open', async () => {
    widgets.open('missing');
    expect(sent).toEqual([1]);
    await runFrames(3);
    expect(captured()).toBe(true);
  });

  it('stops holding after its frame budget when the widget is open but its body never mounts, such as a tab behind another', async () => {
    widgets.open('notes');
    await runFrames(55);
    expect(held()).toBe(true);
    await runFrames(10);
    expect(captured()).toBe(true);
  });
});
