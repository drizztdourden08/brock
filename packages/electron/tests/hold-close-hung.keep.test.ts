/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { acceptAskReply } from '../src/main/ipc/accept-ask-reply';
import { closeGuardState } from '../src/main/window/close-guard-state';
import { holdClose } from '../src/main/window/hold-close';
import { createCloseWindow } from './hold-close-harness';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const guardedWindow = () => {
  const made = createCloseWindow();
  closeGuardState.set(made.win, true);
  holdClose(made.win);
  return made;
};

describe('the close hold with a renderer that hangs', () => {
  it('closes when the renderer does not acknowledge within the ping time', async () => {
    const { raw, contents, attempt } = guardedWindow();
    attempt();
    expect(contents.send).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(4_999);
    expect(raw.close).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2);
    expect(raw.close).toHaveBeenCalledOnce();
  });

  it('waits on the user for as long as it takes once the renderer acknowledged', async () => {
    const { raw, contents, attempt } = guardedWindow();
    attempt();
    const [, pingId] = contents.send.mock.calls[0] as [string, number];
    acceptAskReply(contents.id, pingId, { ok: true, value: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(contents.send).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(3_600_000);
    expect(raw.close).not.toHaveBeenCalled();
    const [, confirmId] = contents.send.mock.calls[1] as [string, number];
    acceptAskReply(contents.id, confirmId, { ok: true, value: 'quit' });
    await vi.advanceTimersByTimeAsync(0);
    expect(raw.close).toHaveBeenCalledOnce();
  });
});
