/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';

const tryGh = (args, cwd) => {
  try {
    return execFileSync('gh', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
};

const ghLoud = (args, cwd) => {
  execFileSync('gh', args, { cwd, stdio: 'inherit' });
};

export { ghLoud, tryGh };
