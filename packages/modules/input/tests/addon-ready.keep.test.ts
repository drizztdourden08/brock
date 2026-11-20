/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { addonReady } from '../ensure-addon/index.mjs';
import type { EnsureResult } from '../ensure-addon/index.mjs';

const READY: EnsureResult[] = ['current', 'installed', 'built'];
const NOT_READY: EnsureResult[] = ['kept', 'unavailable', 'skipped', 'failed'];

describe('the strict addon check', { tags: ['critical'] }, () => {
  it('passes only an addon that matches the pins', () => {
    expect(READY.map(addonReady)).toEqual([true, true, true]);
    expect(NOT_READY.map(addonReady)).toEqual([false, false, false, false]);
  });
});
