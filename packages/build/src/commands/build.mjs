/* @layer tooling-scripts @kind logic */
import { runElectronVite } from './electron-vite.mjs';

/**
 * @param {{ rootDir: string, passthrough?: string[]}} ctx
 * @returns {Promise<number>} exit code
 */
const runBuild = (ctx) => runElectronVite('build', ctx);

export { runBuild };
