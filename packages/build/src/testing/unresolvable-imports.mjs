/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { packageNameOf } from '../declared-externals.mjs';
import { importSpecifiers } from './import-specifiers.mjs';

const isRelative = (spec) => spec.startsWith('./') || spec.startsWith('../');

const packageFound = (fromDir, name) => {
  for (let dir = fromDir; ; dir = dirname(dir)) {
    if (existsSync(join(dir, 'node_modules', ...name.split('/'), 'package.json'))) return true;
    if (dirname(dir) === dir) return false;
  }
};

const problemOf = (file, spec) => {
  if (isRelative(spec)) return existsSync(resolve(dirname(file), spec)) ? null : spec;
  const name = packageNameOf(spec);
  return name && !packageFound(dirname(file), name) ? name : null;
};

const scriptsIn = (dir) => readdirSync(dir, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.[cm]?js$/.test(entry.name))
  .map((entry) => join(entry.parentPath, entry.name));

/**
 * @param {string} outDir the built main folder, dist/electron
 * @returns {{ file: string, spec: string }[]} imports Node cannot find from there
 */
const unresolvableImports = (outDir) => scriptsIn(outDir).flatMap((file) =>
  importSpecifiers(readFileSync(file, 'utf8'))
    .map((spec) => ({ file, spec: problemOf(file, spec) }))
    .filter((entry) => entry.spec !== null));

export { unresolvableImports };
