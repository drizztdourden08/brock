/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contexts } from '../src/contexts/contexts';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { keptUsable } from '../src/tours/TourHost/behavior/keep-usable';
import { defineTour } from '../src/tours/define-tour';
import { toGuidedSteps } from '../src/tours/to-guided-steps';
import { tourMenu } from '../src/tours/tour-menu-entry';
import { touringKey } from '../src/tours/touring-key';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { SESSIONS, WELCOME } from './tour-fixtures';

afterEach(() => {
  document.body.replaceChildren();
});

describe('toGuidedSteps', () => {
  it('lets Tessera wait for a click on the lit part, and uses Next otherwise', () => {
    const steps = toGuidedSteps(WELCOME);
    expect(steps.map((step) => step.advance)).toEqual(['next', 'click', 'next']);
    expect(toGuidedSteps(SESSIONS)[0]?.advance).toBe('next');
    expect(toGuidedSteps(SESSIONS)[1]?.target).toBeUndefined();
  });

  it('finds targets when the step looks, and none for a widget in its own window', () => {
    document.body.innerHTML = '<div data-widget-id="notes">Notes</div><div class="window-title-bar"><div class="window-title-bar__start"><button class="dropdown-trigger">Menu</button></div></div>';
    const [menu, notes] = toGuidedSteps(WELCOME);
    const current = (target: unknown): unknown => (target && typeof target === 'object' && 'current' in target ? target.current : undefined);
    expect(current(menu?.target)).toBe(document.querySelector('.dropdown-trigger'));
    expect(current(notes?.target)).toBe(document.querySelector('[data-widget-id="notes"]'));
    const { layout } = useWidgetLayoutStore.getState();
    useWidgetLayoutStore.setState({ layout: { ...layout, popped: [{ id: 'notes' }] } });
    expect(current(notes?.target)).toBeNull();
    useWidgetLayoutStore.setState({ layout });
  });

  it('opens the screen, sets the context and awaits before when a step enters', async () => {
    const before = vi.fn(() => Promise.resolve());
    const tour = defineTour({ id: 't', title: 'T', steps: [{ id: 's', title: 'S', body: 'B', open: 'about', context: { name: 'session', data: 1 }, before }] });
    await toGuidedSteps(tour)[0]?.onEnter?.();
    expect(useNavigationStore.getState().active).toBe('about');
    expect(contexts.get('session')).toEqual({ active: true, data: 1 });
    expect(before).toHaveBeenCalledWith(expect.objectContaining({ tourId: 't', stepId: 's', index: 0 }));
    contexts.clear('session');
    useNavigationStore.getState().close();
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
  it('closes on Escape, keeps Alt+Enter and holds every other shell key while a tour is open', () => {
    expect(touringKey({ key: 'Escape', altKey: false }, true)).toBe('close');
    expect(touringKey({ key: 'Enter', altKey: true }, true)).toBeNull();
    expect(touringKey({ key: 'k', altKey: false }, true)).toBe('skip');
    expect(touringKey({ key: 'Escape', altKey: false }, false)).toBeNull();
  });
});

describe('keptUsable', () => {
  it('lifts the inert the tour put above the title bar and makes the rest of the app inert instead', () => {
    document.body.innerHTML = '<div id="root"><div class="app"><header class="bar"></header><main class="content"></main></div></div><div id="portal"></div>';
    const root = document.getElementById('root') as HTMLElement;
    const content = document.querySelector('.content') as HTMLElement;
    const bar = document.querySelector('.bar') as HTMLElement;
    root.inert = true;
    const kept = keptUsable.keep([bar], document.body);
    expect(root.inert).toBe(false);
    expect(content.inert).toBe(true);
    expect(bar.inert).toBe(false);
    keptUsable.undo(kept, new Set());
    expect([root.inert, content.inert]).toEqual([true, false]);
    root.inert = false;
    const again = keptUsable.keep([bar], document.body);
    expect(again.lifted).toEqual([]);
    keptUsable.undo(kept, null);
    expect(root.inert).toBe(false);
  });

  it('leaves a lifted node to the tour when the tour changed it since', () => {
    document.body.innerHTML = '<div id="root"><header class="bar"></header><main class="content"></main></div>';
    const root = document.getElementById('root') as HTMLElement;
    root.inert = true;
    const kept = keptUsable.keep([document.querySelector('.bar') as HTMLElement], document.body);
    keptUsable.undo(kept, new Set([root]));
    expect(root.inert).toBe(false);
  });
});
