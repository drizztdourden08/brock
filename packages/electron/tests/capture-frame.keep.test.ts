/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { WebContents } from 'electron';

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
