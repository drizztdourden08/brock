/* @layer tooling-scripts @kind logic */
import { execFileSync, spawn } from 'node:child_process';
import { appendFileSync, closeSync, mkdtempSync, openSync, rmSync, writeFileSync, writeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { shellSpec } from './shell-spec.mjs';

/**
 * @param {import('node:child_process').ChildProcess} child
 * @returns {void}
 */
const stopTree = (child) => {
  if (!child.pid) return;
  try {
    if (process.platform === 'win32') execFileSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else child.kill('SIGTERM');
  } catch {
    child.kill();
  }
};

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
 * @param {{ command: string, cwd: string, logFile: string, shell?: string | null, env?: Record<string, string>, onChild?: (child: import('node:child_process').ChildProcess) => void }} request
 * @returns {Promise<number>} the exit code, 127 when the command could not start
 */
const runStep = ({ command, cwd, logFile, shell = null, env = {}, onChild = () => {} }) => new Promise((resolve) => {
  const fd = openSync(logFile, 'w');
  writeSync(fd, `$ ${command}\n(cwd ${cwd}${shell ? `, shell ${shell}` : ''})\n\n`);
  const launch = launchOf(command, shell);
  let finished = false;
  const finish = (code) => {
    if (finished) return;
    finished = true;
    closeSync(fd);
    launch.cleanup();
    resolve(code);
  };
  const child = spawn(launch.file, launch.args, { cwd, stdio: ['ignore', fd, fd], env: { ...process.env, CI: '1', ...env }, windowsHide: true, ...launch.options });
  onChild(child);
  child.on('error', (error) => {
    writeSync(fd, `${error.message}\n`);
    finish(127);
  });
  child.on('close', (code, signal) => finish(code ?? (signal ? 143 : 1)));
});

export { noteInLog, runStep, stopTree };
