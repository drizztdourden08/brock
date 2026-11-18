/* @layer tooling-scripts @kind logic */
import { regeneratePlugin } from '../regenerate-plugin.mjs';
import { LOCALES_DIR } from './i18n.constants.mjs';
import { writeI18nFiles } from './write-i18n.mjs';

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
const i18nPlugin = ({ rootDir }) => regeneratePlugin({ name: 'brock-i18n', rootDir, dir: LOCALES_DIR, regenerate: writeI18nFiles });

export { i18nPlugin };
