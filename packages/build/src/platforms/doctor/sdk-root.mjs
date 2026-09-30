/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';

/**
 * @param {NodeJS.ProcessEnv} env
 * @returns {string | null} the SDK folder, when it exists
 */
const sdkRoot = (env) => {
  const dir = env.ANDROID_HOME ?? env.ANDROID_SDK_ROOT;
  return dir && existsSync(dir) ? dir : null;
};

export { sdkRoot };
