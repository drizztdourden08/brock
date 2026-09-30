/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { OWN_MIGRATIONS_DIR, OWN_SOURCE, VERSION_FOLDER } from './upgrade.constants.mjs';

const ownMigrations = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((version) => VERSION_FOLDER.test(version))
    .flatMap((version) =>
      readdirSync(join(dir, version))
        .filter((name) => name.endsWith('.mjs'))
        .map((name) => ({ version, file: join(dir, version, name), source: OWN_SOURCE, summary: null })));
};

const moduleMigrations = (modules) =>
  modules.flatMap((module) =>
    (module.manifest.migrations ?? []).map((entry) => ({
      version: entry.version,
      file: join(module.dir, entry.entry),
      source: module.packageName,
      summary: entry.summary ?? null,
    })));

/**
 * @param {{ packageName: string, dir: string, manifest: { migrations?: { version: string, entry: string, summary: string }[] } }[]} modules
 * @param {string} [ownDir] brock-build's migrations folder
 * @returns {{ version: string, file: string, source: string, summary: string | null }[]}
 */
const collectMigrations = (modules, ownDir = OWN_MIGRATIONS_DIR) => [...ownMigrations(ownDir), ...moduleMigrations(modules)];

export { collectMigrations };
