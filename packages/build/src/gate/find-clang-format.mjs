/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { VC_TOOLS, VSWHERE } from '../packaging/packaging.constants.mjs';
import { probe } from '../platforms/doctor/probe.mjs';
import { CLANG_FORMAT_ENV, CLANG_FORMAT_PACKAGE, VS_CLANG_FORMAT } from './gate.constants.mjs';

const pinnedCli = (dir) => {
  try {
    const manifest = createRequire(join(dir, 'package.json')).resolve(`${CLANG_FORMAT_PACKAGE}/package.json`);
    const { bin } = JSON.parse(readFileSync(manifest, 'utf8'));
    const cli = typeof bin === 'string' ? bin : bin?.['clang-format'];
    return cli ? join(dirname(manifest), cli) : null;
  } catch {
    return null;
  }
};

/**
 * @param {string[]} dirs the app and the repo root
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string[] | null} the command: BROCK_CLANG_FORMAT, else the pinned package
 */
const findClangFormat = (dirs, env = process.env) => {
  if (env[CLANG_FORMAT_ENV]) return [env[CLANG_FORMAT_ENV]];
  const cli = dirs.map(pinnedCli).find(Boolean);
  return cli ? [process.execPath, cli] : null;
};

/**
 * @returns {string | null} a clang-format of this machine: PATH, then Visual Studio
 */
const systemClangFormat = () => {
  if (probe('clang-format', ['--version']).ok) return 'clang-format';
  if (process.platform !== 'win32' || !existsSync(VSWHERE)) return null;
  const found = probe(VSWHERE, ['-latest', '-products', '*', '-requires', VC_TOOLS, '-property', 'installationPath']);
  const bin = found.ok && found.out ? join(found.out.split(/\r?\n/)[0], ...VS_CLANG_FORMAT) : null;
  return bin && existsSync(bin) ? bin : null;
};

export { findClangFormat, systemClangFormat };
