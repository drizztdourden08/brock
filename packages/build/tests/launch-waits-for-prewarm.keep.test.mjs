/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const waited = vi.hoisted(() => []);
vi.mock('@drizztdourden08/brock-thread', async (actual) => ({
  ...(await actual()),
  afterPrewarm: (dir) => {
    waited.push(dir);
    return Promise.resolve(false);
  },
}));

const { runStart } = await import('../src/commands/start.mjs');
const { runElectronVite } = await import('../src/commands/electron-vite.mjs');

const made = [];
afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
  waited.splice(0);
});

const app = () => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-launch-wait-'));
  made.push(dir);
  writeFileSync(join(dir, 'package.json'), '{}');
  return dir;
};

describe('every launch waits for a running prewarm', () => {
  it('brock start waits before it touches dist or Electron', async () => {
    const dir = app();
    await runStart({ rootDir: dir });
    expect(waited).toEqual([dir]);
  });

  it('brock dev and brock build wait before they restore Electron', async () => {
    const dir = app();
    await runElectronVite('build', { rootDir: dir }).catch(() => 1);
    expect(waited).toEqual([dir]);
  });
});
