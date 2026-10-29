/* @layer tooling-scripts @kind logic */
import { GATE_FALLBACK, INSTALL_STEP } from './ci.constants.mjs';
import { workflowJobs } from './workflow-jobs.mjs';

const scriptStep = (script, job) => ({ name: script, command: `pnpm run ${script}`, job });

const remoteOnly = (id) => ({
  name: id,
  command: '',
  job: id,
  skip: `The "${id}" job of ci.yml needs the GitHub registry or another operating system. It is recorded skipped-local and replayed on push.`,
});

const gateSteps = (workspace, jobs) => {
  const gateJob = jobs.find((job) => job.scripts);
  const scripts = workspace.gate?.scripts ?? gateJob?.scripts ?? null;
  if (!scripts) return [GATE_FALLBACK];
  return scripts.map((script) => scriptStep(script, gateJob?.id ?? 'gate'));
};

const withRequired = (steps, requiredChecks) => steps.map((step) => ({
  ...step,
  required: step.name === INSTALL_STEP.name || (Array.isArray(requiredChecks) ? requiredChecks.includes(step.name) : !step.skip),
}));

const chooseJob = (steps, job) => {
  if (job === 'all') return steps;
  const known = [...new Set(steps.map((step) => step.job))];
  if (!known.includes(job)) throw new Error(`No job "${job}" here. Known jobs: ${known.join(', ')}, all.`);
  return steps.filter((step) => step.job === job);
};

const chooseOnly = (steps, only) => {
  if (!only) return steps;
  const unknown = only.filter((name) => !steps.some((step) => step.name === name));
  if (unknown.length) throw new Error(`No step named ${unknown.map((name) => `"${name}"`).join(', ')}. Steps: ${steps.map((step) => step.name).join(', ')}.`);
  return steps.filter((step) => only.includes(step.name) || (step.name === INSTALL_STEP.name && steps.some((other) => only.includes(other.name) && !other.skip)));
};

/**
 * @param {{ workspace: object, workflowText?: string | null, job?: string, only?: string[] | null }} request
 * @returns {{ name: string, command: string, job: string, required: boolean, skip?: string }[]}
 */
const planSteps = ({ workspace, workflowText = null, job = 'all', only = null }) => {
  const jobs = workflowText ? workflowJobs(workflowText) : [];
  const all = [INSTALL_STEP, ...gateSteps(workspace, jobs), ...jobs.filter((entry) => !entry.scripts).map((entry) => remoteOnly(entry.id))];
  return withRequired(chooseOnly(chooseJob(all, job), only), workspace.publish?.requiredChecks);
};

export { planSteps };
