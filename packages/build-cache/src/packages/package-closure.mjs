/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { blockedBy } from './blocked-by.mjs';
import { codeExports } from './code-exports.mjs';
import { UI_DEPENDENCIES } from './packages.constants.mjs';

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @param {string} fromDir
 * @param {string} name
 * @returns {string | null} the real folder Node finds for the package from fromDir
 */
const findInstalled = (fromDir, name) => {
  for (let dir = fromDir; ; dir = dirname(dir)) {
    const candidate = join(dir, 'node_modules', ...name.split('/'));
    if (existsSync(join(candidate, 'package.json'))) return realpathSync.native(candidate);
    if (dirname(dir) === dir) return null;
  }
};

/**
 * @param {string} realDir
 * @returns {boolean} an installed copy, not a linked checkout
 */
const isInstalledCopy = (realDir) => realDir.split(/[\\/]/).includes('node_modules');

const scopedNames = (pkg, scope, fields) => [...new Set(fields.flatMap((field) => Object.keys(pkg?.[field] ?? {})))].filter((name) => name.startsWith(scope));

const usesUi = (pkg) => UI_DEPENDENCIES.some((name) => name in (pkg.dependencies ?? {}) || name in (pkg.peerDependencies ?? {}));

/**
 * @typedef {{ name: string, version: string, dir: string, pkg: Record<string, any>, deps: string[], entries: { key: string, file: string, out: string }[] | null, problem: string | null }} ScopedPackage
 */

/**
 * @param {string} rootDir the app root
 * @param {string} scope the package name prefix
 * @returns {Map<string, ScopedPackage>} each installed copy, by its real folder
 */
const installedCopies = (rootDir, scope) => {
  const byDir = new Map();
  const visit = (fromDir, name) => {
    const dir = findInstalled(fromDir, name);
    if (!dir || byDir.has(dir)) return;
    const pkg = readJson(join(dir, 'package.json')) ?? {};
    const node = { name, version: pkg.version, dir, pkg, deps: scopedNames(pkg, scope, ['dependencies', 'peerDependencies', 'optionalDependencies']), entries: codeExports(pkg), problem: null };
    byDir.set(dir, node);
    for (const dep of node.deps) visit(dir, dep);
  };
  for (const name of scopedNames(readJson(join(rootDir, 'package.json')), scope, ['dependencies', 'devDependencies'])) visit(rootDir, name);
  return byDir;
};

/**
 * @param {ScopedPackage} node
 * @param {number} copies how many folders hold this name
 * @param {boolean} skipUi
 * @returns {string | null} why the cache cannot serve it
 */
const problemOf = (node, copies, skipUi) => {
  if (!isInstalledCopy(node.dir)) return 'linked to a source folder';
  if (typeof node.version !== 'string' || !node.version) return 'no version';
  if (copies > 1) return 'installed in more than one version';
  if (!node.entries) return 'no export map that points at code';
  return skipUi && usesUi(node.pkg) ? 'a UI package, kept out of this build' : null;
};

/**
 * @param {string} rootDir the app root
 * @param {{ scope: string, skipUi?: boolean }} options which packages, and whether UI packages stay compiled in
 * @returns {Map<string, ScopedPackage>} the scoped packages the app reaches, by name
 */
const packageClosure = (rootDir, { scope, skipUi = false }) => {
  const copies = [...installedCopies(rootDir, scope).values()];
  const countOf = (name) => copies.filter((node) => node.name === name).length;
  const byName = new Map();
  for (const node of copies) {
    node.problem = problemOf(node, countOf(node.name), skipUi);
    byName.set(node.name, node);
  }
  const nodes = [...byName.values()];
  const blocked = blockedBy(nodes, new Set(nodes.filter((node) => node.problem).map((node) => node.name)));
  for (const node of nodes) {
    if (!node.problem && blocked.has(node.name)) node.problem = 'depends on a package that is not served';
  }
  return byName;
};

export { packageClosure };
