/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getPlatform } from '../src/platform/get-platform';
import { createWebFactory } from '../src/platform/hosts/web-factory';
import { COARSE_QUERY, PHONE_QUERY } from '../src/platform/hosts/web-device.constants';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { usePlatform } from '../src/platform/usePlatform';
import { isShown } from '../src/screens/show/is-shown';
import { useShowContext } from '../src/screens/show/useShowContext';
import { showHarness } from './show-harness';

type Listener = () => void;

const media = { phone: false, coarse: false };
const listeners = new Map<string, Set<Listener>>();
const original = window.matchMedia;

const matchesOf = (query: string): boolean => {
  if (query === PHONE_QUERY) return media.phone;
  return query === COARSE_QUERY ? media.coarse : false;
};

interface FakeMediaList {
  readonly matches: boolean;
  media: string;
  addEventListener: (type: string, listener: Listener) => void;
  removeEventListener: (type: string, listener: Listener) => void;
}

const fakeMatchMedia = (query: string): FakeMediaList => ({
  get matches() { return matchesOf(query); },
  media: query,
  addEventListener: (_type, listener) => { listeners.set(query, (listeners.get(query) ?? new Set()).add(listener)); },
  removeEventListener: (_type, listener) => { listeners.get(query)?.delete(listener); },
});

const turn = (next: typeof media): void => {
  Object.assign(media, next);
  act(() => { for (const listener of new Set([...listeners.values()].flatMap((set) => [...set]))) listener(); });
};

beforeEach(() => {
  Object.assign(window, { matchMedia: fakeMatchMedia });
});

afterEach(() => {
  showHarness.resetShow();
  Object.assign(window, { matchMedia: original });
  Object.assign(media, { phone: false, coarse: false });
  listeners.clear();
});

describe('a phone browser on the web host', () => {
  it('reports a mobile touch form factor where a coarse pointer meets a narrow viewport', () => {
    expect(createWebFactory().info).toMatchObject({ host: 'web', formFactor: 'desktop', input: 'pointer' });
    Object.assign(media, { phone: true, coarse: true });
    expect(createWebFactory().info).toMatchObject({ host: 'web', formFactor: 'mobile', input: 'touch' });
    Object.assign(media, { phone: false, coarse: true });
    expect(createWebFactory().info).toMatchObject({ formFactor: 'desktop', input: 'touch' });
  });

  it("drops the picker filter with anyType: 'mobile' in a phone's browser only", () => {
    const accepts: string[] = [];
    const click = HTMLInputElement.prototype.click;
    HTMLInputElement.prototype.click = function record(this: HTMLInputElement) { accepts.push(this.accept); };
    const { filePicker } = createWebFactory().ports;
    void filePicker().pickFile({ extensions: ['sav'], anyType: 'mobile' });
    Object.assign(media, { phone: true, coarse: true });
    void filePicker().pickFile({ extensions: ['sav'], anyType: 'mobile' });
    HTMLInputElement.prototype.click = click;
    expect(accepts).toEqual(['.sav', '']);
  });

  it('follows the viewport, so show rules and the page see the change', () => {
    const Reader = () => {
      const { info } = usePlatform();
      const show = useShowContext();
      return createElement('output', null, `${info.formFactor} ${show.formFactor} ${info.input}`);
    };
    const host = showHarness.render(createElement(PlatformProvider, null, createElement(Reader)));
    expect(host.textContent).toBe('desktop desktop pointer');
    const phoneOnly = { when: ({ formFactor }: { formFactor: string }) => formFactor === 'mobile' };
    expect(isShown(phoneOnly)).toBe(false);

    turn({ phone: true, coarse: true });
    expect(host.textContent).toBe('mobile mobile touch');
    expect(getPlatform().info.formFactor).toBe('mobile');
    expect(isShown(phoneOnly)).toBe(true);
    expect(document.documentElement.classList.contains('platform-mobile')).toBe(true);

    turn({ phone: false, coarse: false });
    expect(host.textContent).toBe('desktop desktop pointer');
    expect(document.documentElement.classList.contains('platform-mobile')).toBe(false);
  });

  it('stops listening when the provider unmounts', () => {
    showHarness.render(createElement(PlatformProvider, null, null));
    expect([...listeners.values()].map((set) => set.size)).toEqual([1, 1]);
    showHarness.unmount();
    expect([...listeners.values()].map((set) => set.size)).toEqual([0, 0]);
  });
});
