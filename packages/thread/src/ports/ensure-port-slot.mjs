/* @layer tooling-scripts @kind logic */
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { excludeLocally } from '../worktree/exclude-worktrees.mjs';
import { registeredWorktrees } from '../worktree/paths.mjs';
import { freePortSlot } from './free-port-slot.mjs';
import { PORT_BLOCK_SIZE, PORT_SLOT_FILE } from './ports.constants.mjs';
import { slotFileOf } from './slot-file-of.mjs';

const takenSlots = (worktree) => registeredWorktrees(worktree.main)
  .filter((path) => path !== resolve(worktree.path) && path !== resolve(worktree.main))
  .map(slotFileOf)
  .filter((slot) => slot !== null);

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @returns {number} the worktree's slot, written on first use
 */
const ensurePortSlot = (worktree) => {
  if (resolve(worktree.path) === resolve(worktree.main)) return 0;
  const current = slotFileOf(worktree.path);
  if (current !== null) return current;
  const slot = freePortSlot(takenSlots(worktree));
  writeFileSync(join(worktree.path, PORT_SLOT_FILE), `${slot}\n`, 'utf8');
  excludeLocally(worktree.main, `/${PORT_SLOT_FILE}`);
  worktree.log(`Port slot ${slot}: this worktree's ports are the app's base plus ${slot * PORT_BLOCK_SIZE}.`);
  return slot;
};

export { ensurePortSlot };
