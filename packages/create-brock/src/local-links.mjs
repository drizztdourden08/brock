/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { MODULE_PACKAGES } from '@drizztdourden08/brock-build';

const SCOPE = '@drizztdourden08/';

const LOCAL_PACKAGES = {
  'brock-core': 'packages/core',
  'brock-electron': 'packages/electron',
  'brock-react': 'packages/react',
  'brock-build': 'packages/build',
  'brock-lint-config': 'packages/lint-config',
  'brock-thread': 'packages/thread',
  'brock-plugin-snes': 'packages/plugins/snes',
};

const toLinkSpec = (dir) => `link:${resolve(dir).replace(/\\/g, '/')}`;

/**
 * @param {string} packageName
 * @param {{ local: string, tessera?: string | null}} paths
 */
const localSpecFor = (packageName, { local, tessera }) => {
  if (!packageName.startsWith(SCOPE)) return null;
  const short = packageName.slice(SCOPE.length);
  if (short === 'tessera') return toLinkSpec(tessera ?? resolve(local, '../tessera'));
  if (LOCAL_PACKAGES[short]) return toLinkSpec(join(local, LOCAL_PACKAGES[short]));
  if (short.startsWith('brock-')) return toLinkSpec(join(local, 'packages/modules', short.slice('brock-'.length)));
  return null;
};

/**
 * @param {Record<string, string>} deps
 * @param {{ local: string, tessera?: string | null}} paths
 */
const rewriteToLocal = (deps, paths) =>
  Object.fromEntries(Object.entries(deps).map(([name, spec]) => [name, localSpecFor(name, paths) ?? spec]));

/**
 * @param {Record<string, string>} deps
 * @param {string} version
 */
const rewriteWorkspaceSpecs = (deps, version) =>
  Object.fromEntries(Object.entries(deps).map(([name, spec]) => [name, spec.startsWith('workspace:') ? `^${version}` : spec]));

/**
 * @param {Record<string, string>} dependencies
 * @param {string[]} modules
 * @param {string} version
 * @returns {string[]}  Package names added for the modules
 */
const addModuleDependencies = (dependencies, modules, version) => {
  const added = [];
  for (const id of modules) {
    const name = MODULE_PACKAGES[id] ?? id;
    if (dependencies[name]) continue;
    dependencies[name] = MODULE_PACKAGES[id] ? `^${version}` : 'latest';
    added.push(name);
  }
  return added;
};

const linkedNames = (pkg) =>
  Object.entries({ ...pkg.dependencies, ...pkg.devDependencies }).filter(([, spec]) => spec.startsWith('link:')).map(([name]) => name);

const ignoreLinkedInKnip = (targetDir, names) => {
  const file = join(targetDir, 'knip.json');
  if (names.length === 0 || !existsSync(file)) return;
  const knip = JSON.parse(readFileSync(file, 'utf8'));
  knip.ignoreDependencies = [...new Set([...(knip.ignoreDependencies ?? []), ...names])];
  writeFileSync(file, `${JSON.stringify(knip, null, 2)}\n`, 'utf8');
};

/**
 * @param {string} targetDir
 * @param {{ modules: string[], version: string, local?: string | null, tessera?: string | null}} opts
 * @returns {string[]}  Package names added for the modules
 */
const applyDependencies = (targetDir, { modules, version, local = null, tessera = null }) => {
  const file = join(targetDir, 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  pkg.dependencies ??= {};
  const added = addModuleDependencies(pkg.dependencies, modules, version);
  const blocks = ['dependencies', 'devDependencies'].filter((block) => pkg[block]);
  for (const block of blocks) pkg[block] = rewriteWorkspaceSpecs(pkg[block], version);
  if (local) {
    const paths = { local, tessera };
    for (const block of blocks) pkg[block] = rewriteToLocal(pkg[block], paths);
    ignoreLinkedInKnip(targetDir, linkedNames(pkg));
  }
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return added;
};

export { applyDependencies };
