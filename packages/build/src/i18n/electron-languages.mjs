/* @layer tooling-scripts @kind logic */
import { ELECTRON_BASE_LANGUAGE } from './i18n.constants.mjs';
import { scanLocales } from './scan-locales.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {string[]} en-US and every shipped language
 */
const electronLanguages = (rootDir) => {
  const tags = scanLocales(rootDir).offered.map((tag) => (tag === 'en' ? ELECTRON_BASE_LANGUAGE : tag));
  return [...new Set([ELECTRON_BASE_LANGUAGE, ...tags])];
};

export { electronLanguages };
