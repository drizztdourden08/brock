/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { changedFiles, needsWholeTree } from '../src/lint/changed-files.mjs';
import { heavyNodeEnv } from '../src/lint/heavy-env.mjs';
import { chooseMode } from '../src/lint/lint-mode.mjs';
import { planLint } from '../src/lint/lint-plan.mjs';

const { tempDir, put, cleanup } = tempTree('brock-lint-');

afterEach(cleanup);

const git = (cwd, ...args) => {
  const { status } = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], { windowsHide: true, cwd, stdio: 'ignore' });
  if (status !== 0) throw new Error(`git ${args.join(' ')} failed`);
};

const repoOnFeatureBranch = () => {
  const root = tempDir();
  git(root, 'init', '-b', 'main');
  put(root, 'src/old.ts', 'export const old = 1;\n');
  put(root, 'src/gone.ts', 'export const gone = 1;\n');
  git(root, 'add', '.');
  git(root, 'commit', '-m', 'base');
  git(root, 'checkout', '-b', 'feature');
  put(root, 'src/committed.ts', 'export const committed = 1;\n');
  git(root, 'add', '.');
  git(root, 'commit', '-m', 'feature work');
  put(root, 'src/old.ts', 'export const old = 2;\n');
  put(root, 'src/fresh.ts', 'export const fresh = 1;\n');
  rmSync(join(root, 'src/gone.ts'));
  return root;
};

describe('K1 which files brock lint covers', { tags: ['critical'] }, () => {
  it('lints only changed files on a local run and the whole tree in CI', () => {
    expect(chooseMode({ env: {} })).toEqual({ mode: 'changed', reason: 'local run' });
    expect(chooseMode({ env: { CI: 'true' } })).toEqual({ mode: 'all', reason: 'CI is set' });
  });

  it('lets --all and --changed override CI, and files on the command line win', () => {
    expect(chooseMode({ all: true, env: {} }).mode).toBe('all');
    expect(chooseMode({ changed: true, env: { CI: 'true' } }).mode).toBe('changed');
    expect(chooseMode({ paths: ['src/a.ts'], env: { CI: 'true' } }).mode).toBe('paths');
  });

  it('refuses --all together with --changed', () => {
    expect(() => chooseMode({ all: true, changed: true })).toThrow('exclude each other');
  });
});

describe('the changed file list', () => {
  it('E2 holds committed, edited and untracked files since the merge base, and leaves out deleted ones', { tags: ['e2e'] }, () => {
    const root = repoOnFeatureBranch();
    const found = changedFiles(root, { BROCK_LINT_BASE: 'main' });
    expect(found).toMatchObject({ files: ['src/committed.ts', 'src/fresh.ts', 'src/old.ts'], ref: 'main' });
  });

  it('K1 compares with the local main when origin/main is behind it', { tags: ['critical'] }, () => {
    const root = tempDir();
    const commit = (file) => {
      put(root, file, 'export const x = 1;\n');
      git(root, 'add', '.');
      git(root, 'commit', '-q', '-m', file);
    };
    git(root, 'init', '-b', 'main');
    commit('src/base.ts');
    git(root, 'update-ref', 'refs/remotes/origin/main', 'HEAD');
    git(root, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main');
    commit('src/ahead.ts');
    git(root, 'checkout', '-q', '-b', 'feature');
    commit('src/mine.ts');
    expect(changedFiles(root, {})).toMatchObject({ files: ['src/mine.ts'], ref: 'main' });
  });

  it('K1 leaves out the config bundle electron-vite writes for a moment while it starts', { tags: ['critical'] }, () => {
    const root = repoOnFeatureBranch();
    put(root, 'apps/desktop/electron.vite.config.1762150000000.mjs', 'export default {};\n');
    put(root, 'apps/desktop/electron.vite.config.mjs', 'export default {};\n');
    const found = changedFiles(root, { BROCK_LINT_BASE: 'main' });
    expect(found.files).toContain('apps/desktop/electron.vite.config.mjs');
    expect(found.files.some((file) => file.includes('1762150000000'))).toBe(false);
  });

  it('K1 asks for the whole tree when a config or manifest changed, or too many files did', { tags: ['critical'] }, () => {
    expect(needsWholeTree(['src/a.ts', 'eslint.config.mjs'])).toMatch('eslint.config.mjs');
    expect(needsWholeTree(['packages/app/tsconfig.json'])).toMatch('tsconfig.json');
    expect(needsWholeTree(['packages/lint-config/eslint.mjs'])).toMatch('lint-config');
    expect(needsWholeTree(['src/a.ts', 'src/b.tsx'])).toBeNull();
    expect(needsWholeTree(Array.from({ length: 301 }, (_, n) => `src/f${n}.ts`))).toMatch('301');
  });
});

describe('E2 the lint plan outside a git work tree', { tags: ['e2e'] }, () => {
  it('falls back to the whole tree when the changes cannot be listed', () => {
    const plan = planLint({ cwd: tempDir(), env: {} });
    expect(plan.targets).toEqual(['.']);
    expect(plan.line).toMatch('changed files unknown: not a git work tree');
  });
});

describe('K1 the heap ceiling for heavy node children', { tags: ['critical'] }, () => {
  it('sets 2048 MB by default and keeps other NODE_OPTIONS', () => {
    expect(heavyNodeEnv({ PATH: 'p' })).toEqual({ PATH: 'p', NODE_OPTIONS: '--max-old-space-size=2048' });
    expect(heavyNodeEnv({ NODE_OPTIONS: '--trace-warnings' }).NODE_OPTIONS).toBe('--trace-warnings --max-old-space-size=2048');
  });

  it('takes the size from BROCK_LINT_MEMORY_MB and ignores a bad value', () => {
    expect(heavyNodeEnv({ BROCK_LINT_MEMORY_MB: '4096' }).NODE_OPTIONS).toBe('--max-old-space-size=4096');
    expect(heavyNodeEnv({ BROCK_LINT_MEMORY_MB: 'lots' }).NODE_OPTIONS).toBe('--max-old-space-size=2048');
  });

  it('leaves a heap size the user already set', () => {
    const env = { NODE_OPTIONS: '--max-old-space-size=8192', BROCK_LINT_MEMORY_MB: '1024' };
    expect(heavyNodeEnv(env)).toBe(env);
  });
});
