/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addCiWorktree, ciWorktreesFolder, dropCiWorktree, isInsideWorktree } from '../src/ci/ci-worktree.mjs';
import { watchMainCheckout } from '../src/ci/main-guard.mjs';
import { removeTree } from '../src/worktree/remove-tree.mjs';
import { ignoredFolders } from '../src/worktree/ignored-folders.mjs';
import { deleteTree } from '../src/worktree/delete-tree.mjs';
import { initRepo, run } from './git-fixture.mjs';

const LINK = 'junction';

let main = '';
let base = '';
const lines = [];
const log = (message) => lines.push(message);
const engineFile = () => join(main, 'packages', 'engine', 'src', 'index.ts');

beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'brock-safe-delete-'));
  main = join(base, 'main');
  lines.length = 0;
  mkdirSync(join(main, 'packages', 'engine', 'src'), { recursive: true });
  mkdirSync(join(main, 'apps', 'desktop'), { recursive: true });
  writeFileSync(engineFile(), 'export {};\n');
  writeFileSync(join(main, 'apps', 'desktop', 'package.json'), '{}\n');
  writeFileSync(join(main, '.gitignore'), 'node_modules/\n');
  initRepo(main);
  mkdirSync(join(main, 'node_modules', '.bin'), { recursive: true });
  writeFileSync(join(main, 'node_modules', '.bin', 'tool'), 'tool\n');
  mkdirSync(join(main, 'apps', 'desktop', 'node_modules', '@demo'), { recursive: true });
  symlinkSync(join(main, 'packages', 'engine'), join(main, 'apps', 'desktop', 'node_modules', '@demo', 'engine'), LINK);
});

afterEach(() => {
  rmSync(ciWorktreesFolder(main), { recursive: true, force: true });
  rmSync(base, { recursive: true, force: true });
});

const linkedWorktree = (path) => {
  run(main, 'worktree', 'add', '-q', '--detach', path, 'HEAD');
  symlinkSync(join(main, 'node_modules'), join(path, 'node_modules'), LINK);
  symlinkSync(join(main, 'apps', 'desktop', 'node_modules'), join(path, 'apps', 'desktop', 'node_modules'), LINK);
  return path;
};

const mainIsWhole = () => {
  expect(readFileSync(engineFile(), 'utf8')).toBe('export {};\n');
  expect(existsSync(join(main, 'node_modules', '.bin', 'tool'))).toBe(true);
  expect(run(main, 'status', '--porcelain')).toBe('');
};

describe('the Archipelia data loss', () => {
  it.runIf(process.platform === 'win32')('reproduces: git worktree remove follows the junctions and deletes tracked files of the main checkout', () => {
    const tree = linkedWorktree(join(base, 'ci-arch'));
    run(main, 'worktree', 'remove', '--force', tree);
    expect(existsSync(engineFile())).toBe(false);
    expect(run(main, 'status', '--porcelain')).toContain('D packages/engine/src/index.ts');
  });

  it('removeTree removes the same worktree and leaves the main checkout whole', async () => {
    const tree = linkedWorktree(join(base, 'ci-arch'));
    expect(await removeTree(tree, main, log)).toBe(true);
    expect(existsSync(tree)).toBe(false);
    mainIsWhole();
    expect(lines.join('\n')).toMatch(/2 link\(s\) as links first/);
  });

  it('removeTree ignores GIT_DIR and GIT_WORK_TREE that point at the main checkout', async () => {
    const tree = linkedWorktree(join(base, 'wt'));
    const saved = { dir: process.env.GIT_DIR, work: process.env.GIT_WORK_TREE };
    process.env.GIT_DIR = join(main, '.git');
    process.env.GIT_WORK_TREE = main;
    try {
      expect(ignoredFolders(tree)).toEqual([join(tree, 'apps', 'desktop', 'node_modules'), join(tree, 'node_modules')]);
      expect(await removeTree(tree, main, log)).toBe(true);
    } finally {
      for (const [key, value] of [['GIT_DIR', saved.dir], ['GIT_WORK_TREE', saved.work]]) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
    expect(existsSync(tree)).toBe(false);
    mainIsWhole();
  });
});

describe('deleteTree guards', () => {
  it('deletes only strictly inside the folder it owns', async () => {
    const owner = join(base, 'owned');
    mkdirSync(join(owner, 'inside'), { recursive: true });
    await expect(deleteTree({ owner, target: owner })).rejects.toThrow(/not inside/);
    await expect(deleteTree({ owner, target: join(owner, '..', 'main') })).rejects.toThrow(/not inside/);
    await expect(deleteTree({ owner: dirname(main), target: main, mains: [main] })).rejects.toThrow(/main checkout/);
    expect(await deleteTree({ owner, target: join(owner, 'inside') })).toBeNull();
    expect(existsSync(join(owner, 'inside'))).toBe(false);
    mainIsWhole();
  });

  it('refuses a folder that resolves outside through a link above it', async () => {
    const owner = join(base, 'owned');
    mkdirSync(owner);
    symlinkSync(join(main, 'packages'), join(owner, 'packages'), LINK);
    await expect(deleteTree({ owner, target: join(owner, 'packages', 'engine') })).rejects.toThrow(/resolves outside/);
    mainIsWhole();
  });

  it('removes a junction to a sibling folder as a link and keeps the sibling files', async () => {
    const owner = join(base, 'owned');
    mkdirSync(join(owner, 'tree', 'deep'), { recursive: true });
    symlinkSync(join(main, 'packages'), join(owner, 'tree', 'deep', 'packages'), LINK);
    symlinkSync(join(main, 'node_modules'), join(owner, 'tree', 'node_modules'), LINK);
    expect(await deleteTree({ owner, target: join(owner, 'tree') })).toBeNull();
    expect(existsSync(join(owner, 'tree'))).toBe(false);
    mainIsWhole();
  });

  it('refuses a folder that holds a .git folder, at the top or deeper', async () => {
    const owner = join(base, 'owned');
    mkdirSync(join(owner, 'repo', '.git'), { recursive: true });
    mkdirSync(join(owner, 'tree', 'vendor', 'lib', '.git'), { recursive: true });
    writeFileSync(join(owner, 'tree', 'a.txt'), 'a\n');
    await expect(deleteTree({ owner, target: join(owner, 'repo') })).rejects.toThrow(/\.git folder/);
    await expect(deleteTree({ owner, target: join(owner, 'tree') })).rejects.toThrow(/repository of its own/);
    expect(existsSync(join(owner, 'tree', 'a.txt'))).toBe(true);
  });
});

describe('the ci temporary worktree', () => {
  const sha = () => run(main, 'rev-parse', 'HEAD');

  it('lives in its own folder outside the checkout and leaves the sibling files when removed', async () => {
    const path = addCiWorktree({ main, runId: '20261029T100000000Z-aaaa', sha: sha() });
    expect(dirname(path)).toBe(join(dirname(main), '.brock-ci', basename(main)));
    expect(path.startsWith(main)).toBe(false);
    symlinkSync(join(main, 'packages'), join(path, 'packages', 'linked'), LINK);
    symlinkSync(join(main, 'node_modules'), join(path, 'node_modules'), LINK);
    expect(await dropCiWorktree({ path, main, log })).toBeNull();
    expect(existsSync(path)).toBe(false);
    mainIsWhole();
  });

  it('refuses to remove the main checkout handed in as the temporary worktree', async () => {
    expect(await dropCiWorktree({ path: main, main, log })).toMatch(/left in place: Refusing/);
    mainIsWhole();
  });

  it('keeps a step working directory inside the temporary worktree', () => {
    const path = addCiWorktree({ main, runId: '20261029T100000000Z-bbbb', sha: sha() });
    expect(isInsideWorktree(path, path)).toBe(true);
    expect(isInsideWorktree(path, join(path, 'apps', 'desktop'))).toBe(true);
    expect(isInsideWorktree(path, join(path, '..'))).toBe(false);
    expect(isInsideWorktree(path, main)).toBe(false);
    symlinkSync(main, join(path, 'escape'), LINK);
    expect(isInsideWorktree(path, join(path, 'escape'))).toBe(false);
  });

  it('does not run a step whose working directory leaves the worktree, and fails a run that deleted a tracked file of the main checkout', async () => {
    const saved = process.env.COORD_HOME;
    process.env.COORD_HOME = join(base, 'coord');
    const workspace = { name: 'demo', base: 'main', protectedBranches: ['main'], worktreesDir: '.worktrees', publish: {}, gate: undefined };
    const plan = [
      { name: 'escape', command: 'node -e "process.exit(0)"', job: 'gate', required: true, workdir: '..' },
      { name: 'stray', command: `node -e "require('fs').rmSync('${engineFile().replace(/\\/g, '/')}')"`, job: 'other', required: true },
    ];
    const request = { project: 'demo', sha: sha(), branch: 'main', pr: null, trigger: 'manual', plan, partial: false, waitMs: 5000 };
    const announced = [];
    try {
      const { runCi } = await import('../src/ci/run-ci.mjs');
      expect(await runCi({ ctx: { rootDir: main, workspace, log }, runId: '20261029T100000000Z-cccc', request, announce: (file) => announced.push(file) })).toBe(1);
    } finally {
      if (saved === undefined) delete process.env.COORD_HOME;
      else process.env.COORD_HOME = saved;
    }
    const record = JSON.parse(readFileSync(announced[0], 'utf8'));
    expect(record.steps[0]).toMatchObject({ status: 'fail', exitCode: 1 });
    expect(record.steps[0].note).toMatch(/outside the temporary worktree/);
    expect(record.status).toBe('fail');
    expect(record.summary).toMatch(/^DATA LOSS: 1 tracked file/);
  });

  it('notices tracked files of the main checkout deleted during a run', () => {
    const check = watchMainCheckout(main);
    expect(check()).toBeNull();
    rmSync(engineFile());
    expect(check()).toMatch(/DATA LOSS: 1 tracked file\(s\).*packages\/engine\/src\/index\.ts/);
  });
});
