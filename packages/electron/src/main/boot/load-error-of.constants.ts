/* @layer electron-main @kind constants */
const MAX_LENGTH = 400;
const UNCAUGHT = /^Uncaught\b/;
const IMPORT_FAILED = /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;

export { IMPORT_FAILED, MAX_LENGTH, UNCAUGHT };
