/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import { createAppLog } from '../src/log/create-app-log';
import { JobHost } from '../src/jobs/JobHost';
import { jobs } from '../src/jobs/jobs';
import { useJob } from '../src/jobs/useJob';
import { useJobBridge } from '../src/jobs/useJobBridge';
import { useJobStore } from '../src/jobs/useJobStore';
import { useJobTitleBarAction } from '../src/jobs/useJobTitleBarAction';
import type { UseJobResult } from '../src/jobs/jobs.type';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const STEPS = [{ id: 'read', label: 'Reading' }, { id: 'write', label: 'Writing' }];

const hostJob: JobSnapshot = {
  id: 'host-import', title: 'Importing', state: 'running', currentStep: 'write', progress: 0.75, stepProgress: 0.5, line: 'file 3 of 4', error: null, log: [],
  steps: [{ id: 'read', label: 'Reading', weight: 1, state: 'done' }, { id: 'write', label: 'Writing', weight: 1, state: 'current' }],
  startedAt: 1, endedAt: null, cancellable: true, visible: true,
};

let root: Root | null = null;

const mount = (render: () => null): void => {
  document.body.innerHTML = '<div id="host"></div>';
  root = createRoot(document.getElementById('host') as HTMLElement);
  const Probe = (): null => render();
  act(() => root?.render(createElement(Probe)));
};

beforeEach(() => {
  useJobStore.setState({ jobs: {}, shown: null });
});

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe('quiet jobs in the renderer', () => {
  it('keeps a quiet job out of the title bar item and the job dialog, while its snapshot stays in the store', () => {
    let action: ReturnType<typeof useJobTitleBarAction> = null;
    mount(() => {
      action = useJobTitleBarAction();
      return null;
    });
    const quiet = jobs.start('thumbs', STEPS, { visible: false });
    act(() => quiet.step('read'));
    expect(action).toBeNull();
    expect(jobs.get('thumbs')).toMatchObject({ visible: false, currentStep: 'read' });
    const loud = jobs.start('export', STEPS, { title: 'Exporting' });
    act(() => loud.step('write'));
    expect(action).toMatchObject({ status: 'Exporting: Writing 0%' });
    jobs.cancel('thumbs');
    jobs.cancel('export');
  });

  it('draws no job dialog for a quiet job, even when it is opened', () => {
    act(() => {
      jobs.start('hidden', STEPS, { visible: false, title: 'Hidden work' });
      jobs.open('hidden');
    });
    mount(() => null);
    act(() => root?.render(createElement(JobHost)));
    expect(document.querySelector('[data-job-id]')).toBeNull();
    act(() => {
      jobs.start('shown', STEPS, { title: 'Shown work' });
      jobs.open('shown');
    });
    expect(document.querySelector('[data-job-id="shown"]')).not.toBeNull();
    jobs.cancel('hidden');
    jobs.cancel('shown');
  });
});

describe('useJob', () => {
  it('follows a renderer job: state, progress, the current step, the line and the error, and null for an unknown id', () => {
    let result: UseJobResult | null = null;
    let unknown: UseJobResult | null = null;
    mount(() => {
      result = useJob('inline');
      unknown = useJob('nothing');
      return null;
    });
    const job = jobs.start('inline', STEPS, { visible: false });
    act(() => {
      job.step('read');
      job.step('write', 'Saving');
    });
    expect(result).toMatchObject({ job: { state: 'running', progress: 0.5, line: 'Saving', error: null }, step: { id: 'write', label: 'Writing' } });
    act(() => job.fail(new Error('read only')));
    expect(result).toMatchObject({ job: { state: 'failed', error: 'read only' }, step: { id: 'write', state: 'failed' } });
    expect(unknown).toMatchObject({ job: null, step: null });
  });

  it('follows a main process job through the host bridge', async () => {
    let push: (job: JobSnapshot) => void = () => undefined;
    vi.stubGlobal('api', {
      listJobs: () => Promise.resolve([hostJob]),
      onJobUpdate: (listener: (job: JobSnapshot) => void) => {
        push = listener;
        return () => undefined;
      },
    });
    let result: UseJobResult | null = null;
    mount(() => {
      useJobBridge();
      result = useJob('host-import');
      return null;
    });
    await act(async () => Promise.resolve());
    expect(result).toMatchObject({ job: { state: 'running', progress: 0.75, line: 'file 3 of 4' }, step: { label: 'Writing' } });
    act(() => push({ ...hostJob, state: 'done', progress: 1, currentStep: null, endedAt: 2 }));
    expect(result).toMatchObject({ job: { state: 'done', progress: 1 }, step: null });
  });
});

describe('forwarding a renderer job log to the app log', () => {
  it('writes the log lines of a job started with forwardLog to the app log with the job id, and keeps them after the job is gone', async () => {
    const bus = createAppLog();
    await jobs.start('sync', STEPS, { forwardLog: true }).run(async (job) => {
      job.log('fetched 2 files');
      job.log('one file skipped', 'warn');
      return Promise.resolve();
    });
    jobs.start('plain', STEPS).log('stays in the job');
    jobs.dismiss('sync');
    expect(jobs.get('sync')).toBeNull();
    expect(bus.getEntries().map(({ channel, level, message }) => ({ channel, level, message }))).toEqual([
      { channel: 'app', level: 'info', message: '[job sync] fetched 2 files' },
      { channel: 'app', level: 'warn', message: '[job sync] one file skipped' },
    ]);
    jobs.cancel('plain');
  });
});
