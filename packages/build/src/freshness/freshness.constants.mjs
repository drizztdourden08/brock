/* @layer tooling-scripts @kind constants */
const MANIFEST_FILE = '.brock/manifest.json';
const SYNC_INPUTS = ['brock.config.ts', 'package.json', 'src/screens', 'src/widgets', 'src/title-bar', 'src/tours', 'src/boot', 'electron/boot', 'electron/handlers', 'src/review'];
const RENDERER_ENTRY = 'src/main.tsx';
const GENERATED_IMPORT = /from\s+['"](\.\.\/\.brock\/[^'"]+)['"]/g;
const DIST_MAIN = 'dist/electron/main.js';
const DIST_RENDERER = 'dist/renderer/index.html';
const BUILD_OUTPUTS = [DIST_MAIN, 'dist/preload/preload.mjs', DIST_RENDERER];
const BUILD_INPUTS = ['brock.config.ts', 'package.json', 'tsconfig.json', 'electron.vite.config.ts', 'src', 'electron', 'public'];
const NOT_SOURCES = new Set(['node_modules', 'dist', 'release', 'out', 'coverage']);

export {
  BUILD_INPUTS, BUILD_OUTPUTS, DIST_MAIN, DIST_RENDERER, GENERATED_IMPORT, MANIFEST_FILE, NOT_SOURCES, RENDERER_ENTRY, SYNC_INPUTS,
};
