/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { createPlatform } from '@drizztdourden08/brock-core';
import type { Platform } from '@drizztdourden08/brock-core';
import { afterEach, describe, expect, it } from 'vitest';
import { useTitleBarShown } from '../src/app/BrockApp/behavior/useTitleBarShown';
import { createWebFactory } from '../src/platform/hosts/web-factory';
import { PlatformContext } from '../src/platform/platform-context';
import { platformState } from '../src/platform/platform-state';
import { StoragePage } from '../src/storage/StoragePage';
import { setDataDomains } from '../src/storage/set-data-domains';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let root: Root | null = null;

const mount = (element: ReturnType<typeof createElement>): HTMLElement => {
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(element));
  return host;
};

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = '';
  Reflect.deleteProperty(window, 'Capacitor');
  setDataDomains([]);
  platformState.platform = null;
});

const settle = async (): Promise<void> => {
  await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 0); }); });
};

const filesystem = {
  addListener: () => ({ remove: () => undefined }),
  readdir: ({ path }: { path: string }) => Promise.resolve({ files: path === 'saves' ? [{ name: 'a.sav', type: 'file', size: 2048 }] : [] }),
  getUri: () => Promise.resolve({ uri: 'file:///data/app/files' }),
};

describe('the Storage page on a phone', () => {
  it('shows each declared folder with its size and no action it cannot run', async () => {
    Object.assign(window, { Capacitor: { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: { Filesystem: filesystem } } });
    setDataDomains([{ domain: 'saves', label: 'Saves', dir: 'saves' }, { domain: 'media', label: 'Media', dir: 'media' }]);
    const host = mount(createElement(StoragePage));
    await settle();
    const text = host.textContent;
    expect(text).toContain('Saves');
    expect(text).toContain('2.0 KB · 1 item');
    expect(text).toContain('Android (app storage)');
    expect(text).not.toContain('Export');
    expect(text).not.toContain('only available in the desktop app');
    expect([...host.querySelectorAll('button')].map((button) => button.textContent)).toEqual([]);
  });
});

const platformOn = (formFactor: 'mobile' | 'desktop'): Platform => {
  const web = createWebFactory();
  return createPlatform({ ...web, info: { ...web.info, formFactor }, capabilities: { ...web.capabilities, titleBar: true } });
};

const Probe = ({ onMobile }: { onMobile: boolean }) => (useTitleBarShown(onMobile) ? 'shown' : 'hidden');

describe('the title bar on mobile', () => {
  it('stays by default, and an app can leave it out on a phone only', () => {
    const shown = (formFactor: 'mobile' | 'desktop', onMobile: boolean): string => {
      const host = mount(createElement(PlatformContext.Provider, { value: platformOn(formFactor) }, createElement(Probe, { onMobile })));
      const text = host.textContent;
      act(() => root?.unmount());
      root = null;
      return text;
    };
    expect(shown('mobile', true)).toBe('shown');
    expect(shown('mobile', false)).toBe('hidden');
    expect(shown('desktop', false)).toBe('shown');
  });
});
