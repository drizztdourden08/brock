/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';

const run = (cwd, ...args) => String(execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })).trim();

const initRepo = (dir) => {
  for (const args of [['init', '-q', '-b', 'main'], ['config', 'user.name', 't'], ['config', 'user.email', 't@t'], ['add', '.'], ['commit', '-q', '-m', 'init']]) run(dir, ...args);
};

export { initRepo, run };
