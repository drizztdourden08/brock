/* @layer electron-main @kind logic */
import { spawn } from 'child_process';
import type { ChildProcess } from 'child_process';
import type { JobHandle } from '@drizztdourden08/brock-core/jobs';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { attachOutput } from './attach-output';
import { buildProcessEnv } from './build-process-env';
import { cleanLine } from './clean-line';
import { killProcessTree } from './kill-process-tree';
import { exitOutcome } from './exit-outcome';
import { PROCESS_GRACE_MS, PROCESS_LINE_MAX_CHARS, PROCESS_TAIL_LINES } from './process-job.constants';
import type { ProcessRunInput, ProcessSpec, ProcessStream } from './process-job.type';
import { reportProgress } from './report-progress';
import { settleJob } from './settle-job';
import { spawnFailure } from './spawn-failure';
import { watchCancel } from './watch-cancel';

const startChild = (spec: ProcessSpec): ChildProcess =>
  spawn(spec.command, [...spec.args], {
    cwd: spec.cwd,
    env: buildProcessEnv(process.env, spec.env),
    shell: false,
    windowsHide: true,
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

const lineHandler = (job: JobHandle, options: ProcessRunInput, tail: string[]) => (stream: ProcessStream, raw: string): void => {
  const line = cleanLine(raw, PROCESS_LINE_MAX_CHARS);
  if (!line) return;
  tail.push(line);
  if (tail.length > PROCESS_TAIL_LINES) tail.shift();
  job.log(line, stream === 'stderr' ? 'warn' : 'info');
  reportProgress(job, options.progress, line, stream);
};

const launch = (child: ChildProcess, job: JobHandle, options: ProcessRunInput, resolve: (outcome: ProcessJobOutcome) => void): void => {
  const tail: string[] = [];
  const cleanups: (() => void)[] = [];
  let finished = false;
  const finish = (outcome: ProcessJobOutcome): void => {
    if (finished) return;
    finished = true;
    for (const cleanup of cleanups) cleanup();
    settleJob(job, outcome);
    resolve(outcome);
  };
  const giveUp = (): void => finish({ status: 'cancelled', exitCode: null, tail });
  const graceMs = options.cancel?.graceMs ?? PROCESS_GRACE_MS;
  cleanups.push(watchCancel({ pid: child.pid, signal: job.signal, graceMs, giveUp }));
  const untrack = options.track?.(() => killProcessTree(child.pid, true));
  if (untrack) cleanups.push(untrack);
  cleanups.push(attachOutput(child, lineHandler(job, options, tail)));
  child.on('error', (error) => finish(spawnFailure(options, error, tail)));
  child.once('close', (code, signal) => finish(exitOutcome(options, { code, signal, cancelled: job.signal.aborted, tail })));
};

const runProcess = (job: JobHandle, spec: ProcessSpec, options: ProcessRunInput): Promise<ProcessJobOutcome> =>
  new Promise((resolve) => {
    if (options.elevate === 'installer') job.log('This installer may show its own system prompt.');
    let child: ChildProcess;
    try {
      child = startChild(spec);
    } catch (error) {
      const outcome = spawnFailure(options, error, []);
      settleJob(job, outcome);
      resolve(outcome);
      return;
    }
    launch(child, job, options, resolve);
  });

export { runProcess };
