/* @layer tooling-scripts @kind logic */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runPnpm } from '../run.mjs';
import { localpkgVersion } from './localpkg-index.mjs';
import { isLocalpkgMode } from './localpkg-mode.mjs';
import { LOCALPKG_SCOPE } from './localpkg.constants.mjs';
import { packageNameOf } from './registry.mjs';

const declareLocalRanges = (rootDir, names) => {
  const file = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const declared = { ...pkg.dependencies, ...pkg.devDependencies };
  const added = Object.fromEntries(names.filter((name) => !declared[name]).map((name) => [name, `^${localpkgVersion(name)}`]));
  pkg.dependencies = { ...pkg.dependencies, ...added };
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
};

/**
 * @param {string} rootDir the app folder
 * @param {string[]} specs pnpm specs to add
 * @returns {Promise<number>} exit code
 */
const installSpecs = async (rootDir, specs) => {
  const local = isLocalpkgMode(rootDir) ? specs.filter((spec) => spec.startsWith(LOCALPKG_SCOPE)) : [];
  const rest = specs.filter((spec) => !local.includes(spec));
  if (local.length) {
    console.log(`brock add: localpkg mode, declaring ${local.join(', ')} from the local index`);
    declareLocalRanges(rootDir, local.map(packageNameOf));
    const code = await runPnpm(rootDir, ['install', '--no-frozen-lockfile']);
    if (code !== 0) return code;
  }
  return rest.length ? runPnpm(rootDir, ['add', ...rest]) : 0;
};

export { installSpecs };
