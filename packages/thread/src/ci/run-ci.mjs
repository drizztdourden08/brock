/* @layer tooling-scripts @kind logic */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { copyArtifact } from './artifact-copy.mjs';
import { newRecord, stepRecord } from './record-shape.mjs';
import { readRecords, writeRecord } from './check-record.mjs';
import { artifactDir, recordFile } from './ci-paths.mjs';
import { addCiWorktree, dropCiWorktree, isInsideWorktree } from './ci-worktree.mjs';
import { releaseLocalpkg, useLocalpkg } from './localpkg-worktree.mjs';
import { watchMainCheckout } from './main-guard.mjs';
import { acquireRunLock } from './run-lock.mjs';
import { finishedWith } from './run-status.mjs';
import { noteInLog } from './run-step.mjs';
import { spawnStep } from './step-spawn.mjs';
import { runBudgetMs } from './step-timeouts.mjs';
import { stopTree } from './stop-tree.mjs';
import { summarize } from './summarize.mjs';
import { applyCache } from './tree-cache.mjs';

const now = () => new Date().toISOString();

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

const runOne = async ({ step, planned, session, log }) => {
  step.status = 'running';
  step.startedAt = now();
  session.save();
  const started = Date.now();
  if (planned.noop) {
    writeFileSync(step.log, `${step.command}\n`);
    settle(step, { pass: true, code: 0, note: planned.noop });
  } else if (!isInsideWorktree(session.path, step.cwd)) {
    writeFileSync(step.log, `${step.command}\n`);
    settle(step, { pass: false, code: 1, note: `The working directory ${step.cwd} is outside the temporary worktree ${session.path}, so the step was not run.` });
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
  record.steps = plan.map((step, index) => stepRecord(step, { project, runId, index, local: request.localpkg }));
  const save = () => writeRecord(file, record);
  const reused = request.cache && request.tree ? applyCache(record, plan, readRecords(project)) : 0;
  save();
  for (const step of record.steps) if (step.status === 'skipped-local' || step.cachedFrom) writeFileSync(step.log, `${step.note}\n`);
  const control = { cancelled: false, child: null };
  const onSignal = () => {
    control.cancelled = true;
    if (control.child) stopTree(control.child);
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
  return { file, record, plan, save, control, onSignal, reused, timeouts: request.timeouts ?? {}, release: null, path: null, temporary: false, lost: null, localpkg: request.localpkg ?? null };
};

const lockFor = async ({ ctx, request, runId, session }) => {
  const { record, control } = session;
  const todo = session.plan.filter((_, index) => record.steps[index].status === 'pending');
  const hung = (holder) => ctx.log(`The run ${holder?.runId} is past its own timeout, so it is treated as hung and stopped (pid ${holder?.pid}).`);
  const queued = (other) => ctx.log(`Queued behind ${other?.runId ?? 'another run'}.`);
  const budgetMs = runBudgetMs(todo, { overrides: session.timeouts, trigger: record.trigger });
  return acquireRunLock({ project: request.project, runId, timeoutMs: request.waitMs, budgetMs, cancelled: () => control.cancelled, onWait: queued, onHung: hung });
};

const execute = async ({ ctx, request, runId, session }) => {
  const { record, save } = session;
  const pending = record.steps.some((step) => step.status === 'pending');
  if (pending) session.release = await lockFor({ ctx, request, runId, session });
  else if (session.reused) ctx.log(`Nothing to run: ${session.reused} step(s) already passed for this tree.`);
  record.status = 'running';
  record.startedAt = now();
  save();
  if (pending) {
    session.lost = watchMainCheckout(ctx.rootDir);
    session.path = request.here ?? addCiWorktree({ main: ctx.rootDir, runId, sha: request.sha });
    session.temporary = !request.here;
    if (session.localpkg) useLocalpkg({ localpkg: session.localpkg, path: session.path });
    for (const [index, step] of record.steps.entries()) step.cwd = resolve(session.path, session.plan[index].workdir ?? '');
    save();
    await runSteps({ session, log: ctx.log });
  }
  record.status = finishedWith(record);
  record.summary = summarize(record);
};

const noteLoss = (session, log) => {
  const lost = session.lost?.();
  if (!lost) return;
  session.record.status = 'fail';
  session.record.summary = `${lost} ${session.record.summary}`;
  session.save();
  log(lost);
};

const closeSession = async ({ ctx, session }) => {
  const { record, save } = session;
  const path = session.temporary ? session.path : null;
  record.finishedAt = now();
  save();
  process.off('SIGINT', session.onSignal);
  process.off('SIGTERM', session.onSignal);
  if (path) {
    if (session.localpkg) releaseLocalpkg({ localpkg: session.localpkg, path, log: ctx.log });
    const kept = await dropCiWorktree({ path, main: ctx.rootDir, log: ctx.log });
    if (kept) {
      record.summary = `${record.summary} ${kept}`;
      save();
    }
  }
  noteLoss(session, ctx.log);
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
