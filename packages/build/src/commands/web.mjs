/* @layer tooling-scripts @kind logic */
import { runWebVite } from '../platforms/web/run-web-vite.mjs';
import { WEB_MODES, WEB_USAGE } from './platform.constants.mjs';

/**
 * @param {{ rootDir: string, args?: string[], passthrough?: string[] }} ctx
 * @returns {Promise<number>} exit code
 */
const runWeb = ({ rootDir, args = [], passthrough = [] }) => {
  const [mode] = args;
  if (!WEB_MODES.has(mode)) {
    console.error(WEB_USAGE);
    return Promise.resolve(1);
  }
  return runWebVite(rootDir, mode, passthrough);
};

export { runWeb };
