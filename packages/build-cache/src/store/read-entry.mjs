/* @layer tooling-scripts @kind logic */
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { entryPaths } from './entry-path.mjs';
import { hashTree } from './hash-tree.mjs';
import { SCHEMA } from './store.constants.mjs';

const touched = new Set();

/**
 * @param {string} file
 * @returns {Record<string, any> | null}
 */
const readManifest = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @param {string} file
 * @param {unknown} value
 * @returns {void} writes a sibling temp file, then renames it over the file
 */
const writeJsonAtomic = (file, value) => {
  const partial = `${file}.${process.pid}.tmp`;
  writeFileSync(partial, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(partial, file);
};

const matches = (manifest, { kind, name, version, buildKey }, inputHash) => Boolean(manifest)
  && manifest.schema === SCHEMA
  && manifest.kind === kind
  && manifest.name === name
  && manifest.version === version
  && manifest.buildKey === buildKey
  && (inputHash === undefined || manifest.inputHash === inputHash);

/**
 * @param {import('./entry-path.mjs').EntryId} id
 * @param {{ inputHash?: string, verify?: boolean }} [options] verify rehashes the files against the manifest
 * @returns {{ dir: string, filesDir: string, manifestFile: string, manifest: Record<string, any> } | null} the entry, null on any doubt
 */
const readEntry = (id, { inputHash, verify = true } = {}) => {
  const paths = entryPaths(id);
  const manifest = readManifest(paths.manifestFile);
  if (!matches(manifest, id, inputHash)) return null;
  if (verify) {
    try {
      if (hashTree(paths.filesDir).contentHash !== manifest.contentHash) return null;
    } catch {
      return null;
    }
  }
  return { ...paths, manifest };
};

/**
 * @param {{ manifestFile: string, manifest: Record<string, any> }} entry what readEntry gave
 * @param {() => Date} [now]
 * @returns {void} records lastUsedAt, at most once per process for each entry
 */
const touchEntry = (entry, now = () => new Date()) => {
  if (touched.has(entry.manifestFile)) return;
  touched.add(entry.manifestFile);
  try {
    writeJsonAtomic(entry.manifestFile, { ...entry.manifest, lastUsedAt: now().toISOString() });
  } catch {
    touched.add(`${entry.manifestFile}:unwritable`);
  }
};

export { readEntry, readManifest, touchEntry };
