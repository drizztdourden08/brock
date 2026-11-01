/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { announceJob } from '@drizztdourden08/build-cache/jobs';
import { afterPrewarm, prewarmRecord } from '../src/launch/prewarm.mjs';

const made = [];
afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const app = () => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-prewarm-'));
  made.push(dir);
  return dir;
};

describe('K1 afterPrewarm', { tags: ['critical'] }, () => {
  it('lets a launch go at once when no prewarm runs', async () => {
    const lines = [];
    expect(await afterPrewarm(app(), (line) => lines.push(line))).toBe(false);
    expect(lines).toEqual([]);
  });

  it('does not wait on a prewarm whose heartbeat stopped', async () => {
    const dir = app();
    announceJob(prewarmRecord(dir), { pid: process.pid, now: () => Date.now() - 60_000 });
    expect(await afterPrewarm(dir, () => {})).toBe(false);
  });
});
