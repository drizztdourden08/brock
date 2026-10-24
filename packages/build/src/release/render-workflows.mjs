/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { artifactPrefixOf } from '../packaging/release-names.mjs';
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { shapeOf } from '../platforms/server/app-shape.mjs';
import { serverOptions } from '../platforms/server/server-options.mjs';
import { collectWorkflowSteps } from './collect-workflow-steps.mjs';
import { composeWorkflows, workspaceCi } from './compose-workflows.mjs';
import { defaultBranchOf } from './default-branch.mjs';
import { keepGithubTracked } from './keep-github-tracked.mjs';
import { publishPlan, publishWorkflowText } from './publish-packages.mjs';
import { releaseLayout } from './release-layout.mjs';
import { sharedSteps, sharedSystemSteps } from './shared-workflow-steps.mjs';
import { testEnvOf } from './test-env-steps.mjs';
import { managedWorkflows, stepSources } from './workflow-modes.mjs';
import { CI_WORKFLOW_FILE, PUBLISH_WORKFLOW_FILE, RELEASE_WORKFLOW_FILE, WORKFLOWS_DIR } from './workflows.constants.mjs';

const targetsOf = (config) => config.targets ?? DEFAULT_TARGETS;

const slashed = (path) => path.replace(/\\/g, '/');

/**
 * @param {import('./release-layout.mjs').ReleaseLayout} layout
 * @returns {{ ci: string, release: string, publish: string }} the workflow files of the app, from the repo root
 */
const workflowFilesOf = ({ app }) => (app
  ? { ci: `${WORKFLOWS_DIR}/ci-${app.name}.yml`, release: `${WORKFLOWS_DIR}/release-${app.name}.yml`, publish: `${WORKFLOWS_DIR}/publish-packages-${app.name}.yml` }
  : { ci: CI_WORKFLOW_FILE, release: RELEASE_WORKFLOW_FILE, publish: PUBLISH_WORKFLOW_FILE });

/**
 * @param {string} repoDir
 * @returns {string | null} the .gitignore keeping .github, or null
 */
const trackedIgnore = (repoDir) => {
  const file = join(repoDir, '.gitignore');
  return existsSync(file) ? keepGithubTracked(readFileSync(file, 'utf8')) : null;
};

/**
 * @param {import('../config.mjs').BrockConfig} config
 * @returns {{ server?: import('./compose-workflows.mjs').ServerJobOptions }} the server options of an app with a server target
 */
const serverInputOf = (config) => {
  if (!shapeOf(targetsOf(config)).server) return {};
  const { arch, image } = serverOptions(config);
  return { server: { id: config.product.id, arch, image } };
};

/**
 * @param {import('../config.mjs').BrockConfig} config
 * @param {import('./release-layout.mjs').ReleaseLayout} layout
 */
const composeInputOf = (config, layout) => ({
  targets: targetsOf(config),
  ...serverInputOf(config),
  appDir: layout.appDir,
  prefix: artifactPrefixOf(config.product),
  app: layout.app,
  baselines: config.review?.baselines === true,
  testEnv: testEnvOf(config.workflows),
});

/**
 * @param {import('./release-layout.mjs').ReleaseLayout} layout
 * @returns {boolean} the first of several apps writes the workspace ci.yml
 */
const writesSharedCi = (layout) => layout.app !== null && layout.apps[0] === layout.appDir;

/**
 * @param {{ layout: import('./release-layout.mjs').ReleaseLayout, config: import('../config.mjs').BrockConfig, modules: { manifest: Record<string, any> }[] }} app
 * @param {Partial<import('./workspace-workflow-inputs.mjs').WorkflowInputs>} inputs
 * @returns {string | null} the workspace ci.yml this app writes
 */
const sharedCiOf = ({ layout, config, modules }, inputs) => {
  const managed = managedWorkflows(inputs.sharedWorkflows, 'brock.workspace.mjs').ci;
  if (!managed || !writesSharedCi(layout)) return null;
  const own = { name: layout.app.name, appDir: layout.appDir, systemSteps: modules.flatMap((m) => m.manifest.ci ?? []), steps: collectWorkflowSteps(stepSources(config, modules, [], targetsOf(config))) };
  const apps = inputs.workspaceApps ?? [own];
  const steps = sharedSteps({ plugins: collectWorkflowSteps(inputs.pluginSteps ?? []), apps });
  return workspaceCi(sharedSystemSteps(apps), defaultBranchOf(layout.repoDir), steps);
};

/**
 * @param {import('../config.mjs').BrockConfig} config
 * @param {import('./release-layout.mjs').ReleaseLayout} layout
 * @param {import('./workflow-modes.mjs').ManagedWorkflows} managed
 * @returns {{ publish: import('./publish-packages.mjs').PublishPlan | null, publishWorkflow: string | null }} the release job plan and the standalone workflow
 */
const publishInputsOf = (config, layout, managed) => {
  const plan = publishPlan(config.workflows?.publish, layout.repoDir);
  return { publish: managed.release ? plan : null, publishWorkflow: publishWorkflowText(plan, layout.app) };
};

/**
 * @param {string} rootDir the app root
 * @param {import('../config.mjs').BrockConfig} config
 * @param {{ manifest: Record<string, any> }[]} modules
 * @param {Partial<import('./workspace-workflow-inputs.mjs').WorkflowInputs>} [inputs] the plugins, the workspace modes, every app
 * @returns {{ path: string, content: string }[]} the managed workflows and .gitignore
 */
const renderWorkflows = (rootDir, config, modules, inputs = {}) => {
  const layout = releaseLayout(rootDir, config.product);
  if (!layout) return [];
  const managed = managedWorkflows(config.workflows);
  const systemSteps = modules.flatMap((m) => m.manifest.ci ?? []);
  const steps = collectWorkflowSteps(stepSources(config, modules, inputs.pluginSteps ?? [], targetsOf(config)));
  const branch = defaultBranchOf(layout.repoDir);
  const { publish, publishWorkflow } = publishInputsOf(config, layout, managed);
  const { ci, release } = composeWorkflows({ ...composeInputOf(config, layout), systemSteps, steps, branch, publish });
  const at = (file) => slashed(relative(rootDir, join(layout.repoDir, file)));
  const files = workflowFilesOf(layout);
  const sharedCi = sharedCiOf({ layout, config, modules }, inputs);
  const ignore = trackedIgnore(layout.repoDir);
  return [
    ...(sharedCi === null ? [] : [{ path: at(CI_WORKFLOW_FILE), content: sharedCi }]),
    ...(managed.ci ? [{ path: at(files.ci), content: ci }] : []),
    ...(managed.release ? [{ path: at(files.release), content: release }] : []),
    ...(publishWorkflow === null ? [] : [{ path: at(files.publish), content: publishWorkflow }]),
    ...(ignore === null ? [] : [{ path: at('.gitignore'), content: ignore }]),
  ];
};

export { renderWorkflows };
