/* @layer tooling-scripts @kind logic */
import { STEP_INDENT } from './workflow-steps.constants.mjs';

/**
 * @typedef {import('./check-workflow-step.mjs').CheckedStep} CheckedStep
 */

const KEY_INDENT = `${STEP_INDENT}  `;
const VALUE_INDENT = `${KEY_INDENT}  `;
const PLAIN_REF = /^[\w./@-]+$/;

const scalar = (value) => (typeof value === 'string' ? JSON.stringify(value) : String(value));

const mapLines = (key, entries) => (entries.length
  ? [`${KEY_INDENT}${key}:`, ...entries.map(([name, value]) => `${VALUE_INDENT}${name}: ${value}`)]
  : []);

const runLines = (run) => {
  if (!run.includes('\n')) return [`${KEY_INDENT}run: ${JSON.stringify(run)}`];
  const lines = run.replace(/\s+$/, '').split('\n');
  return [`${KEY_INDENT}run: |`, ...lines.map((line) => (line.trim() ? `${VALUE_INDENT}${line}` : ''))];
};

/**
 * @param {CheckedStep} step
 * @returns {[string, string][]} the secrets the step reads, then its own variables
 */
const envEntries = (step) => {
  const secrets = step.secrets.map((name) => [name, `\${{ secrets.${name} }}`]);
  const own = Object.entries(step.env).map(([name, value]) => [name, scalar(value)]);
  return [...secrets.filter(([name]) => !(name in step.env)), ...own];
};

/**
 * @param {CheckedStep} step
 * @returns {string[]} the step, indented under steps
 */
const stepLines = (step) => [
  `${STEP_INDENT}- name: ${JSON.stringify(step.name)}`,
  ...(step.id ? [`${KEY_INDENT}id: ${step.id}`] : []),
  ...(step.if ? [`${KEY_INDENT}if: ${JSON.stringify(step.if)}`] : []),
  ...(step.uses ? [`${KEY_INDENT}uses: ${PLAIN_REF.test(step.uses) ? step.uses : JSON.stringify(step.uses)}`] : []),
  ...mapLines('with', Object.entries(step.with).map(([name, value]) => [name, scalar(value)])),
  ...(step.shell ? [`${KEY_INDENT}shell: ${step.shell}`] : []),
  ...(step.workingDirectory ? [`${KEY_INDENT}working-directory: ${JSON.stringify(step.workingDirectory)}`] : []),
  ...mapLines('env', envEntries(step)),
  ...(step.run ? runLines(step.run) : []),
];

const setupKey = (step) => `${step.uses}|${JSON.stringify(step.with)}`;

/**
 * @param {CheckedStep[]} steps
 * @returns {CheckedStep[]} each uses step of the same action, version and inputs once
 */
const withoutRepeatedSetup = (steps) => {
  const seen = new Set();
  return steps.filter((step) => {
    if (!step.uses) return true;
    if (seen.has(setupKey(step))) return false;
    seen.add(setupKey(step));
    return true;
  });
};

/**
 * @param {CheckedStep[]} steps
 * @param {{ os: string, platform?: string | null, job?: string | null }} job the runner, the platform and the id of the job
 * @returns {CheckedStep[]} the steps that run in that job
 */
const stepsForJob = (steps, { os, platform = null, job = null }) => withoutRepeatedSetup(steps.filter((step) =>
  (!step.os || step.os.includes(os))
  && (!step.platforms || (platform !== null && step.platforms.includes(platform)))
  && (!step.jobs || (job !== null && step.jobs.includes(job)))));

/**
 * @param {CheckedStep[]} steps
 * @returns {string} each step after a blank line
 */
const stepsAfter = (steps) => steps.map((step) => `\n\n${stepLines(step).join('\n')}`).join('');

/**
 * @param {CheckedStep[]} steps
 * @returns {string} each step, then a blank line
 */
const stepsBefore = (steps) => steps.map((step) => `${stepLines(step).join('\n')}\n\n`).join('');

export { stepsForJob, stepsAfter, stepsBefore };
