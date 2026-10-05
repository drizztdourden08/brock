/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { defineTour } from '../src/tours/define-tour';
import { tours } from '../src/tours/tours';
import type { TourDef } from '../src/tours/tour.type';
import { useTourStore } from '../src/tours/useTourStore';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { useWidgetRelayStore } from '../src/widgets/useWidgetRelayStore';
import { RELAY_SLICES } from '../src/widgets/widget.constants';
import { useWidgetTourClick } from '../src/widgets/WidgetWindow/behavior/useWidgetTourClick';
import { tourHarness } from './tour-host-harness';

const { flush, mount, renderInto, unmount, popWidget, clickOn, stepShown } = tourHarness;

const CLICK = defineTour({
  id: 'click',
  title: 'Click',
  steps: [
    { id: 'notes', title: 'Notes', body: 'Click it.', target: { widget: 'notes' }, advanceOn: { click: { widget: 'notes' } }, hint: 'Click the notes' },
    { id: 'after', title: 'After', body: 'Moved on.' },
  ],
});

const LIT_IN_MAIN = defineTour({
  id: 'lit',
  title: 'Lit',
  steps: [
    { id: 'notes', title: 'Notes', body: 'Click the notes window.', target: { tour: 'two' }, advanceOn: { click: { widget: 'notes' } } },
    { id: 'after', title: 'After', body: 'Moved on.' },
  ],
});

const WIDGET = '<div id="widget-window"></div><div data-widget-id="notes"><div class="widget__content"><button class="add">Add</button></div></div>';

const fakeRelay = () => {
  const listeners = new Set<(step: string) => void>();
  const advanced: string[] = [];
  const api = {
    publishWidgetSlice: () => undefined,
    onWidgetSnapshotRequest: () => () => undefined,
    onWidgetTourAdvance: (fn: (step: string) => void) => {
      listeners.add(fn);
      return () => { listeners.delete(fn); };
    },
    advanceWidgetTour: (step: string) => {
      advanced.push(step);
      for (const fn of listeners) fn(step);
    },
  };
  Object.assign(window, { api });
  return { api, advanced, listeners };
};

const WidgetClick = () => {
  useWidgetTourClick('notes');
  return null;
};

const mountPoppedClick = (list: readonly TourDef[] = [CLICK]) => {
  popWidget('notes');
  const root = mount(list);
  document.body.insertAdjacentHTML('beforeend', WIDGET);
  renderInto('widget-window', createElement(WidgetClick));
  return root;
};

afterEach(tourHarness.cleanUp);

describe('a click step on a popped widget', () => {
  it('hides Next, keeps the hint, and goes on when the widget window relays a click on the target', async () => {
    const relay = fakeRelay();
    mountPoppedClick();
    act(() => { tours.start('click'); });
    await flush();
    expect(stepShown()).toBe('notes');
    expect(document.querySelector('.guided-tour__hint')?.textContent).toContain('Click the notes');
    expect(document.querySelector('.guided-tour__actions .btn--primary')).toBeNull();
    expect(useTourStore.getState().clickRelay).toEqual({ widget: 'notes', selector: '[data-widget-id="notes"]', step: 'click:0' });
    clickOn('.rest');
    expect(relay.advanced).toEqual([]);
    clickOn('.add');
    await flush();
    expect(relay.advanced).toEqual(['click:0']);
    expect(stepShown()).toBe('after');
    expect(useTourStore.getState().clickRelay).toBeNull();
    clickOn('.add');
    act(() => relay.api.advanceWidgetTour('click:0'));
    await flush();
    expect(relay.advanced).toHaveLength(2);
    expect(stepShown()).toBe('after');
  });

  it('waits on the relay alone, so a click on the lit part in the main window does not go on', async () => {
    const relay = fakeRelay();
    mountPoppedClick([LIT_IN_MAIN]);
    act(() => { tours.start('lit'); });
    await flush();
    expect(useTourStore.getState().shown?.target).toBe(document.querySelector('[data-tour="two"]'));
    expect(document.querySelector('.guided-tour__hint')?.textContent).toContain('Click the highlighted part');
    clickOn('[data-tour="two"]');
    await flush();
    expect(stepShown()).toBe('notes');
    clickOn('.add');
    await flush();
    expect(relay.advanced).toEqual(['lit:0']);
    expect(stepShown()).toBe('after');
  });

});

describe('the popped widget click relay', () => {
  it('drops the relay and the widget window listener when the widget docks back or the tour closes', async () => {
    const relay = fakeRelay();
    const root = mountPoppedClick();
    act(() => { tours.start('click'); });
    await flush();
    expect(useTourStore.getState().clickRelay?.step).toBe('click:0');
    act(() => tours.stop());
    await flush();
    expect(useTourStore.getState().clickRelay).toBeNull();
    clickOn('.add');
    expect(relay.advanced).toEqual([]);
    act(() => { tours.start('click', 0); });
    await flush();
    expect(useTourStore.getState().clickRelay?.step).toBe('click:0');
    const { layout } = useWidgetLayoutStore.getState();
    act(() => useWidgetLayoutStore.setState({ layout: { ...layout, popped: [] } }));
    await flush();
    expect(useTourStore.getState().clickRelay).toBeNull();
    expect(useWidgetRelayStore.getState().slices[RELAY_SLICES.tourClick]).toBeNull();
    act(() => tours.stop());
    await flush();
    unmount(root);
    expect(relay.listeners.size).toBe(0);
  });
});
