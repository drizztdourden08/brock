/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { LOCALES_DIR } from './i18n.constants.mjs';
import { moduleLocaleSources } from './module-locale-sources.mjs';
import { readI18nOptions } from './read-i18n-options.mjs';
import { scanLocaleDir } from './scan-locale-dir.mjs';

/**
 * @typedef {import('./module-locale-sources.mjs').LocaleSource} LocaleSource
 * @typedef {{ base: string, offered: string[], draft: string[], sources: LocaleSource[], findings: string[] }} LocaleScan
 */

const inTags = (tags) => (file) => tags.includes(file.tag);

/**
 * @param {string} rootDir the app root
 * @returns {LocaleScan} the offered tags, and the files that ship
 */
const scanLocales = (rootDir) => {
  const { base, draft } = readI18nOptions(rootDir);
  const app = scanLocaleDir(join(rootDir, LOCALES_DIR), LOCALES_DIR);
  const found = [...new Set(app.files.map((file) => file.tag))];
  const offered = [base, ...found.filter((tag) => tag !== base && !draft.includes(tag)).sort()];
  const keep = inTags(offered);
  const modules = moduleLocaleSources(rootDir).map((source) => ({ ...source, files: source.files.filter((file) => keep(file) && file.tag !== base) }));
  const sources = [{ id: 'app', kind: 'app', root: LOCALES_DIR, files: app.files.filter(keep) }, ...modules];
  return { base, offered, draft, sources, findings: app.findings };
};

export { scanLocales };
