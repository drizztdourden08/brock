/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { killProcessTree } from '../src/main/jobs/process/kill-process-tree';
import { createStopper } from '../src/main/jobs/process/create-stopper';

vi.mock('../src/main/jobs/process/kill-process-tree', () => ({ killProcessTree: vi.fn(() => Promise.resolve('refused')) }));

const running = { pid: 4242, exitCode: null, signalCode: null };

beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(killProcessTree).mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createStopper', () => {
  it('reports a detached process when the forced kill is refused', async () => {
    const giveUp = vi.fn();
    const controller = new AbortController();
    const stopper = createStopper({ child: running, signal: controller.signal, graceMs: 100, timeoutMs: undefined, giveUp });
    controller.abort();
    await vi.advanceTimersByTimeAsync(50);
    expect(giveUp).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    expect(giveUp).toHaveBeenCalledTimes(1);
    expect(stopper.killed()).toBe(true);
    stopper.dispose();
  });

  it('gives up after the wait when the process outlives the forced kill', async () => {
    vi.mocked(killProcessTree).mockResolvedValue('sent');
    const giveUp = vi.fn();
    const controller = new AbortController();
    const stopper = createStopper({ child: running, signal: controller.signal, graceMs: 100, timeoutMs: undefined, giveUp });
    controller.abort();
    await vi.advanceTimersByTimeAsync(1000);
    expect(giveUp).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(giveUp).toHaveBeenCalledTimes(1);
    stopper.dispose();
  });

  it('never kills a process that already exited, and a disposed stopper does nothing', async () => {
    vi.mocked(killProcessTree).mockResolvedValue('sent');
    const controller = new AbortController();
    const exited = { pid: 4242, exitCode: 0, signalCode: null };
    const stopper = createStopper({ child: exited, signal: controller.signal, graceMs: 100, timeoutMs: undefined, giveUp: vi.fn() });
    controller.abort();
    await vi.advanceTimersByTimeAsync(1000);
    expect(killProcessTree).not.toHaveBeenCalled();
    expect(stopper.killed()).toBe(false);
    stopper.dispose();
  });

  it('force kills at timeoutMs and marks the stop as a timeout', async () => {
    vi.mocked(killProcessTree).mockResolvedValue('sent');
    const controller = new AbortController();
    const stopper = createStopper({ child: running, signal: controller.signal, graceMs: 100, timeoutMs: 500, giveUp: vi.fn() });
    await vi.advanceTimersByTimeAsync(600);
    expect(killProcessTree).toHaveBeenCalledWith(running, true);
    expect(stopper.timedOut()).toBe(true);
    stopper.dispose();
  });
});
