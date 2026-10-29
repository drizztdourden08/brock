/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { METADATA_FILE, PACKAGES_MARK, ROOT_MARK } from './vite-deps.constants.mjs';
import { virtualStoreOf } from './virtual-store-of.mjs';

/**
 * @typedef {{ lockfileHash: string, configHash: string, hash: string }} DepsHashes what Vite writes into _metadata.json and compares on start
 */

/**
 * @param {string} dir a folder holding _metadata.json
 * @returns {Record<string, any> | null} the parsed metadata, null when unusable
 */
const readMetadata = (dir) => {
  try {
    const metadata = JSON.parse(readFileSync(join(dir, METADATA_FILE), 'utf8'));
    const shaped = metadata && typeof metadata.hash === 'string' && metadata.optimized && typeof metadata.optimized === 'object' && metadata.chunks && typeof metadata.chunks === 'object';
    return shaped ? metadata : null;
  } catch {
    return null;
  }
};

/**
 * @param {Record<string, any>} metadata
 * @param {DepsHashes} hashes
 * @returns {boolean} the three hashes are the ones Vite compares
 */
const matchesHashes = (metadata, hashes) => metadata.lockfileHash === hashes.lockfileHash && metadata.configHash === hashes.configHash && metadata.hash === hashes.hash;

/**
 * @param {Record<string, any>} metadata
 * @param {string} dir the folder the `file` paths are relative to
 * @returns {boolean} every pre-bundled file and chunk is there
 */
const filesPresent = (metadata, dir) => [...Object.values(metadata.optimized), ...Object.values(metadata.chunks)]
  .every((info) => typeof info?.file === 'string' && existsSync(resolve(dir, info.file)));

const mapSources = (metadata, map) => ({
  ...metadata,
  optimized: Object.fromEntries(Object.entries(metadata.optimized).map(([id, info]) => [id, typeof info?.src === 'string' ? { ...info, src: map(info.src) } : info])),
});

const inside = (root, path) => {
  const rel = relative(root, path);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
};

/**
 * @param {Record<string, any>} metadata as Vite wrote it
 * @param {{ depsDir: string, installRoot: string }} where the folder it was written in and the install folder
 * @returns {Record<string, any>} src paths in the store or install folder as @root paths
 */
const portableMetadata = (metadata, { depsDir, installRoot }) => {
  const packages = virtualStoreOf(installRoot);
  const posix = (path) => path.split(String.fromCharCode(92)).join('/');
  return mapSources(metadata, (src) => {
    const path = resolve(depsDir, src);
    if (inside(packages, path)) return `${ROOT_MARK}${PACKAGES_MARK}${posix(relative(packages, path))}`;
    return inside(installRoot, path) ? `${ROOT_MARK}${posix(relative(installRoot, path))}` : path;
  });
};

const localSource = (src, installRoot) => {
  const rest = src.slice(ROOT_MARK.length);
  return rest.startsWith(PACKAGES_MARK) ? join(virtualStoreOf(installRoot), rest.slice(PACKAGES_MARK.length)) : join(installRoot, rest);
};

/**
 * @param {Record<string, any>} metadata a portable one
 * @param {{ installRoot: string, hashes: DepsHashes }} this worktree install folder and Vite hashes
 * @returns {Record<string, any>} absolute `src` paths and this worktree's hashes
 */
const localMetadata = (metadata, { installRoot, hashes }) => ({
  ...mapSources(metadata, (src) => (src.startsWith(ROOT_MARK) ? localSource(src, installRoot) : src)),
  ...hashes,
});

/**
 * @param {Record<string, any>} metadata one with absolute `src` paths
 * @returns {boolean} every source file a pre-bundle came from exists here
 */
const sourcesPresent = (metadata) => Object.values(metadata.optimized).every((info) => typeof info?.src === 'string' && isAbsolute(info.src) && existsSync(info.src));

export { filesPresent, localMetadata, matchesHashes, portableMetadata, readMetadata, sourcesPresent };
