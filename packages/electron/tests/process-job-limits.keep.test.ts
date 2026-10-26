/* @layer electron-main @kind test */
import type { ProcessProgressParser } from '../src/main/jobs/process/process-job.type';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createProcessFixture } from './process-job-fixture';
import type { ProcessFixture } from './process-job-fixture';

let fx: ProcessFixture;

afterEach(() => {
  fx.dispose();
});

beforeEach(() => {
  fx = createProcessFixture();
});

const WAIT = { timeout: 15_000, interval: 50 };

describe('run a process as a job: limits and privacy', () => {
  it('force kills a process that outlives timeoutMs and fails the job as timed out', async () => {
    const outcome = await fx.processes.run('slow', { command: fx.command, args: fx.argv('hold') }, { label: 'Slow', timeoutMs: 800 });
    expect(outcome).toMatchObject({ status: 'failed', error: 'Slow timed out.' });
    expect(fx.snapshot('slow')).toMatchObject({ state: 'failed', error: 'Slow timed out.' });
  });

  it('rejects a timeout that is not a positive number', async () => {
    const outcome = await fx.processes.run('bad', { command: fx.command, args: fx.argv('hold') }, { label: 'Bad', timeoutMs: -1 });
    expect(outcome.status).toBe('rejected');
  });

  it('masks a line with the redact function before it reaches the log, the tail or the parser', async () => {
    const seen: string[] = [];
    const progress: ProcessProgressParser = (line) => {
      seen.push(line);
      return null;
    };
    const redact = (line: string): string => line.replace('pass1234', '****');
    const outcome = await fx.processes.run('secret', { command: fx.command, args: fx.argv('echo', 'pass1234') }, { label: 'Secret', redact, progress });
    expect(fx.messages('secret')).toEqual(['ECHO ****']);
    expect(seen).toEqual(['ECHO ****']);
    expect(outcome).toMatchObject({ status: 'done', tail: ['ECHO ****'] });
  });

  it('keeps output out of the job log and the tail when log is false', async () => {
    const outcome = await fx.processes.run('quiet', { command: fx.command, args: fx.argv('echo', 'token') }, { label: 'Quiet', log: false });
    expect(outcome).toMatchObject({ status: 'done', tail: [] });
    expect(fx.messages('quiet')).toEqual([]);
  });

  it('does not let the user cancel an installer job unless the definition says so', async () => {
    const running = fx.processes.run('setup', { command: fx.command, args: fx.argv('hold') }, { label: 'Setup', elevate: 'installer' });
    await vi.waitFor(() => expect(fx.messages('setup')).toContain('READY'), WAIT);
    expect(fx.snapshot('setup')?.cancellable).toBe(false);
    fx.jobs.cancel('setup');
    expect(fx.snapshot('setup')?.state).toBe('running');
    fx.processes.cancelAll();
    expect((await running).status).not.toBe('done');
  });

  it('refuses an interpreter such as msiexec unless the definition allows it', async () => {
    const root = process.platform === 'win32' ? 'C:\\Windows\\System32\\msiexec.exe' : '/usr/bin/pwsh';
    const outcome = await fx.processes.run('msi', { command: root, args: [] }, { label: 'Msi' });
    expect(outcome.status).toBe('rejected');
  });
});
