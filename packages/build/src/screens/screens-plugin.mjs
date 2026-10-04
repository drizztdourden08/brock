/* @layer tooling-scripts @kind logic */
import { regeneratePlugin } from '../regenerate-plugin.mjs';
import { SCREENS_DIR } from './screen-conventions.constants.mjs';
import { writeScreensFile } from './write-screens.mjs';

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
const screensPlugin = ({ rootDir }) => regeneratePlugin({ name: 'brock-screens', rootDir, dir: SCREENS_DIR, regenerate: writeScreensFile });

export { screensPlugin };
