/* @layer tooling-scripts @kind logic */
import { shellSpec } from './shell-spec.mjs';
import { eventNameOf, expand, judge } from './workflow-expr.mjs';
import { matrixEntries, platformOf } from './workflow-matrix.mjs';

const NO_OP_ACTIONS = [
  [/^actions\/checkout$/, 'The detached worktree already is the checkout.'],
  [/^actions\/setup-node$/, 'The local Node is used.'],
  [/^pnpm\/action-setup$/, 'The local pnpm is used.'],
  [/^actions\/cache(\/|$)/, 'No cache is kept locally.'],
];
const UPLOAD_ACTION = /^actions\/upload-artifact$/;
const LINUX_ONLY = /\b(sudo|apt-get|sysctl|xvfb-run)\b/;
const PNPM_INSTALL = /\bpnpm (install|i)\b(?![^\n]*--offline)/g;
const RUNNER_OS = Object.freeze({ win32: 'Windows', linux: 'Linux', darwin: 'macOS' });
const NAME_LIMIT = 60;

const firstLine = (text) => {
  const line = text.split(/\r?\n/).find((entry) => entry.trim()) ?? '';
  const trimmed = line.trim();
  return trimmed.length > NAME_LIMIT ? `${trimmed.slice(0, NAME_LIMIT - 3)}...` : trimmed;
};

const stepName = (step) => step.name ?? (step.run ? firstLine(step.run) : step.uses ?? 'step');

const resolveEnv = (layers, scope) => {
  const env = {};
  const unresolved = [];
  for (const layer of layers) {
    for (const [key, value] of Object.entries(layer)) {
      const result = expand(value, { ...scope, env });
      if (result.unresolved.length) unresolved.push(key);
      else env[key] = result.text;
    }
  }
  if ('NODE_AUTH_TOKEN' in env) env.NODE_AUTH_TOKEN = '';
  return { env, unresolved };
};

const runsOnLabel = (job, scope) => {
  const raw = Array.isArray(job.runsOn) ? job.runsOn[0] : job.runsOn;
  return typeof raw === 'string' ? expand(raw, scope).text : null;
};

const mentions = (text, names) => names.filter((name) => new RegExp(`\\b${name}\\b`).test(text));

const skipped = (base, reason) => ({ ...base, command: base.command ?? '', skip: reason });

const shellOf = (step, { job, workflow, scope }) => step.shell ?? job.shell ?? workflow.shell ?? (scope.runnerOs === 'Windows' ? 'pwsh' : 'bash');

const workdirOf = (step, { job, workflow }) => step.workdir ?? job.workdir ?? workflow.workdir ?? null;

const problemOf = (body, shell, platform) => {
  const spec = shellSpec(shell, platform);
  if (spec.unavailable) return spec.unavailable;
  const linuxOnly = platform !== 'linux' && LINUX_ONLY.test(body);
  return linuxOnly ? `It uses a Linux-only tool (sudo, apt-get, sysctl or xvfb-run) and this machine runs ${RUNNER_OS[platform] ?? platform}.` : null;
};

const planRun = (step, base, context) => {
  const { job, workflow, scope, platform } = context;
  const resolved = resolveEnv([workflow.env, job.env, step.env], scope);
  const body = expand(step.run, { ...scope, env: resolved.env });
  const missing = [...body.unresolved, ...mentions(step.run, resolved.unresolved)];
  if (missing.length) return skipped(base, `It needs ${missing[0]}, which the local runner cannot resolve.`);
  const shell = shellOf(step, context);
  const problem = problemOf(body.text, shell, platform);
  if (problem) return skipped(base, problem);
  return { ...base, command: body.text.replace(PNPM_INSTALL, 'pnpm $1 --offline'), shell, env: resolved.env, workdir: workdirOf(step, context) };
};

const planUpload = (step, base, scope) => {
  const name = expand(step.with.name ?? 'artifact', scope);
  const paths = expand(step.with.path ?? '', scope);
  if (name.unresolved.length || paths.unresolved.length) return skipped(base, `It needs ${[...name.unresolved, ...paths.unresolved][0]}, which the local runner cannot resolve.`);
  const lines = paths.text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return { ...base, command: `upload-artifact ${name.text}`, upload: { name: name.text, paths: lines, ifNoFiles: step.with['if-no-files-found'] ?? 'warn' } };
};

const planUses = (step, base, scope) => {
  const action = step.uses.split('@')[0];
  const quiet = NO_OP_ACTIONS.find(([pattern]) => pattern.test(action));
  if (quiet) return { ...base, command: `uses: ${step.uses}`, noop: quiet[1] };
  if (UPLOAD_ACTION.test(action)) return planUpload(step, base, scope);
  return skipped({ ...base, command: `uses: ${step.uses}` }, `The action ${action} has no local equivalent.`);
};

const plannedBy = (step, base, context) => {
  if (step.run !== null) return planRun(step, base, context);
  return step.uses ? planUses(step, base, context.scope) : skipped(base, 'The step has neither run nor uses.');
};

const planStep = (step, context) => {
  const { job, label, scope, hold } = context;
  const base = { name: `${label} / ${stepName(step)}`, job: label, jobId: job.id, needs: job.needs, always: false };
  if (hold) return skipped(base, hold);
  const condition = judge(step.if, scope);
  if (!condition.run) return skipped(base, `Its condition (${step.if}) is false for the trigger of this run.`);
  return { ...plannedBy(step, base, context), always: condition.afterFailure };
};

const holdOf = (job, scope, { entry, platform, label }) => {
  if (!judge(job.if, scope).run) return `The job condition (${job.if}) is false for the trigger of this run.`;
  const system = platformOf(entry.os ?? (Object.keys(entry).length ? runsOnLabel(job, scope) : null));
  return system && system !== platform ? `The matrix entry ${label} runs on ${RUNNER_OS[system]}; this machine runs ${RUNNER_OS[platform] ?? platform}.` : null;
};

const entryScope = (entry, job, request) => {
  const scope = { env: {}, matrix: entry, eventName: eventNameOf(request.trigger), runnerOs: RUNNER_OS[request.platform] };
  const label = runsOnLabel(job, scope);
  return { ...scope, runnerOs: RUNNER_OS[platformOf(label) ?? request.platform] };
};

/**
 * @param {object} job one job of the workflow with steps of its own
 * @param {object} workflow the parsed workflow
 * @param {{ trigger: string, platform: string }} request
 * @returns {object[]} one planned step for each step of each matrix entry
 */
const planJob = (job, workflow, request) => {
  const entries = matrixEntries(job.matrix);
  if (!entries) return job.steps.map((step) => skipped({ name: `${job.id} / ${stepName(step)}`, job: job.id, jobId: job.id, needs: job.needs, always: false }, 'The matrix of the job is an expression the local runner cannot resolve.'));
  return entries.flatMap((entry) => {
    const scope = entryScope(entry, job, request);
    const label = entries.length > 1 || Object.keys(entry).length ? `${job.id} (${Object.values(entry).join(', ')})` : job.id;
    const context = { job, workflow, scope, label, platform: request.platform, hold: holdOf(job, scope, { entry, platform: request.platform, label }) };
    return job.steps.map((step) => planStep(step, context));
  });
};

export { planJob };
