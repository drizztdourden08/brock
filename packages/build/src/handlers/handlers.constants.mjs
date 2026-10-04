/* @layer tooling-scripts @kind constants */
const HANDLERS_DIR = 'electron/handlers';
const HANDLERS_OUTPUT = '.brock/handlers.main.ts';
const HANDLERS_SUFFIX = '-handlers.ts';
const HANDLERS_FILE = /^[a-z][a-z0-9-]*-handlers\.ts$/;
const HANDLERS_NAME = 'mainHandlers';
const HANDLERS_FROM = '@drizztdourden08/brock-electron/main';

export { HANDLERS_DIR, HANDLERS_FILE, HANDLERS_FROM, HANDLERS_NAME, HANDLERS_OUTPUT, HANDLERS_SUFFIX };
