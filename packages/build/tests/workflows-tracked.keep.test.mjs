/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { keepGithubTracked } from '../src/release/keep-github-tracked.mjs';
import { ensurePnpmPackageManager } from '../src/release/pnpm-package-manager.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { workflowProblems } from '../src/release/workflow-problems.mjs';
import { removeTempRepos, tempRepo as repo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const read = (root, path) => readFileSync(join(root, path), 'utf8');

const STANDARD = '# note\n.*/\n!.changeset/\n\nnode_modules/\n';
const WORKFLOWS = ['.github/workflows/ci.yml', '.github/workflows/release.yml'];

describe('K1 keepGithubTracked', { tags: ['critical'] }, () => {
  it('puts !.github/ right after the rule that hides it, and leaves a file that keeps it alone', () => {
    expect(keepGithubTracked(STANDARD)).toBe('# note\n.*/\n!.github/\n!.changeset/\n\nnode_modules/\n');
    expect(keepGithubTracked('.*/\r\n!.github/\r\n')).toBeNull();
    expect(keepGithubTracked('!.github/\n.*/\n')).toBe('!.github/\n.*/\n!.github/\n');
    expect(keepGithubTracked('node_modules/\n')).toBeNull();
  });
});

describe('K1 the managed .gitignore lines', { tags: ['critical'] }, () => {
  it('brock sync renders the repo .gitignore with !.github/ beside the workflows', () => {
    const root = repo({ '.gitignore': STANDARD, 'package.json': '{"name":"atlas"}' });
    const files = renderWorkflows(root, { product: { id: 'atlas' }, targets: ['windows'] }, []);
    expect(files.map((file) => file.path)).toEqual([...WORKFLOWS, '.gitignore']);
    expect(files.at(-1)?.content).toContain('.*/\n!.github/\n');
    writeFileSync(join(root, '.gitignore'), files.at(-1)?.content ?? '');
    expect(renderWorkflows(root, { product: { id: 'atlas' }, targets: ['windows'] }, []).map((file) => file.path)).toEqual(WORKFLOWS);
  });
});

const git = (cwd, ...args) => spawnSync('git', args, { cwd, encoding: 'utf8' });

describe('E2 brock check on the managed workflows (real git)', { tags: ['e2e'] }, () => {
  it('fails while git ignores a managed workflow, and passes once !.github/ follows the rule', () => {
    const root = repo({ '.gitignore': '.*/\n', 'package.json': '{"name":"atlas","packageManager":"pnpm@10.17.0"}' });
    git(root, 'init', '.');
    const [problem] = workflowProblems(root, WORKFLOWS);
    expect(problem).toMatch(/^\.github\/workflows\/ci\.yml is ignored by git/);
    expect(workflowProblems(root, WORKFLOWS)).toHaveLength(2);
    writeFileSync(join(root, '.gitignore'), '.*/\n!.github/\n');
    expect(workflowProblems(root, WORKFLOWS)).toEqual([]);
  });

  it('fails while the repo root names no pnpm packageManager, which the workflows install', () => {
    const root = repo({ 'package.json': '{"name":"atlas"}' });
    expect(workflowProblems(root, WORKFLOWS)).toEqual([expect.stringMatching(/no "packageManager": "pnpm@<version>"/)]);
    expect(workflowProblems(root, [])).toEqual([]);
  });
});

describe('K3 packageManager for the managed workflows', { tags: ['critical'] }, () => {
  it('adds pnpm@<version in use> once, and keeps one already set', () => {
    const root = repo({ 'package.json': '{"name":"atlas"}' });
    const before = process.env.npm_config_user_agent;
    process.env.npm_config_user_agent = 'pnpm/10.17.0 npm/? node/v24.8.0 win32 x64';
    try {
      expect(ensurePnpmPackageManager(root)).toEqual({ status: 'added', value: 'pnpm@10.17.0' });
      expect(JSON.parse(read(root, 'package.json')).packageManager).toBe('pnpm@10.17.0');
      expect(ensurePnpmPackageManager(root)).toEqual({ status: 'present', value: 'pnpm@10.17.0' });
    } finally {
      if (before === undefined) delete process.env.npm_config_user_agent;
      else process.env.npm_config_user_agent = before;
    }
  });
});
