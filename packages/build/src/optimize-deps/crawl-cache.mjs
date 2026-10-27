/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { CRAWL_CACHE_FILE, CRAWL_CACHE_VERSION, INSTALL_STAMPS } from './optimize-deps.constants.mjs';
import { sourceFilesUnder } from './source-files.mjs';

const stampOf = (file) => {
  const stat = statSync(file, { throwIfNoEntry: false });
  return stat ? `${stat.mtimeMs}:${stat.size}` : null;
};

const installFiles = (rootDir) => {
  const dirs = [...new Set([rootDir, findWorkspaceRoot(rootDir) ?? rootDir])];
  return dirs.flatMap((dir) => INSTALL_STAMPS.map((name) => join(dir, name)));
};

const readCache = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const sameList = (a, b) => Array.isArray(a) && a.length === b.length && a.every((item, index) => item === b[index]);

const isCurrent = (cache, key) => cache?.version === CRAWL_CACHE_VERSION
  && cache.inputs === key.inputs
  && sameList(cache.sources, key.sources)
  && cache.result !== undefined
  && Object.entries(cache.stamps ?? {}).every(([file, stamp]) => stampOf(file) === stamp);

const writeCache = (file, content) => {
  try {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(content));
    return true;
  } catch {
    return false;
  }
};

/**
 * @template T
 * @param {string} rootDir the app root
 * @param {unknown} inputs what the crawl depends on beside the files it reads, as JSON
 * @param {() => Promise<{ result: T, files: string[] }>} crawl the full crawl, with every file it read
 * @returns {Promise<T>} the last result while nothing it read changed
 */
const cachedCrawl = async (rootDir, inputs, crawl) => {
  const file = join(rootDir, CRAWL_CACHE_FILE);
  const key = { inputs: JSON.stringify(inputs), sources: sourceFilesUnder(join(rootDir, 'src')).sort() };
  const cache = readCache(file);
  if (isCurrent(cache, key)) return cache.result;
  const { result, files } = await crawl();
  const stamps = Object.fromEntries([...files, ...installFiles(rootDir)].map((path) => [path, stampOf(path)]));
  writeCache(file, { version: CRAWL_CACHE_VERSION, ...key, result, stamps });
  return result;
};

export { cachedCrawl };
