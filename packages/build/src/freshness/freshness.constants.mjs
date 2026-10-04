/* @layer tooling-scripts @kind constants */
const MANIFEST_FILE = '.brock/manifest.json';
const SYNC_INPUTS = ['brock.config.ts', 'package.json', 'src/screens', 'src/widgets', 'src/title-bar', 'src/boot', 'electron/boot'];
const RENDERER_ENTRY = 'src/main.tsx';
const GENERATED_IMPORT = /from\s+['"](\.\.\/\.brock\/[^'"]+)['"]/g;

export { GENERATED_IMPORT, MANIFEST_FILE, RENDERER_ENTRY, SYNC_INPUTS };
