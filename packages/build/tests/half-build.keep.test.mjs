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

describe('K1 halfBuildReason', { tags: ['critical'] }, () => {
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

describe('K4 assertLaunchable', { tags: ['critical'] }, () => {
  it('refuses a half build instead of opening a blank window', () => {
    write('dist/electron/main.js', 10);
    expect(() => assertLaunchable(app)).toThrow(/blank window/);
  });
});

const fullBuild = () => {
  write('package.json', 600);
  write('src/main.tsx', 600);
  write('dist/electron/main.js', 60);
  write('dist/preload/preload.mjs', 55);
  write('dist/renderer/index.html', 50);
};

describe('K5 assertLaunchable staleness', { tags: ['critical'] }, () => {
  it('passes a build newer than its sources and its install', () => {
    fullBuild();
    write('node_modules/.modules.yaml', 600);
    expect(assertLaunchable(app)).toBe(join(app, 'dist/electron/main.js'));
  });

  it('refuses a dist older than its sources', () => {
    fullBuild();
    write('src/main.tsx', 5);
    expect(() => assertLaunchable(app)).toThrow(/dist is older than its sources: src changed since the last build.*brock build --if-stale/);
  });

  it('refuses a dist older than the install record', () => {
    fullBuild();
    write('node_modules/.modules.yaml', 5);
    expect(() => assertLaunchable(app)).toThrow(/the install changed since the last build/);
  });

  it('falls back to the lockfile when there is no modules record', () => {
    fullBuild();
    write('pnpm-lock.yaml', 5);
    expect(() => assertLaunchable(app)).toThrow(/the install changed since the last build/);
  });

  it('lets allowStale skip only the stale check', () => {
    fullBuild();
    write('src/main.tsx', 5);
    expect(assertLaunchable(app, { allowStale: true })).toBe(join(app, 'dist/electron/main.js'));
    rmSync(join(app, 'dist/renderer/index.html'));
    expect(() => assertLaunchable(app, { allowStale: true })).toThrow(/blank window/);
  });
});
