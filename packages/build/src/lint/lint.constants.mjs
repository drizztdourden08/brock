/* @layer tooling-scripts @kind constants */
const DEFAULT_MEMORY_MB = 2048;
const MEMORY_ENV = 'BROCK_LINT_MEMORY_MB';
const BASE_ENV = 'BROCK_LINT_BASE';
const CACHE_DIR_ENV = 'BROCK_LINT_CACHE_DIR';
const HEAP_FLAG = /--max[-_]old[-_]space[-_]size/;
const BASE_REFS = ['origin/main', 'origin/master', 'main', 'master'];
const MAX_CHANGED_FILES = 300;
const WHOLE_TREE_FILES = /(^|\/)(eslint\.config\.[^/]+|standards\.(config|extension)\.[^/]+|tsconfig[^/]*\.json|package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|\.npmrc)$|(^|\/)lint-config\//;

export { BASE_ENV, BASE_REFS, CACHE_DIR_ENV, DEFAULT_MEMORY_MB, HEAP_FLAG, MAX_CHANGED_FILES, MEMORY_ENV, WHOLE_TREE_FILES };
