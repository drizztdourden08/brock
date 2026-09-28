/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

/**
 * @param {string} rootDir
 * @param {string} packageName
 * @param {string} [binName] Defaults to the package name
 */
const resolveBin = (rootDir, packageName, binName = packageName) => {
  const require = createRequire(join(rootDir, 'package.json'));
  const pkgFile = require.resolve(`${packageName}/package.json`);
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
  const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[binName];
  if (!bin) throw new Error(`${packageName} has no bin named ${binName}`);
  return join(dirname(pkgFile), bin);
};

/**
 * @param {string} rootDir
 */
const resolveElectronBinary = (rootDir) => {
  const require = createRequire(join(rootDir, 'package.json'));
  const resolved = require('electron');
  if (typeof resolved !== 'string') throw new Error('electron did not resolve to a binary path');
  return resolved;
};

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ cwd: string, env?: NodeJS.ProcessEnv, shell?: boolean}} opts
 * @returns {Promise<number>}
 */
const quoteArg = (arg) => (/^[\w./:@^~=+-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`);

const runInherit = (command, args, opts) =>
  new Promise((resolve, reject) => {
    const shell = opts.shell ?? false;
    const child = shell
      ? spawn([command, ...args.map(quoteArg)].join(' '), { cwd: opts.cwd, env: opts.env ?? process.env, stdio: 'inherit', shell: true })
      : spawn(command, args, { cwd: opts.cwd, env: opts.env ?? process.env, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });

/**
 * @param {string} rootDir
 * @param {string} packageName
 * @param {string[]} args
 */
const runBin = (rootDir, packageName, args) => runInherit(process.execPath, [resolveBin(rootDir, packageName), ...args], { cwd: rootDir });

/**
 * @param {string} rootDir
 * @param {string[]} args
 */
const runPnpm = (rootDir, args) => {
  const isWindows = process.platform === 'win32';
  return runInherit(isWindows ? 'pnpm.cmd' : 'pnpm', args, { cwd: rootDir, shell: isWindows });
};

export { resolveBin, resolveElectronBinary, runInherit, runBin, runPnpm };
