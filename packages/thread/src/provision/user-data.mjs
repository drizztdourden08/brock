/* @layer tooling-scripts @kind logic */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @returns {import('../workspace/workspace.type.mjs').ProvisionStep}
 */
const userDataStep = () => ({
  name: 'user-data',
  run: (worktree) => {
    mkdirSync(join(worktree.userData, 'Data'), { recursive: true });
  },
});

export { userDataStep };
