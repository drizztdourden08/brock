/* @layer tooling-scripts @kind constants */
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const LOCALPKG_SCOPE = '@drizztdourden08/';
const LOCALPKG_PNPMFILE = '.pnpmfile.cjs';
const LOCALPKG_MARKER = 'localpkg: generated';
const LOCALPKG_HOME_ENV = 'LOCALPKG_HOME';
const LOCALPKG_INDEX_FILE = 'index.json';
const localpkgHome = () => resolve(process.env[LOCALPKG_HOME_ENV] || join(homedir(), '.coord', 'localpkg'));

export { LOCALPKG_SCOPE, LOCALPKG_PNPMFILE, LOCALPKG_MARKER, LOCALPKG_INDEX_FILE, localpkgHome };
