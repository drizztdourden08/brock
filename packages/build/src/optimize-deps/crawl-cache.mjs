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
  && cache.aliases === key.aliases
  && sameList(cache.sources, key.sources)
  && Array.isArray(cache.specs)
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
 * @param {string} rootDir the app root
 * @param {Record<string, string>} aliases import prefixes and their absolute folders
 * @param {() => Promise<{ specs: string[], files: string[] }>} crawl the full crawl, with every file it read
 * @returns {Promise<string[]>} the last specs, or a new crawl's once a read file changed
 */
const cachedCrawl = async (rootDir, aliases, crawl) => {
  const file = join(rootDir, CRAWL_CACHE_FILE);
  const key = { aliases: JSON.stringify(aliases), sources: sourceFilesUnder(join(rootDir, 'src')).sort() };
  const cache = readCache(file);
  if (isCurrent(cache, key)) return cache.specs;
  const { specs, files } = await crawl();
  const stamps = Object.fromEntries([...files, ...installFiles(rootDir)].map((path) => [path, stampOf(path)]));
  writeCache(file, { version: CRAWL_CACHE_VERSION, ...key, specs, stamps });
  return specs;
};

export { cachedCrawl };
