/* @layer electron-main @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCloseWindow, settle } from './hold-close-harness';

const askWithin = vi.hoisted(() => vi.fn<(...args: unknown[]) => Promise<unknown>>());

vi.mock('../src/main/ipc/ask-within', () => ({ askWithin }));

const { closeApproval } = await import('../src/main/window/close-approval');
const { closeGuardState } = await import('../src/main/window/close-guard-state');
const { holdClose } = await import('../src/main/window/hold-close');

const answers = (confirm: () => Promise<unknown>): void => {
  askWithin.mockImplementation((_timeout, _win, channel) => (channel === 'window:pingQuit' ? Promise.resolve(true) : confirm()));
};

const guardedWindow = () => {
  const made = createCloseWindow();
  closeGuardState.set(made.win, true);
  holdClose(made.win);
  return made;
};

afterEach(() => {
  askWithin.mockReset();
});

describe('the main window close hold without a guard', () => {
  it('closes at once and asks nothing when the renderer has no guard', () => {
    const { win, attempt } = createCloseWindow();
    holdClose(win);
    expect(attempt()).toBe(false);
    expect(askWithin).not.toHaveBeenCalled();
  });

  it('closes at once again after the renderer drops its last guard', () => {
    const { win, attempt } = createCloseWindow();
    holdClose(win);
    closeGuardState.set(win, true);
    closeGuardState.set(win, false);
    expect(attempt()).toBe(false);
    expect(askWithin).not.toHaveBeenCalled();
  });

  it('lets a close the renderer already approved through, once', () => {
    answers(() => Promise.resolve('stay'));
    const { win, attempt } = guardedWindow();
    closeApproval.grant(win);
    expect(attempt()).toBe(false);
    expect(askWithin).not.toHaveBeenCalled();
    expect(attempt()).toBe(true);
  });
});

describe('the main window close hold with a guard', () => {
  it('holds the close, pings, asks the renderer without a deadline, and closes on quit', async () => {
    answers(() => Promise.resolve('quit'));
    const { win, raw, attempt } = guardedWindow();
    expect(attempt()).toBe(true);
    expect(raw.close).not.toHaveBeenCalled();
    await settle();
    expect(askWithin).toHaveBeenNthCalledWith(1, 5000, win, 'window:pingQuit');
    expect(askWithin).toHaveBeenNthCalledWith(2, 2_147_483_647, win, 'window:confirmQuit');
    expect(raw.close).toHaveBeenCalledOnce();
  });

  it('keeps the window open on stay, and asks again on the next close', async () => {
    answers(() => Promise.resolve('stay'));
    const { raw, attempt } = guardedWindow();
    attempt();
    await settle();
    expect(raw.close).not.toHaveBeenCalled();
    attempt();
    await settle();
    expect(askWithin.mock.calls.filter((call) => call[2] === 'window:confirmQuit')).toHaveLength(2);
    expect(raw.close).not.toHaveBeenCalled();
  });

  it('asks once for a second close made while the first answer is pending', async () => {
    let answer: (value: string) => void = () => undefined;
    answers(() => new Promise((resolve) => { answer = resolve; }));
    const { raw, attempt } = guardedWindow();
    expect(attempt()).toBe(true);
    expect(attempt()).toBe(true);
    await settle();
    expect(askWithin.mock.calls.filter((call) => call[2] === 'window:confirmQuit')).toHaveLength(1);
    answer('quit');
    await settle();
    expect(raw.close).toHaveBeenCalledOnce();
  });

  it('closes when the renderer has no handler yet', async () => {
    askWithin.mockRejectedValue(new Error('no handler is registered for "window:pingQuit"'));
    const { raw, attempt } = guardedWindow();
    attempt();
    await settle();
    expect(raw.close).toHaveBeenCalledOnce();
  });

  it('does nothing when the window is gone before the answer', async () => {
    answers(() => Promise.resolve('quit'));
    const { raw, attempt, destroy } = guardedWindow();
    attempt();
    destroy();
    await settle();
    expect(raw.close).not.toHaveBeenCalled();
  });
});
