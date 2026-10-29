/* @layer tooling-scripts @kind logic */
import { GATE_FALLBACK, INSTALL_STEP, STANDARDS_CI } from './ci.constants.mjs';
import { inNeedsOrder, readWorkflow } from './workflow-jobs.mjs';
import { planJob } from './workflow-steps.mjs';

const shortName = (step) => step.name.split(' / ').slice(1).join(' / ') || step.name;

const gateFor = (job, scripts) => {
  const id = job?.id ?? 'gate';
  const place = { job: id, jobId: id, needs: job?.needs ?? [], always: false };
  const install = { ...INSTALL_STEP, ...place };
  if (!scripts) return [install, { ...GATE_FALLBACK, ...place }];
  return [install, ...scripts.map((script) => ({ name: script, command: `pnpm run ${script}`, ...place }))];
};

const reusableCall = (job) => ({
  name: job.id,
  command: `uses: ${job.uses}`,
  job: job.id,
  jobId: job.id,
  needs: job.needs,
  always: false,
  skip: `The job "${job.id}" calls the reusable workflow ${job.uses}, which has no local equivalent. It is recorded skipped-local and replayed on push.`,
});

const stepsOfJob = (job, workflow, request) => {
  if (STANDARDS_CI.test(job.uses ?? '')) return gateFor(job, request.workspace.gate?.scripts ?? job.scripts);
  return job.uses ? [reusableCall(job)] : planJob(job, workflow, request);
};

const unique = (steps) => {
  const seen = new Map();
  return steps.map((step) => {
    const count = (seen.get(step.name) ?? 0) + 1;
    seen.set(step.name, count);
    return count === 1 ? step : { ...step, name: `${step.name} (${count})` };
  });
};

const isRequired = (step, checks) => {
  if (step.name === INSTALL_STEP.name) return true;
  if (!Array.isArray(checks)) return !step.skip;
  if (checks.includes(step.name) || checks.includes(shortName(step))) return true;
  return !step.skip && (checks.includes(step.job) || checks.includes(step.jobId));
};

const chooseJob = (steps, job) => {
  if (job === 'all') return steps;
  const known = [...new Set(steps.flatMap((step) => [step.jobId, step.job]))];
  if (!known.includes(job)) throw new Error(`No job "${job}" here. Known jobs: ${jobsOf(steps).join(', ')}, all.`);
  return steps.filter((step) => step.job === job || step.jobId === job);
};

const named = (step, only) => only.includes(step.name) || only.includes(shortName(step));

const chooseOnly = (steps, only) => {
  if (!only) return steps;
  const unknown = only.filter((name) => !steps.some((step) => named(step, [name])));
  if (unknown.length) throw new Error(`No step named ${unknown.map((name) => `"${name}"`).join(', ')}. Steps: ${steps.map((step) => step.name).join(', ')}.`);
  const wanted = steps.some((step) => named(step, only) && !step.skip);
  return steps.filter((step) => named(step, only) || (step.name === INSTALL_STEP.name && wanted));
};

const jobsOf = (steps) => [...new Set(steps.map((step) => step.jobId))];

/**
 * Reads the free word of `brock ci <word>`: a job name narrows to that job, a step name to that step.
 * @param {object[]} steps the full plan, from planSteps with no job or step chosen
 * @param {string | null} word
 * @param {string} job the --job value
 * @param {string[] | null} only the --only names
 * @returns {{ job: string, only: string[] | null }}
 */
const targetOf = (steps, word, job, only) => {
  if (!word) return { job, only };
  if (steps.some((step) => step.job === word || step.jobId === word)) {
    if (job !== 'all' && job !== word) throw new Error(`"${word}" is a job and --job says "${job}". Give only one.`);
    return { job: word, only };
  }
  if (steps.some((step) => named(step, [word]))) return { job, only: [...(only ?? []), word] };
  throw new Error(`"${word}" is not a job or a step here. Jobs: ${jobsOf(steps).join(', ')}, all. Steps: ${[...new Set(steps.map(shortName))].join(', ')}.`);
};

const EMPTY_WORKFLOW = Object.freeze({ env: {}, shell: null, workdir: null, jobs: [] });

const standaloneGate = (workflow, workspace) => {
  if (workflow.jobs.some((entry) => STANDARDS_CI.test(entry.uses ?? ''))) return [];
  const scripts = workspace.gate?.scripts ?? null;
  const ownJobs = workflow.jobs.some((entry) => !entry.uses && entry.steps.length > 0);
  return scripts || !ownJobs ? gateFor(null, scripts) : [];
};

/**
 * @param {{ workspace: object, workflowText?: string | null, job?: string, only?: string[] | null, trigger?: string, platform?: string }} request
 * @returns {object[]} the steps of the run, in the order they run
 */
const planSteps = ({ workspace, workflowText = null, job = 'all', only = null, trigger = 'manual', platform = process.platform }) => {
  const workflow = workflowText ? readWorkflow(workflowText) : EMPTY_WORKFLOW;
  const request = { workspace, trigger, platform };
  const steps = [...standaloneGate(workflow, workspace), ...inNeedsOrder(workflow.jobs).flatMap((entry) => stepsOfJob(entry, workflow, request))];
  const checks = workspace.publish?.requiredChecks;
  return chooseOnly(chooseJob(unique(steps), job), only).map((step) => ({ ...step, required: isRequired(step, checks) }));
};

export { planSteps, targetOf };
