/* @layer tooling-scripts @kind logic */
import { regeneratePlugin } from '../regenerate-plugin.mjs';
import { TITLE_BAR_DIR } from './title-bar-conventions.constants.mjs';
import { writeTitleBarFile } from './write-title-bar.mjs';

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
const titleBarPlugin = ({ rootDir }) => regeneratePlugin({ name: 'brock-title-bar', rootDir, dir: TITLE_BAR_DIR, regenerate: writeTitleBarFile });

export { titleBarPlugin };
