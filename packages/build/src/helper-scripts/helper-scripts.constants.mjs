/* @layer tooling-scripts @kind constants */
const HELPERS_OUT = 'dist/helpers';
const HELPERS_RESOURCES = 'helpers';
const HELPER_EXT = '.mjs';
const HELPER_NAME = /^[a-z0-9][a-z0-9-]*$/;
const HELPER_SOURCE = /\.(?:ts|mts|js|mjs)$/;
const HELPER_TARGET = 'node22';
const HELPERS_LABEL = 'brock.config.ts helpers';

export { HELPERS_OUT, HELPERS_RESOURCES, HELPER_EXT, HELPER_NAME, HELPER_SOURCE, HELPER_TARGET, HELPERS_LABEL };
