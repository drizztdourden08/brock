/* @layer tooling-scripts @kind constants */
const WORKSPACE_DEFAULTS = Object.freeze({
  base: 'main',
  branchPrefix: 'agent/',
  protectedBranches: ['main', 'master', 'gh-pages'],
  worktreesDir: '.worktrees',
  targets: {},
  provision: [],
  build: { staleDirs: [], steps: [] },
  publish: { prStyle: 'house' },
  plugins: [],
});

const WORKSPACE_FILE = 'brock.workspace.mjs';

export { WORKSPACE_DEFAULTS, WORKSPACE_FILE };
