/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { JobSnapshot, JobState } from '@drizztdourden08/brock-core/types';
import { clearFinishedJobs } from '../src/jobs/clear-finished-jobs';
import { useJobStore } from '../src/jobs/useJobStore';

const START = 1_000_000;

const job = (id: string, state: JobState, endedAt: number | null = null): JobSnapshot => ({
  id, title: id, state, steps: [], currentStep: null, progress: state === 'running' ? 0.5 : 1, stepProgress: 0, line: null, error: null, log: [], startedAt: START, endedAt, cancellable: false,
});

const ids = (): string[] => Object.keys(useJobStore.getState().jobs).sort();

let stop: () => void = () => undefined;

beforeEach(() => {
  vi.useFakeTimers({ now: START });
  useJobStore.setState({ jobs: {}, shown: null });
  stop = clearFinishedJobs();
});

afterEach(() => {
  stop();
  vi.useRealTimers();
});

describe('finished jobs in the title bar', () => {
  it('clears a hidden job that succeeded 30 seconds after it finished, and keeps a failed one', () => {
    const { upsert } = useJobStore.getState();
    upsert(job('export', 'running'));
    upsert(job('import', 'running'));
    vi.advanceTimersByTime(5_000);
    upsert(job('export', 'done', Date.now()));
    upsert(job('import', 'failed', Date.now()));
    vi.advanceTimersByTime(29_000);
    expect(ids()).toEqual(['export', 'import']);
    vi.advanceTimersByTime(1_000);
    expect(ids()).toEqual(['import']);
    vi.advanceTimersByTime(600_000);
    expect(ids()).toEqual(['import']);
  });

  it('counts from when the job finished, for a job that was already done when the app learned of it', () => {
    useJobStore.getState().upsert(job('old', 'done', START - 25_000));
    vi.advanceTimersByTime(4_999);
    expect(ids()).toEqual(['old']);
    vi.advanceTimersByTime(1);
    expect(ids()).toEqual([]);
  });

  it('leaves a job while its dialog is open, and clears it once the dialog is hidden past the 30 seconds', () => {
    useJobStore.getState().upsert(job('export', 'done', START));
    useJobStore.getState().show('export');
    vi.advanceTimersByTime(40_000);
    expect(ids()).toEqual(['export']);
    useJobStore.getState().show(null);
    vi.advanceTimersByTime(0);
    expect(ids()).toEqual([]);
  });
});
