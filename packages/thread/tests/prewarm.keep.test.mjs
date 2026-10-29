/* @layer tooling-scripts @kind test */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

const finishLater = (file, state) => setTimeout(() => {
  const record = JSON.parse(readFileSync(file, 'utf8'));
  writeFileSync(file, JSON.stringify({ ...record, state, reason: 'sync failed' }));
}, 50);

describe('afterPrewarm', () => {
  it('lets a launch go at once when no prewarm runs', async () => {
    const lines = [];
    expect(await afterPrewarm(app(), (line) => lines.push(line))).toBe(false);
    expect(lines).toEqual([]);
  });

  it('waits for a running prewarm and reports how it ended', async () => {
    const dir = app();
    announceJob(prewarmRecord(dir), { pid: process.pid });
    finishLater(prewarmRecord(dir), 'failed');
    const lines = [];
    expect(await afterPrewarm(dir, (line) => lines.push(line))).toBe(true);
    expect(lines[0]).toMatch(/is running \(pid \d+, started \d+ s ago\); waiting for it/);
    expect(lines[1]).toMatch(/failed \(sync failed\); going ahead without it/);
  });

  it('does not wait on a prewarm whose heartbeat stopped', async () => {
    const dir = app();
    announceJob(prewarmRecord(dir), { pid: process.pid, now: () => Date.now() - 60_000 });
    expect(await afterPrewarm(dir, () => {})).toBe(false);
  });
});
