/* @layer tooling-scripts @kind logic */
import { writeFileSync } from 'node:fs';
import { newRecord, stepRecord } from './record-shape.mjs';
import { writeRecord } from './check-record.mjs';
import { recordFile } from './ci-paths.mjs';
import { addCiWorktree, dropCiWorktree } from './ci-worktree.mjs';
import { OFFLINE_NOTE } from './ci.constants.mjs';
import { acquireRunLock } from './run-lock.mjs';
import { noteInLog, runStep, stopTree } from './run-step.mjs';
import { summarize } from './summarize.mjs';

const now = () => new Date().toISOString();

const finishedWith = (record) => {
  if (record.steps.some((step) => step.status === 'cancelled')) return 'cancelled';
  if (record.steps.some((step) => step.status === 'fail')) return 'fail';
  return record.steps.some((step) => step.status === 'pass') ? 'pass' : 'skipped-local';
};

const stepStatus = (code, cancelled) => {
  if (cancelled) return 'cancelled';
  return code === 0 ? 'pass' : 'fail';
};

const runOne = async ({ step, cwd, control, save, log }) => {
  step.status = 'running';
  step.startedAt = now();
  save();
  const started = Date.now();
  const code = await runStep({ command: step.command, cwd, logFile: step.log, onChild: (child) => { control.child = child; } });
  control.child = null;
  step.exitCode = code;
  step.durationMs = Date.now() - started;
  step.status = stepStatus(code, control.cancelled);
  if (step.status === 'fail' && step.name === 'install') {
    step.note = OFFLINE_NOTE;
    noteInLog(step.log, OFFLINE_NOTE);
  }
  save();
  log(`${step.name}: ${step.status} (${(step.durationMs / 1000).toFixed(1)}s, exit ${code})`);
};

const runSteps = async ({ record, cwd, control, save, log }) => {
  let stopped = null;
  for (const step of record.steps) {
    if (step.status !== 'pending') continue;
    if (control.cancelled) step.status = 'cancelled';
    else if (stopped) step.status = 'not-run';
    else {
      await runOne({ step, cwd, control, save, log });
      if (step.status !== 'pass') stopped = step;
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
  return { file, record, save, control, onSignal, release: null, path: null };
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
    for (const step of record.steps) step.cwd = session.path;
    save();
    await runSteps({ record, cwd: session.path, control, save, log: ctx.log });
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
