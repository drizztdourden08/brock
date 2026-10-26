/* @layer tooling-scripts @kind constants */
const ALWAYS_INCLUDED = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client'];
const TESSERA_PACKAGE = '@drizztdourden08/tessera';
const NON_RENDERER_ENTRIES = new Set(['main', 'preload', 'splash-preload', 'node', 'zip', 'worker', 'cli', 'config', 'ensure-wasm', 'augment', 'package.json']);
const ENTRY_CONDITIONS = ['browser', 'import', 'module', 'default'];
const DECLARATION_FILE = /\.d\.[cm]?ts$/;
const SOURCE_FILE = /\.(?:[cm]?[jt]sx?)$/;
const TEST_FILE = /\.(?:test|spec|stories)\.[cm]?[jt]sx?$/;
const SKIPPED_DIRS = new Set(['node_modules', 'dist', 'out', 'release', 'coverage', 'tests', '__tests__']);
const ASSET_SPECIFIER = /\.(?:css|less|s[ac]ss|styl|svg|png|jpe?g|gif|webp|avif|ico|wasm|woff2?|ttf|otf|txt|html|json|md|glsl|wgsl)$/i;
const DYNAMIC_IMPORT = /\bimport\s*\(\s*['"]([^'"\n]+)['"]\s*\)/g;
const RESOLVE_SUFFIXES = ['', '.ts', '.tsx', '.mts', '.js', '.jsx', '.mjs', '/index.ts', '/index.tsx', '/index.js', '/index.mjs'];
const NODE_MODULES_SEGMENT = /[\\/]node_modules[\\/]/;
const OPTION_KEYS = ['include', 'exclude', 'entries', 'worker'];
const READ_BATCH = 64;
const DEPS_METADATA_ENV = 'BROCK_DEV_DEPS_METADATA';
const ELECTRON_VITE_MODE_ENV = 'NODE_ENV_ELECTRON_VITE';
const CRAWL_CACHE_FILE = 'node_modules/.vite/brock-renderer-deps.json';
const CRAWL_CACHE_VERSION = 1;
const INSTALL_STAMPS = ['package.json', 'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'node_modules/.modules.yaml'];

export {
  ALWAYS_INCLUDED, ASSET_SPECIFIER, CRAWL_CACHE_FILE, CRAWL_CACHE_VERSION, DECLARATION_FILE, DEPS_METADATA_ENV, DYNAMIC_IMPORT, ELECTRON_VITE_MODE_ENV, ENTRY_CONDITIONS, INSTALL_STAMPS, NODE_MODULES_SEGMENT, NON_RENDERER_ENTRIES, OPTION_KEYS, READ_BATCH, RESOLVE_SUFFIXES,
  SKIPPED_DIRS, SOURCE_FILE, TESSERA_PACKAGE, TEST_FILE,
};
