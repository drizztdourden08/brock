/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { treeFiles } from '../src/lint/changed-files.mjs';
import { heavyNodeEnv } from '../src/lint/heavy-env.mjs';
import { batchSizeOf, runBatches, splitBatches, worstExit } from '../src/lint/lint-batches.mjs';
import { planLint } from '../src/lint/lint-plan.mjs';
import { FULL_TREE_MEMORY_MB } from '../src/lint/lint.constants.mjs';

const { tempDir, put, cleanup } = tempTree('brock-batches-');

afterEach(cleanup);

const repoWith = (count) => {
  const root = tempDir();
  spawnSync('git', ['init', '-q', '-b', 'main'], { cwd: root });
  for (let n = 0; n < count; n += 1) put(root, `src/f${String(n).padStart(3, '0')}.ts`, 'export {};\n');
  return root;
};

describe('splitting the file list', () => {
  it('cuts contiguous slices of the batch size and keeps every file once', () => {
    const files = Array.from({ length: 2500 }, (_, n) => `f${n}`);
    const batches = splitBatches(files, 1000);
    expect(batches.map((batch) => batch.length)).toEqual([1000, 1000, 500]);
    expect(batches.flat()).toEqual(files);
  });

  it('makes no empty batch and one batch for a short list', () => {
    expect(splitBatches([], 1000)).toEqual([]);
    expect(splitBatches(['a', 'b'], 1000)).toEqual([['a', 'b']]);
    expect(splitBatches(['a', 'b'], 2)).toEqual([['a', 'b']]);
  });

  it('takes the size from BROCK_LINT_BATCH_SIZE and ignores a bad value', () => {
    expect(batchSizeOf({})).toBe(1000);
    expect(batchSizeOf({ BROCK_LINT_BATCH_SIZE: '250' })).toBe(250);
    expect(batchSizeOf({ BROCK_LINT_BATCH_SIZE: 'many' })).toBe(1000);
    expect(batchSizeOf({ BROCK_LINT_BATCH_SIZE: '0' })).toBe(1000);
  });
});

describe('merging the exit codes', () => {
  it('takes the worst code, so a crash outranks lint problems', () => {
    expect(worstExit([])).toBe(0);
    expect(worstExit([0, 0])).toBe(0);
    expect(worstExit([0, 1, 0])).toBe(1);
    expect(worstExit([1, 2, 0])).toBe(2);
    expect(worstExit([0, 134, 1])).toBe(134);
  });

  it('runs every batch in order even after a failure and returns the worst code', async () => {
    const seen = [];
    const codes = [0, 1, 134, 0];
    const result = await runBatches([['a'], ['b'], ['c'], ['d']], async (batch, index) => {
      seen.push([batch[0], index]);
      return codes[index];
    });
    expect(seen).toEqual([['a', 0], ['b', 1], ['c', 2], ['d', 3]]);
    expect(result).toEqual({ code: 134, codes });
  });

  it('runs one batch at a time', async () => {
    let running = 0;
    let peak = 0;
    await runBatches([['a'], ['b'], ['c']], async () => {
      running += 1;
      peak = Math.max(peak, running);
      await Promise.resolve();
      running -= 1;
      return 0;
    });
    expect(peak).toBe(1);
  });
});

describe('the full-tree plan', () => {
  it('lists the tree sorted, without deleted files, and batches it', () => {
    const root = repoWith(5);
    spawnSync('git', ['add', '.'], { cwd: root });
    spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'x'], { cwd: root });
    spawnSync('git', ['rm', '-q', '--cached', 'src/f000.ts'], { cwd: root });
    put(root, 'a-new.ts');
    const files = treeFiles(root);
    expect(files).toEqual(['a-new.ts', 'src/f000.ts', 'src/f001.ts', 'src/f002.ts', 'src/f003.ts', 'src/f004.ts']);
    const plan = planLint({ cwd: root, all: true, env: { BROCK_LINT_BATCH_SIZE: '4' } });
    expect(plan.batches).toEqual([files.slice(0, 4), files.slice(4)]);
    expect(plan.line).toBe('brock lint: full tree (--all), 6 files in 2 batches');
  });

  it('lints "." in one run when git cannot list the tree', () => {
    const plan = planLint({ cwd: tempDir(), all: true, env: {} });
    expect(plan.batches).toBeNull();
    expect(plan.targets).toEqual(['.']);
  });

  it('does not batch a run on named files', () => {
    const root = repoWith(3);
    const plan = planLint({ cwd: root, paths: ['src/f001.ts'], env: {} });
    expect(plan.mode).toBe('paths');
    expect(plan.batches).toBeUndefined();
  });
});

describe('the heap ceiling choice', () => {
  it('gives a full-tree batch 4096 MB and a changed run 2048 MB', () => {
    expect(FULL_TREE_MEMORY_MB).toBe(4096);
    expect(heavyNodeEnv({}, FULL_TREE_MEMORY_MB).NODE_OPTIONS).toBe('--max-old-space-size=4096');
    expect(heavyNodeEnv({}).NODE_OPTIONS).toBe('--max-old-space-size=2048');
  });

  it('lets BROCK_LINT_MEMORY_MB and a NODE_OPTIONS heap flag win over the full-tree default', () => {
    expect(heavyNodeEnv({ BROCK_LINT_MEMORY_MB: '3000' }, FULL_TREE_MEMORY_MB).NODE_OPTIONS).toBe('--max-old-space-size=3000');
    const env = { NODE_OPTIONS: '--max-old-space-size=1024' };
    expect(heavyNodeEnv(env, FULL_TREE_MEMORY_MB)).toBe(env);
  });
});
