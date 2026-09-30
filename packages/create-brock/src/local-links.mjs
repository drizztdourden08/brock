/* @layer tooling-scripts @kind logic */
import { TESSERA_REGISTRY } from './create-brock.constants.mjs';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { linkSpec, MODULE_PACKAGES } from '@drizztdourden08/brock-build';
import { modulePeers } from './module-peers.mjs';

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

/**
 * @param {{ local: string, tessera?: string | null}} paths
 * @returns {string | null} null keeps the registry spec
 */
const tesseraSpec = ({ local, tessera }) => {
  if (tessera === TESSERA_REGISTRY) return null;
  if (tessera) return linkSpec(tessera);
  const sibling = resolve(local, '../tessera');
  return existsSync(join(sibling, 'package.json')) ? linkSpec(sibling) : null;
};

/**
 * @param {string} packageName
 * @param {{ local: string, tessera?: string | null}} paths
 */
const localSpecFor = (packageName, { local, tessera }) => {
  if (!packageName.startsWith(SCOPE)) return null;
  const short = packageName.slice(SCOPE.length);
  if (short === 'tessera') return tesseraSpec({ local, tessera });
  if (LOCAL_PACKAGES[short]) return linkSpec(join(local, LOCAL_PACKAGES[short]));
  if (short.startsWith('brock-')) return linkSpec(join(local, 'packages/modules', short.slice('brock-'.length)));
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
 * @param {Record<string, string>} specs
 * @returns {string[]} the names added
 */
const addMissing = (dependencies, specs) => {
  const fresh = Object.keys(specs).filter((name) => !dependencies[name]);
  for (const name of fresh) dependencies[name] = specs[name];
  return fresh;
};

/**
 * @param {Record<string, string>} dependencies
 * @param {string[]} modules
 * @param {{ version: string, local: string | null, templateDir: string }} opts
 * @returns {{ added: string[], peers: string[], pending: string[] }} pending: peers wait for install
 */
const addModuleDependencies = (dependencies, modules, { version, local, templateDir }) => {
  const added = [];
  const peers = [];
  const pending = [];
  for (const id of modules) {
    const name = MODULE_PACKAGES[id] ?? id;
    added.push(...addMissing(dependencies, { [name]: MODULE_PACKAGES[id] ? `^${version}` : 'latest' }));
    const declared = modulePeers(id, { local, templateDir });
    if (!declared) {
      pending.push(name);
      continue;
    }
    peers.push(...Object.keys(declared));
    added.push(...addMissing(dependencies, declared));
  }
  return { added, peers, pending };
};

const linkedNames = (pkg) =>
  Object.entries({ ...pkg.dependencies, ...pkg.devDependencies }).filter(([, spec]) => spec.startsWith('link:')).map(([name]) => name);

const ignoreInKnip = (targetDir, names) => {
  const file = join(targetDir, 'knip.json');
  if (names.length === 0 || !existsSync(file)) return;
  const knip = JSON.parse(readFileSync(file, 'utf8'));
  knip.ignoreDependencies = [...new Set([...(knip.ignoreDependencies ?? []), ...names])];
  writeFileSync(file, `${JSON.stringify(knip, null, 2)}\n`, 'utf8');
};

/**
 * @param {string} targetDir
 * @param {{ modules: string[], version: string, templateDir: string, local?: string | null, tessera?: string | null}} opts
 * @returns {{ added: string[], pending: string[] }}
 */
const applyDependencies = (targetDir, { modules, version, templateDir, local = null, tessera = null }) => {
  const file = join(targetDir, 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  pkg.dependencies ??= {};
  const { added, peers, pending } = addModuleDependencies(pkg.dependencies, modules, { version, local, templateDir });
  const blocks = ['dependencies', 'devDependencies'].filter((block) => pkg[block]);
  for (const block of blocks) pkg[block] = rewriteWorkspaceSpecs(pkg[block], version);
  if (local) {
    const paths = { local, tessera };
    for (const block of blocks) pkg[block] = rewriteToLocal(pkg[block], paths);
  }
  ignoreInKnip(targetDir, [...peers, ...(local ? linkedNames(pkg) : [])]);
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return { added, pending };
};

export { applyDependencies };
