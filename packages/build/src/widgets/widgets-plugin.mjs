/* @layer tooling-scripts @kind logic */
import { regeneratePlugin } from '../regenerate-plugin.mjs';
import { WIDGETS_DIR } from './widget-conventions.constants.mjs';
import { writeWidgetsFile } from './write-widgets.mjs';

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
const widgetsPlugin = ({ rootDir }) => regeneratePlugin({ name: 'brock-widgets', rootDir, dir: WIDGETS_DIR, regenerate: writeWidgetsFile });

export { widgetsPlugin };
