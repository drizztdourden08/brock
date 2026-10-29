/* @layer tooling-scripts @kind logic */
import { writeFileSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { cacheRoot, commitEntry, readEntry, touchEntry } from '@drizztdourden08/build-cache/store';
import { identityOf } from './env-key.mjs';
import { portableOutputs } from './portable-outputs.mjs';
import { RECORD_FILE, SHARED_VERSION } from './shared-build.constants.mjs';
import { entryIdFor } from './shared-entries.mjs';

const outDirOf = (rootDir, outDir) => {
  const rel = relative(rootDir, outDir);
  return rel === '' || rel.startsWith('..') || isAbsolute(rel) ? null : rel.split(String.fromCharCode(92)).join('/');
};

const sourcesOf = ({ repo, repoDirs, placed, files, dirs }) => ({ repo, repoDirs, placed, files, dirs });

/**
 * @typedef {object} SharedStoreInput
 * @property {string} rootDir the app root
 * @property {string} target main or preload
 * @property {Record<string, any>} record the reuse record just written, with its preflight key
 * @property {string} outDir the folder the bundle was written to
 * @property {import('../repo-snapshot.mjs').RepoSnapshot | null} snapshot the checkout the build started from
 * @property {string} [root] the cache root
 */

/**
 * @param {SharedStoreInput} input
 * @returns {Promise<'stored' | 'present' | 'skipped'>} skipped: it cannot be moved
 */
const storeSharedBuild = async ({ rootDir, target, record, outDir, snapshot, root = cacheRoot() }) => {
  const rel = outDirOf(rootDir, outDir);
  if (!snapshot || !rel || !record.preflight) return 'skipped';
  const scope = { root, identity: identityOf(rootDir, snapshot), target, envKey: record.preflight };
  const id = entryIdFor(scope, record);
  const present = readEntry(id, { verify: false });
  if (present) {
    touchEntry(present);
    return 'present';
  }
  const portable = portableOutputs(record.outputs, rootDir);
  if (!portable.clean) return 'skipped';
  await commitEntry({
    ...id,
    buildSettings: { shared: SHARED_VERSION, target },
    fill: async (filesDir) => {
      writeFileSync(join(filesDir, RECORD_FILE), JSON.stringify({ ...record, outputs: portable.outputs }));
      return { target, preflight: record.preflight, outDir: rel, ...sourcesOf(record) };
    },
  });
  return 'stored';
};

/**
 * @param {SharedStoreInput} input
 * @returns {Promise<'stored' | 'present' | 'skipped'>} never throws: a build never fails over the cache
 */
const publishBuild = (input) => storeSharedBuild(input).catch(() => 'skipped');

export { publishBuild };
