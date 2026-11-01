/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { buildIfStale } from '../src/launch/build-if-stale.mjs';

describe('K1 buildIfStale, before a production launch', { tags: ['critical'] }, () => {
  it('refuses the launch when that build fails, and leaves an app with no brock-build to the dist check', () => {
    expect(buildIfStale('/app', () => ({ status: 2, output: '' }))).toBe('brock build failed (exit 2)');
    expect(buildIfStale('/app', () => null)).toBeNull();
  });
});
