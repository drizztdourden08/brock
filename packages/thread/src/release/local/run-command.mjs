/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';

const WINDOWS = process.platform === 'win32';
const MAX_OUTPUT = 64 * 1024 * 1024;

const quote = (arg) => (/[\s"&|<>^%]/.test(arg) ? `"${arg.replace(/"/g, '\\"')}"` : arg);

/**
 * @param {string} command run through the shell on Windows
 * @param {string[]} args
 * @param {{ cwd: string, env?: Record<string, string> }} where
 * @returns {string} what the command printed
 */
const runCommand = (command, args, { cwd, env = {} }) =>
  execFileSync(command, WINDOWS ? args.map(quote) : args, {
    windowsHide: true,
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: MAX_OUTPUT,
    shell: WINDOWS,
  });

export { runCommand };
