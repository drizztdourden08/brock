/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LOCALE_TAG, LOCALES_DIR } from '../i18n.constants.mjs';
import { cliResult } from './cli-result.mjs';
import { loadAppLocales } from './load-app-locales.mjs';

/**
 * @param {{ rootDir: string, tag?: string }} input the app and the new tag
 * @returns {import('./cli-result.mjs').CliResult} the empty namespace files written
 */
const addLocale = ({ rootDir, tag }) => {
  if (!tag || !LOCALE_TAG.test(tag)) return cliResult({ errors: ['brock i18n add <tag>: the tag must be a BCP 47 tag such as fr or pt-BR'] });
  const app = loadAppLocales(rootDir);
  const dir = join(rootDir, LOCALES_DIR, tag);
  if (existsSync(dir)) return cliResult({ errors: [`${LOCALES_DIR}/${tag} already exists`] });
  if (!app.baseFiles.size) return cliResult({ errors: [`${LOCALES_DIR}/${app.base} has no namespace files to copy the shape from`] });
  mkdirSync(dir, { recursive: true });
  for (const namespace of app.baseFiles.keys()) writeFileSync(join(dir, `${namespace}.json`), '{}\n');
  return cliResult({ lines: [`brock i18n add: ${LOCALES_DIR}/${tag} with ${app.baseFiles.size} empty namespace file(s)`] });
};

export { addLocale };
