/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { BROCK_SCOPE, DEFAULT_REGISTRY, NPM_TIMEOUT_MS } from './upgrade.constants.mjs';

const onWindows = process.platform === 'win32';

const npm = (args, cwd) =>
  spawnSync(onWindows ? 'npm.cmd' : 'npm', args, { cwd, encoding: 'utf8', timeout: NPM_TIMEOUT_MS, shell: onWindows, stdio: ['ignore', 'pipe', 'pipe'] });

const scopeRegistry = (cwd) => {
  const out = npm(['config', 'get', `${BROCK_SCOPE}:registry`], cwd);
  const value = out.status === 0 ? out.stdout.trim() : '';
  return /^https?:/.test(value) ? value : DEFAULT_REGISTRY;
};

export { npm, scopeRegistry };
