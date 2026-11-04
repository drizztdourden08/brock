/* @layer tooling-scripts @kind constants */
const HELPERS_OUT = 'dist/helpers';
const HELPERS_RESOURCES = 'helpers';
const HELPER_EXT = '.mjs';
const HELPER_NAME = /^[a-z0-9][a-z0-9-]*$/;
const HELPER_SOURCE = /\.(?:ts|mts|js|mjs)$/;
const HELPERS_LABEL = 'brock.config.ts helpers';
const HELPER_APP_DEFINE = 'process.env.BROCK_HELPER_APP';

export { HELPER_APP_DEFINE,HELPERS_OUT, HELPERS_RESOURCES, HELPER_EXT, HELPER_NAME, HELPER_SOURCE, HELPERS_LABEL };
