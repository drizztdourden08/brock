/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import type { JobSnapshot, JobState } from '@drizztdourden08/brock-core/types';
import { jobBarStatus } from '../src/jobs/job-bar-status';
import { JobDialog } from '../src/jobs/JobDialog';

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
});

afterEach(() => document.body.replaceChildren());

describe('the title bar job status', () => {
  it('names the current step between the title and the percent while the job runs', () => {
    expect(jobBarStatus(job('running', 'generate'))).toBe('Running Sunday: Generating 40%');
  });

  it('keeps the title and the percent when no step is current, and the state once it ends', () => {
    expect(jobBarStatus(job('running', null))).toBe('Running Sunday 40%');
    expect(jobBarStatus(job('done', null))).toBe('Running Sunday: done');
    expect(jobBarStatus(job('failed', 'generate'))).toBe('Running Sunday: failed');
  });
});

describe('JobDialog', () => {
  it('names its job on the dialog with data-job-id, and drops it when the dialog closes', () => {
    document.body.innerHTML = '<div id="host"></div>';
    const root = createRoot(document.getElementById('host') as HTMLElement);
    const noop = (): void => undefined;
    act(() => root.render(createElement(JobDialog, { job: job('running', 'generate'), onHide: noop, onCancel: noop, onClose: noop })));
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute('data-job-id')).toBe('run-sunday');
    expect(document.querySelector('[data-job-id="run-sunday"] [aria-label="Running Sunday"]')?.getAttribute('data-state')).toBe('running');
    act(() => root.unmount());
    expect(document.querySelector('[data-job-id]')).toBeNull();
  });
});
