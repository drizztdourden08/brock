/* @layer tooling-scripts @kind constants */
const PLATFORM_USAGE = 'Usage: brock platform list | add <id | bundle>... | remove <id | bundle>...';
const WEB_USAGE = 'Usage: brock web build | dev [-- vite args]   (the renderer alone, relative base, into dist/web)';
const WEB_MODES = new Set(['build', 'dev']);
const SERVER_USAGE = 'Usage: brock server build | dev [-- app args] | package [--arch x64,arm64] [--deb]   (the server entry as one Node file in dist/server/main.mjs; dev rebuilds and restarts it; package fills release/server)';
const SERVER_MODES = new Set(['build', 'dev', 'package']);

export { PLATFORM_USAGE, WEB_USAGE, WEB_MODES, SERVER_USAGE, SERVER_MODES };
