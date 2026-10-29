/* @layer tooling-scripts @kind logic */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { deleteTree } from '../delete-tree.mjs';
import { cloneModules } from './clone-modules.mjs';
import { lockfileImporters } from './lockfile-importers.mjs';
import { pickSource } from './pick-source.mjs';
import { entryOf } from './store-entry.mjs';
import { strayLinks } from './verify-links.mjs';
import { ensureVirtualStore } from './virtual-store.mjs';

const seconds = (since) => `${((Date.now() - since) / 1000).toFixed(1)} s`;

/**
 * @param {{ target: string, state: import('./modules-state.mjs').ModulesState, mains: string[] }} input
 * @returns {Promise<void>} the copy is gone, links removed as links
 */
const undo = async ({ target, state, mains }) => {
  for (const rel of lockfileImporters(state.lockfile.toString('utf8'))) {
    const failure = await deleteTree({ owner: target, target: join(target, rel, 'node_modules'), mains });
    if (failure) throw new Error(`Could not undo the copy: ${failure.path} stayed (${failure.code}).`);
  }
};

const strayOf = ({ target, state, store }) => {
  const roots = lockfileImporters(state.lockfile.toString('utf8')).map((rel) => join(target, rel, 'node_modules')).filter((dir) => existsSync(dir));
  return strayLinks({ roots, homes: [entryOf(store), target] });
};

const problemWith = ({ target, state, store, placed }) => {
  if (placed.missing.length > 0) return `${placed.missing.length} link(s) of the copy lead nowhere (first: ${placed.missing[0]})`;
  const stray = strayOf({ target, state, store });
  return stray.length > 0 ? `${stray.length} link(s) of the copy lead into another checkout (first: ${stray[0].path} -> ${stray[0].real})` : null;
};

const copyLocalInputs = (source, target, log) => {
  for (const name of source.local ?? []) copyFileSync(join(source.dir, name), join(target, name));
  if (source.local?.length) log(`node_modules: copied ${source.local.join(', ')}, which ${source.dir} keeps out of git, so a later install resolves the same way.`);
};

/**
 * @param {{ target: string, main: string, log: (message: string) => void, worktrees?: string[] }} input
 * @returns {Promise<{ source: string, store: string } | null>} where it came from
 */
const cloneInstall = async ({ target, main, log, worktrees }) => {
  const started = Date.now();
  const { source, reason } = pickSource({ target, main, worktrees });
  if (!source) {
    log(`node_modules: ${reason}; running a real install.`);
    return null;
  }
  const mains = [main, source.dir];
  const { state } = source;
  try {
    const store = await ensureVirtualStore({ source: source.dir, state, log, mains });
    const placed = await cloneModules({ source: source.dir, target, state, store });
    const problem = problemWith({ target, state, store, placed });
    if (problem) {
      await undo({ target, state, mains });
      log(`node_modules: ${problem}; running a real install.`);
      return null;
    }
    copyLocalInputs(source, target, log);
    log(`node_modules: linked from ${source.dir} in ${seconds(started)} (${placed.importers} project(s), ${placed.links} links, packages in ${store}).`);
    return { source: source.dir, store };
  } catch (error) {
    await undo({ target, state, mains });
    log(`node_modules: the copy failed (${error?.message ?? error}); running a real install.`);
    return null;
  }
};

export { cloneInstall };
