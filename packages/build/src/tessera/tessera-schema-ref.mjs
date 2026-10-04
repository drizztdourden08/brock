/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { workspaceDirs } from '../workspace-dirs.mjs';
import { DESIGN_DIR, TESSERA_SCHEMA_FILE, TESSERA_SCHEMA_REF } from './tessera.constants.mjs';

const schemaIn = (dir) => join(dir, 'node_modules', ...TESSERA_SCHEMA_FILE.split('/'));

const asRef = (rootDir, file) => `./${relative(rootDir, file).replace(/\\/g, '/')}`;

/**
 * @param {string} rootDir the repo root
 * @returns {string} the $schema path, relative to the root
 */
const tesseraSchemaRef = (rootDir) => {
  const dirs = [rootDir, join(rootDir, DESIGN_DIR), ...workspaceDirs(rootDir)];
  const found = dirs.map(schemaIn).find((file) => existsSync(file));
  return found ? asRef(rootDir, found) : TESSERA_SCHEMA_REF;
};

export { tesseraSchemaRef };
