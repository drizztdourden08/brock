/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const THREAD_NAME = '@drizztdourden08/brock-thread';

const manifestOf = (dir) => JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));

const packageDirOf = (file) => {
  for (let dir = dirname(file); ; dir = dirname(dir)) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    if (dirname(dir) === dir) return null;
  }
};

const threadDirOf = (packageDir) => {
  if (manifestOf(packageDir).name === THREAD_NAME) return packageDir;
  try {
    return packageDirOf(createRequire(join(packageDir, 'package.json')).resolve(THREAD_NAME));
  } catch {
    return null;
  }
};

/**
 * @typedef {object} RunnerPackage
 * @property {string} label the package name and version
 * @property {boolean} hasLocalMode whether the thread code beside it knows the local remote mode
 */

/**
 * @param {string} bin a bin file of brock-build or brock-thread
 * @returns {RunnerPackage}
 */
const runnerPackage = (bin) => {
  const packageDir = dirname(dirname(bin));
  const { name, version } = manifestOf(packageDir);
  const threadDir = threadDirOf(packageDir);
  const hasLocalMode = threadDir !== null && existsSync(join(threadDir, 'src', 'local', 'remote-mode.mjs'));
  return { label: `${name.split('/').pop()} ${version}`, hasLocalMode };
};

export { runnerPackage };
