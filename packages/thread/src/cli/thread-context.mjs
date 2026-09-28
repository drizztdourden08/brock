/* @layer tooling-scripts @kind logic */
import { mainCheckout } from '../worktree/paths.mjs';
import { loadWorkspace } from '../workspace/load-workspace.mjs';
import { loadPlugins } from '../plugins/load-plugins.mjs';
import { createLog } from '../log.mjs';

/**
 * @param {string} [cwd]
 * @returns {Promise<import('../workspace/workspace.type.mjs').ThreadContext>}
 */
const createThreadContext = async (cwd = process.cwd()) => {
  const rootDir = mainCheckout(cwd);
  const workspace = await loadWorkspace(rootDir);
  const { plugins, verbs } = await loadPlugins(rootDir, workspace);
  return {
    rootDir,
    workspace,
    plugins,
    verbs,
    targets: Object.assign({}, ...plugins.map((p) => p.targets), workspace.targets),
    provision: [...workspace.provision, ...plugins.flatMap((p) => p.steps.provision)],
    build: [...workspace.build.steps, ...plugins.flatMap((p) => p.steps.build)],
    guards: plugins.flatMap((p) => p.guards),
    log: createLog(workspace.name),
  };
};

export { createThreadContext };
