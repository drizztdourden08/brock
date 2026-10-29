/* @layer tooling-scripts @kind logic */
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { entryPaths } from './entry-path.mjs';
import { hashTree } from './hash-tree.mjs';
import { readEntry } from './read-entry.mjs';
import { FILES_DIR, MANIFEST_FILE, SCHEMA, TEMP_DIR } from './store.constants.mjs';

const OWN_VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const BUILT_BY = `@drizztdourden08/build-cache@${OWN_VERSION}`;

const discardEntry = (dir, root) => {
  if (!existsSync(dir)) return;
  const stale = join(root, TEMP_DIR, `stale-${randomUUID()}`);
  renameSync(dir, stale);
  rmSync(stale, { recursive: true, force: true });
};

/**
 * @param {import('./entry-path.mjs').EntryId & { inputHash?: string, buildSettings?: unknown, fill: (filesDir: string) => Promise<Record<string, unknown> | void> }} input fill returns extra manifest fields
 * @param {() => Date} [now]
 * @returns {Promise<NonNullable<ReturnType<typeof readEntry>>>} built in .tmp, renamed in
 */
const commitEntry = async ({ fill, inputHash, buildSettings, ...id }, now = () => new Date()) => {
  const { dir } = entryPaths(id);
  const building = join(id.root, TEMP_DIR, randomUUID());
  const buildingFiles = join(building, FILES_DIR);
  mkdirSync(buildingFiles, { recursive: true });
  try {
    const extra = (await fill(buildingFiles)) ?? {};
    const { contentHash, sizeBytes } = hashTree(buildingFiles);
    const at = now().toISOString();
    const manifest = { schema: SCHEMA, kind: id.kind, name: id.name, version: id.version, buildKey: id.buildKey, contentHash, sizeBytes, builtAt: at, lastUsedAt: at, builtBy: BUILT_BY, inputHash, buildSettings, ...extra };
    writeFileSync(join(building, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`);
    mkdirSync(dirname(dir), { recursive: true });
    if (!readEntry(id, { inputHash })) discardEntry(dir, id.root);
    try {
      renameSync(building, dir);
    } catch (error) {
      const raced = readEntry(id, { inputHash });
      if (raced) return raced;
      throw error;
    }
    const committed = readEntry(id, { inputHash, verify: false });
    if (!committed) throw new Error(`build-cache: ${dir} did not read back after the commit`);
    return committed;
  } finally {
    rmSync(building, { recursive: true, force: true });
  }
};

export { commitEntry, discardEntry };
