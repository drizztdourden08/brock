/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ToolState, ToolsApi } from '../src/tools.type';
import { useTool } from '../src/renderer/useTool';

vi.mock('@drizztdourden08/brock-react', () => ({
  jobs: { open: () => undefined },
  hostApi: () => (window as Window & { api?: unknown }).api ?? null,
}));

const stateOf = (status: ToolState['status']): ToolState => ({
  id: 'runtime', label: 'Runtime', status, source: status === 'ready' ? 'path' : null, paths: null, canInstall: false, hint: null,
});

const fakeApi = () => {
  let status: ToolState['status'] = 'unavailable';
  const listeners = new Set<(id: string) => void>();
  const api: ToolsApi = {
    list: () => Promise.resolve([]),
    state: vi.fn(() => Promise.resolve(stateOf(status))),
    install: () => Promise.resolve({ success: false, error: 'no' }),
    onChanged: (listener) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
  const setStatus = (next: ToolState['status']): void => { status = next; };
  return { api, listeners, setStatus };
};

const flush = () => act(async () => { await Promise.resolve(); });

afterEach(() => {
  Reflect.deleteProperty(window, 'api');
  document.body.replaceChildren();
});

describe('useTool', () => {
  it('locates the tool again on window focus and when main says it changed', async () => {
    const { api, listeners, setStatus } = fakeApi();
    Object.assign(window, { api: { tools: api } });
    const seen: (string | undefined)[] = [];
    const Probe = () => {
      seen.push(useTool('runtime').state?.status);
      return null;
    };
    document.body.innerHTML = '<div id="host"></div>';
    const root = createRoot(document.getElementById('host') as HTMLElement);
    act(() => root.render(createElement(Probe)));
    await flush();
    expect(seen.at(-1)).toBe('unavailable');
    setStatus('ready');
    window.dispatchEvent(new Event('focus'));
    await flush();
    expect(seen.at(-1)).toBe('ready');
    setStatus('missing');
    listeners.forEach((listener) => listener('runtime'));
    await flush();
    expect(seen.at(-1)).toBe('missing');
    act(() => root.unmount());
    expect(listeners.size).toBe(0);
  });
});
