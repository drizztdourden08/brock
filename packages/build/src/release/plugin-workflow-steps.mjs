/* @layer tooling-scripts @kind logic */
import { loadPlugins, loadWorkspace } from '@drizztdourden08/brock-thread';
import { findWorkspaceRoot } from '../workspace.mjs';

/**
 * @param {string} repoDir
 * @returns {Promise<{ plugins: (string | object)[] }>} the workspace, or none listed when it does not load
 */
const workspaceOf = async (repoDir) => {
  try {
    const workspace = await loadWorkspace(repoDir);
    return { ...workspace, plugins: workspace.plugins ?? [] };
  } catch {
    return { plugins: [] };
  }
};

/**
 * @param {string} appDir the app root
 * @returns {Promise<import('./collect-workflow-steps.mjs').StepSource[]>} each plugin's steps
 */
const pluginWorkflowSteps = async (appDir) => {
  const repoDir = findWorkspaceRoot(appDir) ?? appDir;
  try {
    const { plugins } = await loadPlugins(repoDir, await workspaceOf(repoDir));
    return plugins.filter((plugin) => plugin.workflows).map((plugin) => ({ label: `plugin ${plugin.name} workflows`, workflows: plugin.workflows }));
  } catch (error) {
    throw new Error(`the plugins of the repo command did not load, so their workflow steps are unknown: ${error.message}`, { cause: error });
  }
};

export { pluginWorkflowSteps };
