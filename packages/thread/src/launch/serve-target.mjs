/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const IS_WINDOWS = process.platform === 'win32';
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

const quoteArg = (arg) => (/^[\w./:@^~=+-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`);

const binDirs = (worktree, dir) => {
  const root = resolve(worktree.path);
  const dirs = [];
  for (let current = resolve(dir); current.startsWith(root); current = dirname(current)) {
    dirs.push(join(current, 'node_modules', '.bin'));
    if (current === root) break;
  }
  return dirs;
};

const binPath = (worktree, dir, name) => {
  const fileName = IS_WINDOWS ? `${name}.cmd` : name;
  const found = binDirs(worktree, dir).map((binDir) => join(binDir, fileName)).find(existsSync);
  if (!found) {
    throw new Error(`"${name}" is not installed in "${worktree.name}" (no node_modules/.bin/${fileName} between ${dir} and the worktree root). Run: ${worktree.workspace.name} worktree create ${worktree.name}`);
  }
  return found;
};

const withPort = (args, port) => {
  if (port === undefined || args.some((arg) => arg.startsWith('--port'))) return args;
  return [...args, '--port', String(port)];
};

const spawnPiped = (file, args, cwd, port) => {
  const env = port === undefined ? process.env : { ...process.env, PORT: String(port) };
  const stdio = ['ignore', 'pipe', 'pipe'];
  if (IS_WINDOWS) return spawn([file, ...args].map(quoteArg).join(' '), { cwd, env, stdio, shell: true });
  return spawn(file, args, { cwd, env, stdio });
};

const announceReady = (child, ready, log) => {
  let announced = false;
  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
    if (announced) return;
    const match = String(chunk).replace(ANSI, '').match(ready);
    if (!match) return;
    announced = true;
    log(`Serving at ${match[0]}`);
  });
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));
};

/**
 * @param {{ command: string[], port?: number, ready?: RegExp, cwd?: string }} options
 * @returns {import('../workspace/workspace.type.mjs').LaunchTarget}
 */
const serveTarget = ({ command, port, ready = /https?:\/\/\S+/, cwd = '.' }) => {
  if (!Array.isArray(command) || command.length === 0) throw new Error('serveTarget: "command" must be a non-empty array, like ["vite", "dev"].');
  const [binName, ...commandArgs] = command;
  const notReady = (worktree) => {
    const installed = binDirs(worktree, resolve(worktree.path, cwd)).some((binDir) => existsSync(dirname(binDir)));
    return installed ? null : `"${worktree.name}" has no node_modules. Run: ${worktree.workspace.name} worktree create ${worktree.name}`;
  };
  const launch = ({ worktree, passthrough }) => {
    const args = withPort([...commandArgs, ...passthrough], port);
    const dir = resolve(worktree.path, cwd);
    worktree.log(`${dir}> ${binName} ${args.join(' ')}`);
    const child = spawnPiped(binPath(worktree, dir, binName), args, dir, port);
    announceReady(child, ready, worktree.log);
    return Promise.resolve(child);
  };
  return { kind: 'serve', launch, notReady };
};

export { serveTarget };
