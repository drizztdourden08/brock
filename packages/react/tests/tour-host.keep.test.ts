/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { defineTour } from '../src/tours/define-tour';
import { TourHost } from '../src/tours/TourHost';
import { tours } from '../src/tours/tours';
import { EMPTY_PROGRESS, NO_TOURS } from '../src/tours/tours.constants';
import { useTourStore } from '../src/tours/useTourStore';

const TOUR = defineTour({
  id: 'host',
  title: 'Host',
  steps: [
    { id: 'one', title: 'One', body: 'First.' },
    { id: 'two', title: 'Two', body: 'Second.', target: { tour: 'two' }, advanceOn: { event: 'went' } },
  ],
});

let root: Root | null = null;

const flush = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => { setTimeout(resolve, 50); });
  });
};

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  useTourStore.setState({ tours: NO_TOURS, active: null, progress: EMPTY_PROGRESS, progressFor: null });
  document.body.replaceChildren();
  document.documentElement.classList.remove('brock-touring');
});

describe('TourHost', () => {
  it('draws the open step with Tessera, marks the document while touring and advances on a tour event', async () => {
    document.body.innerHTML = '<div id="app"><div data-tour="two">Two</div></div>';
    root = createRoot(document.getElementById('app') as HTMLElement);
    act(() => root?.render(createElement(TourHost, { ready: false })));
    useTourStore.getState().setTours([TOUR]);
    act(() => { tours.start('host'); });
    await flush();
    expect(document.querySelector('.guided-tour')?.getAttribute('data-step')).toBe('one');
    expect(document.documentElement.classList.contains('brock-touring')).toBe(true);
    act(() => tours.next());
    await flush();
    expect(document.querySelector('.guided-tour')?.getAttribute('data-step')).toBe('two');
    act(() => tours.emit('went'));
    await flush();
    expect(document.querySelector('.guided-tour')).toBeNull();
    expect(tours.isCompleted('host')).toBe(true);
    expect(document.documentElement.classList.contains('brock-touring')).toBe(false);
  });
});
