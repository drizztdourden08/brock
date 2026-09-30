/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { BUILD_PACKAGE } from './upgrade.constants.mjs';

const onWindows = process.platform === 'win32';

const quote = (arg) => (/^[\w@:/.=+-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`);

const pnpm = (dir, args) => {
  const result = onWindows
    ? spawnSync(['pnpm', ...args].map(quote).join(' '), { cwd: dir, stdio: 'inherit', shell: true })
    : spawnSync('pnpm', args, { cwd: dir, stdio: 'inherit' });
  return result.status ?? 1;
};

const node = (dir, args) => spawnSync(process.execPath, args, { cwd: dir, stdio: 'inherit' }).status ?? 1;

const brockBin = (dir) => join(dir, 'node_modules', ...BUILD_PACKAGE.split('/'), 'bin', 'brock.mjs');

const brock = (dir, args) => node(dir, [brockBin(dir), ...args]);

const runIn = Object.freeze({ pnpm, brock });

export { runIn };
