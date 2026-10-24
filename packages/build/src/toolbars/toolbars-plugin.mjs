/* @layer tooling-scripts @kind logic */
import { regeneratePlugin } from '../regenerate-plugin.mjs';
import { TOOLBARS_DIR } from './toolbar-conventions.constants.mjs';
import { writeToolbarsFile } from './write-toolbars.mjs';

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
const toolbarsPlugin = ({ rootDir }) => regeneratePlugin({ name: 'brock-toolbars', rootDir, dir: TOOLBARS_DIR, regenerate: writeToolbarsFile });

export { toolbarsPlugin };
