/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { defineTour } from '../src/tours/define-tour';
import { tours } from '../src/tours/tours';
import { useTourStore } from '../src/tours/useTourStore';
import { useWidgetRelayStore } from '../src/widgets/useWidgetRelayStore';
import { RELAY_SLICES } from '../src/widgets/widget.constants';
import { WidgetTourSpot } from '../src/widgets/WidgetWindow/sub-components/WidgetTourSpot';
import { tourHarness } from './tour-host-harness';

const { flush, mount, renderInto, popWidget, stepShown } = tourHarness;

const TOUR = defineTour({
  id: 'host',
  title: 'Host',
  steps: [
    { id: 'one', title: 'One', body: 'First.' },
    { id: 'two', title: 'Two', body: 'Second.', target: { tour: 'two' }, advanceOn: { event: 'went' } },
  ],
});

const POPPED = defineTour({ id: 'popped', title: 'Popped', steps: [{ id: 'notes', title: 'Notes', body: 'In its window.', target: { widget: 'notes' } }] });

afterEach(tourHarness.cleanUp);

describe('TourHost', () => {
  it('draws the open step with Tessera, keeps the title bar live, records the shown step and goes on after a tour event', async () => {
    mount([TOUR]);
    act(() => { tours.start('host'); });
    await flush();
    expect(stepShown()).toBe('one');
    expect(useTourStore.getState().shown).toEqual({ id: 'host', index: 0, step: 'one', target: null });
    const bar = document.querySelector('.window-title-bar') as HTMLElement;
    expect(bar.closest('[inert]')).toBeNull();
    expect((document.querySelector('.rest') as HTMLElement).inert).toBe(true);
    act(() => tours.next());
    await flush();
    expect(stepShown()).toBe('two');
    expect(useTourStore.getState().shown?.target).toBe(document.querySelector('[data-tour="two"]'));
    act(() => tours.emit('went'));
    await flush();
    expect(document.querySelector('.guided-tour')).toBeNull();
    expect(useTourStore.getState().shown).toBeNull();
    expect(tours.isCompleted('host')).toBe(true);
    expect(bar.closest('[inert]')).toBeNull();
  });

  it('names the spot for a widget window when the lit widget is popped, and clears it when the tour closes', async () => {
    popWidget('notes');
    mount([POPPED]);
    act(() => { tours.start('popped'); });
    await flush();
    expect(useTourStore.getState().spot).toEqual({ widget: 'notes', selector: '[data-widget-id="notes"] .widget__content' });
    act(() => tours.stop());
    await flush();
    expect(useTourStore.getState().spot).toBeNull();
  });
});

describe('WidgetTourSpot', () => {
  it('draws the tour spot in the widget window the main window names, and nothing elsewhere', async () => {
    document.body.innerHTML = '<div id="host"></div><div data-widget-id="notes"><textarea></textarea></div>';
    renderInto('host', createElement(WidgetTourSpot, { id: 'notes' }));
    expect(document.querySelector('.tour-spot')).toBeNull();
    act(() => useWidgetRelayStore.getState().receive(RELAY_SLICES.tourSpot, { widget: 'logs', selector: '[data-widget-id="logs"]' }));
    expect(document.querySelector('.tour-spot')).toBeNull();
    act(() => useWidgetRelayStore.getState().receive(RELAY_SLICES.tourSpot, { widget: 'notes', selector: '[data-widget-id="notes"] textarea' }));
    await flush();
    expect(document.querySelector('.tour-spot')?.getAttribute('data-lit')).toBe('true');
    act(() => useWidgetRelayStore.getState().receive(RELAY_SLICES.tourSpot, null));
    expect(document.querySelector('.tour-spot')).toBeNull();
  });
});
