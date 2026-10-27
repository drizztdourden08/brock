/* @layer electron-main @kind test */
import { EventEmitter } from 'events';
import { PassThrough } from 'stream';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { killProcessTree } from '../src/main/jobs/process/kill-process-tree';
import { PROCESS_DETACHED_MESSAGE, PROCESS_INSTALLER_GIVE_UP_MS, PROCESS_INSTALLER_GRACE_MS } from '../src/main/jobs/process/process-job.constants';
import { createProcessFixture } from './process-job-fixture';
import type { ProcessFixture } from './process-job-fixture';

interface FakeChild extends EventEmitter {
  pid: number;
  exitCode: number | null;
  signalCode: NodeJS.Signals | null;
  stdout: PassThrough;
  stderr: PassThrough;
  unref: ReturnType<typeof vi.fn>;
}

const children: FakeChild[] = [];

const makeChild = (): FakeChild => {
  const child = new EventEmitter() as FakeChild;
  Object.assign(child, { pid: 4242, exitCode: null, signalCode: null, stdout: new PassThrough(), stderr: new PassThrough(), unref: vi.fn() });
  children.push(child);
  return child;
};

const exitOnKill = (child: FakeChild): void => {
  child.signalCode = 'SIGTERM';
  child.emit('exit', null, 'SIGTERM');
  child.emit('close', null, 'SIGTERM');
};

vi.mock('child_process', () => ({ spawn: vi.fn(() => makeChild()) }));
vi.mock('../src/main/jobs/process/kill-process-tree', () => ({ killProcessTree: vi.fn(() => Promise.resolve('sent')) }));

let fx: ProcessFixture;

beforeEach(() => {
  vi.useFakeTimers();
  children.length = 0;
  vi.mocked(killProcessTree).mockReset();
  vi.mocked(killProcessTree).mockResolvedValue('sent');
  fx = createProcessFixture();
});

afterEach(() => {
  fx.processes.cancelAll();
  vi.useRealTimers();
  fx.dispose();
});

const startInstaller = (options: { cancellable?: boolean } = {}) => {
  const outcome = fx.processes.run('setup', { command: fx.command, args: [] }, { label: 'Setup', elevate: 'installer', ...options });
  const child = children[0];
  if (!child) throw new Error('no child was spawned');
  child.stdout.write('working\n');
  return { outcome, child };
};

describe('cancelling an elevated installer', () => {
  it('is allowed by default and ends as cancelled when the process exits on the kill', async () => {
    const { outcome, child } = startInstaller();
    await vi.advanceTimersByTimeAsync(0);
    expect(fx.snapshot('setup')?.cancellable).toBe(true);
    vi.mocked(killProcessTree).mockImplementation(() => {
      exitOnKill(child);
      return Promise.resolve('sent');
    });
    fx.jobs.cancel('setup');
    await vi.advanceTimersByTimeAsync(10);
    expect(await outcome).toMatchObject({ status: 'cancelled' });
    expect(child.unref).not.toHaveBeenCalled();
  });

  it('ends as cancelled when the process exits during the grace period', async () => {
    const { outcome, child } = startInstaller();
    await vi.advanceTimersByTimeAsync(0);
    fx.jobs.cancel('setup');
    await vi.advanceTimersByTimeAsync(PROCESS_INSTALLER_GRACE_MS - 100);
    exitOnKill(child);
    await vi.advanceTimersByTimeAsync(10);
    expect(await outcome).toMatchObject({ status: 'cancelled' });
    expect(child.unref).not.toHaveBeenCalled();
  });

  it('stops waiting and ends as detached when the process ignores the kill', async () => {
    const { outcome, child } = startInstaller();
    await vi.advanceTimersByTimeAsync(0);
    fx.jobs.cancel('setup');
    await vi.advanceTimersByTimeAsync(PROCESS_INSTALLER_GRACE_MS + PROCESS_INSTALLER_GIVE_UP_MS - 100);
    expect(child.unref).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(200);
    const result = await outcome;
    expect(result).toMatchObject({ status: 'detached', exitCode: null, error: PROCESS_DETACHED_MESSAGE, tail: ['working'] });
    expect(PROCESS_DETACHED_MESSAGE).toBe('The installer keeps running on its own. Brock stopped waiting for it.');
    expect(child.unref).toHaveBeenCalledTimes(1);
    expect(child.stdout.destroyed).toBe(true);
    expect(child.stderr.destroyed).toBe(true);
    expect(result.status === 'detached' ? result.logFile : undefined).toEqual(expect.stringContaining('setup-'));
    expect(fx.snapshot('setup')?.state).toBe('cancelled');
  });

  it('detaches at once when the system refuses the forced kill', async () => {
    vi.mocked(killProcessTree).mockResolvedValue('refused');
    const { outcome, child } = startInstaller();
    await vi.advanceTimersByTimeAsync(0);
    fx.jobs.cancel('setup');
    await vi.advanceTimersByTimeAsync(PROCESS_INSTALLER_GRACE_MS + 100);
    expect(await outcome).toMatchObject({ status: 'detached' });
    expect(child.unref).toHaveBeenCalledTimes(1);
  });

  it('stays off when cancellable is false', async () => {
    startInstaller({ cancellable: false });
    await vi.advanceTimersByTimeAsync(0);
    expect(fx.snapshot('setup')?.cancellable).toBe(false);
    fx.jobs.cancel('setup');
    await vi.advanceTimersByTimeAsync(PROCESS_INSTALLER_GRACE_MS + PROCESS_INSTALLER_GIVE_UP_MS + 100);
    expect(killProcessTree).not.toHaveBeenCalled();
    expect(fx.snapshot('setup')?.state).toBe('running');
  });
});
