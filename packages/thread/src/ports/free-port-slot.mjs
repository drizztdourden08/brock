/* @layer tooling-scripts @kind logic */
import { MAX_PORT_SLOT } from './ports.constants.mjs';

/**
 * @param {Iterable<number>} taken slots other worktrees hold
 * @returns {number} the lowest free slot from 1
 */
const freePortSlot = (taken) => {
  const used = new Set(taken);
  for (let slot = 1; slot <= MAX_PORT_SLOT; slot += 1) if (!used.has(slot)) return slot;
  throw new Error(`Every port slot from 1 to ${MAX_PORT_SLOT} is taken. Finish a worktree to free one.`);
};

export { freePortSlot };
