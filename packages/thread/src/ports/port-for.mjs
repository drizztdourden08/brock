/* @layer tooling-scripts @kind logic */
import { MAX_PORT, MAX_PORT_SLOT, MIN_PORT_BASE, PORT_BLOCK_SIZE, PORT_OFFSETS } from './ports.constants.mjs';

const assertRange = (label, value, min, max) => {
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${label} ${value} must be a whole number from ${min} to ${max}.`);
};

/**
 * @param {number} base the app's port base, product.ports.base
 * @param {number} slot 0 for the main checkout, N for a thread worktree
 * @param {number} [offset] 0 for the dev renderer, 1 to 9 for tools
 * @returns {number}
 */
const portFor = (base, slot, offset = PORT_OFFSETS.renderer) => {
  assertRange('Port base', base, MIN_PORT_BASE, MAX_PORT - PORT_BLOCK_SIZE * (MAX_PORT_SLOT + 1));
  assertRange('Port slot', slot, 0, MAX_PORT_SLOT);
  assertRange('Port offset', offset, PORT_OFFSETS.renderer, PORT_OFFSETS.lastTool);
  return base + PORT_BLOCK_SIZE * slot + offset;
};

export { portFor };
