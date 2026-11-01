/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { appendFileSync, closeSync, mkdtempSync, openSync, rmSync, writeFileSync, writeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { KILL_GRACE_MS, TIMEOUT_CODE } from './ci.constants.mjs';
import { shellSpec } from './shell-spec.mjs';
import { stopTree } from './stop-tree.mjs';
import { watchStep } from './step-watchdog.mjs';

/**
 * @param {string} logFile
 * @param {string} text a line the runner adds to the step's log
 * @returns {void}
 */
const noteInLog = (logFile, text) => appendFileSync(logFile, `\n[brock ci] ${text}\n`);

const launchOf = (command, shell) => {
  if (!shell) return { file: command, args: [], options: { shell: true }, cleanup: () => {} };
  const spec = shellSpec(shell);
  const dir = mkdtempSync(join(tmpdir(), 'brock-ci-'));
  const script = join(dir, `step.${spec.ext}`);
  writeFileSync(script, spec.wrap(command));
  return { file: spec.file, args: spec.args(script), options: { windowsVerbatimArguments: spec.verbatim }, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

/**
 * @param {{ command: string, cwd: string, logFile: string, shell?: string | null, env?: Record<string, string>, timeoutMs?: number, outcome?: { timedOut?: boolean }, onChild?: (child: import('node:child_process').ChildProcess) => void }} request the step to run
 * @returns {Promise<number>} the exit code, 127 when the command could not start, 124 on a timeout
 */
const runStep = ({ command, cwd, logFile, shell = null, env = {}, timeoutMs = 0, outcome = {}, onChild = () => {} }) => new Promise((resolve) => {
  const fd = openSync(logFile, 'w');
  writeSync(fd, `$ ${command}\n(cwd ${cwd}${shell ? `, shell ${shell}` : ''})\n\n`);
  const launch = launchOf(command, shell);
  let finished = false;
  let watch = null;
  const finish = (code) => {
    if (finished) return;
    finished = true;
    watch?.cancel();
    closeSync(fd);
    launch.cleanup();
    resolve(outcome.timedOut ? TIMEOUT_CODE : code);
  };
  const child = spawn(launch.file, launch.args, { cwd, stdio: ['ignore', fd, fd], env: { ...process.env, ...env }, windowsHide: true, ...launch.options });
  onChild(child);
  if (timeoutMs > 0) {
    const onTimeout = () => {
      outcome.timedOut = true;
      writeSync(fd, `\n[brock ci] timed out after ${Math.round(timeoutMs / 60000)} minute(s); stopping pid ${child.pid} and its tree\n`);
      setTimeout(() => finish(TIMEOUT_CODE), KILL_GRACE_MS).unref();
    };
    watch = watchStep({ child, timeoutMs, stop: stopTree, onTimeout });
  }
  child.on('error', (error) => {
    writeSync(fd, `${error.message}\n`);
    finish(127);
  });
  child.on('close', (code, signal) => finish(code ?? (signal ? 143 : 1)));
});

export { noteInLog, runStep };
