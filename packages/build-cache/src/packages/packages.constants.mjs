/* @layer tooling-scripts @kind constants */
const DEFAULT_SCOPE = '@drizztdourden08/';
const LAYOUT_VERSION = 1;
const INPUT_KEY_LENGTH = 12;
const PLACED_FOLDER = ['node_modules', '.build-cache', 'node_modules'];
const PLACED_MARKER = '.build-cache.json';
const CODE_FILE = /\.(?:[cm]?[jt]sx?)$/;
const EXPORT_CONDITIONS = ['node', 'import', 'module', 'default'];
const UI_DEPENDENCIES = ['react', 'react-dom', 'preact', 'vue', 'svelte', 'solid-js'];
const ASSET_LOADERS = Object.freeze({
  '.svg': 'file', '.png': 'file', '.jpg': 'file', '.jpeg': 'file', '.gif': 'file', '.webp': 'file', '.avif': 'file', '.ico': 'file',
  '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.otf': 'file', '.wav': 'file', '.mp3': 'file', '.ogg': 'file', '.wasm': 'file',
  '.txt': 'text', '.md': 'text',
});

export { ASSET_LOADERS, CODE_FILE, DEFAULT_SCOPE, INPUT_KEY_LENGTH, LAYOUT_VERSION, EXPORT_CONDITIONS, PLACED_FOLDER, PLACED_MARKER, UI_DEPENDENCIES };
