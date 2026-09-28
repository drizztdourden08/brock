/* @layer tooling-scripts @kind logic */
import { dirname, join } from 'node:path';
import { applyEntries, commitVault } from './apply-entries.mjs';
import { agreedIndex, compareTrees } from './compare-trees.mjs';
import { expectedVaultHint, locateVault } from './locate-vault.mjs';
import { guardMirroredDeletions, refusalLines } from './removal-guard.mjs';
import { createSnapshot } from './safety-snapshot.mjs';
import { reportEntries } from './vault-report.mjs';
import { readVaultState, writeVaultState } from './vault-state.mjs';
import { indexPaths, indexTree } from './tree-index.mjs';

const managedRoots = (declared, remoteIndex) => {
  const fromVault = Object.keys(remoteIndex).map((path) => dirname(path));
  const dirs = [...new Set([...declared, ...fromVault])].sort();
  return dirs.filter((dir) => !dirs.some((other) => other !== dir && dir.startsWith(`${other}/`)));
};

const forcedPush = (entries) => entries.map((entry) => ({
  ...entry,
  status: entry.local ? 'local-newer' : 'local-deleted',
  direction: 'push',
}));

const planEntries = ({ root, treeDir, vault, mode, log }) => {
  const remote = indexTree(treeDir);
  const local = indexPaths(root, managedRoots(vault.managedRoots, remote));
  const base = readVaultState(join(root, vault.stateFile), log);
  const compared = compareTrees({ local, remote, base });
  return { remote, entries: mode === 'force-push' ? forcedPush(compared) : compared };
};

const applyPlan = ({ entries, root, located, vault, mode, message, log }) => {
  const guard = guardMirroredDeletions({ entries, vaultDir: located.vaultDir, mode, limit: vault.maxMirroredDeletions });
  if (guard.blocked) {
    for (const line of refusalLines(guard)) log(`vault: ${line}`);
    return;
  }
  const incoming = entries.filter((entry) => entry.status === 'remote-deleted').length;
  if (incoming > 0) {
    const ref = createSnapshot({ root, roots: vault.managedRoots, namespace: vault.safetyNamespace });
    log(`vault: safety snapshot ${ref} holds the ${incoming} file(s) about to be removed here`);
  }
  if (guard.outgoing.length > 0) {
    log(`vault: ${guard.outgoing.length} file(s) gone locally will be removed from the vault${guard.head ? `; ${guard.head} still holds them` : ''}`);
  }
  const applied = applyEntries({ entries, root, treeDir: located.treeDir });
  if (applied.pulled + applied.pushed + applied.removed === 0) return;
  log(`vault: pulled ${applied.pulled}, pushed ${applied.pushed}, removed ${applied.removed}`);
  const committed = commitVault(located.vaultDir, message ?? `chore(tree): sync from the main repository (${mode})`);
  if (committed) log(`vault: committed ${committed} (not pushed, that is yours to send)`);
};

/**
 * @param {{ mode: 'sync' | 'status' | 'force-push', root: string, main: string, name: string, vault: object, message?: string, log: (message: string) => void }} request
 * @returns {number} the exit code
 */
const runVaultSync = ({ mode, root, main, name, vault, message, log }) => {
  const located = locateVault({ main, name, vault });
  if (!located) {
    log('vault: not available, so it is skipped. The build, lint and unit tests do not need it.');
    log(`vault:   ${expectedVaultHint({ main, name, vault })}`);
    return 0;
  }
  const { remote, entries } = planEntries({ root, treeDir: located.treeDir, vault, mode, log });
  log(`vault: ${located.vaultDir}, ${Object.keys(remote).length} file(s) in ${vault.treeDir}/`);
  reportEntries(entries, log);
  if (mode === 'status') return 0;
  applyPlan({ entries, root, located, vault, mode, message, log });
  const settledRemote = indexTree(located.treeDir);
  const settledLocal = indexPaths(root, managedRoots(vault.managedRoots, settledRemote));
  writeVaultState(join(root, vault.stateFile), agreedIndex({ local: settledLocal, remote: settledRemote }), located.vaultDir);
  return 0;
};

export { runVaultSync };
