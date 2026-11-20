/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { addonReady } from '../ensure-addon/index.mjs';

describe('the strict addon check', { tags: ['critical'] }, () => {
  it('passes only an addon that matches the pins', () => {
    expect(['current', 'installed', 'built'].every((result) => addonReady(result as 'current'))).toBe(true);
    expect(['kept', 'unavailable', 'skipped', 'failed'].some((result) => addonReady(result as 'kept'))).toBe(false);
  });
});
