/* @layer tooling-scripts @kind logic */
import { statSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { CARGO_ENV } from './cargo.constants.mjs';

const NAMES = process.platform === 'win32' ? ['cargo.exe', 'cargo.com'] : ['cargo'];
const SCRIPT = /\.[cm]?js$/;

const isFile = (path) => {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
};

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string[] | null} the command: BROCK_CARGO, else cargo on PATH, else null
 */
const findCargo = (env = process.env) => {
  const named = env[CARGO_ENV];
  if (named) return SCRIPT.test(named) ? [process.execPath, named] : [named];
  const dirs = (env.PATH ?? env.Path ?? '').split(delimiter).filter(Boolean);
  const found = dirs.flatMap((dir) => NAMES.map((name) => join(dir, name))).find(isFile);
  return found ? [found] : null;
};

export { findCargo };
