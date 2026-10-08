/* @layer tooling-scripts @kind constants */
const HANDLERS_DIR = 'electron/handlers';
const HANDLERS_OUTPUT = '.brock/handlers.main.ts';
const HANDLERS_DEV_OUTPUT = '.brock/handlers.main.dev.ts';
const HANDLERS_FILE = /^([a-z][a-z0-9-]*)-handlers(\.dev)?\.ts$/;
const HANDLERS_NAME = 'mainHandlers';
const HANDLERS_DEV_NAME = 'devHandlers';
const HANDLERS_FROM = '@drizztdourden08/brock-electron/main';

export { HANDLERS_DEV_NAME, HANDLERS_DEV_OUTPUT, HANDLERS_DIR, HANDLERS_FILE, HANDLERS_FROM, HANDLERS_NAME, HANDLERS_OUTPUT };
