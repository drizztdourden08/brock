/* @layer tooling-scripts @kind logic */
import { homedir } from 'node:os';
import { join } from 'node:path';
import { KEYSTORE_FOLDER } from './mobile.constants.mjs';

/**
 * @param {string} packageId the Android application id
 * @returns {{ dir: string, keystore: string, password: string, base64: string }} under ~/.brock/keystores, outside every repo
 */
const keystorePaths = (packageId) => {
  const dir = join(homedir(), ...KEYSTORE_FOLDER);
  return {
    dir,
    keystore: join(dir, `${packageId}.jks`),
    password: join(dir, `${packageId}.password`),
    base64: join(dir, `${packageId}.jks.b64`),
  };
};

export { keystorePaths };
