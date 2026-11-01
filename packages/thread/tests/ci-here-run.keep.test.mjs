/* @layer tooling-scripts @kind test */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { newRunId, readRecords } from '../src/ci/check-record.mjs';
import { ciWorktreesFolder } from '../src/ci/ci-worktree.mjs';
import { runCi } from '../src/ci/run-ci.mjs';
import { skipInstall } from '../src/ci/skip-install.mjs';
import { ciRepo, git, workspace } from './ci-workflow-fixture.mjs';

const ci = ciRepo({ 'package.json': JSON.stringify({ name: 'demo' }) });

describe('brock ci --here runs', { tags: ['standard'] }, () => {
  const node = (code) => `node -e "process.exit(${code})"`;
  const plan = (...codes) => skipInstall([{ name: 'install', command: 'pnpm install --offline --frozen-lockfile', job: 'gate', required: true }, ...codes.map((code, index) => ({ name: `s${index}`, command: node(code), job: 'gate', required: true }))]);
  const run = (steps) => runCi({
    ctx: { rootDir: ci.repo, workspace, log: () => {} },
    runId: newRunId(),
    request: { project: 'demo', sha: git(ci.repo, 'rev-parse', 'HEAD'), branch: 'main', pr: null, trigger: 'pr', partial: false, waitMs: 5000, plan: steps, here: ci.repo },
    announce: () => {},
  });

  it('runs the steps in the checkout, skips the install and makes no temporary worktree', async () => {
    expect(await run(plan(0, 0))).toBe(0);
    const record = readRecords('demo').at(-1);
    expect(record).toMatchObject({ status: 'pass', place: 'here' });
    expect(record.steps.map((step) => step.status)).toEqual(['skipped-local', 'pass', 'pass']);
    expect(record.steps[1].cwd.replace(/\\/g, '/')).toBe(ci.repo.replace(/\\/g, '/'));
    expect(existsSync(ciWorktreesFolder(ci.repo))).toBe(false);
    expect(existsSync(join(ci.repo, 'package.json'))).toBe(true);
  });

  it('fails the run when a step fails and still leaves the checkout alone', async () => {
    expect(await run(plan(0, 3))).toBe(1);
    expect(readRecords('demo').at(-1)).toMatchObject({ status: 'fail', place: 'here' });
    expect(existsSync(join(ci.repo, 'package.json'))).toBe(true);
  });
});
