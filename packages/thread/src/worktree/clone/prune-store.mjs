/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { cacheRoot } from '@drizztdourden08/build-cache';
import { deleteTree } from '../delete-tree.mjs';
import { mainCheckout, registeredWorktrees } from '../paths.mjs';
import { samePath } from '../same-path.mjs';
import { CLONE_RECORD, STORE_RECORD } from './clone.constants.mjs';
import { isInside } from './path-map.mjs';
import { modulesStoreRoot } from './store-dir.mjs';
import { entryOf } from './store-entry.mjs';

const TEMP_FOLDER = '.tmp';

const entriesOf = (root) => readdirSync(root, { withFileTypes: true }).filter((entry) => entry.name !== TEMP_FOLDER);

const refusalFor = (root, worktrees) => {
  if (dirname(root) === root || samePath(root, homedir())) return `${root} is a drive root or the home folder`;
  const build = cacheRoot();
  if (isInside(root, build) || isInside(build, root)) return `${root} overlaps the build cache ${build}`;
  const checkout = worktrees.find((path) => isInside(root, path) || isInside(path, root));
  if (checkout) return `${root} overlaps the checkout ${checkout}`;
  const stranger = entriesOf(root).find((entry) => !entry.isDirectory() || !existsSync(join(root, entry.name, STORE_RECORD)));
  return stranger ? `${join(root, stranger.name)} is not a store entry, so ${root} is not a store root` : null;
};

const liveEntry = (worktree, root) => {
  try {
    const { store } = JSON.parse(readFileSync(join(worktree, 'node_modules', CLONE_RECORD), 'utf8'));
    const entry = entryOf(store);
    return samePath(dirname(entry), root) ? basename(entry) : null;
  } catch {
    return null;
  }
};

/**
 * @param {{ cwd: string, log: (message: string) => void, dryRun?: boolean }} input
 * @returns {Promise<{ kept: string[], pruned: string[] }>} entries kept for a live worktree, and entries removed
 */
const pruneStore = async ({ cwd, log, dryRun = false }) => {
  const main = mainCheckout(cwd);
  const root = resolve(modulesStoreRoot(main));
  const worktrees = registeredWorktrees(main);
  if (!existsSync(root)) return { kept: [], pruned: [] };
  const refusal = refusalFor(root, worktrees);
  if (refusal) throw new Error(`Refusing to prune: ${refusal}.`);
  const live = new Set(worktrees.map((path) => liveEntry(path, root)).filter(Boolean));
  const result = { kept: [], pruned: [] };
  for (const { name } of entriesOf(root)) {
    if (live.has(name)) result.kept.push(name);
    else if (dryRun) result.pruned.push(name);
    else {
      const failure = await deleteTree({ owner: root, target: join(root, name), mains: worktrees });
      if (failure) log(`${failure.path} stayed (${failure.code}).`);
      else result.pruned.push(name);
    }
  }
  log(`${dryRun ? 'Would prune' : 'Pruned'} ${result.pruned.length} store entr${result.pruned.length === 1 ? 'y' : 'ies'} in ${root}; kept ${result.kept.length} used by a worktree.`);
  return result;
};

export { pruneStore };
