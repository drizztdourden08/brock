/* @layer tooling-scripts @kind logic */
import { basename, resolve } from 'node:path';
import { loadPlugins, loadWorkspace } from '@drizztdourden08/brock-thread';
import { appDirs } from '../commands/app-dirs.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { resolveModules } from '../modules/resolve.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { collectWorkflowSteps } from './collect-workflow-steps.mjs';
import { stepSources } from './workflow-modes.mjs';

/**
 * @typedef {import('./shared-workflow-steps.mjs').WorkspaceApp} WorkspaceApp
 * @typedef {object} WorkflowInputs
 * @property {import('./collect-workflow-steps.mjs').StepSource[]} pluginSteps
 * @property {{ ci?: string, release?: string } | undefined} sharedWorkflows workflows of brock.workspace.mjs
 * @property {WorkspaceApp[] | undefined} workspaceApps every app, when the repo has several
 */

/**
 * @param {string} repoDir
 * @returns {Promise<{ plugins: (string | object)[], workflows?: object }>} the workspace, or none when it does not load
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
 * @param {string} repoDir
 * @param {{ plugins: (string | object)[] }} workspace
 * @returns {Promise<import('./collect-workflow-steps.mjs').StepSource[]>} each plugin's steps
 */
const pluginSteps = async (repoDir, workspace) => {
  try {
    const { plugins } = await loadPlugins(repoDir, workspace);
    return plugins.filter((plugin) => plugin.workflows).map((plugin) => ({ label: `plugin ${plugin.name} workflows`, workflows: plugin.workflows }));
  } catch (error) {
    throw new Error(`the plugins of the repo command did not load, so their workflow steps are unknown: ${error.message}`, { cause: error });
  }
};

/**
 * @param {string} repoDir
 * @param {string} dir an app folder, from the repo root
 * @returns {Promise<WorkspaceApp>} its module and app steps, without the plugins
 */
const workspaceApp = async (repoDir, dir) => {
  const root = resolve(repoDir, dir);
  const config = await loadBrockConfig(root);
  const { modules } = resolveModules(root, config.modules ?? []);
  return {
    name: basename(dir),
    appDir: dir,
    systemSteps: modules.flatMap((m) => m.manifest.ci ?? []),
    steps: collectWorkflowSteps(stepSources(config, modules, []).map((source) => ({ ...source, label: `${dir}: ${source.label}` }))),
  };
};

/**
 * @param {string} appDir the app root
 * @returns {Promise<WorkflowInputs>} plugins, workspace modes, apps
 */
const workflowInputs = async (appDir) => {
  const repoDir = findWorkspaceRoot(appDir) ?? appDir;
  const workspace = await workspaceOf(repoDir);
  const apps = appDirs(repoDir);
  return {
    pluginSteps: await pluginSteps(repoDir, workspace),
    sharedWorkflows: workspace.workflows,
    workspaceApps: apps.length > 1 ? await Promise.all(apps.map((dir) => workspaceApp(repoDir, dir))) : undefined,
  };
};

export { workflowInputs };
