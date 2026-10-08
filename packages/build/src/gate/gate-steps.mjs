/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { repoRootOf } from './clang-format-files.mjs';

const scriptsOf = (dir) => {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, 'utf8')).scripts ?? {};
  } catch {
    return {};
  }
};

const scriptStep = (appDir, script) => {
  const dir = [appDir, repoRootOf(appDir)].find((candidate) => scriptsOf(candidate)[script] !== undefined);
  if (!dir) throw new Error(`brock.config.ts gate.scripts: no package.json script "${script}" in the app or the workspace root`);
  const where = relative(appDir, dir).replace(/\\/g, '/');
  return { kind: 'script', name: where ? `pnpm run ${script} (in ${where})` : `pnpm run ${script}`, dir, script };
};

/**
 * @typedef {{ kind: 'clang-format', name: string, entries: string[] } | { kind: 'script', name: string, dir: string, script: string }} GateStep
 */

/**
 * @param {string} appDir the app root
 * @param {{ gate?: { scripts?: string[], clangFormat?: string[] } }} config brock.config.ts
 * @returns {GateStep[]} the C format check, then each script
 */
const gateSteps = (appDir, config) => {
  const entries = config.gate?.clangFormat ?? [];
  return [
    ...(entries.length ? [{ kind: 'clang-format', name: `clang-format --dry-run (${entries.join(', ')})`, entries }] : []),
    ...(config.gate?.scripts ?? []).map((script) => scriptStep(appDir, script)),
  ];
};

export { gateSteps };
