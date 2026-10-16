/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { jobs } from '../src/jobs/jobs';
import { useJobStore } from '../src/jobs/useJobStore';

const STEPS = [{ id: 'read', label: 'Read' }, { id: 'write', label: 'Write', weight: 3 }];

beforeEach(() => {
  useJobStore.setState({ jobs: {}, shown: null });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('renderer jobs', () => {
  it('starts a job in the renderer that the job store shows, with no main process', async () => {
    const result = await jobs.start('extract', STEPS, { title: 'Extracting' }).run(async (job) => {
      job.step('read');
      job.step('write', 'Writing');
      return Promise.resolve(7);
    });
    expect(result).toBe(7);
    expect(jobs.get('extract')).toMatchObject({
      title: 'Extracting', state: 'done', progress: 1, line: 'Writing',
      steps: [{ id: 'read', state: 'done', weight: 1 }, { id: 'write', state: 'done', weight: 3 }],
    });
    jobs.dismiss('extract');
    expect(jobs.get('extract')).toBeNull();
  });

  it('cancels a renderer job through its signal and leaves host jobs to the host', () => {
    const host = { cancelJob: vi.fn(), dismissJob: vi.fn() };
    vi.stubGlobal('window', { api: host });
    const job = jobs.start('long', STEPS);
    jobs.cancel('long');
    expect(job.signal.aborted).toBe(true);
    expect(jobs.get('long')?.state).toBe('cancelled');
    expect(host.cancelJob).not.toHaveBeenCalled();
    jobs.cancel('main-side');
    jobs.dismiss('main-side');
    expect(host.cancelJob).toHaveBeenCalledWith('main-side');
    expect(host.dismissJob).toHaveBeenCalledWith('main-side');
  });

  it('refuses a second renderer job under a running id', () => {
    jobs.start('twice', STEPS);
    expect(() => jobs.start('twice', STEPS)).toThrow('already running');
    jobs.cancel('twice');
  });
});
