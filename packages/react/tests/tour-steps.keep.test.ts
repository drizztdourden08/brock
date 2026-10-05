/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contexts } from '../src/contexts/contexts';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { defineTour } from '../src/tours/define-tour';
import { toGuidedSteps } from '../src/tours/to-guided-steps';
import { tourTargets } from '../src/tours/resolve-tour-target';
import { tourMenu } from '../src/tours/tour-menu-entry';
import { touringHolds } from '../src/tours/touring-key';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { SESSIONS, WELCOME } from './tour-fixtures';

afterEach(() => {
  document.body.replaceChildren();
});

describe('toGuidedSteps', () => {
  it('lets Tessera wait for a click on the lit part, waits for the app on an event, and uses Next otherwise', () => {
    const steps = toGuidedSteps(WELCOME);
    expect(steps.map((step) => step.advance)).toEqual(['next', 'click', 'next']);
    expect(steps[1]?.clickTarget).toBeUndefined();
    expect(toGuidedSteps(SESSIONS)[0]?.advance).toBe('wait');
    expect(toGuidedSteps(SESSIONS)[1]?.target).toBeUndefined();
  });

  it('hands a click target apart from the lit part, the hint and a walking mascot to Tessera', () => {
    document.body.innerHTML = '<nav data-tour="menu"><button class="entry">Settings</button></nav>';
    const tour = defineTour({
      id: 'c',
      title: 'C',
      steps: [{ id: 'm', title: 'M', body: 'B', target: { tour: 'menu' }, advanceOn: { click: '.entry' }, hint: 'Pick Settings', mascot: { walk: 'move-wobble', arrive: 'wave' } }],
    });
    const [step] = toGuidedSteps(tour);
    expect(step?.advance).toBe('click');
    expect(step?.hint).toBe('Pick Settings');
    expect(step?.mascot).toEqual({ walk: 'move-wobble', arrive: 'wave' });
    const click = step?.clickTarget;
    expect(click && 'current' in click ? click.current : null).toBe(document.querySelector('.entry'));
  });

});

describe('toGuidedSteps targets and entry', () => {
  it('finds targets when the step looks, and none for a widget in its own window', () => {
    document.body.innerHTML = '<div data-widget-id="notes">Notes</div><div class="window-title-bar"><div class="window-title-bar__start"><button class="dropdown-trigger">Menu</button></div></div>';
    const [menu, notes] = toGuidedSteps(WELCOME);
    const current = (target: unknown): unknown => (target && typeof target === 'object' && 'current' in target ? target.current : undefined);
    expect(current(menu?.target)).toBe(document.querySelector('.dropdown-trigger'));
    expect(current(notes?.target)).toBe(document.querySelector('[data-widget-id="notes"]'));
    const { layout } = useWidgetLayoutStore.getState();
    useWidgetLayoutStore.setState({ layout: { ...layout, popped: [{ id: 'notes' }] } });
    expect(current(notes?.target)).toBeNull();
    const popped = toGuidedSteps(WELCOME)[1];
    expect([popped?.target, popped?.advance]).toEqual([undefined, 'next']);
    const inNotes = { id: 'n', title: 'N', body: 'B', widget: 'notes', advanceOn: { click: '[data-widget-id="notes"] textarea' } };
    expect(tourTargets.poppedSpot({ id: 'w', title: 'W', body: 'B', target: { widget: 'notes' } })).toEqual({ widget: 'notes', selector: '[data-widget-id="notes"] .widget__content' });
    expect(tourTargets.poppedSpot(inNotes)).toEqual({ widget: 'notes', selector: '[data-widget-id="notes"] textarea' });
    expect(tourTargets.poppedSpot({ id: 'm', title: 'M', body: 'B', target: { shell: 'menu' } })).toBeNull();
    useWidgetLayoutStore.setState({ layout });
    expect(tourTargets.poppedSpot(inNotes)).toBeNull();
    document.body.insertAdjacentHTML('beforeend', '<div data-setting-key="windowMode"></div>');
    const [row] = toGuidedSteps(defineTour({ id: 'r', title: 'R', steps: [{ id: 'row', title: 'Row', body: 'B', target: { setting: 'windowMode' } }] }));
    expect(current(row?.target)).toBe(document.querySelector('[data-setting-key="windowMode"]'));
  });

  it('opens the screen, sets the context and awaits before when a step enters', async () => {
    const before = vi.fn(() => Promise.resolve());
    const tour = defineTour({ id: 't', title: 'T', steps: [{ id: 's', title: 'S', body: 'B', open: 'about', context: { name: 'session', data: 1 }, before }] });
    const { signal } = new AbortController();
    await toGuidedSteps(tour)[0]?.onEnter?.({ signal });
    expect(useNavigationStore.getState().active).toBe('about');
    expect(contexts.get('session')).toEqual({ active: true, data: 1 });
    expect(before).toHaveBeenCalledWith(expect.objectContaining({ tourId: 't', stepId: 's', index: 0, signal }));
    contexts.clear('session');
    useNavigationStore.getState().close();
  });

  it('prepares nothing once Tessera aborted the step', async () => {
    const before = vi.fn();
    const tour = defineTour({ id: 't', title: 'T', steps: [{ id: 's', title: 'S', body: 'B', open: 'about', before }] });
    const control = new AbortController();
    control.abort();
    await toGuidedSteps(tour)[0]?.onEnter?.({ signal: control.signal });
    expect(before).not.toHaveBeenCalled();
    expect(useNavigationStore.getState().active).not.toBe('about');
  });
});

describe('the Take the tour entry', () => {
  it('starts the only tour, or lists them when there are several', () => {
    const start = vi.fn();
    tourMenu.entry([WELCOME], 'advanced', start)?.onClick?.();
    expect(start).toHaveBeenCalledWith('welcome');
    expect(tourMenu.entry([WELCOME, SESSIONS], 'advanced', start)?.children?.length).toBe(2);
    expect(tourMenu.entry([], 'advanced', start)).toBeNull();
  });
});

describe('touring keys', () => {
  it('holds every shell key but Alt+Enter while a tour is open, and leaves Escape to Tessera', () => {
    expect(touringHolds({ key: 'k', altKey: false }, true)).toBe(true);
    expect(touringHolds({ key: 'Enter', altKey: true }, true)).toBe(false);
    expect(touringHolds({ key: 'Escape', altKey: false }, false)).toBe(false);
  });
});
