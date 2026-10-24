/* @layer tooling-scripts @kind logic */
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { attestSteps } from './attest-steps.mjs';
import { APP_ATTEST_LABEL, APP_STEPS_LABEL, WORKFLOW_MODES } from './workflow-steps.constants.mjs';

/**
 * @typedef {{ ci: boolean, release: boolean }} ManagedWorkflows true when brock sync writes and checks that file
 */

const modeOf = (workflows, key, file) => {
  const mode = workflows?.[key] ?? 'managed';
  if (!WORKFLOW_MODES.includes(mode)) throw new Error(`${file} workflows.${key} is '${mode}'; it takes ${WORKFLOW_MODES.map((m) => `'${m}'`).join(' or ')}.`);
  return mode;
};

/**
 * @param {{ ci?: string, release?: string } | undefined} workflows workflows of brock.config.ts or brock.workspace.mjs
 * @param {string} [file] the config file, for the message
 * @returns {ManagedWorkflows}
 */
const managedWorkflows = (workflows, file = 'brock.config.ts') => ({
  ci: modeOf(workflows, 'ci', file) === 'managed',
  release: modeOf(workflows, 'release', file) === 'managed',
});

/**
 * @param {import('../config.mjs').BrockConfig} config
 * @param {{ manifest: Record<string, any> }[]} modules
 * @param {import('./collect-workflow-steps.mjs').StepSource[]} pluginSteps
 * @param {string[]} [targets] the targets the attest steps must find a linux build in
 * @returns {import('./collect-workflow-steps.mjs').StepSource[]} modules, then plugins, then the app
 */
const stepSources = (config, modules, pluginSteps, targets = DEFAULT_TARGETS) => [
  ...modules.map((m) => ({ label: `module ${m.manifest.id} brock.workflows`, workflows: m.manifest.workflows })),
  ...pluginSteps,
  { label: APP_STEPS_LABEL, workflows: config.workflows?.steps },
  { label: APP_ATTEST_LABEL, workflows: attestSteps(config.workflows?.attest, targets) },
];

export { managedWorkflows, stepSources };
