/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { isLocalMode } from './local/remote-mode.mjs';

const LOCAL_MESSAGE = 'gh is not called in local mode (~/.coord/remote.json).';

const tryGh = (args, cwd) => {
  if (isLocalMode()) return null;
  try {
    return execFileSync('gh', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
};

const ghLoud = (args, cwd) => {
  if (isLocalMode()) throw new Error(LOCAL_MESSAGE);
  execFileSync('gh', args, { cwd, stdio: 'inherit' });
};

export { ghLoud, tryGh };
