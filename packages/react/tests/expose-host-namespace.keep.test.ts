/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { exposeHostNamespace } from '../src/host/expose-host-namespace';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('K4 exposeHostNamespace', { tags: ['critical'] }, () => {
  it('adds a module namespace to the api shim once, and never over a preload one', () => {
    const api: Record<string, unknown> = { display: 'preload' };
    vi.stubGlobal('window', { api });
    exposeHostNamespace('input', 'android');
    exposeHostNamespace('input', 'again');
    exposeHostNamespace('display', 'android');
    expect(api).toEqual({ display: 'preload', input: 'android' });
  });
});
