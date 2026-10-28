/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeClipboard, sessionOf } from './clipboard-fixture';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('clipboard change watch', () => {
  it('does not poll until something subscribes', async () => {
    const board = fakeClipboard();
    const fingerprint = vi.spyOn(board, 'fingerprint');
    const { emitted } = sessionOf(board);
    board.write({ text: 'x', privates: [] });
    vi.advanceTimersByTime(5000);
    expect(fingerprint).not.toHaveBeenCalled();
    expect(emitted).toEqual([]);
  });

  it('sends only a flag with no content when the clipboard changes', async () => {
    const board = fakeClipboard();
    const session = sessionOf(board);
    await session.call('clipboard:watch', 'w1');
    vi.advanceTimersByTime(600);
    expect(session.emitted).toEqual([]);
    board.write({ text: 'secret', privates: [] });
    vi.advanceTimersByTime(600);
    expect(session.emitted).toEqual(['clipboard:changed']);
    expect(session.extras).toEqual([[]]);
    vi.advanceTimersByTime(5000);
    expect(session.emitted).toEqual(['clipboard:changed']);
  });

  it('stops polling when the last watcher leaves', async () => {
    const board = fakeClipboard();
    const fingerprint = vi.spyOn(board, 'fingerprint');
    const { call } = sessionOf(board);
    await call('clipboard:watch', 'a');
    await call('clipboard:watch', 'b');
    await call('clipboard:unwatch', 'a');
    vi.advanceTimersByTime(1100);
    const during = fingerprint.mock.calls.length;
    expect(during).toBeGreaterThan(1);
    await call('clipboard:unwatch', 'b');
    vi.advanceTimersByTime(5000);
    expect(fingerprint.mock.calls.length).toBe(during);
  });

  it('stops polling after a reload of the window', async () => {
    const board = fakeClipboard();
    const fingerprint = vi.spyOn(board, 'fingerprint');
    const { call, navigate } = sessionOf(board);
    await call('clipboard:watch', 'a');
    navigate();
    const before = fingerprint.mock.calls.length;
    vi.advanceTimersByTime(5000);
    expect(fingerprint.mock.calls.length).toBe(before);
  });

  it('limits the number of watchers and refuses a bad id', async () => {
    const { call } = sessionOf(fakeClipboard());
    for (let index = 0; index < 16; index += 1) await call('clipboard:watch', `w${index}`);
    await expect(call('clipboard:watch', 'one-too-many')).rejects.toThrow(/At most 16/);
    for (const bad of [undefined, '', 5, 'x'.repeat(65), {}]) {
      await expect(call('clipboard:watch', bad)).rejects.toThrow(/needs an id/);
      await expect(call('clipboard:unwatch', bad)).rejects.toThrow(/needs an id/);
    }
  });

  it('keeps going when the fingerprint throws', async () => {
    const board = fakeClipboard();
    const { call, emitted } = sessionOf(board);
    await call('clipboard:watch', 'a');
    vi.spyOn(board, 'fingerprint').mockImplementationOnce(() => {
      throw new Error('clipboard busy');
    });
    vi.advanceTimersByTime(600);
    expect(emitted).toEqual([]);
    board.write({ text: 'x', privates: [] });
    vi.advanceTimersByTime(600);
    expect(emitted).toEqual(['clipboard:changed']);
  });
});
