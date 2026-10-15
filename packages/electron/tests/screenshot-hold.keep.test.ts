/* @layer electron-main @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BrowserWindow, WebContents } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { MainContext } from '../src/main/types/main-context.type';

const shots = vi.hoisted(() => ({ taken: [] as string[], quits: 0, exits: [] as number[], logs: [] as string[] }));

vi.mock('electron', () => ({ app: { quit: () => { shots.quits += 1; }, exit: (code: number) => { shots.exits.push(code); } } }));
vi.mock('../src/main/handlers/capture-window', () => ({
  captureWindow: (_win: unknown, name: string) => { shots.taken.push(name); return Promise.resolve(`/data/screenshots/${name}.png`); },
}));

const settle = async (): Promise<void> => {
  for (let i = 0; i < 10; i += 1) await Promise.resolve();
};

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

describe('--screenshot', () => {
  it('waits for the reveal, then for every hold the app took to be released', async () => {
    vi.resetModules();
    const { armScreenshotFlag } = await import('../src/main/bootstrap/screenshot-flag');
    const { captureHolds } = await import('../src/main/handlers/capture-holds');
    const { bootEvents } = await import('../src/main/boot/boot-events');
    captureHolds.set(2);
    armScreenshotFlag(contextFor('boot'));
    bootEvents.emit('revealed');
    await settle();
    expect(shots.taken).toEqual([]);
    captureHolds.set(1);
    await settle();
    expect(shots.taken).toEqual([]);
    captureHolds.set(0);
    await settle();
    expect(shots.taken).toEqual(['boot']);
    expect(shots.quits).toBe(1);
  });

  it('shoots at the reveal when the app holds nothing', async () => {
    vi.resetModules();
    const { armScreenshotFlag } = await import('../src/main/bootstrap/screenshot-flag');
    const { bootEvents } = await import('../src/main/boot/boot-events');
    armScreenshotFlag(contextFor('boot'));
    bootEvents.emit('revealed');
    await settle();
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
    await vi.advanceTimersByTimeAsync(0);
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

describe('captureFrame', () => {
  const contents = (devtools: Partial<WebContents['debugger']>, fallback = 'page') => {
    const state = { attached: false };
    return {
      debugger: {
        isAttached: () => state.attached,
        attach: vi.fn(() => { state.attached = true; }),
        detach: vi.fn(() => { state.attached = false; }),
        ...devtools,
      },
      capturePage: () => Promise.resolve({ toPNG: () => Buffer.from(fallback) }),
    } as Partial<WebContents> as WebContents;
  };

  it('takes the frame from the surface through the debugger, which also works for an off-screen window', async () => {
    const { captureFrame } = await import('../src/main/handlers/capture-frame');
    const page = contents({ sendCommand: (method: string) => Promise.resolve(method === 'Page.captureScreenshot' ? { data: Buffer.from('surface').toString('base64') } : {}) });
    expect((await captureFrame(page)).toString()).toBe('surface');
    expect(page.debugger.attach).toHaveBeenCalledWith('1.3');
    expect(page.debugger.detach).toHaveBeenCalled();
  });

  it('falls back to capturePage when the debugger is busy or fails', async () => {
    const { captureFrame } = await import('../src/main/handlers/capture-frame');
    const busy = contents({ attach: () => { throw new Error('Another debugger is already attached'); } });
    expect((await captureFrame(busy)).toString()).toBe('page');
    const failing = contents({ sendCommand: () => Promise.reject(new Error('no surface')) });
    expect((await captureFrame(failing)).toString()).toBe('page');
  });
});
