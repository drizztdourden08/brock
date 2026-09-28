/* @layer tooling-scripts @kind logic */
import { vaultGit } from './vault-git.mjs';

const vaultHead = (vaultDir) => {
  try {
    return vaultGit(['rev-parse', '--short', 'HEAD'], vaultDir);
  } catch {
    return null;
  }
};

/**
 * @param {{ entries: object[], vaultDir: string, mode: string, limit: number }} request
 * @returns {{ blocked: boolean, outgoing: object[], head: string | null }}
 */
const guardMirroredDeletions = ({ entries, vaultDir, mode, limit }) => {
  const outgoing = entries.filter((entry) => entry.status === 'local-deleted');
  const head = vaultHead(vaultDir);
  if (outgoing.length === 0 || mode === 'force-push') return { blocked: false, outgoing, head };
  return { blocked: outgoing.length > limit, outgoing, head };
};

/**
 * @param {{ outgoing: object[], head: string | null }} guard
 * @returns {string[]}
 */
const refusalLines = ({ outgoing, head }) => [
  `REFUSING to sync: ${outgoing.length} file(s) are gone locally and would be removed from the vault.`,
  'That many at once is far more often an accident than an intent: an emptied managed root',
  'looks the same as a deliberate delete by the time it reaches here.',
  `Nothing has been changed on either side. The vault still holds every one of them${head ? ` at ${head}` : ''}.`,
  ...outgoing.slice(0, 10).map((entry) => `  would remove  ${entry.path}`),
  ...(outgoing.length > 10 ? [`  ...and ${outgoing.length - 10} more`] : []),
  'If the files should go, restore them locally first and delete them deliberately,',
  'or run force-push to declare this checkout correct.',
];

export { guardMirroredDeletions, refusalLines };
