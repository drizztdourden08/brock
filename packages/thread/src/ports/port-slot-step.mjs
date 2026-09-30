/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { ensurePortSlot } from './ensure-port-slot.mjs';

/**
 * @returns {import('../workspace/workspace.type.mjs').ProvisionStep}
 */
const portSlotStep = () => ({
  name: 'port-slot',
  run: (worktree) => {
    if (existsSync(worktree.path)) ensurePortSlot(worktree);
  },
});

export { portSlotStep };
