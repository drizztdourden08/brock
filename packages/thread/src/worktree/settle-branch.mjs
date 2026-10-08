/* @layer tooling-scripts @kind logic */
import { deleteBranch } from './delete-branch.mjs';

/**
 * @param {{ name: string, branch: string, base: string, landed: { landed: boolean, via: string | null }, ctx: import('../workspace/workspace.type.mjs').ThreadContext }} request
 * @returns {void}
 */
const settleBranch = ({ name, branch, base, landed, ctx }) => {
  const { workspace, rootDir, log } = ctx;
  if (!landed.landed) {
    log(`Branch "${branch}" kept, not merged into ${base} yet. Resume with: ${workspace.name} worktree create ${name} --from ${branch}`);
    return;
  }
  deleteBranch({ branch, cwd: rootDir, via: landed.via, ctx });
};

export { settleBranch };
