/* @layer electron-main @kind logic */
import type { Stats } from 'fs';
import { rm } from 'fs/promises';
import { commitCopy } from './commit-copy';
import { SHOWN } from './move-by-copy.constants';
import { removeCopied } from './remove-copied';
import { sameTree } from './same-tree';
import { stageCopy } from './stage-copy';

const reasonOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const moveByCopy = async (source: string, info: Stats, target: string, overwrite: boolean): Promise<void> => {
  if (info.isSymbolicLink()) throw new Error(`"${source}" is a link and cannot be moved to another drive`);
  const staged = await stageCopy(source, info, target);
  if (info.isDirectory() && !(await sameTree(source, staged.entries).catch(() => false))) {
    await rm(staged.staging, { recursive: true, force: true });
    throw new Error(`"${source}" changed while it was being copied, so nothing was moved`);
  }
  await commitCopy(staged, info, target, overwrite);
  let kept: string[];
  try {
    kept = await removeCopied(source, info, staged);
  } catch (error) {
    throw new Error(`"${source}" was copied to "${target}" and checked, but it could not be fully removed (${reasonOf(error)}). The copy is complete; nothing was lost.`, { cause: error });
  }
  if (kept.length > 0) {
    throw new Error(`"${source}" was copied to "${target}" and checked, but ${kept.length} item(s) changed after the copy or could not be removed and were left in place: ${kept.slice(0, SHOWN).join(', ')}`);
  }
};

export { moveByCopy };
