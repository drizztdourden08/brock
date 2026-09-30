/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { BROCK_SCOPE, BUILD_PACKAGE, DEFAULT_REGISTRY, NPM_TIMEOUT_MS } from './upgrade.constants.mjs';

const onWindows = process.platform === 'win32';

const npm = (args, cwd) =>
  spawnSync(onWindows ? 'npm.cmd' : 'npm', args, { cwd, encoding: 'utf8', timeout: NPM_TIMEOUT_MS, shell: onWindows, stdio: ['ignore', 'pipe', 'pipe'] });

const scopeRegistry = (cwd) => {
  const out = npm(['config', 'get', `${BROCK_SCOPE}:registry`], cwd);
  const value = out.status === 0 ? out.stdout.trim() : '';
  return /^https?:/.test(value) ? value : DEFAULT_REGISTRY;
};

const problemOf = (result) => {
  if (result.error) return result.error.message;
  const lines = `${result.stderr ?? ''}`.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.find((line) => /\b(E[A-Z0-9]+|code)\b/.test(line)) ?? lines[0] ?? `npm exited with ${result.status}`;
};

/**
 * @param {string} cwd the app checkout, whose .npmrc names the registry
 * @returns {{ version: string | null, registry: string, problem: string | null }}
 */
const latestBrock = (cwd) => {
  const registry = scopeRegistry(cwd);
  const result = npm(['view', BUILD_PACKAGE, 'version', `--registry=${registry}`, '--fetch-retries=0'], cwd);
  const version = result.status === 0 ? result.stdout.trim().split(/\s+/).pop() : '';
  if (version && /^\d+\.\d+\.\d+/.test(version)) return { version, registry, problem: null };
  return { version: null, registry, problem: problemOf(result) };
};

export { latestBrock };
