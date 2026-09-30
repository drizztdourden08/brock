/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { PROBE_TIMEOUT_MS } from './doctor.constants.mjs';

const quote = (arg) => (/^[\w./:;@=+-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`);

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {{ ok: boolean, out: string }} stdout and stderr together
 */
const probe = (command, args) => {
  const options = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: PROBE_TIMEOUT_MS };
  const result = process.platform === 'win32'
    ? spawnSync([command, ...args].map(quote).join(' '), { ...options, shell: true })
    : spawnSync(command, args, options);
  return { ok: result.status === 0, out: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
};

export { probe };
