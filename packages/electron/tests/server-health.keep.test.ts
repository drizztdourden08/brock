/* @layer electron-main @kind test */
import { existsSync, readFileSync } from 'fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { healthFilePath } from '../src/server/health-file-path';
import { runServer } from '../src/server/run-server';
import { createHarness, idle, removeHarnessRoots } from './server-harness';

afterEach(removeHarnessRoots);

describe('the heartbeat and the health command', () => {
  it('writes an ok record at start, and removes it on stop', async () => {
    const { options, clock, dataDir } = await createHarness();
    const handle = await runServer(idle(), options);
    const file = healthFilePath(dataDir);
    expect(JSON.parse(readFileSync(file, 'utf8'))).toEqual({ ok: true, pid: process.pid, at: clock.value });
    await handle?.stop();
    expect(existsSync(file)).toBe(false);
  });

  it('beats again on the interval with the health the server reports', async () => {
    vi.useFakeTimers();
    try {
      const { options, clock, dataDir } = await createHarness();
      let healthy = true;
      const handle = await runServer(idle({ health: () => healthy }), { ...options, heartbeatMs: 1_000 });
      healthy = false;
      clock.value += 1_000;
      await vi.advanceTimersByTimeAsync(1_000);
      expect(JSON.parse(readFileSync(healthFilePath(dataDir), 'utf8'))).toMatchObject({ ok: false, at: clock.value });
      await handle?.stop();
    } finally {
      vi.useRealTimers();
    }
  });

  it('exits 0 for a fresh ok heartbeat', async () => {
    const { options, healthOptions, clock, exitCodes, out } = await createHarness();
    const handle = await runServer(idle(), options);
    out.length = 0;
    expect(await runServer(idle(), { ...healthOptions, now: () => clock.value + 29_000 })).toBeNull();
    expect(exitCodes).toEqual([0]);
    expect(out).toEqual(['healthy\n']);
    await handle?.stop();
  });

  it('exits 1 when the heartbeat is older than 30 seconds, missing, or not ok', async () => {
    const { options, healthOptions, clock, exitCodes } = await createHarness();
    const handle = await runServer(idle(), options);
    await runServer(idle(), { ...healthOptions, now: () => clock.value + 31_000 });
    await handle?.stop();
    await runServer(idle(), healthOptions);
    const faulty = await runServer(idle({ health: () => false }), options);
    await runServer(idle(), healthOptions);
    await faulty?.stop();
    expect(exitCodes).toEqual([1, 1, 1]);
  });

  it('does not start the server for the health command', async () => {
    const { healthOptions } = await createHarness();
    const start = vi.fn(idle());
    await runServer(start, healthOptions);
    expect(start).not.toHaveBeenCalled();
  });
});

describe('stopping', () => {
  it.each(['SIGTERM', 'SIGINT'] as const)('calls stop once on %s', async (signal) => {
    const { options, signals, out, dataDir } = await createHarness();
    const stop = vi.fn();
    await runServer(idle({ stop }), options);
    signals.emit(signal);
    await vi.waitFor(() => expect(stop).toHaveBeenCalledTimes(1));
    expect(out.join('')).toContain('stopped');
    expect(existsSync(healthFilePath(dataDir))).toBe(false);
  });

  it('stops only once when asked twice', async () => {
    const { options } = await createHarness();
    const stop = vi.fn();
    const handle = await runServer(idle({ stop }), options);
    await Promise.all([handle?.stop(), handle?.stop()]);
    expect(stop).toHaveBeenCalledTimes(1);
  });

  it('exits 1 and logs to stderr when start throws', async () => {
    const { options, err, exitCodes } = await createHarness();
    const handle = await runServer(() => {
      throw new Error('port in use');
    }, options);
    expect(handle).toBeNull();
    expect(exitCodes).toEqual([1]);
    expect(err.join('')).toContain('port in use');
  });

  it('exits 1 when stop throws', async () => {
    const { options, exitCodes, err } = await createHarness();
    const handle = await runServer(idle({ stop: () => Promise.reject(new Error('stuck')) }), options);
    await handle?.stop();
    expect(exitCodes).toEqual([1]);
    expect(err.join('')).toContain('stuck');
  });
});
