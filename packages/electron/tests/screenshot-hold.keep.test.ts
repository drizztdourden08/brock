/* @layer electron-main @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { WebContents } from 'electron';
import type { MainContext } from '../src/main/types/main-context.type';

const shots = vi.hoisted(() => ({ taken: [] as string[], quits: 0 }));

vi.mock('electron', () => ({ app: { quit: () => { shots.quits += 1; }, exit: () => undefined } }));
vi.mock('../src/main/handlers/capture-window', () => ({
  captureWindow: (_win: unknown, name: string) => { shots.taken.push(name); return Promise.resolve(`/data/screenshots/${name}.png`); },
}));

const settle = async (): Promise<void> => {
  for (let i = 0; i < 10; i += 1) await Promise.resolve();
};

const contextFor = (name: string | null): MainContext => ({
  flags: { flagValue: (flag: string) => (flag === '--screenshot' ? name : null) },
  window: () => ({}),
  log: () => undefined,
}) as Partial<MainContext> as MainContext;

afterEach(() => {
  shots.taken.length = 0;
  shots.quits = 0;
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
