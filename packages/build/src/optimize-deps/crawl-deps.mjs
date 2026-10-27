/* @layer tooling-scripts @kind logic */
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { packageNameOf } from '../declared-externals.mjs';
import { runtimeSpecifiers } from '../renderer-imports/runtime-specifiers.mjs';
import { ASSET_SPECIFIER, DYNAMIC_IMPORT, READ_BATCH } from './optimize-deps.constants.mjs';
import { splitSpecifier } from './package-entry.mjs';
import { sourceFilesUnder } from './source-files.mjs';

const specifiersOf = async (file) => {
  const text = await readFile(file, 'utf8').catch(() => '');
  return [...runtimeSpecifiers(text), ...[...text.matchAll(DYNAMIC_IMPORT)].map((match) => match[1])];
};

const isPackageSpecifier = (spec) => !/^[./\\]|^[A-Za-z]:|^virtual:|\0|\?/.test(spec) && !ASSET_SPECIFIER.test(spec) && packageNameOf(spec) !== null;

/**
 * @param {ReturnType<import('./package-entry.mjs').createResolver>} resolver
 * @param {Record<string, string>} aliases import prefixes and their absolute folders
 * @returns {(file: string, spec: string) => string | null | undefined} the file; undefined for a package
 */
const localFileOf = (resolver, aliases) => (file, spec) => {
  if (spec.startsWith('.')) return resolver.resolveFile(resolve(dirname(file), spec));
  const hit = Object.entries(aliases).find(([name]) => spec === name || spec.startsWith(`${name}/`));
  return hit ? resolver.resolveFile(join(hit[1], spec.slice(hit[0].length))) : undefined;
};

/**
 * @typedef {{ file: string, chain: string[], inside?: boolean }} CrawlStep inside: in a pre-bundled package
 * @typedef {(name: string, found: { dir: string, linked: boolean }) => boolean} BundledTest whether a linked package is pre-bundled
 */

/**
 * @param {string} rootDir the app root
 * @param {ReturnType<import('./package-entry.mjs').createResolver>} resolver
 * @param {BundledTest} bundled
 * @returns {(from: CrawlStep, spec: string) => { include?: string, next?: CrawlStep } | null} a dep, a linked file, or both for a pre-bundled package
 */
const packageStepOf = (rootDir, resolver, bundled) => (from, spec) => {
  const { name, subpath } = splitSpecifier(spec);
  const found = resolver.findPackage(dirname(from.file), name);
  const entry = found ? resolver.entryFile(found, subpath) : null;
  if (!entry) return null;
  const chain = [...from.chain, name];
  if (found.linked && bundled(name, found)) return { include: [...from.chain, spec].join(' > '), next: { file: entry, chain, inside: true } };
  if (found.linked) return { next: { file: entry, chain, inside: from.inside } };
  const fromRoot = resolver.findPackage(rootDir, name);
  if (fromRoot && !fromRoot.linked && resolver.entryFile(fromRoot, subpath)) return { include: spec };
  return from.chain.length > 0 ? { include: [...from.chain, spec].join(' > ') } : null;
};

/**
 * @typedef {object} CrawlOptions
 * @property {Set<string>} [seen] filled with every file the crawl read
 * @property {BundledTest} [bundled] linked packages included whole, still read
 * @property {string[]} [bundledEntries] pre-bundled entry files to read too
 * @property {Set<string>} [bundledFiles] filled with every file a pre-bundled package carries
 */

/**
 * @param {string} rootDir the app root
 * @param {Record<string, string>} aliases import prefixes and their absolute folders
 * @param {ReturnType<import('./package-entry.mjs').createResolver>} resolver
 * @param {CrawlOptions} [options]
 * @returns {Promise<string[]>} the node_modules imports of the renderer
 */
const crawlRendererDeps = async (rootDir, aliases, resolver, { seen = new Set(), bundled = () => false, bundledEntries = [], bundledFiles = new Set() } = {}) => {
  const localFile = localFileOf(resolver, aliases);
  const packageStep = packageStepOf(rootDir, resolver, bundled);
  const include = new Set();
  const visited = new Set();
  const queue = [...sourceFilesUnder(join(rootDir, 'src')).map((file) => ({ file, chain: [] })), ...bundledEntries.map((file) => ({ file, chain: [], inside: true }))];
  const follow = (from, spec) => {
    const local = localFile(from.file, spec);
    if (local) queue.push({ ...from, file: local });
    if (local !== undefined || !isPackageSpecifier(spec)) return;
    const step = packageStep(from, spec);
    if (step?.next) queue.push(step.next);
    if (step?.include && !from.inside) include.add(step.include);
  };
  const isNew = (from) => {
    const key = `${from.inside ? 1 : 0}${from.file}`;
    if (visited.has(key)) return false;
    visited.add(key);
    seen.add(from.file);
    if (from.inside) bundledFiles.add(from.file);
    return true;
  };
  while (queue.length > 0) {
    const batch = queue.splice(0, READ_BATCH).filter(isNew);
    const read = await Promise.all(batch.map(async (from) => ({ from, specs: await specifiersOf(from.file) })));
    for (const { from, specs } of read) for (const spec of specs) follow(from, spec);
  }
  return [...include];
};

export { crawlRendererDeps };
