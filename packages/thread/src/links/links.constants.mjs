/* @layer tooling-scripts @kind constants */
const LINK_PREFIX = 'link:';
const DRIVE_PATH = /^([A-Za-z]):[\\/]/;
const RESOLVE_LINE = 'prefer-frozen-lockfile=false';
const LOCKFILE_ATTRIBUTE = 'pnpm-lock.yaml text eol=lf';
const LINK_BLOCKS = Object.freeze(['dependencies', 'devDependencies', 'optionalDependencies']);

export { DRIVE_PATH, LINK_BLOCKS, LINK_PREFIX, LOCKFILE_ATTRIBUTE, RESOLVE_LINE };
