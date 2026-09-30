/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';

/**
 * @param {string} file
 * @param {string[]} args
 * @param {{ cwd?: string, shell?: boolean, env?: NodeJS.ProcessEnv }} [opts] shell only matters on Windows
 */
const runStep = (file, args, { cwd, shell = false, env = process.env } = {}) => {
  execFileSync(file, args, { cwd, env, stdio: 'inherit', shell: shell && process.platform === 'win32' });
};

export { runStep };
