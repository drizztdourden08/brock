/* @layer tooling-scripts @kind constants */
const MANIFEST_FILE = '.brock/manifest.json';
const SYNC_INPUTS = ['brock.config.ts', 'package.json', 'src/screens', 'src/widgets', 'src/title-bar', 'src/tours', 'src/boot', 'electron/boot', 'electron/handlers', 'src/review'];
const RENDERER_ENTRY = 'src/main.tsx';
const GENERATED_IMPORT = /from\s+['"](\.\.\/\.brock\/[^'"]+)['"]/g;
const DIST_MAIN = 'dist/electron/main.js';
const DIST_RENDERER = 'dist/renderer/index.html';

export { DIST_MAIN, DIST_RENDERER, GENERATED_IMPORT, MANIFEST_FILE, RENDERER_ENTRY, SYNC_INPUTS };
