/* @layer tooling-scripts @kind logic */
import { noWorkflowSteps } from './collect-workflow-steps.mjs';
import { STEP_POINTS } from './workflow-steps.constants.mjs';

/**
 * @typedef {import('./collect-workflow-steps.mjs').CollectedSteps} CollectedSteps
 * @typedef {import('./check-workflow-step.mjs').CheckedStep} CheckedStep
 * @typedef {object} WorkspaceApp
 * @property {string} name the app folder name
 * @property {string} appDir the app folder, from the repo root
 * @property {import('@drizztdourden08/brock-core/module').ModuleCiStep[]} systemSteps
 * @property {CollectedSteps} steps its module and app steps
 */

/**
 * @param {CheckedStep} step
 * @param {WorkspaceApp} app
 * @returns {CheckedStep} named after the app; a shell step runs in its folder
 */
const appStep = (step, app) => (step.run
  ? { ...step, name: `${app.name}: ${step.name}`, workingDirectory: app.appDir, env: { APP_DIR: app.appDir, ...step.env } }
  : { ...step, name: `${app.name}: ${step.name}` });

/**
 * @param {{ plugins: CollectedSteps, apps: WorkspaceApp[] }} inputs
 * @returns {CollectedSteps} the plugin steps once, then every app's, in workspace order
 */
const sharedSteps = ({ plugins, apps }) => ({
  ci: Object.fromEntries(STEP_POINTS.ci.map((point) => [point, [...plugins.ci[point], ...apps.flatMap((app) => app.steps.ci[point].map((step) => appStep(step, app)))]])),
  release: noWorkflowSteps().release,
});

/**
 * @param {WorkspaceApp[]} apps
 * @returns {import('@drizztdourden08/brock-core/module').ModuleCiStep[]} every app's module steps, each once
 */
const sharedSystemSteps = (apps) => {
  const seen = new Set();
  return apps.flatMap((app) => app.systemSteps).filter((step) => {
    const key = JSON.stringify([step.name, step.run, step.os ?? null]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export { sharedSteps, sharedSystemSteps };
