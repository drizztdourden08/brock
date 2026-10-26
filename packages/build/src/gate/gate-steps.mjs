/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { cargoRoot } from './cargo-root.mjs';
import { cargoSteps } from './cargo-steps.mjs';
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

const lane = (appDir, config, { env, cargoRoots }) => {
  const root = cargoRoot(appDir, config);
  if (!root || cargoRoots.has(root)) return [];
  cargoRoots.add(root);
  return cargoSteps({ appDir, root, clippyArgs: config.gate?.cargo?.clippyArgs, env });
};

/**
 * @typedef {{ kind: 'clang-format', name: string, entries: string[] } | { kind: 'script', name: string, dir: string, script: string } | { kind: 'rust-comments' | 'cargo-missing', name: string, dir: string } | { kind: 'cargo', name: string, dir: string, command: string[], args: string[], env?: Record<string, string> }} GateStep
 */

/**
 * @param {string} appDir the app root, or the repo root of a repo with no app
 * @param {{ gate?: { scripts?: string[], clangFormat?: string[], cargo?: { enabled?: boolean, path?: string, clippyArgs?: string[] } } }} config brock.config.ts, or the gate of brock.workspace.mjs
 * @param {{ env?: NodeJS.ProcessEnv, cargoRoots?: Set<string> }} [options] cargoRoots: folders whose lane is already there
 * @returns {GateStep[]} the C format check, each script, then the cargo lane
 */
const gateSteps = (appDir, config, { env = process.env, cargoRoots = new Set() } = {}) => {
  const entries = config.gate?.clangFormat ?? [];
  return [
    ...(entries.length ? [{ kind: 'clang-format', name: `clang-format --dry-run (${entries.join(', ')})`, entries }] : []),
    ...(config.gate?.scripts ?? []).map((script) => scriptStep(appDir, script)),
    ...lane(appDir, config, { env, cargoRoots }),
  ];
};

export { gateSteps };
