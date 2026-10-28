/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadedStep } from '../src/review/app/loaded-step';
import { declareStepLimit } from '../src/review/dom/declare-step-limit';
import type { StepTour } from '../src/review/review.type';

const host = vi.hoisted(() => ({ alive: vi.fn() }));

vi.mock('../src/host/host-api', () => ({ hostApi: () => ({ reviewAlive: host.alive }) }));
vi.mock('../src/review/app/sized-run', () => ({ sizedRun: () => Promise.resolve() }));

const tour = { check: vi.fn() } as Partial<StepTour> as StepTour;

beforeEach(() => {
  host.alive.mockClear();
});

describe('a step that declares timeoutMs', () => {
  it('tells main the limit once the step is loaded', async () => {
    const step = loadedStep('engine', () => Promise.resolve({ default: { timeoutMs: 120_000, run: () => Promise.resolve() } }));
    await step.run(tour);
    expect(host.alive).toHaveBeenCalledWith(120_000);
  });

  it('sends no limit for a step that declares none', async () => {
    const step = loadedStep('plain', () => Promise.resolve({ default: { run: () => Promise.resolve() } }));
    await step.run(tour);
    expect(host.alive).not.toHaveBeenCalled();
  });

  it('clears the limit with null when the next step starts', () => {
    declareStepLimit(null);
    expect(host.alive).toHaveBeenCalledWith(null);
  });
});
