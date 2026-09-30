/* @layer tooling-scripts @kind logic */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { SPLASH_FILE } from '../packaging/packaging.constants.mjs';
import { setupSplashPng } from './setup-splash-png.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {import('./installer-inputs.mjs').InstallerInputs} inputs
 * @returns {string}  the root-relative Setup splash vpk reads
 */
const writeSetupSplash = (rootDir, inputs) => {
  const file = join(rootDir, SPLASH_FILE);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, setupSplashPng(rootDir, inputs).png);
  return SPLASH_FILE;
};

export { writeSetupSplash };
