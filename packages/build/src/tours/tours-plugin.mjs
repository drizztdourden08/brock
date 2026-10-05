/* @layer tooling-scripts @kind logic */
import { regeneratePlugin } from '../regenerate-plugin.mjs';
import { TOURS_DIR } from './tour-conventions.constants.mjs';
import { writeToursFile } from './write-tours.mjs';

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
const toursPlugin = ({ rootDir }) => regeneratePlugin({ name: 'brock-tours', rootDir, dir: TOURS_DIR, regenerate: writeToursFile });

export { toursPlugin };
