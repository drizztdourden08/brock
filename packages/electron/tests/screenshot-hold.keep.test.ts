/* @layer electron-main @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BrowserWindow } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import { REVIEW_HOLD_MS } from '../src/main/review/review.constants';
import type { MainContext } from '../src/main/types/main-context.type';

const shots = vi.hoisted(() => ({ taken: [] as string[], quits: 0, exits: [] as number[], logs: [] as string[] }));

vi.mock('electron', () => ({ app: { quit: () => { shots.quits += 1; }, exit: (code: number) => { shots.exits.push(code); } } }));
vi.mock('../src/main/handlers/capture-window', () => ({
  captureWindow: (_win: unknown, name: string) => { shots.taken.push(name); return Promise.resolve(`/data/screenshots/${name}.png`); },
}));

const contextFor = (name: string | null, timeout: string | null = null): MainContext => ({
  flags: { flagValue: (flag: string) => ({ '--screenshot': name, '--screenshot-timeout': timeout }[flag] ?? null) } as Partial<AutomationFlags> as AutomationFlags,
  window: () => ({}) as BrowserWindow,
  log: (line: string) => { shots.logs.push(line); },
}) as Partial<MainContext> as MainContext;

afterEach(() => {
  vi.useRealTimers();
  shots.taken.length = 0;
  shots.quits = 0;
  shots.exits.length = 0;
  shots.logs.length = 0;
});

const STABLE_MS = 50;

const shooting = async () => {
  vi.resetModules();
  vi.useFakeTimers();
  const { armScreenshotFlag } = await import('../src/main/bootstrap/screenshot-flag');
  const { captureHolds } = await import('../src/main/handlers/capture-holds');
  const { bootEvents } = await import('../src/main/boot/boot-events');
  armScreenshotFlag(contextFor('boot'));
  return { captureHolds, bootEvents };
};

describe('--screenshot', () => {
  it('waits for the reveal, then for every hold the app took to be released', async () => {
    const { captureHolds, bootEvents } = await shooting();
    captureHolds.set(2);
    bootEvents.emit('revealed');
    await vi.advanceTimersByTimeAsync(STABLE_MS * 4);
    expect(shots.taken).toEqual([]);
    captureHolds.set(1);
    await vi.advanceTimersByTimeAsync(STABLE_MS * 4);
    expect(shots.taken).toEqual([]);
    captureHolds.set(0);
    await vi.advanceTimersByTimeAsync(STABLE_MS - 1);
    expect(shots.taken).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(shots.taken).toEqual(['boot']);
    expect(shots.quits).toBe(1);
  });

  it('shoots once the count has stayed at 0 for a frame when the app holds nothing', async () => {
    const { bootEvents } = await shooting();
    bootEvents.emit('revealed');
    await vi.advanceTimersByTimeAsync(STABLE_MS);
    expect(shots.taken).toEqual(['boot']);
  });

  it('a hold that appears just after the count hits 0 delays the capture until it is released too', async () => {
    const { captureHolds, bootEvents } = await shooting();
    captureHolds.set(1);
    bootEvents.emit('revealed');
    captureHolds.set(0);
    await vi.advanceTimersByTimeAsync(STABLE_MS / 2);
    captureHolds.set(1);
    await vi.advanceTimersByTimeAsync(STABLE_MS * 10);
    expect(shots.taken).toEqual([]);
    captureHolds.set(0);
    await vi.advanceTimersByTimeAsync(STABLE_MS);
    expect(shots.taken).toEqual(['boot']);
  });

  it('adds up the holds of every window, and forgets the holds of a window that is gone', async () => {
    const { captureHolds, bootEvents } = await shooting();
    captureHolds.set(1, 1);
    captureHolds.set(2, 2);
    bootEvents.emit('revealed');
    expect(captureHolds.count()).toBe(3);
    captureHolds.set(0, 1);
    await vi.advanceTimersByTimeAsync(STABLE_MS * 4);
    expect(shots.taken).toEqual([]);
    captureHolds.drop(2);
    await vi.advanceTimersByTimeAsync(STABLE_MS);
    expect(shots.taken).toEqual(['boot']);
  });
});

const armed = async (timeout: string | null, defaultMs?: number, bootWatchdogMs?: number) => {
  vi.resetModules();
  vi.useFakeTimers();
  const { armScreenshotFlag } = await import('../src/main/bootstrap/screenshot-flag');
  const { captureHolds } = await import('../src/main/handlers/capture-holds');
  const { bootEvents } = await import('../src/main/boot/boot-events');
  const { bootState } = await import('../src/main/boot/boot-state');
  if (bootWatchdogMs !== undefined) bootState.watchdogMs = bootWatchdogMs;
  armScreenshotFlag(contextFor('boot', timeout), defaultMs);
  return { captureHolds, bootEvents };
};

describe('the --screenshot watchdog', () => {
  it('captures what there is and exits 2 when the window is never revealed in time', async () => {
    await armed(null);
    await vi.advanceTimersByTimeAsync(19_999);
    expect(shots.taken).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(shots.taken).toEqual(['boot']);
    expect(shots.exits).toEqual([2]);
    expect(shots.quits).toBe(0);
    expect(shots.logs.at(-1)).toContain('fired after 20 s (the window was never revealed)');
  });

  it('waits as long as --screenshot-timeout says, then names the holds still open', async () => {
    const { captureHolds, bootEvents } = await armed('45');
    captureHolds.set(1);
    bootEvents.emit('revealed');
    await vi.advanceTimersByTimeAsync(44_000);
    expect(shots.taken).toEqual([]);
    await vi.advanceTimersByTimeAsync(1_000);
    expect(shots.exits).toEqual([2]);
    expect(shots.logs.at(-1)).toContain('fired after 45 s (1 screenshot hold(s) still open)');
    captureHolds.set(0);
  });

  it('takes the app default from bootstrapApp, and warns about a value that is not seconds', async () => {
    await armed('soon', 5_000);
    expect(shots.logs[0]).toContain('--screenshot-timeout=soon is not a count of seconds above 0; waiting 5 s');
    await vi.advanceTimersByTimeAsync(5_000);
    expect(shots.exits).toEqual([2]);
  });

  it('quits with no error code when the capture beats it', async () => {
    const { bootEvents } = await armed('1');
    bootEvents.emit('revealed');
    await vi.advanceTimersByTimeAsync(STABLE_MS);
    expect(shots.quits).toBe(1);
    await vi.advanceTimersByTimeAsync(5_000);
    expect(shots.exits).toEqual([]);
  });
});

describe('the --screenshot watchdog default', () => {
  it('waits as long as the boot watchdog when that is longer, such as the 120 s of a dev launch', async () => {
    await armed(null, undefined, 120_000);
    await vi.advanceTimersByTimeAsync(119_999);
    expect(shots.taken).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(shots.exits).toEqual([2]);
    expect(shots.logs.at(-1)).toContain('fired after 120 s (the window was never revealed)');
  });

  it('keeps 20 s over a shorter production boot watchdog, and --screenshot-timeout still wins over a dev one', async () => {
    await armed(null, undefined, 8_000);
    await vi.advanceTimersByTimeAsync(19_999);
    expect(shots.exits).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(shots.exits).toEqual([2]);
    shots.exits.length = 0;
    await armed('30', undefined, 120_000);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(shots.exits).toEqual([2]);
  });
});

describe('review captures', () => {
  it('wait for the same holds as --screenshot, stable for a frame, and report the holds still open when the wait runs out', async () => {
    vi.resetModules();
    vi.useFakeTimers();
    const { captureHolds } = await import('../src/main/handlers/capture-holds');
    const { awaitCaptureHolds } = await import('../src/main/review/await-capture-holds');
    const checks: unknown[] = [];
    const session = { addCheck: (check: unknown) => { checks.push(check); } } as Parameters<typeof awaitCaptureHolds>[0];
    captureHolds.set(1);
    let done = false;
    void awaitCaptureHolds(session, 'home').then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(1_000);
    expect(done).toBe(false);
    captureHolds.set(0);
    await vi.advanceTimersByTimeAsync(STABLE_MS / 2);
    captureHolds.set(1);
    await vi.advanceTimersByTimeAsync(STABLE_MS * 2);
    expect(done).toBe(false);
    captureHolds.set(0);
    await vi.advanceTimersByTimeAsync(STABLE_MS);
    expect(done).toBe(true);
    expect(checks).toEqual([]);
    captureHolds.set(2);
    const late = awaitCaptureHolds(session, 'settings');
    await vi.advanceTimersByTimeAsync(REVIEW_HOLD_MS);
    await late;
    expect(checks).toEqual([{ id: 'capture-holds', step: 'settings', pass: false, reason: `2 screenshot hold(s) still open after ${REVIEW_HOLD_MS / 1000} s; captured what there was` }]);
    captureHolds.set(0);
  });
});
