/* @layer tooling-scripts @kind constants */
const SERVER_ENTRY = 'server/main.ts';
const SERVER_OUT = 'dist/server';
const SERVER_FILE = 'main.mjs';
const DIST_SERVER = 'dist/server/main.mjs';
const SERVER_SOURCE = /\.(?:ts|mts|js|mjs)$/;
const SERVER_LABEL = 'brock.config.ts server';
const NATIVE_ADDON = /\.node(?:[?#].*)?$/;
const NATIVE_LOADERS = new Set(['bindings', 'node-gyp-build', 'prebuild-install']);

export { SERVER_ENTRY, SERVER_OUT, SERVER_FILE, DIST_SERVER, SERVER_SOURCE, SERVER_LABEL, NATIVE_ADDON, NATIVE_LOADERS };
