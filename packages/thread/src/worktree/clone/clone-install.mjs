/* @layer tooling-scripts @kind logic */
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { cloneModules } from './clone-modules.mjs';
import { lockfileImporters } from './lockfile-importers.mjs';
import { pickSource } from './pick-source.mjs';
import { ensureVirtualStore } from './virtual-store.mjs';

const seconds = (since) => `${((Date.now() - since) / 1000).toFixed(1)} s`;

const undo = (target, state) => {
  for (const rel of lockfileImporters(state.lockfile.toString('utf8'))) rmSync(join(target, rel, 'node_modules'), { recursive: true, force: true });
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
  try {
    const store = await ensureVirtualStore({ source: source.dir, state: source.state, log });
    const placed = await cloneModules({ source: source.dir, target, state: source.state, store });
    if (placed.missing.length > 0) {
      undo(target, source.state);
      log(`node_modules: ${placed.missing.length} link(s) of the copy lead nowhere (first: ${placed.missing[0]}); running a real install.`);
      return null;
    }
    log(`node_modules: linked from ${source.dir} in ${seconds(started)} (${placed.importers} project(s), ${placed.links} links, packages in ${store}).`);
    return { source: source.dir, store };
  } catch (error) {
    undo(target, source.state);
    log(`node_modules: the copy failed (${error?.message ?? error}); running a real install.`);
    return null;
  }
};

export { cloneInstall };
