/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { delimiter } from 'node:path';
import { bundledCmakeDir } from './bundled-cmake-dir.mjs';

const cmakeOnPath = () => {
  try {
    execFileSync('cmake', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

/**
 * @returns {NodeJS.ProcessEnv | null} an env that reaches cmake, or null
 */
const cmakeEnv = () => {
  if (cmakeOnPath()) return process.env;
  const bundled = bundledCmakeDir();
  return bundled ? { ...process.env, PATH: `${bundled}${delimiter}${process.env.PATH ?? ''}` } : null;
};

export { cmakeEnv };
