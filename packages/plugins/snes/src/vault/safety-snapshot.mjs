/* @layer tooling-scripts @kind logic */
import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { vaultGit } from './vault-git.mjs';

const stamp = (now = new Date()) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

const buildTree = (root, roots) => {
  const indexFile = join(tmpdir(), `vault-safety-${process.pid}-${Date.now()}.index`);
  const env = { GIT_INDEX_FILE: indexFile };
  try {
    vaultGit(['read-tree', 'HEAD'], root, env);
    for (const path of roots) {
      if (existsSync(join(root, path))) vaultGit(['add', '-f', '--', path], root, env);
    }
    return vaultGit(['write-tree'], root, env);
  } finally {
    rmSync(indexFile, { force: true });
  }
};

const freeRef = (root, base) => {
  const taken = (ref) => {
    try {
      vaultGit(['rev-parse', '--verify', '--quiet', ref], root);
      return true;
    } catch {
      return false;
    }
  };
  let ref = base;
  for (let n = 2; taken(ref); n += 1) ref = `${base}-${n}`;
  return ref;
};

/**
 * @param {{ root: string, roots: string[], namespace: string }} request
 * @returns {string} the ref that holds the snapshot
 */
const createSnapshot = ({ root, roots, namespace }) => {
  const ref = freeRef(root, `${namespace}/vault-sync-${stamp()}`);
  const tree = buildTree(root, roots);
  const message = 'safety: vault-sync snapshot\n\nManaged roots captured before mirrored deletions. Kept outside refs/heads so no push carries it.\n';
  const commit = vaultGit(['commit-tree', tree, '-p', 'HEAD', '-m', message], root);
  vaultGit(['update-ref', ref, commit], root);
  return ref;
};

export { createSnapshot };
