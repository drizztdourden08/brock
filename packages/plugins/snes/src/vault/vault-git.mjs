/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';

/**
 * @param {string[]} args
 * @param {string} cwd
 * @param {Record<string, string>} [env] extra environment variables
 * @returns {string}
 */
const vaultGit = (args, cwd, env) => execFileSync('git', args, {
  cwd,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  maxBuffer: 64 * 1024 * 1024,
  env: env ? { ...process.env, ...env } : process.env,
}).trim();

export { vaultGit };
