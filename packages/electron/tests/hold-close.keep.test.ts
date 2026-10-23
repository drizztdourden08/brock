/* @layer electron-main @kind test */
import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, it, vi } from 'vitest';

const askWithin = vi.hoisted(() => vi.fn<(...args: unknown[]) => Promise<unknown>>());

vi.mock('../src/main/ipc/ask-within', () => ({ askWithin }));

const { closeApproval } = await import('../src/main/window/close-approval');
const { holdClose } = await import('../src/main/window/hold-close');

const settle = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, 0); });

const createWindow = () => {
  const emitter = new EventEmitter();
  let destroyed = false;
  const win = Object.assign(emitter, {
    isDestroyed: () => destroyed,
    close: vi.fn(() => { emitter.emit('close', { preventDefault: () => undefined }); }),
  });
  const attempt = (): boolean => {
    let prevented = false;
    emitter.emit('close', { preventDefault: () => { prevented = true; } });
    return prevented;
  };
  return { win: win as never, raw: win, attempt, destroy: () => { destroyed = true; } };
};

afterEach(() => {
  askWithin.mockReset();
});

describe('the main window close hold', () => {
  it('holds the close, asks the renderer, and closes on quit', async () => {
    askWithin.mockResolvedValue('quit');
    const { win, raw, attempt } = createWindow();
    holdClose(win);
    expect(attempt()).toBe(true);
    expect(raw.close).not.toHaveBeenCalled();
    await settle();
    expect(askWithin).toHaveBeenCalledWith(expect.any(Number), win, 'window:confirmQuit');
    expect(raw.close).toHaveBeenCalledOnce();
  });

  it('keeps the window open on stay, and asks again on the next close', async () => {
    askWithin.mockResolvedValue('stay');
    const { win, raw, attempt } = createWindow();
    holdClose(win);
    attempt();
    await settle();
    expect(raw.close).not.toHaveBeenCalled();
    attempt();
    await settle();
    expect(askWithin).toHaveBeenCalledTimes(2);
    expect(raw.close).not.toHaveBeenCalled();
  });

  it('asks once for a second close made while the first answer is pending', async () => {
    let answer: (value: string) => void = () => undefined;
    askWithin.mockReturnValue(new Promise((resolve) => { answer = resolve; }));
    const { win, raw, attempt } = createWindow();
    holdClose(win);
    expect(attempt()).toBe(true);
    expect(attempt()).toBe(true);
    await settle();
    expect(askWithin).toHaveBeenCalledOnce();
    answer('quit');
    await settle();
    expect(raw.close).toHaveBeenCalledOnce();
  });

});

describe('the main window close hold when the renderer cannot answer', () => {
  it('closes when the renderer has no handler yet', async () => {
    askWithin.mockRejectedValue(new Error('no handler is registered for "window:confirmQuit"'));
    const { win, raw, attempt } = createWindow();
    holdClose(win);
    attempt();
    await settle();
    expect(raw.close).toHaveBeenCalledOnce();
  });

  it('keeps the window open when the renderer does not answer in time', async () => {
    askWithin.mockRejectedValue(new Error('ask "window:confirmQuit" timed out after 600000 ms'));
    const { win, raw, attempt } = createWindow();
    holdClose(win);
    attempt();
    await settle();
    expect(raw.close).not.toHaveBeenCalled();
    askWithin.mockResolvedValue('quit');
    attempt();
    await settle();
    expect(raw.close).toHaveBeenCalledOnce();
  });

  it('does nothing when the window is gone before the answer', async () => {
    askWithin.mockResolvedValue('quit');
    const { win, raw, attempt, destroy } = createWindow();
    holdClose(win);
    attempt();
    destroy();
    await settle();
    expect(raw.close).not.toHaveBeenCalled();
  });

  it('lets a close the renderer already approved through, once', () => {
    askWithin.mockResolvedValue('stay');
    const { win, attempt } = createWindow();
    holdClose(win);
    closeApproval.grant(win);
    expect(attempt()).toBe(false);
    expect(askWithin).not.toHaveBeenCalled();
    expect(attempt()).toBe(true);
  });
});
