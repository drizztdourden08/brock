/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_BASE, OPTIONS_PATTERN } from './i18n.constants.mjs';

const stringsIn = (text) => [...text.matchAll(/'([^']*)'|"([^"]*)"/g)].map((match) => match[1] ?? match[2] ?? '');

const optionBody = (rootDir) => {
  const file = join(rootDir, 'brock.config.ts');
  return existsSync(file) ? (OPTIONS_PATTERN.exec(readFileSync(file, 'utf8'))?.[1] ?? '') : '';
};

/**
 * @param {string} rootDir the app root
 * @returns {{ base: string, draft: string[] }} moduleOptions.i18n read from literals in brock.config.ts
 */
const readI18nOptions = (rootDir) => {
  const body = optionBody(rootDir);
  const base = /base:\s*['"]([^'"]+)['"]/.exec(body)?.[1] ?? DEFAULT_BASE;
  const draft = stringsIn(/draft:\s*\[([^\]]*)\]/.exec(body)?.[1] ?? '');
  return { base, draft };
};

export { readI18nOptions };
