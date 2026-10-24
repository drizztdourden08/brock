/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { isBenignBrowserError } from '../src/log/is-benign-browser-error';

describe('isBenignBrowserError', () => {
  it('matches the ResizeObserver loop notice exactly and nothing else', () => {
    expect(isBenignBrowserError('ResizeObserver loop completed with undelivered notifications.')).toBe(true);
    expect(isBenignBrowserError('ResizeObserver loop limit exceeded')).toBe(false);
    expect(isBenignBrowserError('Uncaught error: ResizeObserver loop completed with undelivered notifications.')).toBe(false);
    expect(isBenignBrowserError('boom')).toBe(false);
  });
});
