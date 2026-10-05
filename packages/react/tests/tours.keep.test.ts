/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tourProgress } from '../src/tours/tour-progress';
import { tours } from '../src/tours/tours';
import { EMPTY_PROGRESS, NO_TOURS } from '../src/tours/tours.constants';
import { toursFromFiles } from '../src/tours/tours-from-files';
import { uniqueTours } from '../src/tours/unique-tours';
import { useTourStore } from '../src/tours/useTourStore';
import { SESSIONS, WELCOME } from './tour-fixtures';

const reset = (): void => {
  useTourStore.setState({ tours: NO_TOURS, active: null, progress: EMPTY_PROGRESS, loaded: false, firstUse: false });
};

beforeEach(reset);
afterEach(reset);

describe('tourProgress', () => {
  it('reads only well formed progress from ui-views', () => {
    expect(tourProgress.read(null)).toEqual(EMPTY_PROGRESS);
    expect(tourProgress.read({ completed: ['a', 3], started: 'x', last: { a: 2, b: -1, c: 1.5, d: 'x' } })).toEqual({ completed: ['a'], started: [], last: { a: 2 } });
  });

  it('resumes an unfinished tour at its last step and restarts a finished one', () => {
    const started = tourProgress.started(EMPTY_PROGRESS, 'welcome', 2);
    expect(tourProgress.startStep(started, WELCOME)).toBe(2);
    expect(tourProgress.startStep(started, WELCOME, 0)).toBe(0);
    expect(tourProgress.startStep(started, WELCOME, 99)).toBe(2);
    const done = tourProgress.completed(started, 'welcome');
    expect(done).toEqual({ completed: ['welcome'], started: ['welcome'], last: {} });
    expect(tourProgress.startStep(done, WELCOME)).toBe(0);
  });

  it('merges two records, keeping every finished and started tour and the last steps of the first record', () => {
    const a = { completed: ['welcome'], started: ['welcome', 'sessions'], last: { sessions: 1 } };
    const b = { completed: ['sessions'], started: ['sessions', 'other'], last: { sessions: 0, other: 2 } };
    expect(tourProgress.merge(a, b)).toEqual({ completed: ['welcome', 'sessions'], started: ['welcome', 'sessions', 'other'], last: { sessions: 1, other: 2 } });
  });

  it('picks the first first-run tour the app has never started', () => {
    expect(tourProgress.firstRun([SESSIONS, WELCOME], EMPTY_PROGRESS)?.id).toBe('welcome');
    expect(tourProgress.firstRun([SESSIONS, WELCOME], tourProgress.started(EMPTY_PROGRESS, 'welcome', 0))).toBeNull();
  });
});

describe('tours', () => {
  it('starts, steps, goes back and completes on Next at the last step', () => {
    useTourStore.getState().setTours([WELCOME]);
    expect(tours.start('missing')).toBe(false);
    expect(tours.start('welcome')).toBe(true);
    expect(useTourStore.getState().active).toEqual({ id: 'welcome', index: 0 });
    tours.next();
    tours.next();
    expect(useTourStore.getState().progress.last).toEqual({ welcome: 2 });
    tours.back();
    expect(useTourStore.getState().active?.index).toBe(1);
    tours.next();
    tours.next();
    expect(useTourStore.getState().active).toBeNull();
    expect(tours.isCompleted('welcome')).toBe(true);
  });

  it('keeps the last step when closed and resumes there', () => {
    useTourStore.getState().setTours([WELCOME]);
    tours.start('welcome');
    tours.next();
    tours.stop();
    expect(tours.isOpen()).toBe(false);
    tours.start('welcome');
    expect(useTourStore.getState().active).toEqual({ id: 'welcome', index: 1 });
  });

  it('starts a first-run tour once, only while the app is on its first use', () => {
    useTourStore.getState().setTours([SESSIONS, WELCOME]);
    expect(tours.startFirstRun()).toBe(false);
    useTourStore.getState().setLoaded(EMPTY_PROGRESS, true);
    expect(tours.startFirstRun()).toBe(true);
    expect(useTourStore.getState().firstUse).toBe(false);
    expect(useTourStore.getState().active?.id).toBe('welcome');
    tours.stop();
    expect(tours.startFirstRun()).toBe(false);
  });

  it('lists file tours by id with the file name as the id, and drops a repeated id', () => {
    expect(toursFromFiles([{ id: 'welcome', tour: WELCOME }, { id: 'a-tour', tour: SESSIONS }]).map((tour) => tour.id)).toEqual(['a-tour', 'welcome']);
    const warn = vi.fn();
    expect(uniqueTours([WELCOME, { ...SESSIONS, id: 'welcome' }], warn)).toEqual([WELCOME]);
    expect(warn).toHaveBeenCalledOnce();
  });
});
