/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SOURCE_SCOPE } from '../vite.constants.mjs';
import { bundledBrockOf } from './bundled-brock.mjs';
import { cachedCrawl } from './crawl-cache.mjs';
import { crawlRendererDeps } from './crawl-deps.mjs';
import { linkedSourcesStamp } from './linked-stamp.mjs';
import {
  ALWAYS_INCLUDED, LIST_OPTION_KEYS, LIVE_BROCK_ENV, LIVE_BROCK_KEY, NON_RENDERER_ENTRIES, OPTION_KEYS, SOURCE_FILE, STAMP_PLUGIN, TESSERA_PACKAGE,
} from './optimize-deps.constants.mjs';
import { createResolver, exportsMap, splitSpecifier } from './package-entry.mjs';

const isRendererEntry = (key) => !key.includes('*') && !/\.\w+$/.test(key) && !NON_RENDERER_ENTRIES.has(key.slice(2).split('/')[0]);

/**
 * @param {string} rootDir the app root
 * @param {ReturnType<typeof createResolver>} resolver
 * @param {import('./crawl-deps.mjs').BundledTest} bundled
 * @param {string[]} bundledEntries filled with the entry files of the pre-bundled ones
 * @returns {(name: string) => string[]} renderer entries; none when linked and served as source
 */
const installedEntriesOf = (rootDir, resolver, bundled, bundledEntries) => (name) => {
  const found = resolver.findPackage(rootDir, name);
  if (!found || (found.linked && !bundled(name, found))) return [];
  const keys = Object.keys(exportsMap(found.pkg) ?? { '.': null }).filter((key) => isRendererEntry(key) && SOURCE_FILE.test(resolver.entryFile(found, key) ?? ''));
  if (found.linked) bundledEntries.push(...keys.map((key) => resolver.entryFile(found, key)));
  return keys.map((key) => (key === '.' ? name : `${name}/${key.slice(2)}`));
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

const liveBrockOption = (value) => {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') throw new Error(`brock.config.ts build.optimizeDeps.${LIVE_BROCK_KEY} takes true or false.`);
  return value;
};

/**
 * @param {unknown} options build.optimizeDeps of brock.config.ts
 * @returns {{ include: string[], exclude: string[], entries: string[], worker: string[], liveBrock: boolean }} checked, each list empty when unset
 */
const optimizeDepsOptions = (options) => {
  if (options === undefined || options === null) return { include: [], exclude: [], entries: [], worker: [], liveBrock: false };
  if (typeof options !== 'object' || Array.isArray(options)) throw new Error(`brock.config.ts build.optimizeDeps takes { ${OPTION_KEYS.join(', ')} }.`);
  const unknown = Object.keys(options).filter((key) => !OPTION_KEYS.includes(key));
  if (unknown.length > 0) throw new Error(`brock.config.ts build.optimizeDeps: ${unknown.join(', ')} is not an option; it takes ${OPTION_KEYS.join(', ')}.`);
  return { ...Object.fromEntries(LIST_OPTION_KEYS.map((key) => [key, stringList(options[key], key)])), liveBrock: liveBrockOption(options[LIVE_BROCK_KEY]) };
};

const crawlKnownDeps = (rootDir, aliases, live) => async () => {
  const resolver = createResolver();
  const bundledManifests = new Set();
  const bundled = bundledBrockOf(rootDir, live, bundledManifests);
  const bundledEntries = [];
  const bundledFiles = new Set();
  const seen = new Set();
  const specs = [
    ...ALWAYS_INCLUDED.filter((spec) => resolvableFromRoot(rootDir, resolver, spec)),
    ...[TESSERA_PACKAGE, ...scopedDependencies(rootDir)].flatMap(installedEntriesOf(rootDir, resolver, bundled, bundledEntries)),
    ...await crawlRendererDeps(rootDir, aliases, resolver, { seen, bundled, bundledEntries, bundledFiles }),
  ];
  const result = { specs, bundled: [...bundledFiles, ...bundledManifests] };
  return { result, files: [...seen, ...resolver.manifests()] };
};

const stampPlugin = (stamp) => ({ name: `${STAMP_PLUGIN}:${stamp}`, setup: () => undefined });

/**
 * @param {string} rootDir the app root
 * @param {Record<string, string>} aliases import prefixes and their absolute folders
 * @param {unknown} options build.optimizeDeps of brock.config.ts
 * @returns {Promise<{ include: string[], exclude?: string[], entries?: string[], esbuildOptions?: { plugins: { name: string, setup: () => void }[] } }>} the renderer optimizeDeps
 */
const rendererOptimizeDeps = async (rootDir, aliases, options) => {
  const { include, exclude, entries, worker, liveBrock } = optimizeDepsOptions(options);
  const live = liveBrock || process.env[LIVE_BROCK_ENV] === '1';
  const crawled = await cachedCrawl(rootDir, { aliases, live }, crawlKnownDeps(rootDir, aliases, live));
  const known = crawled.specs.filter((spec) => !isExcluded(spec, exclude));
  return {
    include: [...new Set([...known, ...include, ...worker])].sort(),
    ...(exclude.length > 0 ? { exclude } : {}),
    ...(entries.length > 0 ? { entries } : {}),
    ...(crawled.bundled.length > 0 ? { esbuildOptions: { plugins: [stampPlugin(linkedSourcesStamp(crawled.bundled))] } } : {}),
  };
};

export { optimizeDepsOptions, rendererOptimizeDeps };
