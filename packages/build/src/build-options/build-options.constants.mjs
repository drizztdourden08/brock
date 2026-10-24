/* @layer tooling-scripts @kind constants */
const APP_ALIAS = '@app';
const ALIAS_NAME = /^[@#~$\w][\w.-]*(?:\/[\w.-]+)*$/;
const DEFINE_NAME = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/;
const NODE_POLYFILLS_PACKAGE = 'vite-plugin-node-polyfills';
const NODE_POLYFILLS_SETTING = /\bnodePolyfills\s*:(?!\s*false\b)/;
const WORKER_FORMAT = 'es';
const CJS_SHIM_BLOCK = /\n\/\/ -- CommonJS Shims --\n[\s\S]*?createRequire\(import\.meta\.url\);\n/;
const CJS_SHIM_MODULE = '__cjs_mod__';
const NODE_BUNDLE_TARGET = 'node22';
const CJS_GLOBALS_BANNER = [
  "import { fileURLToPath as __brockFileURLToPath } from 'node:url';",
  "import { dirname as __brockDirname } from 'node:path';",
  "import { createRequire as __brockCreateRequire } from 'node:module';",
  'const __brock_filename = __brockFileURLToPath(import.meta.url);',
  'const __brock_dirname = __brockDirname(__brock_filename);',
  'const __brock_require = __brockCreateRequire(import.meta.url);',
  '',
].join('\n');
const CJS_GLOBALS_DEFINE = {
  __dirname: '__brock_dirname',
  __filename: '__brock_filename',
  'require.resolve': '__brock_require.resolve',
  'require.main': '__brock_require.main',
  'require.cache': '__brock_require.cache',
};
const TSCONFIG_APP_PATH = '"@app/*": ["./src/*"],';

export {
  ALIAS_NAME, APP_ALIAS, CJS_GLOBALS_BANNER, CJS_GLOBALS_DEFINE, CJS_SHIM_BLOCK, CJS_SHIM_MODULE, DEFINE_NAME, NODE_BUNDLE_TARGET, NODE_POLYFILLS_PACKAGE, NODE_POLYFILLS_SETTING, TSCONFIG_APP_PATH, WORKER_FORMAT,
};
