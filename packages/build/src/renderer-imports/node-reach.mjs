/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { runtimeSpecifiers } from './runtime-specifiers.mjs';

const BUILTINS = new Set(builtinModules);
const SOURCE_EXTENSIONS = ['', '.ts', '.tsx', '.mts', '.js', '.mjs', '/index.ts', '/index.tsx', '/index.js'];

const isBuiltin = (spec) => spec.startsWith('node:') || BUILTINS.has(spec.split('/')[0]);

const resolveSource = (fromFile, spec) => {
  const base = resolve(dirname(fromFile), spec);
  const found = SOURCE_EXTENSIONS.map((ext) => `${base}${ext}`).find((path) => existsSync(path) && statSync(path).isFile());
  return found ?? null;
};

/**
 * @param {string} entry  The barrel file of a package
 * @param {string} packageDir
 * @returns {{ spec: string, file: string } | null}  The first Node builtin the barrel loads
 */
const nodeReach = (entry, packageDir) => {
  const seen = new Set();
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    for (const spec of runtimeSpecifiers(readFileSync(file, 'utf8'))) {
      if (isBuiltin(spec)) return { spec, file: relative(packageDir, file).replace(/\\/g, '/') };
      const next = spec.startsWith('.') ? resolveSource(file, spec) : null;
      if (next) queue.push(next);
    }
  }
  return null;
};

/**
 * @param {Record<string, unknown> | string | undefined} target  An exports entry
 * @returns {string | null}
 */
const entryPath = (target) => {
  if (typeof target === 'string') return target;
  if (!target || typeof target !== 'object') return null;
  return entryPath(target.import ?? target.default ?? target.types);
};

/**
 * @param {string} packageDir
 * @returns {{ entry: string, subpaths: string[] } | null}  The barrel and the other subpaths, when the package has both
 */
const barrelOf = (packageDir) => {
  const pkg = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
  const exports = pkg.exports && typeof pkg.exports === 'object' ? pkg.exports : null;
  const main = exports ? entryPath(exports['.']) : null;
  if (!main) return null;
  const subpaths = Object.keys(exports).filter((key) => key !== '.' && key !== './package.json' && !key.includes('*'));
  const entry = join(packageDir, main);
  return subpaths.length > 0 && existsSync(entry) ? { entry, subpaths } : null;
};

export { barrelOf, nodeReach };
