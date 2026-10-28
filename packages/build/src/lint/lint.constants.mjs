/* @layer tooling-scripts @kind constants */
const DEFAULT_MEMORY_MB = 2048;
const FULL_TREE_MEMORY_MB = 4096;
const BATCH_SIZE = 1000;
const BATCH_ENV = 'BROCK_LINT_BATCH_SIZE';
const STATS_ENV = 'BROCK_LINT_STATS';
const MEMORY_ENV = 'BROCK_LINT_MEMORY_MB';
const BASE_ENV = 'BROCK_LINT_BASE';
const CACHE_DIR_ENV = 'BROCK_LINT_CACHE_DIR';
const HEAP_FLAG = /--max[-_]old[-_]space[-_]size/;
const BASE_REFS = ['origin/main', 'origin/master', 'main', 'master'];
const MAX_CHANGED_FILES = 300;
const WHOLE_TREE_FILES = /(^|\/)(eslint\.config\.[^/]+|standards\.(config|extension)\.[^/]+|tsconfig[^/]*\.json|package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|\.npmrc)$|(^|\/)lint-config\//;

export {
  BASE_ENV,
  BASE_REFS,
  BATCH_ENV,
  BATCH_SIZE,
  CACHE_DIR_ENV,
  DEFAULT_MEMORY_MB,
  FULL_TREE_MEMORY_MB,
  HEAP_FLAG,
  MAX_CHANGED_FILES,
  MEMORY_ENV,
  STATS_ENV,
  WHOLE_TREE_FILES,
};
