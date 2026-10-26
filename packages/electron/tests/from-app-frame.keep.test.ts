/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fromAppFrame } from '../src/main/ipc/from-app-frame';

interface Frame {
  origin: string;
  url: string;
}

const state = vi.hoisted(() => ({ server: null as string | null, main: null as object | null }));

vi.mock('../src/main/window/dev-server-url', () => ({ devServerUrl: () => state.server }));
vi.mock('../src/main/window/get-main-window', () => ({ getMainWindow: () => (state.main ? { webContents: state.main } : null) }));

const eventFrom = (frame: Frame | null, top = true) => {
  const sender = { mainFrame: top ? frame : { origin: 'other', url: 'other' } };
  return { sender, senderFrame: frame };
};

beforeEach(() => {
  state.server = null;
  state.main = null;
});

describe('fromAppFrame', () => {
  it('refuses a call with no frame, from a sub frame, or from another origin', () => {
    state.server = 'http://localhost:5173';
    expect(fromAppFrame(eventFrom(null))).toBe(false);
    expect(fromAppFrame(eventFrom({ origin: 'http://localhost:5173', url: 'http://localhost:5173/' }, false))).toBe(false);
    expect(fromAppFrame(eventFrom({ origin: 'https://evil.example', url: 'https://evil.example/' }))).toBe(false);
  });

  it('accepts the dev server origin and the file origin of a built app', () => {
    state.server = 'http://localhost:5173';
    const dev = eventFrom({ origin: 'http://localhost:5173', url: 'http://localhost:5173/index.html' });
    state.main = dev.sender;
    expect(fromAppFrame(dev)).toBe(true);
    state.server = null;
    const built = eventFrom({ origin: 'file://', url: 'file:///app/index.html' });
    state.main = built.sender;
    expect(fromAppFrame(built)).toBe(true);
    expect(fromAppFrame(eventFrom({ origin: 'file://', url: 'https://x.example/' }))).toBe(false);
  });

  it('accepts only the main window unless the caller opts other windows in', () => {
    const widget = eventFrom({ origin: 'file://', url: 'file:///app/widget.html' });
    state.main = {};
    expect(fromAppFrame(widget)).toBe(false);
    expect(fromAppFrame(widget, { anyWindow: true })).toBe(true);
  });
});
