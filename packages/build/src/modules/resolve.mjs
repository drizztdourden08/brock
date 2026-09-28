/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { packageForModule } from './registry.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/module').ResolvedModule} ResolvedModule
 */
/**
 * @typedef {import('@drizztdourden08/brock-core/module').BrockModuleManifest} BrockModuleManifest
 */

/**
 * @param {string} rootDir
 * @returns {(packageName: string) => { dir: string, pkg: Record<string, any> } | null}
 */
const packageReader = (rootDir) => {
  const require = createRequire(join(rootDir, 'package.json'));
  const locate = (packageName) => {
    try {
      return require.resolve(`${packageName}/package.json`);
    } catch {
      let dir = rootDir;
      for (;;) {
        const candidate = join(dir, 'node_modules', ...packageName.split('/'), 'package.json');
        if (existsSync(candidate)) return candidate;
        const parent = dirname(dir);
        if (parent === dir) return null;
        dir = parent;
      }
    }
  };
  return (packageName) => {
    const file = locate(packageName);
    if (!file) return null;
    try {
      return { dir: dirname(file), pkg: JSON.parse(readFileSync(file, 'utf8')) };
    } catch {
      return null;
    }
  };
};

/**
 * @param {string} rootDir
 */
const declaredDependencies = (rootDir) => {
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    return Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) });
  } catch {
    return [];
  }
};

/**
 * @param {string} id
 * @param {(name: string) => { dir: string, pkg: Record<string, any> } | null} read
 * @param {string[]} candidates
 * @returns {{ resolved: ResolvedModule | null, packageName: string | null}}
 */
const findModule = (id, read, candidates) => {
  const builtIn = packageForModule(id);
  const names = builtIn ? [builtIn, ...candidates] : candidates;
  for (const name of names) {
    const found = read(name);
    if (!found?.pkg?.brock) continue;
    if (found.pkg.brock.id !== id) continue;
    return {
      packageName: name,
      resolved: { packageName: name, version: found.pkg.version ?? '0.0.0', manifest: found.pkg.brock, exports: found.pkg.exports ?? null },
    };
  }
  return { resolved: null, packageName: builtIn };
};

/**
 * @param {string} rootDir
 * @param {string[]} ids
 * @returns {{ modules: (ResolvedModule & { exports: unknown }
 */
const resolveModules = (rootDir, ids) => {
  const read = packageReader(rootDir);
  const candidates = declaredDependencies(rootDir);
  const modules = [];
  const missing = [];
  for (const id of ids) {
    const { resolved, packageName } = findModule(id, read, candidates);
    if (resolved) modules.push(resolved);
    else missing.push({ id, packageName });
  }
  return { modules, missing };
};

/**
 * @param {string} packageName
 * @param {unknown} exportsMap `package.json#exports`, or null
 * @param {string} subpath A manifest entry such as `./src/main/index.ts`
 */
const exportTarget = (target) => (typeof target === 'string' ? target : target?.import ?? target?.default);

const specifierFor = (packageName, exportsMap, subpath) => {
  const normalized = subpath.startsWith('./') ? subpath : `./${subpath}`;
  if (exportsMap && typeof exportsMap === 'object') {
    for (const [key, target] of Object.entries(exportsMap)) {
      if (exportTarget(target) === normalized) return key === '.' ? packageName : `${packageName}/${key.slice(2)}`;
    }
  }
  return `${packageName}/${normalized.slice(2)}`;
};

export { resolveModules, specifierFor };
