/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { announce } from '../src/announce/announce';
import { ANNOUNCE_CLEAR_MS, ANNOUNCE_SET_DELAY_MS } from '../src/announce/announce.constants';
import { Announcer } from '../src/announce/Announcer';
import { useAnnounceStore } from '../src/announce/useAnnounceStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let root: Root | null = null;

const region = (politeness: string): HTMLElement | null => document.querySelector<HTMLElement>(`[data-announcer="${politeness}"]`);
const textOf = (politeness: string): string | undefined => region(politeness)?.textContent;
const settle = (): void => {
  act(() => {
    vi.advanceTimersByTime(ANNOUNCE_SET_DELAY_MS + 1);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(createElement(Announcer)));
});

afterEach(() => {
  act(() => {
    vi.runOnlyPendingTimers();
    root?.unmount();
  });
  root = null;
  vi.useRealTimers();
  useAnnounceStore.setState({ polite: '', assertive: '' });
  document.body.innerHTML = '';
});

describe('the announcer', () => {
  it('mounts one polite status region and one assertive alert region, both empty', () => {
    expect(region('polite')?.getAttribute('role')).toBe('status');
    expect(region('polite')?.getAttribute('aria-live')).toBe('polite');
    expect(region('assertive')?.getAttribute('role')).toBe('alert');
    expect(region('assertive')?.getAttribute('aria-live')).toBe('assertive');
    expect(textOf('polite')).toBe('');
    expect(textOf('assertive')).toBe('');
  });

  it('writes a message to the polite region by default', () => {
    act(() => announce('Saved hero'));
    settle();
    expect(textOf('polite')).toBe('Saved hero');
    expect(textOf('assertive')).toBe('');
  });

  it('writes to the assertive region when asked', () => {
    act(() => announce('Connection lost', { politeness: 'assertive' }));
    settle();
    expect(textOf('assertive')).toBe('Connection lost');
    expect(textOf('polite')).toBe('');
  });

  it('clears the region before it repeats the same message, so a screen reader says it again', () => {
    act(() => announce('Tool changed'));
    settle();
    expect(textOf('polite')).toBe('Tool changed');
    act(() => announce('Tool changed'));
    expect(textOf('polite')).toBe('');
    settle();
    expect(textOf('polite')).toBe('Tool changed');
  });

  it('empties the region after a while and ignores a blank message', () => {
    act(() => announce('   '));
    settle();
    expect(textOf('polite')).toBe('');
    act(() => announce('Done'));
    settle();
    act(() => {
      vi.advanceTimersByTime(ANNOUNCE_CLEAR_MS + 1);
    });
    expect(textOf('polite')).toBe('');
  });
});
