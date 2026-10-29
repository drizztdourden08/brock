/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { CLONE_RECORD, INSTALLED_LOCKFILE, KEPT_DOT_ENTRIES, MODULES_STATE, WORKSPACE_STATE } from './clone.constants.mjs';
import { lockfileImporters } from './lockfile-importers.mjs';
import { mirrorTree } from './mirror-tree.mjs';
import { isInside, pathMapper, textRewriter } from './path-map.mjs';

const TEXT_FILES = new Set([MODULES_STATE, WORKSPACE_STATE]);

/**
 * @param {{ source: string, target: string, virtualStore: string, store: string }} where
 * @param {string[]} missing collects links whose new target does not exist
 * @returns {import('./mirror-tree.mjs').MirrorRules} package links go to the shared store
 */
const modulesRules = ({ source, target, virtualStore, store }, missing) => {
  const pairs = [[virtualStore, store], [source, target]];
  const moveLink = pathMapper(pairs);
  const rewrite = textRewriter(pairs);
  return {
    mapLink: (link) => {
      const moved = isInside(virtualStore, link) || isInside(source, link) ? moveLink(link) : link;
      if (!existsSync(moved)) missing.push(moved);
      return moved;
    },
    skip: (rel) => !rel.includes(sep) && rel.startsWith('.') && !KEPT_DOT_ENTRIES.has(rel),
    rewrite: (rel) => (TEXT_FILES.has(rel) || rel.split(sep)[0] === '.bin' ? rewrite : null),
  };
};

const installedImporters = (source, state) => lockfileImporters(state.lockfile.toString('utf8')).filter((rel) => {
  const dir = join(source, rel, 'node_modules');
  if (!existsSync(dir)) return false;
  if (readdirSync(dir).length === 0) throw new Error(`${dir} is empty; the install of ${source} is damaged.`);
  return true;
});

const addCounts = (total, counts) => Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, (total[key] ?? 0) + value]));

/**
 * @param {{ source: string, target: string, state: import('./modules-state.mjs').ModulesState, store: string }} input
 * @returns {Promise<{ importers: number, links: number, rewritten: number, missing: string[] }>} what it placed, and links to nothing
 */
const cloneModules = async ({ source, target, state, store }) => {
  const missing = [];
  const rules = modulesRules({ source, target, virtualStore: state.virtualStore, store }, missing);
  const importers = installedImporters(source, state);
  let total = {};
  for (const rel of importers) total = addCounts(total, await mirrorTree(join(source, rel, 'node_modules'), join(target, rel, 'node_modules'), rules));
  const pnpmDir = join(target, 'node_modules', '.pnpm');
  mkdirSync(pnpmDir, { recursive: true });
  copyFileSync(join(state.virtualStore, INSTALLED_LOCKFILE), join(pnpmDir, INSTALLED_LOCKFILE));
  const lockfileHash = createHash('sha256').update(state.lockfile).digest('hex');
  writeFileSync(join(target, 'node_modules', CLONE_RECORD), `${JSON.stringify({ source, store, lockfileHash, at: new Date().toISOString() }, null, 2)}\n`);
  return { importers: importers.length, links: total.links ?? 0, rewritten: total.rewritten ?? 0, missing };
};

export { cloneModules };
