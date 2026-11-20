/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { eventOf, fakeClipboard, senderOf, sessionOf } from './clipboard-fixture';

vi.mock('../src/main/window/dev-server-url', () => ({ devServerUrl: () => null }));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('K1 clipboard change watch', { tags: ['critical'] }, () => {
  it('does not poll until something subscribes', async () => {
    const board = fakeClipboard();
    const fingerprint = vi.spyOn(board, 'fingerprint');
    const { emitted } = sessionOf(board);
    await board.write({ text: 'x', privates: [] });
    await vi.advanceTimersByTimeAsync(5000);
    expect(fingerprint).not.toHaveBeenCalled();
    expect(emitted).toEqual([]);
  });

  it('sends only a flag with no content when the clipboard changes', async () => {
    const board = fakeClipboard();
    const session = sessionOf(board);
    await session.call('clipboard:watch', 'w1');
    await vi.advanceTimersByTimeAsync(600);
    expect(session.emitted).toEqual([]);
    await board.write({ text: 'secret', privates: [] });
    await vi.advanceTimersByTimeAsync(600);
    expect(session.emitted).toEqual(['clipboard:changed']);
    expect(session.extras).toEqual([[]]);
    await vi.advanceTimersByTimeAsync(5000);
    expect(session.emitted).toEqual(['clipboard:changed']);
  });

  it('stops polling when the last watcher leaves', async () => {
    const board = fakeClipboard();
    const fingerprint = vi.spyOn(board, 'fingerprint');
    const { call } = sessionOf(board);
    await call('clipboard:watch', 'a');
    await call('clipboard:watch', 'b');
    await call('clipboard:unwatch', 'a');
    await vi.advanceTimersByTimeAsync(1100);
    const during = fingerprint.mock.calls.length;
    expect(during).toBeGreaterThan(1);
    await call('clipboard:unwatch', 'b');
    await vi.advanceTimersByTimeAsync(5000);
    expect(fingerprint.mock.calls.length).toBe(during);
  });
});

describe('K1 clipboard watch pacing', { tags: ['critical'] }, () => {
  it('does not start a poll while the previous one is still running', async () => {
    const board = fakeClipboard();
    const { call } = sessionOf(board);
    await call('clipboard:watch', 'a');
    await vi.advanceTimersByTimeAsync(100);
    const fingerprint = vi.spyOn(board, 'fingerprint').mockReturnValue(new Promise<string>(() => undefined));
    await vi.advanceTimersByTimeAsync(5000);
    expect(fingerprint).toHaveBeenCalledTimes(1);
  });
});

describe('K1 clipboard watch ownership', { tags: ['critical'] }, () => {
  const polls = async (board: ReturnType<typeof fakeClipboard>): Promise<number> => {
    const fingerprint = vi.spyOn(board, 'fingerprint');
    await vi.advanceTimersByTimeAsync(5000);
    return fingerprint.mock.calls.length;
  };

  it('drops a window watches when it navigates, and keeps the others', async () => {
    const board = fakeClipboard();
    const main = sessionOf(board);
    const widget = senderOf();
    await main.call('clipboard:watch', 'a');
    await main.callFrom(eventOf(widget), 'clipboard:watch', 'a');
    main.navigate();
    await board.write({ text: 'x', privates: [] });
    await vi.advanceTimersByTimeAsync(600);
    expect(main.sender.sent).toEqual([]);
    expect(widget.sent).toEqual(['clipboard:changed']);
    main.navigate(widget);
    expect(await polls(board)).toBe(0);
  });

  it('drops the watches of a window that is destroyed or whose process is gone', async () => {
    for (const name of ['destroyed', 'render-process-gone']) {
      const board = fakeClipboard();
      const session = sessionOf(board);
      await session.call('clipboard:watch', 'a');
      session.sender.fire(name);
      expect(await polls(board), name).toBe(0);
    }
  });

  it('stops polling for a window that is destroyed without an event', async () => {
    const board = fakeClipboard();
    const session = sessionOf(board);
    await session.call('clipboard:watch', 'a');
    session.sender.destroyed = true;
    await board.write({ text: 'x', privates: [] });
    await vi.advanceTimersByTimeAsync(600);
    expect(session.sender.sent).toEqual([]);
    expect(await polls(board)).toBe(0);
  });

  it('ignores a navigation inside the same document', async () => {
    const board = fakeClipboard();
    const session = sessionOf(board);
    await session.call('clipboard:watch', 'a');
    session.sender.fire('did-start-navigation', { isMainFrame: true, isSameDocument: true });
    session.sender.fire('did-start-navigation', { isMainFrame: false, isSameDocument: false });
    await board.write({ text: 'x', privates: [] });
    await vi.advanceTimersByTimeAsync(600);
    expect(session.sender.sent).toEqual(['clipboard:changed']);
  });
});

describe('K1 clipboard watch between windows and limits', { tags: ['critical'] }, () => {
  it('tells each window that owns a watch, a widget window included, and no other', async () => {
    const board = fakeClipboard();
    const main = sessionOf(board);
    const widget = senderOf();
    const bystander = senderOf();
    await main.call('clipboard:watch', 'a');
    await main.callFrom(eventOf(widget), 'clipboard:watch', 'a');
    await board.write({ text: 'x', privates: [] });
    await vi.advanceTimersByTimeAsync(600);
    expect(main.sender.sent).toEqual(['clipboard:changed']);
    expect(widget.sent).toEqual(['clipboard:changed']);
    expect(bystander.sent).toEqual([]);
  });

  it('lets one window unwatch without touching another window that uses the same id', async () => {
    const board = fakeClipboard();
    const main = sessionOf(board);
    const widget = senderOf();
    await main.call('clipboard:watch', 'same');
    await main.callFrom(eventOf(widget), 'clipboard:watch', 'same');
    await main.callFrom(eventOf(widget), 'clipboard:unwatch', 'same');
    await board.write({ text: 'x', privates: [] });
    await vi.advanceTimersByTimeAsync(600);
    expect(main.sender.sent).toEqual(['clipboard:changed']);
    expect(widget.sent).toEqual([]);
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
    vi.spyOn(board, 'fingerprint').mockRejectedValueOnce(new Error('clipboard busy'));
    await vi.advanceTimersByTimeAsync(600);
    expect(emitted).toEqual([]);
    await board.write({ text: 'x', privates: [] });
    await vi.advanceTimersByTimeAsync(600);
    expect(emitted).toEqual(['clipboard:changed']);
  });
});
