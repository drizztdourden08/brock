/* @layer tooling-scripts @kind logic */
import { runElectronVite } from './electron-vite.mjs';

/**
 * @param {{ rootDir: string, passthrough?: string[]}} ctx
 * @returns {Promise<number>} exit code
 */
const runDev = (ctx) => runElectronVite('dev', ctx);

export { runDev };
