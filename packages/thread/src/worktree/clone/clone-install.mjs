/* @layer tooling-scripts @kind logic */
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { deleteTree } from '../delete-tree.mjs';
import { cloneModules } from './clone-modules.mjs';
import { lockfileImporters } from './lockfile-importers.mjs';
import { pickSource } from './pick-source.mjs';
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
  try {
    const store = await ensureVirtualStore({ source: source.dir, state: source.state, log, mains });
    const placed = await cloneModules({ source: source.dir, target, state: source.state, store });
    if (placed.missing.length > 0) {
      await undo({ target, state: source.state, mains });
      log(`node_modules: ${placed.missing.length} link(s) of the copy lead nowhere (first: ${placed.missing[0]}); running a real install.`);
      return null;
    }
    for (const name of source.local ?? []) copyFileSync(join(source.dir, name), join(target, name));
    if (source.local?.length) log(`node_modules: copied ${source.local.join(', ')}, which ${source.dir} keeps out of git, so a later install resolves the same way.`);
    log(`node_modules: linked from ${source.dir} in ${seconds(started)} (${placed.importers} project(s), ${placed.links} links, packages in ${store}).`);
    return { source: source.dir, store };
  } catch (error) {
    await undo({ target, state: source.state, mains });
    log(`node_modules: the copy failed (${error?.message ?? error}); running a real install.`);
    return null;
  }
};

export { cloneInstall };
