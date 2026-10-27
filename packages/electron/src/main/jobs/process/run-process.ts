/* @layer electron-main @kind logic */
import { spawn } from 'child_process';
import type { ChildProcess } from 'child_process';
import type { JobHandle } from '@drizztdourden08/brock-core/jobs';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { attachOutput } from './attach-output';
import { buildProcessEnv } from './build-process-env';
import { cleanLine } from './clean-line';
import { createStopper } from './create-stopper';
import { exitOutcome } from './exit-outcome';
import { killProcessTree } from './kill-process-tree';
import { openProcessLog } from './open-process-log';
import {
  PROCESS_DETACHED_MESSAGE, PROCESS_EXIT_WAIT_MS, PROCESS_GIVE_UP_MS, PROCESS_GRACE_MS, PROCESS_INSTALLER_GIVE_UP_MS, PROCESS_INSTALLER_GRACE_MS, PROCESS_LINE_MAX_CHARS, PROCESS_TAIL_LINES,
} from './process-job.constants';
import type { ProcessLog, ProcessRunInput, ProcessSpec, ProcessStream } from './process-job.type';
import { redactLine } from './redact-line';
import { reportProgress } from './report-progress';
import { settleJob } from './settle-job';
import { spawnFailure } from './spawn-failure';
import { withLogFile } from './with-log-file';

const startChild = (spec: ProcessSpec): ChildProcess =>
  spawn(spec.command, [...spec.args], {
    cwd: spec.cwd,
    env: buildProcessEnv(process.env, spec.env),
    shell: false,
    windowsHide: true,
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

const lineHandler = (job: JobHandle, options: ProcessRunInput, tail: string[], log: ProcessLog | null) => (stream: ProcessStream, raw: string): void => {
  const cleaned = cleanLine(raw, PROCESS_LINE_MAX_CHARS);
  if (!cleaned) return;
  const line = redactLine(options.redact, cleaned);
  if (options.log !== false) {
    tail.push(line);
    log?.write(line);
    if (tail.length > PROCESS_TAIL_LINES) tail.shift();
    job.log(line, stream === 'stderr' ? 'warn' : 'info');
  }
  reportProgress(job, options.progress, line, stream);
};

const launch = (child: ChildProcess, job: JobHandle, options: ProcessRunInput, resolve: (outcome: ProcessJobOutcome) => void): void => {
  const tail: string[] = [];
  const log = openProcessLog(job.id, options);
  const closers: (() => void)[] = [];
  const exit: { code: number | null; signal: NodeJS.Signals | null } = { code: null, signal: null };
  let finished = false;
  const finish = (outcome: ProcessJobOutcome): void => {
    if (finished) return;
    finished = true;
    for (const close of closers) close();
    const final = withLogFile(outcome, log?.close());
    settleJob(job, final);
    resolve(final);
  };
  const detached: ProcessJobOutcome = { status: 'detached', exitCode: null, tail, error: PROCESS_DETACHED_MESSAGE };
  const installer = options.elevate === 'installer';
  const graceMs = options.cancel?.graceMs ?? (installer ? PROCESS_INSTALLER_GRACE_MS : PROCESS_GRACE_MS);
  const giveUpMs = installer ? PROCESS_INSTALLER_GIVE_UP_MS : PROCESS_GIVE_UP_MS;
  const detach = (): void => {
    child.unref();
    finish(detached);
  };
  const stopper = createStopper({ child, signal: job.signal, graceMs, timeoutMs: options.timeoutMs, giveUpMs, giveUp: detach });
  const untrack = options.track?.(() => void killProcessTree(child, true));
  closers.push(attachOutput(child, lineHandler(job, options, tail, log)));
  const settleExit = (): void => finish(exitOutcome(options, { ...exit, killed: stopper.killed(), timedOut: stopper.timedOut(), tail }));
  child.on('error', (error) => {
    if (child.pid !== undefined) return;
    stopper.dispose();
    untrack?.();
    finish(spawnFailure(options, error, tail));
  });
  child.once('exit', (code, signal) => {
    exit.code = code;
    exit.signal = signal;
    stopper.dispose();
    untrack?.();
    const wait = setTimeout(settleExit, PROCESS_EXIT_WAIT_MS);
    closers.push(() => clearTimeout(wait));
  });
  child.once('close', (code, signal) => {
    exit.code = code;
    exit.signal = signal;
    settleExit();
  });
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
