/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { halfBuildReason } from '../src/freshness/half-build-reason.mjs';
import { assertLaunchable } from '../src/testing/assert-launchable.mjs';

let app = '';

const write = (rel, secondsAgo) => {
  const file = join(app, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, 'x');
  const at = new Date(Date.now() - secondsAgo * 1000);
  utimesSync(file, at, at);
};

beforeEach(() => {
  app = mkdtempSync(join(tmpdir(), 'brock-half-build-'));
});

afterEach(() => {
  rmSync(app, { recursive: true, force: true });
});

describe('halfBuildReason', () => {
  it('passes a full build, where the renderer is written after main', () => {
    write('dist/electron/main.js', 60);
    write('dist/renderer/index.html', 50);
    expect(halfBuildReason(app)).toBeNull();
  });

  it('flags a dev launch that built main with no renderer', () => {
    write('dist/electron/main.js', 10);
    expect(halfBuildReason(app)).toMatch(/index\.html is missing/);
  });

  it('flags a dev launch that rebuilt main after the last build', () => {
    write('dist/renderer/index.html', 600);
    write('dist/electron/main.js', 10);
    expect(halfBuildReason(app)).toMatch(/newer than dist\/renderer\/index\.html/);
  });

  it('leaves an app with no build to the missing-main message', () => {
    expect(halfBuildReason(app)).toBeNull();
  });
});

describe('assertLaunchable', () => {
  it('refuses a half build instead of opening a blank window', () => {
    write('dist/electron/main.js', 10);
    expect(() => assertLaunchable(app)).toThrow(/blank window/);
  });
});
