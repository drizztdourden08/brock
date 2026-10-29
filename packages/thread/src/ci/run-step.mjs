/* @layer tooling-scripts @kind logic */
import { execFileSync, spawn } from 'node:child_process';
import { appendFileSync, closeSync, openSync, writeSync } from 'node:fs';

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

/**
 * @param {{ command: string, cwd: string, logFile: string, onChild?: (child: import('node:child_process').ChildProcess) => void }} request
 * @returns {Promise<number>} the exit code, 127 when the command could not start
 */
const runStep = ({ command, cwd, logFile, onChild = () => {} }) => new Promise((resolve) => {
  const fd = openSync(logFile, 'w');
  writeSync(fd, `$ ${command}\n(cwd ${cwd})\n\n`);
  let finished = false;
  const finish = (code) => {
    if (finished) return;
    finished = true;
    closeSync(fd);
    resolve(code);
  };
  const child = spawn(command, { cwd, shell: true, stdio: ['ignore', fd, fd], env: { ...process.env, CI: '1' }, windowsHide: true });
  onChild(child);
  child.on('error', (error) => {
    writeSync(fd, `${error.message}\n`);
    finish(127);
  });
  child.on('close', (code, signal) => finish(code ?? (signal ? 143 : 1)));
});

export { noteInLog, runStep, stopTree };
