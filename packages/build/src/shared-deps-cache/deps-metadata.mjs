/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { METADATA_FILE } from './shared-deps-cache.constants.mjs';

/**
 * @param {string} depsDir the dependency cache folder
 * @returns {Record<string, any> | null} the parsed metadata, null when unreadable
 */
const readMetadata = (depsDir) => {
  try {
    const metadata = JSON.parse(readFileSync(join(depsDir, METADATA_FILE), 'utf8'));
    return metadata && typeof metadata.hash === 'string' && metadata.optimized && typeof metadata.optimized === 'object' ? metadata : null;
  } catch {
    return null;
  }
};

const readManifest = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
};

const packageVersionOf = (file) => {
  for (let dir = dirname(file); ; dir = dirname(dir)) {
    const manifest = readManifest(dir);
    if (typeof manifest?.version === 'string') return `${manifest.name ?? ''}@${manifest.version}`;
    if (dirname(dir) === dir) return null;
  }
};

const insideStore = (store, file) => {
  const path = relative(store, file);
  return path !== '' && !path.startsWith('..') && !isAbsolute(path);
};

/**
 * @param {Record<string, any>} metadata
 * @param {string} depsDir the folder the `src` paths are relative to
 * @param {string} store the pnpm store folder of the lockfile
 * @returns {Record<string, string> | null} versions by dependency, null when one is outside
 */
const dependencyVersions = (metadata, depsDir, store) => {
  const versions = {};
  for (const [id, info] of Object.entries(metadata.optimized)) {
    const file = typeof info?.src === 'string' ? resolve(depsDir, info.src) : null;
    if (!file || !insideStore(store, file) || !existsSync(file)) return null;
    const version = packageVersionOf(file);
    if (!version) return null;
    versions[id] = version;
  }
  return versions;
};

export { dependencyVersions, readMetadata };
