/* @layer tooling-scripts @kind logic */
import { checkWorkflowStep } from './check-workflow-step.mjs';
import { STEP_POINTS } from './workflow-steps.constants.mjs';

/**
 * @typedef {import('./check-workflow-step.mjs').CheckedStep} CheckedStep
 * @typedef {{ ci: Record<string, CheckedStep[]>, release: Record<string, CheckedStep[]> }} CollectedSteps
 * @typedef {{ label: string, workflows?: import('@drizztdourden08/brock-core/module').WorkflowSteps | null }} StepSource
 */

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * @returns {CollectedSteps} every step point, empty
 */
const noWorkflowSteps = () => ({
  ci: Object.fromEntries(STEP_POINTS.ci.map((point) => [point, []])),
  release: Object.fromEntries(STEP_POINTS.release.map((point) => [point, []])),
});

/**
 * @param {string} where
 * @param {string} workflow ci or release
 * @param {unknown} points
 * @returns {[string, unknown[]][]} each point and its steps, checked for shape
 */
const pointsOf = (where, workflow, points) => {
  if (!STEP_POINTS[workflow]) throw new Error(`${where}: unknown workflow "${workflow}"; steps go under ci or release.`);
  if (!isObject(points)) throw new Error(`${where}.${workflow} maps a step point to its steps: ${STEP_POINTS[workflow].join(', ')}.`);
  return Object.entries(points).map(([point, steps]) => {
    if (!STEP_POINTS[workflow].includes(point)) throw new Error(`${where}.${workflow}: unknown step point "${point}"; it takes ${STEP_POINTS[workflow].join(', ')}.`);
    if (!Array.isArray(steps)) throw new Error(`${where}.${workflow}.${point} is a list of steps.`);
    return [point, steps];
  });
};

/**
 * @param {CollectedSteps} collected
 * @param {StepSource} source
 */
const addSource = (collected, { label, workflows }) => {
  if (workflows === undefined || workflows === null) return;
  if (!isObject(workflows)) throw new Error(`${label} maps ci and release to their step points.`);
  for (const [workflow, points] of Object.entries(workflows)) {
    for (const [point, steps] of pointsOf(label, workflow, points)) {
      collected[workflow][point].push(...steps.map((step, at) => checkWorkflowStep(step, `${label}.${workflow}.${point}[${at}]`, workflow)));
    }
  }
};

/**
 * @param {StepSource[]} sources in the order their steps run: modules, plugins, then the app
 * @returns {CollectedSteps}
 */
const collectWorkflowSteps = (sources) => {
  const collected = noWorkflowSteps();
  for (const source of sources) addSource(collected, source);
  return collected;
};

export { collectWorkflowSteps, noWorkflowSteps };
