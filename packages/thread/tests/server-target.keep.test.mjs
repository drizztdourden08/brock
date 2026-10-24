/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { defineWorkspace, serverTarget } from '../src/index.mjs';

const made = [];

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const put = (root, path, content) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};

const WRITE_ARGV = "require('node:fs').appendFileSync(process.env.ARGV_LOG, `${JSON.stringify(process.argv.slice(2))}\\n`);\n";

const worktreeApp = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-server-target-'));
  made.push(root);
  const log = join(root, 'argv.log');
  put(root, 'package.json', JSON.stringify({ name: 'fixture' }));
  put(root, '.user-data/keep', '');
  put(root, 'node_modules/@drizztdourden08/brock-build/package.json', JSON.stringify({ name: '@drizztdourden08/brock-build', bin: { brock: 'bin/brock.cjs' } }));
  put(root, 'node_modules/@drizztdourden08/brock-build/bin/brock.cjs', WRITE_ARGV);
  put(root, 'dist/server/main.mjs', "import { appendFileSync } from 'node:fs';\nappendFileSync(process.env.ARGV_LOG, `${JSON.stringify(['main', ...process.argv.slice(2)])}\\n`);\nconsole.log('server up');\n");
  process.env.ARGV_LOG = log;
  const worktree = { name: 'main', path: root, main: root, workspace: { name: 'demo' }, log: () => undefined };
  return { root, log, worktree };
};

const request = (worktree, extra = {}) => ({ worktree, state: 'none', visible: false, sound: false, prod: false, passthrough: [], ...extra });

const closed = (child) => new Promise((resolve) => child.on('close', resolve));

const lines = (log) => readFileSync(log, 'utf8').trim().split('\n').map((line) => JSON.parse(line));

describe('serverTarget', () => {
  it('is a launch target of kind server that defineWorkspace accepts', () => {
    const target = serverTarget();
    expect(target.kind).toBe('server');
    expect(defineWorkspace({ name: 'demo', targets: { server: target } }).targets.server).toBe(target);
  });

  it('runs the built server with node and the data flag for a production launch of state none', async () => {
    const { root, log, worktree } = worktreeApp();
    const target = serverTarget();
    expect(target.notReady(worktree, true)).toBeNull();
    const child = await target.launch(request(worktree, { prod: true, passthrough: ['--port=4000'] }));
    expect(await closed(child)).toBe(0);
    expect(lines(log)).toEqual([['build', '--if-stale'], ['sync', '--if-stale'], ['main', `--user-data=${join(root, '.user-data')}`, '--port=4000']]);
  });

  it('runs brock server dev with the data flag for a launch without --prod', async () => {
    const { root, log, worktree } = worktreeApp();
    const child = await serverTarget().launch(request(worktree));
    expect(await closed(child)).toBe(0);
    expect(lines(log)).toEqual([['sync', '--if-stale'], ['server', 'dev', '--', `--user-data=${join(root, '.user-data')}`]]);
  });

  it('refuses a state when it has no states hook, and asks the hook otherwise', () => {
    const { worktree } = worktreeApp();
    expect(serverTarget().checkState(worktree, 'none')).toBeNull();
    expect(serverTarget().checkState(worktree, 'big')).toMatch(/declares no states for its server/);
    const states = (_worktree, state) => (state === 'big' ? ['--seed=big'] : null);
    expect(serverTarget({ states }).checkState(worktree, 'big')).toBeNull();
    expect(serverTarget({ states }).checkState(worktree, 'other')).toMatch(/is not a state/);
  });

  it('reports a worktree without its data folder or a production build', () => {
    const { root, worktree } = worktreeApp();
    expect(serverTarget({ userData: '.missing' }).notReady(worktree, false)).toMatch(/has no \.missing folder/);
    rmSync(join(root, 'dist'), { recursive: true });
    expect(serverTarget().notReady(worktree, false)).toBeNull();
    expect(serverTarget().notReady(worktree, true)).toMatch(/dist[\\/]server[\\/]main\.mjs is missing/);
  });
});
