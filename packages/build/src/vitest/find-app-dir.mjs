/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { workspaceDirs } from '../workspace-dirs.mjs';
import { DEPENDENCY_FIELDS, REACT_PACKAGE } from './vitest.constants.mjs';

const usesBrockReact = (dir) => {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) return false;
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  return DEPENDENCY_FIELDS.some((field) => Boolean(pkg[field]?.[REACT_PACKAGE]));
};

/**
 * @param {string} rootDir the folder holding vitest.config.ts
 * @param {string} [appDir] the app folder, relative to rootDir or absolute
 * @returns {string} the app folder to take shared packages from
 */
const findAppDir = (rootDir, appDir) => {
  if (appDir) return resolve(rootDir, appDir);
  if (existsSync(join(rootDir, CONFIG_FILE))) return rootDir;
  const members = workspaceDirs(rootDir).filter(usesBrockReact);
  return members.find((dir) => existsSync(join(dir, CONFIG_FILE))) ?? members[0] ?? rootDir;
};

export { findAppDir };
