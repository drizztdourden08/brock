/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, vi } from 'vitest';
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

const git = (cwd, ...args) => execFileSync('git', args, { windowsHide: true, cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const workspace = { name: 'demo', base: 'main', protectedBranches: ['main'], worktreesDir: '.worktrees', publish: {}, gate: undefined };
const byName = (steps) => Object.fromEntries(steps.map((step) => [step.name, step]));

/**
 * @param {string} dir the empty folder
 * @param {Record<string, string>} files relative path to text
 * @returns {void}
 */
const initRepo = (dir, files) => {
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'config', 'user.name', 't');
  git(dir, 'config', 'user.email', 't@t');
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), text);
  }
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', 'init');
};

/**
 * @param {Record<string, string>} files the first commit
 * @returns {{ home: string, repo: string }} set before each test
 */
const ciRepo = (files) => {
  const state = { home: '', repo: '' };
  beforeEach(() => {
    vi.stubEnv('COORD_PROJECT', undefined);
    state.home = mkdtempSync(join(tmpdir(), 'brock-ci-home-'));
    vi.stubEnv('COORD_HOME', state.home);
    state.repo = mkdtempSync(join(tmpdir(), 'brock-ci-repo-'));
    initRepo(state.repo, files);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    for (const dir of [state.home, state.repo, ciWorktreesFolder(state.repo)]) rmSync(dir, { recursive: true, force: true });
  });
  return state;
};

/**
 * @returns {{ repo: () => string }} a fresh repo for each test
 */
const fixtureRepo = () => {
  const state = ciRepo({ 'tools/mark.mjs': MARKER });
  return { repo: () => state.repo };
};

export { BROKEN, byName, ciRepo, fixtureRepo, git, WORKFLOW, workspace };
