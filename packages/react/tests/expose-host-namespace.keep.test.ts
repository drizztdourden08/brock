/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { exposeHostNamespace } from '../src/host/expose-host-namespace';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('exposeHostNamespace', () => {
  it('adds a module namespace to the api shim once, and never over a preload one', () => {
    const api: Record<string, unknown> = { display: 'preload' };
    vi.stubGlobal('window', { api });
    exposeHostNamespace('input', 'android');
    exposeHostNamespace('input', 'again');
    exposeHostNamespace('display', 'android');
    expect(api).toEqual({ display: 'preload', input: 'android' });
  });

  it('does nothing before window.api exists', () => {
    vi.stubGlobal('window', {});
    expect(() => { exposeHostNamespace('input', 'android'); }).not.toThrow();
  });
});
