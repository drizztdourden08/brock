/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_PIN } from './tessera-renames.constants.mjs';

const fileOf = (rootDir) => join(rootDir, 'package.json');

const readPackage = (rootDir) => (existsSync(fileOf(rootDir)) ? JSON.parse(readFileSync(fileOf(rootDir), 'utf8')) : null);

const read = (rootDir) => {
  const pinned = readPackage(rootDir)?.brock?.[TESSERA_PIN];
  return typeof pinned === 'string' ? pinned : null;
};

const write = (rootDir, version) => {
  const pkg = readPackage(rootDir);
  if (!pkg || pkg.brock?.[TESSERA_PIN] === version) return false;
  const next = { ...pkg, brock: { ...pkg.brock, [TESSERA_PIN]: version } };
  writeFileSync(fileOf(rootDir), `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return true;
};

const tesseraPin = Object.freeze({ read, write });

export { tesseraPin };
