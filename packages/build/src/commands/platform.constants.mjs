/* @layer tooling-scripts @kind constants */
const PLATFORM_USAGE = 'Usage: brock platform list | add <id | bundle>... | remove <id | bundle>...';
const WEB_USAGE = 'Usage: brock web build | dev [-- vite args]   (the renderer alone, relative base, into dist/web)';
const WEB_MODES = new Set(['build', 'dev']);

export { PLATFORM_USAGE, WEB_USAGE, WEB_MODES };
