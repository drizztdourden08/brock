/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const forwardSlashes = (path) => path.replace(/\\/g, '/');

const tarIsGnu = () => {
  try {
    return /GNU tar/i.test(execFileSync('tar', ['--version'], { windowsHide: true, encoding: 'utf8' }));
  } catch {
    return false;
  }
};

/**
 * @param {string} archive a .tar.gz
 * @param {string} destination
 * @returns {boolean} whether tar unpacked it
 */
const extractArchive = (archive, destination) => {
  mkdirSync(destination, { recursive: true });
  const localFlag = tarIsGnu() ? ['--force-local'] : [];
  try {
    execFileSync('tar', [...localFlag, '-xf', forwardSlashes(archive), '-C', forwardSlashes(destination)], { windowsHide: true, stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
};

export { extractArchive };
