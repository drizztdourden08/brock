/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { setImmediate } from 'node:timers';
import { afterEach, describe, expect, it } from 'vitest';
import { ensureAppSynced, runGuideLater } from '../src/launch/ensure-app-synced.mjs';

const apps = [];

afterEach(() => {
  apps.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

const writeFiles = (root, files) => {
  Object.entries(files).forEach(([path, content]) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  });
};

const BUILD = 'node_modules/@drizztdourden08/brock-build';

const SYNC_MODULE = (problem) => `import { appendFileSync } from 'node:fs';
export const syncIfStaleLater = async (appDir, label) => {
  appendFileSync(process.env.SYNC_LOG, JSON.stringify(['sync', label]) + '\\n');
  return { problem: ${JSON.stringify(problem)}, guide: async () => appendFileSync(process.env.SYNC_LOG, JSON.stringify(['guide']) + '\\n') };
};
`;

const app = ({ inProcess, problem = null }) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-app-synced-'));
  apps.push(root);
  const log = join(root, 'sync.log');
  process.env.SYNC_LOG = log;
  const manifest = { name: '@drizztdourden08/brock-build', bin: { brock: 'bin/brock.cjs' }, ...(inProcess ? { exports: { './sync-if-stale': './src/sync-if-stale.mjs', './package.json': './package.json' } } : {}) };
  writeFiles(root, {
    'package.json': JSON.stringify({ name: 'fixture' }),
    [`${BUILD}/package.json`]: JSON.stringify(manifest),
    [`${BUILD}/bin/brock.cjs`]: "require('node:fs').appendFileSync(process.env.SYNC_LOG, `${JSON.stringify(['child', ...process.argv.slice(2)])}\\n`);\n",
    ...(inProcess ? { [`${BUILD}/src/sync-if-stale.mjs`]: SYNC_MODULE(problem) } : {}),
  });
  return { root, log };
};

const lines = (log) => readFileSync(log, 'utf8').trim().split('\n').map((line) => JSON.parse(line));

describe('ensureAppSynced', () => {
  it('syncs inside this process when the app brock-build offers it, and hands back the guide without running it', async () => {
    const { root, log } = app({ inProcess: true });
    const guide = await ensureAppSynced(root, () => undefined);
    expect(lines(log)).toEqual([['sync', 'brock sync']]);
    runGuideLater(guide, () => undefined);
    await new Promise((resolve) => setImmediate(resolve));
    expect(lines(log)).toEqual([['sync', 'brock sync'], ['guide']]);
  });

  it('refuses to launch with the reason when the sync finds a problem', async () => {
    const { root } = app({ inProcess: true, problem: 'src/main.tsx imports ../.brock/x, which is missing' });
    await expect(ensureAppSynced(root, () => undefined)).rejects.toThrow(/not ready to launch[\s\S]*src\/main\.tsx imports/);
  });

  it('falls back to a brock sync --if-stale child for a brock-build that has no sync export', async () => {
    const { root, log } = app({ inProcess: false });
    const guide = await ensureAppSynced(root, () => undefined);
    expect(lines(log)).toEqual([['child', 'sync', '--if-stale']]);
    await expect(guide()).resolves.toBeUndefined();
  });

  it('logs a guide that fails instead of throwing', async () => {
    const messages = [];
    runGuideLater(() => Promise.reject(new Error('no tessera')), (message) => messages.push(message));
    await new Promise((resolve) => setImmediate(resolve));
    expect(messages).toEqual(['The Tessera guide did not finish: no tessera']);
  });
});
