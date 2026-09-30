/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { keystorePaths } from './keystore-paths.mjs';
import { KEY_ALIAS, SIGNING_ENV } from './mobile.constants.mjs';

/**
 * @param {string} packageId
 * @param {string} command the app's own command, for the hint
 * @returns {NodeJS.ProcessEnv} the environment Gradle signs a release with
 */
const signingEnv = (packageId, command) => {
  if (process.env[SIGNING_ENV.file]) return process.env;
  const paths = keystorePaths(packageId);
  if (!existsSync(paths.keystore) || !existsSync(paths.password)) {
    throw new Error(`No release keystore: set ${SIGNING_ENV.file}, ${SIGNING_ENV.password} and ${SIGNING_ENV.alias}, or run ${command} mobile keystore.`);
  }
  return {
    ...process.env,
    [SIGNING_ENV.file]: paths.keystore,
    [SIGNING_ENV.password]: readFileSync(paths.password, 'utf8').trim(),
    [SIGNING_ENV.alias]: KEY_ALIAS,
  };
};

export { signingEnv };
