/* @layer tooling-scripts @kind constants */
const APP_ALIAS = '@app';
const ALIAS_NAME = /^[@#~$\w][\w.-]*(?:\/[\w.-]+)*$/;
const NODE_POLYFILLS_PACKAGE = 'vite-plugin-node-polyfills';
const NODE_POLYFILLS_SETTING = /\bnodePolyfills\s*:(?!\s*false\b)/;
const WORKER_FORMAT = 'es';
const TSCONFIG_APP_PATH = '"@app/*": ["./src/*"],';

export { ALIAS_NAME, APP_ALIAS, NODE_POLYFILLS_PACKAGE, NODE_POLYFILLS_SETTING, TSCONFIG_APP_PATH, WORKER_FORMAT };
