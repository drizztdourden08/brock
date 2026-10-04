/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import { createJobRegistry } from '../src/main/jobs/create-job-registry';

const STEPS = [{ id: 'download', label: 'Download', weight: 3 }, { id: 'unpack', label: 'Unpack' }];

let emitted: JobSnapshot[] = [];

const last = (): JobSnapshot => {
  const snapshot = emitted.at(-1);
  if (!snapshot) throw new Error('nothing emitted');
  return snapshot;
};

beforeEach(() => {
  vi.useFakeTimers();
  emitted = [];
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createJobRegistry', () => {
  it('reports steps, weighted progress, the current line and log lines', () => {
    const registry = createJobRegistry((snapshot) => emitted.push(snapshot), () => 1000);
    const job = registry.start('setup', STEPS, { title: 'Setting up' });
    expect(last()).toMatchObject({ id: 'setup', title: 'Setting up', state: 'running', progress: 0, cancellable: true });
    job.step('download', 'Fetching');
    expect(last().steps.map((step) => step.state)).toEqual(['current', 'upcoming']);
    job.progress(0.5, 'Half way');
    job.log('fetched part 1');
    const before = emitted.length;
    vi.advanceTimersByTime(100);
    expect(emitted.length).toBe(before + 1);
    expect(last()).toMatchObject({ progress: 0.375, stepProgress: 0.5, line: 'Half way', log: [{ at: 1000, level: 'info', message: 'fetched part 1' }] });
    job.step('unpack');
    expect(last().steps.map((step) => step.state)).toEqual(['done', 'current']);
    expect(last().progress).toBe(0.75);
    job.done('Ready');
    expect(last()).toMatchObject({ state: 'done', progress: 1, line: 'Ready', endedAt: 1000 });
    job.progress(0.1);
    expect(last().state).toBe('done');
  });

  it('marks the current step failed with the error and refuses a second running job with the same id', async () => {
    const registry = createJobRegistry((snapshot) => emitted.push(snapshot));
    const job = registry.start('setup', STEPS);
    expect(() => registry.start('setup', STEPS)).toThrow(/already running/);
    await expect(job.run((running) => {
      running.step('download');
      return Promise.reject(new Error('disk full'));
    })).rejects.toThrow('disk full');
    expect(last()).toMatchObject({ state: 'failed', error: 'disk full' });
    expect(last().steps[0]?.state).toBe('failed');
    expect(registry.start('setup', STEPS).id).toBe('setup');
  });

  it('cancels through the signal, and dismisses only finished jobs', () => {
    const registry = createJobRegistry((snapshot) => emitted.push(snapshot));
    const job = registry.start('export', STEPS);
    job.step('download');
    registry.dismiss('export');
    expect(registry.list()).toHaveLength(1);
    registry.cancel('export');
    expect(job.signal.aborted).toBe(true);
    expect(last()).toMatchObject({ state: 'cancelled' });
    expect(last().steps[0]?.state).toBe('failed');
    registry.dismiss('export');
    expect(registry.list()).toHaveLength(0);
  });

  it('ignores cancel on a job that cannot be cancelled', () => {
    const registry = createJobRegistry((snapshot) => emitted.push(snapshot));
    const job = registry.start('migrate', STEPS, { cancellable: false });
    registry.cancel('migrate');
    expect(job.signal.aborted).toBe(false);
    expect(last().state).toBe('running');
  });
});
