/* @layer tooling-scripts @kind logic */
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { vaultGit } from './vault-git.mjs';

const copy = (from, to) => {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
};

const remove = (path) => {
  if (existsSync(path)) rmSync(path, { force: true });
};

const applyOne = ({ entry, root, treeDir, applied }) => {
  const localPath = join(root, entry.path);
  const vaultPath = join(treeDir, entry.path);
  if (entry.status === 'remote-deleted' || entry.status === 'local-deleted') {
    remove(entry.direction === 'pull' ? localPath : vaultPath);
    applied.removed += 1;
    return;
  }
  if (entry.direction === 'pull') {
    copy(vaultPath, localPath);
    applied.pulled += 1;
    return;
  }
  copy(localPath, vaultPath);
  applied.pushed += 1;
};

/**
 * @param {{ entries: object[], root: string, treeDir: string }} request
 * @returns {{ pulled: number, pushed: number, removed: number }}
 */
const applyEntries = ({ entries, root, treeDir }) => {
  const applied = { pulled: 0, pushed: 0, removed: 0 };
  for (const entry of entries) {
    if (entry.direction) applyOne({ entry, root, treeDir, applied });
  }
  return applied;
};

/**
 * @param {string} vaultDir
 * @param {string} subject the commit subject
 * @returns {string | null} the short hash, or null when nothing changed
 */
const commitVault = (vaultDir, subject) => {
  if (vaultGit(['status', '--porcelain'], vaultDir) === '') return null;
  vaultGit(['add', '-A'], vaultDir);
  vaultGit(['commit', '-q', '-m', subject], vaultDir);
  return vaultGit(['rev-parse', '--short', 'HEAD'], vaultDir);
};

export { applyEntries, commitVault };
