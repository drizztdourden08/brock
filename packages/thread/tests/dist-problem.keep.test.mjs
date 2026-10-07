/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { distProblem } from '../src/launch/dist-problem.mjs';

const made = [];

const appWith = (ages) => {
  const app = mkdtempSync(join(tmpdir(), 'brock-dist-'));
  made.push(app);
  for (const [rel, secondsAgo] of Object.entries(ages)) {
    const file = join(app, rel);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, rel);
    const at = new Date(Date.now() - secondsAgo * 1000);
    utimesSync(file, at, at);
  }
  return app;
};

afterAll(() => {
  for (const app of made) rmSync(app, { recursive: true, force: true });
});

describe('distProblem', () => {
  it('passes a full build', () => {
    expect(distProblem(appWith({ 'dist/electron/main.js': 60, 'dist/preload/preload.mjs': 55, 'dist/renderer/index.html': 50 }))).toBeNull();
  });

  it('names the missing output, as a dev launch leaves no renderer', () => {
    expect(distProblem(appWith({ 'dist/electron/main.js': 10, 'dist/preload/preload.mjs': 10 }))).toMatch(/index\.html is missing/);
  });

  it('flags a main rebuilt by a dev launch after the last build', () => {
    const app = appWith({ 'dist/renderer/index.html': 600, 'dist/electron/main.js': 10, 'dist/preload/preload.mjs': 10 });
    expect(distProblem(app)).toMatch(/dev launch rebuilt main/);
  });
});
