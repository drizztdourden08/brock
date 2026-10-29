/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { afterPrewarm, runningPrewarm } from '../src/launch/prewarm.mjs';

const made = [];
afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const appWith = (record) => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-prewarm-'));
  made.push(dir);
  mkdirSync(join(dir, 'node_modules', '.vite'), { recursive: true });
  if (record) writeFileSync(join(dir, 'node_modules', '.vite', 'brock-prewarm.json'), JSON.stringify(record));
  return dir;
};

describe('prewarm', () => {
  it('sees a live pre-bundle, and ignores a finished, stale or missing one', () => {
    expect(runningPrewarm(appWith({ pid: process.pid, startedAt: Date.now() }))).toBe(process.pid);
    expect(runningPrewarm(appWith({ pid: process.pid, startedAt: Date.now() - 60 * 60 * 1000 }))).toBeNull();
    expect(runningPrewarm(appWith({ pid: 999_999_999, startedAt: Date.now() }))).toBeNull();
    expect(runningPrewarm(appWith(null))).toBeNull();
  });

  it('lets a launch go at once when nothing runs', async () => {
    const lines = [];
    await afterPrewarm(appWith({ pid: 999_999_999, startedAt: Date.now() }), (line) => lines.push(line));
    expect(lines).toEqual([]);
  });
});
