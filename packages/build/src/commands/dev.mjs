/* @layer tooling-scripts @kind logic */
import { LIVE_BROCK_ENV } from '../optimize-deps/optimize-deps.constants.mjs';
import { runElectronVite } from './electron-vite.mjs';

/**
 * @param {{ rootDir: string, passthrough?: string[], liveBrock?: boolean }} ctx liveBrock keeps linked Brock as hot source
 * @returns {Promise<number>} exit code
 */
const runDev = (ctx) => {
  if (ctx.liveBrock) process.env[LIVE_BROCK_ENV] = '1';
  return runElectronVite('dev', ctx);
};

export { runDev };
