/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SOURCE_SCOPE } from '../vite.constants.mjs';
import { crawlRendererDeps } from './crawl-deps.mjs';
import { ALWAYS_INCLUDED, NON_RENDERER_ENTRIES, OPTION_KEYS, SOURCE_FILE, TESSERA_PACKAGE } from './optimize-deps.constants.mjs';
import { createResolver, exportsMap, splitSpecifier } from './package-entry.mjs';

const isRendererEntry = (key) => !key.includes('*') && !/\.\w+$/.test(key) && !NON_RENDERER_ENTRIES.has(key.slice(2).split('/')[0]);

/**
 * @param {string} rootDir the app root
 * @param {ReturnType<typeof createResolver>} resolver
 * @returns {(name: string) => string[]} renderer entries; none when linked
 */
const installedEntriesOf = (rootDir, resolver) => (name) => {
  const found = resolver.findPackage(rootDir, name);
  if (!found || found.linked) return [];
  return Object.keys(exportsMap(found.pkg) ?? { '.': null })
    .filter((key) => isRendererEntry(key) && SOURCE_FILE.test(resolver.entryFile(found, key) ?? ''))
    .map((key) => (key === '.' ? name : `${name}/${key.slice(2)}`));
};

const resolvableFromRoot = (rootDir, resolver, spec) => {
  const { name, subpath } = splitSpecifier(spec);
  const found = resolver.findPackage(rootDir, name);
  return Boolean(found && !found.linked && resolver.entryFile(found, subpath));
};

const scopedDependencies = (rootDir) => {
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    return Object.keys(pkg.dependencies ?? {}).filter((name) => name.startsWith(SOURCE_SCOPE) && name !== TESSERA_PACKAGE);
  } catch {
    return [];
  }
};

const isExcluded = (spec, exclude) => exclude.some((name) => {
  const last = spec.split(' > ').at(-1);
  return last === name || last.startsWith(`${name}/`);
});

const stringList = (value, key) => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string' && item.trim())) {
    throw new Error(`brock.config.ts build.optimizeDeps.${key} takes a list of package specifiers.`);
  }
  return value;
};

/**
 * @param {unknown} options build.optimizeDeps of brock.config.ts
 * @returns {{ include: string[], exclude: string[], entries: string[], worker: string[] }} checked, each list empty when unset
 */
const optimizeDepsOptions = (options) => {
  if (options === undefined || options === null) return { include: [], exclude: [], entries: [], worker: [] };
  if (typeof options !== 'object' || Array.isArray(options)) throw new Error('brock.config.ts build.optimizeDeps takes { include, exclude, entries, worker }.');
  const unknown = Object.keys(options).filter((key) => !OPTION_KEYS.includes(key));
  if (unknown.length > 0) throw new Error(`brock.config.ts build.optimizeDeps: ${unknown.join(', ')} is not an option; it takes ${OPTION_KEYS.join(', ')}.`);
  return Object.fromEntries(OPTION_KEYS.map((key) => [key, stringList(options[key], key)]));
};

/**
 * @param {string} rootDir the app root
 * @param {Record<string, string>} aliases import prefixes and their absolute folders
 * @param {unknown} options build.optimizeDeps of brock.config.ts
 * @returns {Promise<{ include: string[], exclude?: string[], entries?: string[] }>} the renderer optimizeDeps
 */
const rendererOptimizeDeps = async (rootDir, aliases, options) => {
  const { include, exclude, entries, worker } = optimizeDepsOptions(options);
  const resolver = createResolver();
  const installedEntries = installedEntriesOf(rootDir, resolver);
  const known = [
    ...ALWAYS_INCLUDED.filter((spec) => resolvableFromRoot(rootDir, resolver, spec)),
    ...[TESSERA_PACKAGE, ...scopedDependencies(rootDir)].flatMap(installedEntries),
    ...await crawlRendererDeps(rootDir, aliases, resolver),
  ].filter((spec) => !isExcluded(spec, exclude));
  return {
    include: [...new Set([...known, ...include, ...worker])].sort(),
    ...(exclude.length > 0 ? { exclude } : {}),
    ...(entries.length > 0 ? { entries } : {}),
  };
};

export { optimizeDepsOptions, rendererOptimizeDeps };
