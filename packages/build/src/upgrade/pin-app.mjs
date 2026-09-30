/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { followBrockPin } from '@drizztdourden08/brock-thread';

/**
 * @param {string} rootDir the app folder
 * @param {string} version pinned when package.json has no brock.version
 * @param {boolean} check reports without writing
 * @returns {string[]} the package.json fields off the pin
 */
const pinApp = (rootDir, version, check) => {
  const file = join(rootDir, 'package.json');
  if (!existsSync(file)) return [];
  const { pkg, changed } = followBrockPin(JSON.parse(readFileSync(file, 'utf8')), version);
  if (changed.length > 0 && !check) writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return changed;
};

export { pinApp };
