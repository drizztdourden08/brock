/* @layer tooling-scripts @kind logic */
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { copyArtifact } from './artifact-copy.mjs';
import { newRecord, stepRecord } from './record-shape.mjs';
import { writeRecord } from './check-record.mjs';
import { artifactDir, recordFile } from './ci-paths.mjs';
import { addCiWorktree, dropCiWorktree } from './ci-worktree.mjs';
import { OFFLINE_NOTE } from './ci.constants.mjs';
import { acquireRunLock } from './run-lock.mjs';
import { noteInLog, runStep, stopTree } from './run-step.mjs';
import { summarize } from './summarize.mjs';
import { eventNameOf } from './workflow-expr.mjs';

const now = () => new Date().toISOString();

const RUNNER_OS = Object.freeze({ win32: 'Windows', linux: 'Linux', darwin: 'macOS' });

const finishedWith = (record) => {
  if (record.steps.some((step) => step.status === 'cancelled')) return 'cancelled';
  if (record.steps.some((step) => step.status === 'fail')) return 'fail';
  return record.steps.some((step) => step.status === 'pass') ? 'pass' : 'skipped-local';
};

const stepStatus = (code, cancelled) => {
  if (cancelled) return 'cancelled';
  return code === 0 ? 'pass' : 'fail';
};

const workflowEnv = (planned, { root, record }) => ({
  GITHUB_WORKSPACE: root.replace(/\\/g, '/'),
  GITHUB_EVENT_NAME: eventNameOf(record.trigger),
  RUNNER_OS: RUNNER_OS[process.platform] ?? process.platform,
  RUNNER_TEMP: tmpdir(),
  ...planned.env,
});

const settle = (step, { pass, code, note }) => {
  step.exitCode = code;
  step.status = pass ? 'pass' : 'fail';
  if (note) {
    step.note = note;
    noteInLog(step.log, note);
  }
};

const keepArtifact = (step, planned, session) => {
  const dir = artifactDir(session.record.project, session.record.id, planned.upload.name);
  const kept = copyArtifact(planned.upload, { root: session.path, dir });
  step.artifact = kept.artifact;
  writeFileSync(step.log, `${[kept.text, ...kept.artifact.files].join('\n')}\n`);
  settle(step, { pass: kept.pass, code: kept.pass ? 0 : 1, note: kept.text });
};

const spawnStep = async (step, planned, session) => {
  const { control, record } = session;
  const code = await runStep({
    command: step.command,
    cwd: step.cwd,
    logFile: step.log,
    shell: planned.shell ?? null,
    env: planned.env ? workflowEnv(planned, { root: session.path, record }) : {},
    onChild: (child) => { control.child = child; },
  });
  control.child = null;
  step.exitCode = code;
  step.status = stepStatus(code, control.cancelled);
  if (step.status === 'fail' && step.name === 'install') {
    step.note = OFFLINE_NOTE;
    noteInLog(step.log, OFFLINE_NOTE);
  }
};

const runOne = async ({ step, planned, session, log }) => {
  step.status = 'running';
  step.startedAt = now();
  session.save();
  const started = Date.now();
  if (planned.noop) {
    writeFileSync(step.log, `${step.command}\n`);
    settle(step, { pass: true, code: 0, note: planned.noop });
  } else if (planned.upload) keepArtifact(step, planned, session);
  else await spawnStep(step, planned, session);
  step.durationMs = Date.now() - started;
  session.save();
  log(`${step.name}: ${step.status} (${(step.durationMs / 1000).toFixed(1)}s, exit ${step.exitCode})`);
};

const blockedBy = (planned, failed) => (planned.needs ?? []).some((need) => failed.bases.has(need)) || (failed.jobs.has(planned.job) && !planned.always);

const runSteps = async ({ session, log }) => {
  const failed = { jobs: new Set(), bases: new Set() };
  for (const [index, step] of session.record.steps.entries()) {
    if (step.status !== 'pending') continue;
    const planned = session.plan[index];
    if (session.control.cancelled) step.status = 'cancelled';
    else if (blockedBy(planned, failed)) step.status = 'not-run';
    else await runOne({ step, planned, session, log });
    if (step.status !== 'pass') {
      failed.jobs.add(planned.job);
      failed.bases.add(planned.jobId ?? planned.job);
    }
  }
};

const failRun = (record, error, cancelled) => {
  for (const step of record.steps) if (step.status === 'pending' || step.status === 'running') step.status = cancelled ? 'cancelled' : 'not-run';
  record.status = cancelled ? 'cancelled' : 'fail';
  record.summary = error.message.split('\n')[0];
};

const openSession = ({ ctx, request, runId }) => {
  const { project, plan } = request;
  const file = recordFile(project, runId);
  const record = newRecord({ runId, request, main: ctx.rootDir });
  record.steps = plan.map((step, index) => stepRecord(step, { project, runId, index }));
  const save = () => writeRecord(file, record);
  save();
  for (const step of record.steps) if (step.status === 'skipped-local') writeFileSync(step.log, `${step.note}\n`);
  const control = { cancelled: false, child: null };
  const onSignal = () => {
    control.cancelled = true;
    if (control.child) stopTree(control.child);
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
  return { file, record, plan, save, control, onSignal, release: null, path: null };
};

const execute = async ({ ctx, request, runId, session }) => {
  const { record, save, control } = session;
  const queuedBehind = (other) => ctx.log(`Queued behind ${other?.runId ?? 'another run'}.`);
  session.release = await acquireRunLock({ project: request.project, runId, timeoutMs: request.waitMs, cancelled: () => control.cancelled, onWait: queuedBehind });
  record.status = 'running';
  record.startedAt = now();
  save();
  if (record.steps.some((step) => step.status === 'pending')) {
    session.path = addCiWorktree({ main: ctx.rootDir, worktreesDir: ctx.workspace.worktreesDir, runId, sha: request.sha });
    for (const [index, step] of record.steps.entries()) step.cwd = resolve(session.path, session.plan[index].workdir ?? '');
    save();
    await runSteps({ session, log: ctx.log });
  }
  record.status = finishedWith(record);
  record.summary = summarize(record);
};

const closeSession = async ({ ctx, session }) => {
  const { record, save, path } = session;
  record.finishedAt = now();
  save();
  process.off('SIGINT', session.onSignal);
  process.off('SIGTERM', session.onSignal);
  if (path) {
    const kept = await dropCiWorktree({ path, main: ctx.rootDir, log: ctx.log });
    if (kept) {
      record.summary = `${record.summary} ${kept}`;
      save();
    }
  }
  session.release?.();
};

/**
 * @param {{ ctx: import('../workspace/workspace.type.mjs').ThreadContext, request: object, runId: string, announce: (file: string) => void }} job
 * @returns {Promise<number>} 0 pass or skipped-local, 1 fail or cancelled
 */
const runCi = async ({ ctx, request, runId, announce }) => {
  const session = openSession({ ctx, request, runId });
  announce(session.file);
  try {
    await execute({ ctx, request, runId, session });
  } catch (error) {
    failRun(session.record, error, session.control.cancelled);
  } finally {
    await closeSession({ ctx, session });
  }
  return session.record.status === 'pass' || session.record.status === 'skipped-local' ? 0 : 1;
};

export { runCi };
