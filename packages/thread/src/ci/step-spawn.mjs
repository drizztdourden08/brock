/* @layer tooling-scripts @kind logic */
import { tmpdir } from 'node:os';
import { OFFLINE_NOTE } from './ci.constants.mjs';
import { noteInLog, runStep } from './run-step.mjs';
import { stepStatus } from './run-status.mjs';
import { timeoutMs } from './step-timeouts.mjs';
import { eventNameOf } from './workflow-expr.mjs';

const RUNNER_OS = Object.freeze({ win32: 'Windows', linux: 'Linux', darwin: 'macOS' });

const workflowEnv = (planned, { root, record }) => ({
  GITHUB_WORKSPACE: root.replace(/\/g, '/'),
  GITHUB_EVENT_NAME: eventNameOf(record.trigger),
  RUNNER_OS: RUNNER_OS[process.platform] ?? process.platform,
  RUNNER_TEMP: tmpdir(),
  ...planned.env,
});

const noteOf = (step, outcome, limitMs) => {
  if (outcome.timedOut) return `Timed out after ${Math.round(limitMs / 60000)} minute(s). The process tree was stopped.`;
  return step.status === 'fail' && step.name === 'install' ? OFFLINE_NOTE : null;
};

/**
 * @param {object} step the record's step
 * @param {object} planned the planned step
 * @param {{ control: { cancelled: boolean, child: object | null }, record: object, path: string, timeouts: object }} session
 * @returns {Promise<void>}
 */
const spawnStep = async (step, planned, session) => {
  const { control, record } = session;
  const outcome = { timedOut: false };
  const limitMs = timeoutMs(planned.name, { overrides: session.timeouts, trigger: record.trigger });
  const code = await runStep({
    command: step.command,
    cwd: step.cwd,
    logFile: step.log,
    shell: planned.shell ?? null,
    env: { ...(planned.env ? workflowEnv(planned, { root: session.path, record }) : {}), ...(planned.stepEnv ?? {}) },
    timeoutMs: limitMs,
    outcome,
    onChild: (child) => { control.child = child; },
  });
  control.child = null;
  step.exitCode = code;
  step.status = stepStatus(code, { cancelled: control.cancelled, timedOut: outcome.timedOut });
  const note = noteOf(step, outcome, limitMs);
  if (note) {
    step.note = note;
    noteInLog(step.log, note);
  }
};

export { spawnStep };
