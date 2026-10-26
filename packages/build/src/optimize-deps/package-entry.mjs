/* @layer tooling-scripts @kind logic */
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DECLARATION_FILE, ENTRY_CONDITIONS, NODE_MODULES_SEGMENT, RESOLVE_SUFFIXES } from './optimize-deps.constants.mjs';

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const isFile = (path) => statSync(path, { throwIfNoEntry: false })?.isFile() ?? false;

const memo = (fn) => {
  const cache = new Map();
  return (key) => {
    if (!cache.has(key)) cache.set(key, fn(key));
    return cache.get(key);
  };
};

/**
 * @param {string} spec a bare specifier
 * @returns {{ name: string, subpath: string }} the package name and its exports key
 */
const splitSpecifier = (spec) => {
  const parts = spec.split('/');
  const size = spec.startsWith('@') ? 2 : 1;
  return { name: parts.slice(0, size).join('/'), subpath: parts.length > size ? `./${parts.slice(size).join('/')}` : '.' };
};

const conditionTarget = (target) => {
  if (typeof target === 'string') return target;
  if (Array.isArray(target)) return target.map(conditionTarget).find(Boolean) ?? null;
  if (!target || typeof target !== 'object') return null;
  return ENTRY_CONDITIONS.filter((condition) => condition in target).map((condition) => conditionTarget(target[condition])).find(Boolean) ?? null;
};

/**
 * @param {Record<string, any>} pkg a package.json
 * @returns {Record<string, unknown> | null} its exports as a subpath map
 */
const exportsMap = (pkg) => {
  const { exports } = pkg;
  if (exports === undefined || exports === null) return null;
  const sugar = typeof exports === 'string' || Array.isArray(exports) || !Object.keys(exports).every((key) => key.startsWith('.'));
  return sugar ? { '.': exports } : exports;
};

const patternTarget = (map, subpath) => {
  for (const [key, target] of Object.entries(map)) {
    const [head, tail, extra] = key.split('*');
    if (tail === undefined || extra !== undefined) continue;
    if (subpath.length < head.length + tail.length || !subpath.startsWith(head) || !subpath.endsWith(tail)) continue;
    return conditionTarget(target)?.replaceAll('*', subpath.slice(head.length, subpath.length - tail.length)) ?? null;
  }
  return null;
};

const entryTarget = (pkg, subpath) => {
  const map = exportsMap(pkg);
  if (map) return subpath in map ? conditionTarget(map[subpath]) : patternTarget(map, subpath);
  if (subpath !== '.') return subpath;
  return typeof pkg.module === 'string' ? pkg.module : (pkg.main ?? './index.js');
};

const createResolver = () => {
  const manifests = new Set();
  const packageAt = memo((candidate) => {
    const file = join(candidate, 'package.json');
    const pkg = readJson(file);
    if (!pkg) return null;
    manifests.add(file);
    const real = realpathSync.native(candidate);
    return { dir: real, pkg, linked: !NODE_MODULES_SEGMENT.test(real) };
  });
  const resolveFile = memo((base) => {
    const typed = /\.[cm]?js$/.test(base) ? [base.replace(/js$/, 'ts'), base.replace(/js$/, 'tsx')] : [];
    return [...RESOLVE_SUFFIXES.map((suffix) => `${base}${suffix}`), ...typed].find(isFile) ?? null;
  });
  const findPackage = (fromDir, name) => {
    for (let dir = fromDir; ; dir = dirname(dir)) {
      const found = packageAt(join(dir, 'node_modules', ...name.split('/')));
      if (found) return found;
      if (dirname(dir) === dir) return null;
    }
  };
  const entryFile = (found, subpath) => {
    const target = entryTarget(found.pkg, subpath);
    const file = typeof target === 'string' ? resolveFile(join(found.dir, target)) : null;
    return file && !DECLARATION_FILE.test(file) ? file : null;
  };
  return { findPackage, resolveFile, entryFile, manifests: () => [...manifests] };
};

export { createResolver, exportsMap, splitSpecifier };
