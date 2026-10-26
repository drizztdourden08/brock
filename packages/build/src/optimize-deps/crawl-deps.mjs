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
 * @param {string} rootDir the app root
 * @param {ReturnType<import('./package-entry.mjs').createResolver>} resolver
 * @returns {(from: { file: string, chain: string[] }, spec: string) => { include?: string, next?: { file: string, chain: string[] } } | null} a dep or a linked file
 */
const packageStepOf = (rootDir, resolver) => (from, spec) => {
  const { name, subpath } = splitSpecifier(spec);
  const found = resolver.findPackage(dirname(from.file), name);
  const entry = found ? resolver.entryFile(found, subpath) : null;
  if (!entry) return null;
  if (found.linked) return { next: { file: entry, chain: [...from.chain, name] } };
  const fromRoot = resolver.findPackage(rootDir, name);
  if (fromRoot && !fromRoot.linked && resolver.entryFile(fromRoot, subpath)) return { include: spec };
  return from.chain.length > 0 ? { include: [...from.chain, spec].join(' > ') } : null;
};

/**
 * @param {string} rootDir the app root
 * @param {Record<string, string>} aliases import prefixes and their absolute folders
 * @param {ReturnType<import('./package-entry.mjs').createResolver>} resolver
 * @param {Set<string>} [seen] filled with every file the crawl read
 * @returns {Promise<string[]>} the node_modules imports of the renderer
 */
const crawlRendererDeps = async (rootDir, aliases, resolver, seen = new Set()) => {
  const localFile = localFileOf(resolver, aliases);
  const packageStep = packageStepOf(rootDir, resolver);
  const include = new Set();
  const queue = sourceFilesUnder(join(rootDir, 'src')).map((file) => ({ file, chain: [] }));
  const follow = (from, spec) => {
    const local = localFile(from.file, spec);
    if (local) queue.push({ file: local, chain: from.chain });
    if (local !== undefined || !isPackageSpecifier(spec)) return;
    const step = packageStep(from, spec);
    if (step?.next) queue.push(step.next);
    if (step?.include) include.add(step.include);
  };
  while (queue.length > 0) {
    const batch = queue.splice(0, READ_BATCH).filter((from) => !seen.has(from.file) && seen.add(from.file));
    const read = await Promise.all(batch.map(async (from) => ({ from, specs: await specifiersOf(from.file) })));
    for (const { from, specs } of read) for (const spec of specs) follow(from, spec);
  }
  return [...include];
};

export { crawlRendererDeps };
