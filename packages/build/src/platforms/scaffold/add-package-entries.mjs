/* @layer tooling-scripts @kind logic */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const declared = (pkg, name) => Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);

/**
 * @param {Record<string, any>} pkg
 * @param {string} block
 * @param {Record<string, string>} values
 * @returns {string[]} the names added to that block
 */
const addToBlock = (pkg, block, values) => {
  pkg[block] ??= {};
  const fresh = Object.keys(values).filter((name) => !pkg[block][name] && !declared(pkg, name));
  for (const name of fresh) pkg[block][name] = values[name];
  return fresh;
};

/**
 * @param {string} rootDir
 * @param {Partial<Record<'dependencies' | 'devDependencies' | 'scripts', Record<string, string>>>} entries
 * @returns {string[]} the names added; an entry already there is kept
 */
const addPackageEntries = (rootDir, entries) => {
  const file = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const added = Object.entries(entries).flatMap(([block, values]) => addToBlock(pkg, block, values ?? {}));
  if (added.length) writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return added;
};

export { addPackageEntries };
