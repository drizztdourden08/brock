/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { SCRIPTS_DIR, SSH_OPTIONS } from './linux.constants.mjs';

/**
 * @typedef {object} RemoteTarget
 * @property {string} target user@host
 * @property {string[]} ssh the options before the target for ssh
 * @property {string[]} scp the options for scp
 */

/**
 * @param {string} word
 * @returns {string} the word as one POSIX shell word
 */
const shellQuote = (word) => (/^[\w./:=@+-]+$/.test(word) ? word : `'${word.replace(/'/g, `'\\''`)}'`);

/**
 * @param {{ host: string, user: string, port: number | null }} machine
 * @param {string | null} key the private key to use, else the agent and default keys
 * @returns {RemoteTarget} key-only, never a password prompt
 */
const remoteTarget = (machine, key) => {
  const identity = key ? ['-i', key] : [];
  return {
    target: `${machine.user}@${machine.host}`,
    ssh: [...(machine.port ? ['-p', String(machine.port)] : []), ...identity, ...SSH_OPTIONS],
    scp: [...(machine.port ? ['-P', String(machine.port)] : []), ...identity, ...SSH_OPTIONS],
  };
};

/**
 * @param {string} name a file in scripts/
 * @returns {string}
 */
const scriptText = (name) => readFileSync(new URL(name, SCRIPTS_DIR), 'utf8').replace(/\r\n/g, '\n');

/**
 * @param {string[]} args
 * @returns {string} runs the script piped on stdin
 */
const bashStdin = (args) => ['bash', '-s', '--', ...args.map(shellQuote)].join(' ');

/**
 * @param {RemoteTarget} remote
 * @param {string} script a file in scripts/
 * @param {string[]} args
 */
const runRemoteScript = (remote, script, args) => {
  execFileSync('ssh', [...remote.ssh, remote.target, bashStdin(args)], { input: scriptText(script), stdio: ['pipe', 'inherit', 'inherit'] });
};

/**
 * @param {RemoteTarget} remote
 * @param {string} command one shell line
 * @returns {string} its output; throws when it fails
 */
const remoteCapture = (remote, command) => execFileSync('ssh', ['-n', ...remote.ssh, remote.target, command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

/**
 * @param {RemoteTarget} remote
 * @param {string} from a host file
 * @param {string} to a path under the VM user's home
 */
const copyTo = (remote, from, to) => {
  execFileSync('scp', [...remote.scp, from, `${remote.target}:${to}`], { stdio: 'inherit' });
};

export { shellQuote, remoteTarget, scriptText, bashStdin, runRemoteScript, remoteCapture, copyTo };
