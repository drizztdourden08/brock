/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { AppReview, ReviewStepDef } from '../src/review/app-review.type';
import type { StepTour } from '../src/review/review.type';
import { recordingTour } from './review-outcomes';

const START = { x: 10, y: 20, width: 1200, height: 800 };
const calls: unknown[] = [];
let bounds: typeof START | null = START;

vi.mock('../src/review/app/app-tour', () => ({
  appTour: (tour: StepTour, id: string) => Object.assign(Object.create(tour) as StepTour, { id, capture: (name: string) => tour.capture([id, name].join('-')) }),
}));
vi.mock('../src/review/dom/settle', () => ({ settle: () => Promise.resolve() }));
vi.mock('../src/review/widgets/probe', () => ({
  probe: (request: { bounds?: unknown }) => { calls.push(request.bounds ?? 'read'); return Promise.resolve({ bounds }); },
}));

const { appSteps } = await import('../src/review/app/app-steps');

const stepOf = (def: ReviewStepDef) => {
  const review: AppReview = { seed: null, steps: [{ id: 'editor', load: () => Promise.resolve({ default: def }) }] };
  const [step] = appSteps(review, new Set());
  if (!step) throw new Error('no step');
  return step;
};

const capturing: ReviewStepDef = {
  run: async (tour) => { tour.check('layout', true, 'laid out', ''); await tour.capture('layout'); },
};

describe('app review step sizes', () => {
  it('resizes the window before the step and restores it after, with the capture suffixed', async () => {
    calls.length = 0;
    const { tour, captures, checks } = recordingTour();
    await stepOf({ ...capturing, sizes: [{ name: 'tall', width: 700, height: 900 }] }).run(tour);
    expect(calls).toEqual(['read', { ...START, width: 700, height: 900 }, START]);
    expect(captures).toEqual(['editor-layout-tall']);
    expect(checks.map((c) => c.id)).toEqual(['layout-tall', 'step-ran']);
  });

  it('runs a step once per listed size, narrow using the shell size', async () => {
    calls.length = 0;
    const { tour, captures } = recordingTour();
    await stepOf({ ...capturing, sizes: ['narrow', { name: 'wide', width: 1400, height: 800 }] }).run(tour);
    expect(calls).toEqual([
      'read', { ...START, width: 600, height: 720 }, START,
      'read', { ...START, width: 1400, height: 800 }, START,
    ]);
    expect(captures).toEqual(['editor-layout-narrow', 'editor-layout-wide']);
  });

  it('restores the window when the step throws, and leaves a step without sizes alone', async () => {
    calls.length = 0;
    const boom = stepOf({ sizes: ['narrow'], run: () => Promise.reject(new Error('boom')) });
    await expect(boom.run(recordingTour().tour)).rejects.toThrow('boom');
    expect(calls.at(-1)).toEqual(START);
    calls.length = 0;
    const { tour, captures } = recordingTour();
    await stepOf(capturing).run(tour);
    expect(calls).toEqual([]);
    expect(captures).toEqual(['editor-layout']);
  });

  it('fails a check and skips the step when the main window has no bounds', async () => {
    bounds = null;
    const { tour, checks, captures } = recordingTour();
    await stepOf({ ...capturing, sizes: ['narrow'] }).run(tour);
    expect(captures).toEqual([]);
    expect(checks[0]).toMatchObject({ id: 'window-narrow', pass: false });
    bounds = START;
  });
});
