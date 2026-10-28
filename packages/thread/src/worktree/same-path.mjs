/* @layer tooling-scripts @kind logic */
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';

const canonical = (path) => {
  let real = resolve(path);
  try {
    real = realpathSync.native(real);
  } catch {
    real = resolve(path);
  }
  const slashed = real.replace(/\\/g, '/').replace(/\/+$/, '');
  return process.platform === 'win32' ? slashed.toLowerCase() : slashed;
};

/**
 * @param {string} a
 * @param {string} b
 * @returns {boolean} true when both name one folder
 */
const samePath = (a, b) => canonical(a) === canonical(b);

export { samePath };
