/* @layer tooling-scripts @kind logic */
import { join, relative, resolve } from 'node:path';

const posix = (path) => path.split('\\').join('/');

const mapSources = (metadata, move) => ({
  ...metadata,
  optimized: Object.fromEntries(Object.entries(metadata.optimized ?? {}).map(([id, info]) => [id, typeof info?.src === 'string' ? { ...info, src: posix(move(info.src)) } : info])),
});

/**
 * A shared entry names each source inside the package store, so a checkout whose store is elsewhere can read it.
 * @param {Record<string, any>} metadata Vite's metadata, sources relative to the cache folder
 * @param {string} depsDir the cache folder
 * @param {string} store the package store of that checkout
 * @returns {Record<string, any>} the same metadata, sources relative to the store
 */
const toStoreRelative = (metadata, depsDir, store) => mapSources(metadata, (src) => relative(store, resolve(depsDir, src)));

/**
 * @param {Record<string, any>} metadata a shared entry's metadata, sources relative to the store
 * @param {string} depsDir the cache folder it is seeded into
 * @param {string} store the package store of that checkout
 * @returns {Record<string, any>} Vite's metadata for that checkout, sources relative to its cache folder
 */
const fromStoreRelative = (metadata, depsDir, store) => mapSources(metadata, (src) => relative(depsDir, join(store, src)));

export { fromStoreRelative, toStoreRelative };
