/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_LOG_TEXT } from '../src/session/boot/log-text.constants';
import { resolveLogText } from '../src/session/boot/resolve-log-text';

describe('randomizer log text', { tags: ['critical'] }, () => {
  it('keeps the defaults when a game gives no overrides', () => {
    expect(resolveLogText()).toEqual(DEFAULT_LOG_TEXT);
    expect(resolveLogText({}).rerollFailed('boom')).toBe('[Boot] Randomizer generation failed: boom');
  });

  it('applies an override and keeps the other defaults', () => {
    const text = resolveLogText({ rerollFailed: (message) => `custom ${message}` });
    expect(text.rerollFailed('x')).toBe('custom x');
    expect(text.armed('a')).toBe(DEFAULT_LOG_TEXT.armed('a'));
  });

  it('lets armed return null to skip the line', () => {
    expect(resolveLogText({ armed: () => null }).armed('a')).toBeNull();
  });
});
