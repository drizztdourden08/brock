/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DRIVER_PACKAGES } from './testing.constants.mjs';

const resolveFrom = (appDir, name) => {
  try {
    return createRequire(join(appDir, 'package.json')).resolve(name);
  } catch {
    return null;
  }
};

/**
 * @param {string} appDir the app root
 * @returns {Promise<{ launch: (options: object) => Promise<any> }>} Playwright's _electron
 */
const loadElectronDriver = async (appDir) => {
  for (const name of DRIVER_PACKAGES) {
    const file = resolveFrom(appDir, name);
    if (!file) continue;
    const loaded = await import(pathToFileURL(file).href);
    const driver = loaded._electron ?? loaded.default?._electron;
    if (driver) return driver;
  }
  throw new Error(`launchAppForTest needs Playwright in the app: pnpm add -D playwright-core (looked for ${DRIVER_PACKAGES.join(', ')}).`);
};

export { loadElectronDriver };
