/* @layer tooling-scripts @kind logic */
import { PLATFORM_ORDER } from '../platforms/platforms.constants.mjs';
import { ENV_NAME, RESERVED_SECRET, RUNNER_OSES, SECRET_NAME, STEP_KEYS } from './workflow-steps.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/module').WorkflowStep} WorkflowStep
 * @typedef {CheckedAction & CheckedFilters} CheckedStep
 */

/**
 * @typedef {object} CheckedAction
 * @property {string} name
 * @property {string | null} run
 * @property {string | null} uses
 * @property {Record<string, string | number | boolean>} with
 * @property {Record<string, string>} env
 * @property {string | null} shell
 */

/**
 * @typedef {object} CheckedFilters
 * @property {string | null} if
 * @property {string[]} secrets
 * @property {string[] | null} os null runs on every runner
 * @property {string[] | null} platforms null runs in every job
 */

const listOf = (value) => (Array.isArray(value) ? value : [value]);

const fail = (where, message) => {
  throw new Error(`${where}: ${message}`);
};

const textOf = (where, value, key) => {
  if (value === undefined) return null;
  if (typeof value !== 'string' || !value.trim()) fail(where, `${key} must be a non-empty string.`);
  return value;
};

const mapOf = (where, value, key, check) => {
  if (value === undefined) return {};
  if (typeof value !== 'object' || value === null || Array.isArray(value)) fail(where, `${key} must be an object.`);
  for (const [name, entry] of Object.entries(value)) check(name, entry);
  return { ...value };
};

const choicesOf = (where, value, key, allowed) => {
  if (value === undefined) return null;
  const list = listOf(value);
  const wrong = list.filter((entry) => !allowed.includes(entry));
  if (!list.length || wrong.length) fail(where, `${key} takes ${allowed.join(', ')}; got ${JSON.stringify(value)}.`);
  return list;
};

const secretsOf = (where, value) => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail(where, 'secrets lists the repository secret names the step reads.');
  for (const name of value) {
    if (typeof name !== 'string' || !SECRET_NAME.test(name)) fail(where, `secret "${name}" is not a secret name (letters, digits, underscores).`);
    if (RESERVED_SECRET.test(name)) fail(where, `secret "${name}": GitHub reserves the GITHUB_ prefix; the workflow token is secrets.GITHUB_TOKEN already.`);
  }
  return [...value];
};

const assertKeys = (where, step) => {
  const unknown = Object.keys(step).filter((key) => !STEP_KEYS.has(key));
  if (unknown.length) fail(where, `unknown key ${unknown.join(', ')}; a step takes ${[...STEP_KEYS].join(', ')}.`);
};

const assertAction = (where, step) => {
  if ((step.run === undefined) === (step.uses === undefined)) fail(where, 'a step takes run (a shell command) or uses (an action), one of the two.');
  if (step.with !== undefined && step.uses === undefined) fail(where, 'with goes with uses, the inputs of an action.');
};

const checkEnv = (where) => (name, value) => {
  if (!ENV_NAME.test(name)) fail(where, `env ${name} is not a variable name.`);
  if (typeof value !== 'string') fail(where, `env ${name} must be a string.`);
};

const checkWith = (where) => (name, value) => {
  if (!['string', 'number', 'boolean'].includes(typeof value)) fail(where, `with.${name} must be a string, a number or a boolean.`);
};

/**
 * @param {WorkflowStep} step
 * @param {string} where the source and position, for the message
 * @returns {CheckedStep}
 */
const checkWorkflowStep = (step, where) => {
  if (typeof step !== 'object' || step === null || Array.isArray(step)) fail(where, 'a step is an object with a name and run or uses.');
  assertKeys(where, step);
  assertAction(where, step);
  return {
    name: textOf(where, step.name, 'name') ?? fail(where, 'name is missing.'),
    run: textOf(where, step.run, 'run'),
    uses: textOf(where, step.uses, 'uses'),
    with: mapOf(where, step.with, 'with', checkWith(where)),
    env: mapOf(where, step.env, 'env', checkEnv(where)),
    shell: textOf(where, step.shell, 'shell'),
    if: textOf(where, step.if, 'if'),
    secrets: secretsOf(where, step.secrets),
    os: choicesOf(where, step.os, 'os', RUNNER_OSES),
    platforms: choicesOf(where, step.platforms, 'platforms', PLATFORM_ORDER),
  };
};

export { checkWorkflowStep };
