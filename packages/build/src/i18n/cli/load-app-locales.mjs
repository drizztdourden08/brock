/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { LOCALES_DIR } from '../i18n.constants.mjs';
import { readI18nOptions } from '../read-i18n-options.mjs';
import { scanLocaleDir } from '../scan-locale-dir.mjs';

/**
 * @typedef {import('../scan-locale-dir.mjs').LocaleFile} LocaleFile
 * @typedef {{ base: string, draft: string[], dynamicKeys: string[], files: LocaleFile[], findings: string[], tags: string[], baseFiles: Map<string, LocaleFile> }} AppLocales
 */

/**
 * @param {string} rootDir the app root
 * @returns {AppLocales} the app's own locale files, the base ones by namespace
 */
const loadAppLocales = (rootDir) => {
  const { base, draft, dynamicKeys } = readI18nOptions(rootDir);
  const { files, findings } = scanLocaleDir(join(rootDir, LOCALES_DIR), LOCALES_DIR);
  const tags = [...new Set(files.map((file) => file.tag))].sort();
  const baseFiles = new Map(files.filter((file) => file.tag === base).map((file) => [file.namespace, file]));
  return { base, draft, dynamicKeys, files, findings, tags, baseFiles };
};

export { loadAppLocales };
