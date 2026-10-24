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
const TSCONFIG_APP_PATH = '"@app/*": ["./src/*"],';

export {
  ALIAS_NAME, APP_ALIAS, CJS_SHIM_BLOCK, CJS_SHIM_MODULE, DEFINE_NAME, NODE_BUNDLE_TARGET, NODE_POLYFILLS_PACKAGE, NODE_POLYFILLS_SETTING, TSCONFIG_APP_PATH, WORKER_FORMAT,
};
