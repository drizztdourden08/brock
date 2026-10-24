/* @layer tooling-scripts @kind logic */
import { regeneratePlugin } from '../regenerate-plugin.mjs';
import { STARTUP_DIR } from './startup-conventions.constants.mjs';
import { writeStartupFile } from './write-startup.mjs';

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
const startupPlugin = ({ rootDir }) => regeneratePlugin({ name: 'brock-startup', rootDir, dir: STARTUP_DIR, regenerate: writeStartupFile });

export { startupPlugin };
