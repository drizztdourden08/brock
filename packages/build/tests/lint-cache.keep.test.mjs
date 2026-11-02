/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { basename } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { lintCacheFile } from '../src/lint/lint-cache.mjs';

const { tempDir, put, cleanup } = tempTree('brock-lint-cache-');

afterEach(cleanup);

const project = () => {
  const root = tempDir();
  put(root, 'src/Tags.tsx', "import { mirrors } from './Asset.constants';\nexport const tags = mirrors();\n");
  put(root, 'src/Asset.constants.ts', 'export const mirrors = () => 1;\n');
  put(root, 'notes.md', 'one\n');
  const git = (...args) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: root, stdio: 'ignore' });
  git('init', '-b', 'main');
  git('add', '.');
  return root;
};

describe('K1 the lint cache follows the types a file imports', { tags: ['critical'] }, () => {
  it('misses for an unchanged file after a file it imports changes', () => {
    const root = project();
    const env = {};
    const before = lintCacheFile(root, 'changed', env);
    put(root, 'src/Asset.constants.ts', 'export const mirrors = () => [1];\n');
    const after = lintCacheFile(root, 'changed', env);
    expect(after).not.toBe(before);
    expect(basename(after)).toMatch(/^eslint-changed-[0-9a-f]{16}\.json$/);
  });

  it('keeps the cache while no TypeScript file, tsconfig or lockfile changed', () => {
    const root = project();
    const before = lintCacheFile(root, 'changed', {});
    put(root, 'notes.md', 'two\n');
    expect(lintCacheFile(root, 'changed', {})).toBe(before);
  });

  it('misses after a tsconfig change and drops the stale cache of the same run', () => {
    const root = project();
    const env = { BROCK_LINT_CACHE_DIR: tempDir() };
    const before = lintCacheFile(root, 'all-0', env);
    put(env.BROCK_LINT_CACHE_DIR, basename(before), '{}');
    put(root, 'tsconfig.json', '{"compilerOptions":{"strict":true}}\n');
    const after = lintCacheFile(root, 'all-0', env);
    expect(after).not.toBe(before);
    expect(existsSync(before)).toBe(false);
  });
});
