/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { VC_TOOLS, VSWHERE } from '../packaging/packaging.constants.mjs';
import { probe } from '../platforms/doctor/probe.mjs';
import { CLANG_FORMAT_ENV, VS_CLANG_FORMAT } from './gate.constants.mjs';

const onWindows = process.platform === 'win32';

const localBin = (dirs) => dirs
  .map((dir) => join(dir, 'node_modules', '.bin', onWindows ? 'clang-format.cmd' : 'clang-format'))
  .find((bin) => existsSync(bin));

const visualStudioBin = () => {
  if (!onWindows || !existsSync(VSWHERE)) return undefined;
  const found = probe(VSWHERE, ['-latest', '-products', '*', '-requires', VC_TOOLS, '-property', 'installationPath']);
  const bin = found.ok && found.out ? join(found.out.split(/\r?\n/)[0], ...VS_CLANG_FORMAT) : null;
  return bin && existsSync(bin) ? bin : undefined;
};

/**
 * @param {string[]} dirs folders whose node_modules/.bin may hold one
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string | null} env, local bin, PATH, then Visual Studio
 */
const findClangFormat = (dirs, env = process.env) => {
  if (env[CLANG_FORMAT_ENV]) return env[CLANG_FORMAT_ENV];
  const local = localBin(dirs);
  if (local) return local;
  if (probe('clang-format', ['--version']).ok) return 'clang-format';
  return visualStudioBin() ?? null;
};

export { findClangFormat };
