/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { threadVerbNames } from '@drizztdourden08/brock-thread/cli';
import { afterEach, describe, expect, it } from 'vitest';
import { findProjectBuild } from '../src/find-project-build.mjs';
import { findProjectThread } from '../src/find-project-thread.mjs';
import { runnerFor } from '../src/runner-for.mjs';
import { THREAD_VERBS } from '../src/thread-verbs.constants.mjs';

const made = [];
const GLOBAL_BIN = join('global', 'brock-build', 'bin', 'brock.mjs');

const install = (root, packageName, binFile, version) => {
  const dir = join(root, 'node_modules', ...packageName.split('/'));
  mkdirSync(join(dir, 'bin'), { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: packageName, version }));
  writeFileSync(join(dir, 'bin', binFile), '');
  return join(dir, 'bin', binFile);
};

const project = () => {
  const root = mkdtempSync(join(tmpdir(), 'cli-runner-'));
  made.push(root);
  mkdirSync(join(root, 'apps', 'deep'), { recursive: true });
  return root;
};

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('K4 the runner a project gets', { tags: ['critical'] }, () => {
  it('finds the project brock-thread by walking up from a nested folder', () => {
    const root = project();
    const bin = install(root, '@drizztdourden08/brock-thread', 'brock-thread.mjs', '0.116.0');
    expect(findProjectThread(join(root, 'apps', 'deep'))).toEqual({ root, bin, version: '0.116.0' });
    expect(findProjectBuild(join(root, 'apps', 'deep'))).toBeNull();
  });

  it('runs a thread verb through the project brock-thread when there is no brock-build', () => {
    const root = project();
    install(root, '@drizztdourden08/brock-thread', 'brock-thread.mjs', '0.116.0');
    const thread = findProjectThread(root);
    expect(runnerFor('release', null, GLOBAL_BIN, thread)).toBe(thread.bin);
    expect(runnerFor('pr', null, GLOBAL_BIN, thread)).toBe(thread.bin);
  });

  it('keeps the global brock-build for a verb the thread does not own', () => {
    const root = project();
    install(root, '@drizztdourden08/brock-thread', 'brock-thread.mjs', '0.116.0');
    expect(runnerFor('lint', null, GLOBAL_BIN, findProjectThread(root))).toBe(GLOBAL_BIN);
  });

  it('falls back to the global brock-build with no project copy of either', () => {
    expect(runnerFor('release', null, GLOBAL_BIN, null)).toBe(GLOBAL_BIN);
  });

  it('prefers the project brock-build over the project brock-thread', () => {
    const root = project();
    install(root, '@drizztdourden08/brock-thread', 'brock-thread.mjs', '0.116.0');
    install(root, '@drizztdourden08/brock-build', 'brock.mjs', '0.116.0');
    const build = findProjectBuild(root);
    expect(runnerFor('release', build, GLOBAL_BIN, findProjectThread(root))).toBe(build.bin);
  });

  it('lists exactly the verbs brock-thread owns', () => {
    expect([...THREAD_VERBS].sort()).toEqual([...threadVerbNames()].sort());
  });
});
