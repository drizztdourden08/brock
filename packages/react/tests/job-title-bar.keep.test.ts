/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { JobSnapshot, JobState } from '@drizztdourden08/brock-core/types';
import { jobBarStatus } from '../src/jobs/job-bar-status';

const job = (state: JobState, currentStep: string | null): JobSnapshot => ({
  id: 'run-sunday',
  title: 'Running Sunday',
  state,
  steps: [
    { id: 'fetch', label: 'Fetching', weight: 1, state: 'done' },
    { id: 'generate', label: 'Generating', weight: 1, state: currentStep === 'generate' ? 'current' : 'upcoming' },
  ],
  currentStep,
  progress: 0.4,
  stepProgress: 0.2,
  line: null,
  error: null,
  log: [],
  startedAt: 1,
  endedAt: state === 'running' ? null : 2,
  cancellable: false,
  visible: true,
});

describe('K1 the title bar job status', { tags: ['critical'] }, () => {
  it('names the current step between the title and the percent while the job runs', () => {
    expect(jobBarStatus(job('running', 'generate'))).toBe('Running Sunday: Generating 40%');
  });

  it('keeps the title and the percent when no step is current, and the state once it ends', () => {
    expect(jobBarStatus(job('running', null))).toBe('Running Sunday 40%');
    expect(jobBarStatus(job('done', null))).toBe('Running Sunday: done');
    expect(jobBarStatus(job('failed', 'generate'))).toBe('Running Sunday: failed');
  });
});
