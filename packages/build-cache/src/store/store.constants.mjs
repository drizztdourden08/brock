/* @layer tooling-scripts @kind constants */
const CACHE_ENV = 'BROCK_BUILD_CACHE_DIR';
const CACHE_FOLDERS = ['.brock', 'cache', 'build-cache'];
const SCHEMA = 1;
const MANIFEST_FILE = 'manifest.json';
const FILES_DIR = 'files';
const TEMP_DIR = '.tmp';
const KIND = Object.freeze({ PACKAGE: 'package', ELECTRON: 'electron' });
const SEGMENT = /^[\w.+@-]+$/;
const SKIPPED_FOLDERS = new Set(['node_modules', '.git']);

export { CACHE_ENV, CACHE_FOLDERS, FILES_DIR, KIND, MANIFEST_FILE, SCHEMA, SEGMENT, SKIPPED_FOLDERS, TEMP_DIR };
