/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { buildIfStale } from '../src/launch/build-if-stale.mjs';

describe('buildIfStale, before a production launch', () => {
  it('asks the app to build when dist is older than its sources, showing the output', () => {
    const calls = [];
    const run = (appDir, args, opts) => {
      calls.push({ appDir, args, opts });
      return { status: 0, output: '' };
    };
    expect(buildIfStale('/app', run)).toBeNull();
    expect(calls).toEqual([{ appDir: '/app', args: ['build', '--if-stale'], opts: { inherit: true } }]);
  });

  it('refuses the launch when that build fails, and leaves an app with no brock-build to the dist check', () => {
    expect(buildIfStale('/app', () => ({ status: 2, output: '' }))).toBe('brock build failed (exit 2)');
    expect(buildIfStale('/app', () => null)).toBeNull();
  });
});
