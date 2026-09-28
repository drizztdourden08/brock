/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

/**
 * @param {string} packageDir
 * @returns {string | null} the cmake-js entry script, or null when not installed
 */
const cmakeJsBin = (packageDir) => {
  try {
    const require = createRequire(join(packageDir, 'package.json'));
    require.resolve('node-addon-api');
    return join(dirname(require.resolve('cmake-js/package.json')), 'bin', 'cmake-js');
  } catch {
    return null;
  }
};

export { cmakeJsBin };
