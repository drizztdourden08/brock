/* @layer tooling-scripts @kind logic */
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { INSTALL_RECORDS } from './freshness.constants.mjs';

const recordIn = (dir) => INSTALL_RECORDS.map((rel) => join(dir, rel)).find((file) => existsSync(file));

/**
 * @param {string} appDir
 * @returns {number} when the nearest install record changed, 0 when there is none
 */
const installChangedAt = (appDir) => {
  const root = findWorkspaceRoot(appDir) ?? appDir;
  for (let dir = appDir; ; dir = dirname(dir)) {
    const record = recordIn(dir);
    if (record) return statSync(record).mtimeMs;
    if (dir === root || dirname(dir) === dir) return 0;
  }
};

export { installChangedAt };
