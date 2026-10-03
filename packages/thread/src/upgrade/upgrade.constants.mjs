/* @layer tooling-scripts @kind constants */
const BROCK_SCOPE = '@drizztdourden08';
const BROCK_PACKAGE = /^@drizztdourden08\/(?:brock(?:-[a-z0-9-]+)?|create-brock)$/;
const BUILD_PACKAGE = '@drizztdourden08/brock-build';
const TESSERA_PACKAGE = '@drizztdourden08/tessera';
const REACT_PACKAGE = '@drizztdourden08/brock-react';
const CATALOG_SPEC = 'catalog:';
const LOCAL_SPEC = /^(?:link|file|workspace|portal):/;
const DEFAULT_REGISTRY = 'https://npm.pkg.github.com';
const BROCK_REPO = 'drizztdourden08/brock';
const WORKTREE_PREFIX = 'brock-';
const PIN_FIELD = 'brock.version';
const REPORT_FILE = 'upgrade-report.md';
const MIGRATIONS_FILE = '.user-data/upgrade-migrations.json';
const NPM_TIMEOUT_MS = 60000;
const GATE_SCRIPTS = Object.freeze(['lint', 'typecheck', 'structure', 'test']);
const CHECKOUT_PACKAGE_DIRS = Object.freeze(['packages', 'packages/modules', 'packages/plugins']);
const DEPENDENCY_BLOCKS = Object.freeze(['dependencies', 'devDependencies']);
const CHECK_EXIT = Object.freeze({ upToDate: 0, behind: 1, offline: 2 });

export {
  BROCK_PACKAGE, BROCK_REPO, BROCK_SCOPE, BUILD_PACKAGE, CATALOG_SPEC, CHECK_EXIT, CHECKOUT_PACKAGE_DIRS, DEFAULT_REGISTRY, DEPENDENCY_BLOCKS,
  GATE_SCRIPTS, LOCAL_SPEC, MIGRATIONS_FILE, NPM_TIMEOUT_MS, PIN_FIELD, REACT_PACKAGE, REPORT_FILE, TESSERA_PACKAGE, WORKTREE_PREFIX,
};
