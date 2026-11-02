/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { hereRequest } from '../src/ci/here-request.mjs';
import { mergeBlocker } from '../src/pr/merge-gate.mjs';
import { newRecord } from '../src/ci/record-shape.mjs';
import { skipInstall } from '../src/ci/skip-install.mjs';
import { planSteps } from '../src/ci/ci-plan.mjs';
import { parseThreadArgs } from '../src/cli/thread-args.mjs';

const SHA = 'a'.repeat(40);
const gitAnswers = (answers) => (args) => answers[args.join(' ')] ?? null;
const clean = { 'rev-parse --show-toplevel': '/work/repo', 'rev-parse HEAD': SHA, 'status --porcelain --untracked-files=no': '' };

describe('brock ci --here checks', { tags: ['critical'] }, () => {
  it('returns null without the flag and the checkout with it', () => {
    expect(hereRequest({ options: {}, sha: SHA, git: gitAnswers(clean) })).toBeNull();
    expect(hereRequest({ options: { here: true }, sha: SHA, git: gitAnswers(clean) })).toBe('/work/repo');
  });

  it('refuses a HEAD that is not the commit under test', () => {
    const git = gitAnswers({ ...clean, 'rev-parse HEAD': 'b'.repeat(40) });
    expect(() => hereRequest({ options: { here: true }, sha: SHA, git })).toThrow(/HEAD to be the commit under test/);
  });

  it('refuses a tracked tree with changes', () => {
    const git = gitAnswers({ ...clean, 'status --porcelain --untracked-files=no': ' M a.txt' });
    expect(() => hereRequest({ options: { here: true }, sha: SHA, git })).toThrow(/clean tracked tree/);
  });

  it('refuses to combine with --localpkg', () => {
    expect(() => hereRequest({ options: { here: true, localpkg: true }, sha: SHA, git: gitAnswers(clean) })).toThrow(/cannot combine with --localpkg/);
  });
});

describe('brock ci --here plan and record', { tags: ['critical'] }, () => {
  const workspace = { name: 'demo', base: 'main', publish: {}, gate: { scripts: ['lint', 'test'] } };
  const request = { project: 'demo', sha: SHA, branch: 'b', pr: null, trigger: 'pr', partial: false };

  it('marks the install step skipped and not required, and leaves the others', () => {
    const plain = planSteps({ workspace });
    const plan = skipInstall(plain);
    expect(plan[0]).toMatchObject({ name: 'install', required: false });
    expect(plan[0].skip).toContain('--here');
    expect(plan.slice(1)).toEqual(plain.slice(1));
  });

  it('skips a workflow step that is only a pnpm install', () => {
    const plan = skipInstall([{ name: 'ci / Install', command: 'pnpm install --offline --frozen-lockfile', required: true }, { name: 'ci / Lint', command: 'pnpm run lint', required: true }]);
    expect(plan.map((step) => Boolean(step.skip))).toEqual([true, false]);
  });

  it('writes the place into the record', () => {
    expect(newRecord({ runId: 'r', request, main: '/m' }).place).toBe('worktree');
    expect(newRecord({ runId: 'r', request: { ...request, here: '/m' }, main: '/m' }).place).toBe('here');
  });

  it('lets the merge guard accept a passing here record', () => {
    const run = { id: 'r', status: 'pass', place: 'here', steps: [{ name: 'lint', required: true, status: 'pass' }, { name: 'install', required: false, status: 'skipped-local' }] };
    expect(mergeBlocker(run, { sha: SHA, alias: 'brock', pr: null })).toBeNull();
  });
});

describe('thread argument parsing of flags', { tags: ['critical'] }, () => {
  it('never lets --here, --localpkg or --no-cache take the next word', () => {
    expect(parseThreadArgs(['--here', 'lint'])).toEqual({ positional: ['lint'], options: { here: true } });
    expect(parseThreadArgs(['--localpkg', 'test', '--no-cache', 'lint'])).toEqual({ positional: ['test', 'lint'], options: { localpkg: true, 'no-cache': true } });
    expect(parseThreadArgs(['--commit', 'abc']).options.commit).toBe('abc');
  });
});
