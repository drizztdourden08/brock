/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { MainContext } from '../src/main/types/main-context.type';
import { windowHandlers } from '../src/main/window/ipc-handlers';

vi.mock('electron', () => ({ screen: {}, BrowserWindow: { getAllWindows: () => [] } }));

type Listener = (event: unknown, ...args: unknown[]) => void;

const listeners = (window: MainContext['window']): Map<string, Listener> => {
  const map = new Map<string, Listener>();
  const on = ((channel: string, fn: Listener) => map.set(channel, fn)) as MainContext['on'];
  const handle = (() => undefined) as MainContext['handle'];
  windowHandlers.register({ on, handle, window } as Partial<MainContext> as MainContext);
  return map;
};

const sendTitle = (window: MainContext['window'], title: string): void => listeners(window).get('window:setTitle')?.({}, title);

describe('the window title channel', () => {
  it('sets the OS title of the app window', () => {
    const titles: string[] = [];
    const win = { setTitle: (title: string) => titles.push(title) };
    sendTitle(() => win as never, 'sprite * - Bxel');
    expect(titles).toEqual(['sprite * - Bxel']);
  });

  it('does nothing without an app window', () => {
    const send = (): void => sendTitle(() => null, 'sprite - Bxel');
    expect(send).not.toThrow();
  });
});
