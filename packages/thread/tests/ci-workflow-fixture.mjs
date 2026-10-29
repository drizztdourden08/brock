/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach } from 'vitest';
import { ciWorktreesFolder } from '../src/ci/ci-worktree.mjs';

const WORKFLOW = `name: fixture
env:
  GREETING: hi
jobs:
  later:
    needs: [prepare]
    runs-on: ubuntu-24.04
    steps:
      - run: node tools/mark.mjs later

  prepare:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
      - name: Mark with simple expressions
        run: node tools/mark.mjs prepare $GREETING-$LEVEL-[$NODE_AUTH_TOKEN]
        env:
          LEVEL: \${{ secrets.NOPE || 'dflt' }}
          NODE_AUTH_TOKEN: \${{ secrets.PACKAGES_TOKEN }}
      - name: Needs a sha
        run: echo \${{ github.sha }}
      - name: Third party action
        uses: some/unknown-action@v1
      - name: Only on push
        if: github.event_name == 'push'
        run: node tools/mark.mjs only-on-push
      - name: Not on push
        if: github.event_name != 'push'
        run: node tools/mark.mjs not-on-push
      - name: Install from the registry
        run: pnpm --version && echo pnpm install --frozen-lockfile
      - name: Keep the marks
        if: always()
        uses: actions/upload-artifact@v7
        with:
          name: marks
          path: order.txt

  matrixed:
    strategy:
      matrix:
        os: [windows-latest, ubuntu-24.04, macos-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - run: node tools/mark.mjs matrix-\${{ matrix.os }}
`;

const BROKEN = `jobs:
  broken:
    runs-on: ubuntu-24.04
    steps:
      - name: Fails
        run: exit 3
      - name: Skipped by the failure
        run: node tools/mark.mjs never
      - name: Cleanup
        if: always()
        run: node tools/mark.mjs cleanup
  free:
    runs-on: ubuntu-24.04
    steps:
      - run: node tools/mark.mjs free
  downstream:
    needs: broken
    runs-on: ubuntu-24.04
    steps:
      - run: node tools/mark.mjs downstream
`;


const MARKER = "import { appendFileSync } from 'node:fs';\nappendFileSync('order.txt', `${process.argv.slice(2).join(' ')}\\n`);\n";

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const workspace = { name: 'demo', base: 'main', protectedBranches: ['main'], worktreesDir: '.worktrees', publish: {}, gate: undefined };
const byName = (steps) => Object.fromEntries(steps.map((step) => [step.name, step]));

/**
 * @returns {{ repo: () => string }} a fresh repo for each test
 */
const fixtureRepo = () => {
  const state = { home: '', saved: undefined, savedProject: undefined, repo: '' };
  beforeEach(() => {
    state.saved = process.env.COORD_HOME;
    state.savedProject = process.env.COORD_PROJECT;
    delete process.env.COORD_PROJECT;
    state.home = mkdtempSync(join(tmpdir(), 'brock-ciw-home-'));
    process.env.COORD_HOME = state.home;
    state.repo = mkdtempSync(join(tmpdir(), 'brock-ciw-repo-'));
    git(state.repo, 'init', '-q', '-b', 'main');
    git(state.repo, 'config', 'user.name', 't');
    git(state.repo, 'config', 'user.email', 't@t');
    mkdirSync(join(state.repo, 'tools'));
    writeFileSync(join(state.repo, 'tools', 'mark.mjs'), MARKER);
    git(state.repo, 'add', '-A');
    git(state.repo, 'commit', '-q', '-m', 'marker');
  });
  afterEach(() => {
    if (state.saved === undefined) delete process.env.COORD_HOME;
    else process.env.COORD_HOME = state.saved;
    if (state.savedProject === undefined) delete process.env.COORD_PROJECT;
    else process.env.COORD_PROJECT = state.savedProject;
    rmSync(state.home, { recursive: true, force: true });
    rmSync(state.repo, { recursive: true, force: true });
    rmSync(ciWorktreesFolder(state.repo), { recursive: true, force: true });
  });
  return { repo: () => state.repo };
};

export { BROKEN, byName, fixtureRepo, git, WORKFLOW, workspace };
