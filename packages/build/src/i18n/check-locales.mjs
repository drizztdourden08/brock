/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { declaredDependencies } from '../modules/declared-dependencies.mjs';
import { FOLDER_HINT, I18N_PACKAGE, LOCALE_TAG, LOCALES_DIR, NAMESPACE } from './i18n.constants.mjs';
import { messageArgs } from './message-args.mjs';
import { readI18nOptions } from './read-i18n-options.mjs';
import { scanLocaleDir } from './scan-locale-dir.mjs';

/** @param {import('./scan-locale-dir.mjs').LocaleFile} file @returns {string[]} */
const fileFindings = (file) => [
  ...(NAMESPACE.test(file.namespace) ? [] : [`${file.path}: "${file.namespace}" is not a kebab-case namespace`]),
  ...Object.entries(file.messages).flatMap(([key, text]) => {
    try {
      messageArgs(text);
      return [];
    } catch (error) {
      return [`${file.path}: "${key}" does not parse as an ICU message (${error instanceof Error ? error.message : String(error)})`];
    }
  }),
];

const tagFindings = (tags) => tags.filter((tag) => !LOCALE_TAG.test(tag)).map((tag) => `${LOCALES_DIR}/${tag}: not a BCP 47 language tag such as en, fr or pt-BR. ${FOLDER_HINT}`);

/** @param {import('./scan-locale-dir.mjs').LocaleFile[]} files @param {string} base @returns {string[]} */
const baseFindings = (files, base) => {
  const inBase = new Map(files.filter((file) => file.tag === base).map((file) => [file.namespace, file]));
  return files.filter((file) => file.tag !== base && inBase.has(file.namespace)).flatMap((file) => Object.keys(file.messages)
    .filter((key) => !(key in inBase.get(file.namespace).messages))
    .map((key) => `${file.path}: "${key}" is not in the base ${base} file; the base has every key`));
};

const moduleFinding = (rootDir, tags, base) => {
  const second = tags.filter((tag) => tag !== base);
  return second.length && !declaredDependencies(rootDir).includes(I18N_PACKAGE)
    ? [`${LOCALES_DIR}: ${second.join(', ')} ship without the i18n module; run brock add i18n so a user can pick a language`]
    : [];
};

/**
 * @param {string} rootDir the app root
 * @returns {string[]} what brock structure reports about src/locales
 */
const checkLocales = (rootDir) => {
  const { base } = readI18nOptions(rootDir);
  const { files, findings } = scanLocaleDir(join(rootDir, LOCALES_DIR), LOCALES_DIR);
  const tags = [...new Set(files.map((file) => file.tag))];
  const missingBase = tags.length && !tags.includes(base) ? [`${LOCALES_DIR}/${base}: the base language has no folder; add it with every key`] : [];
  return [...findings, ...tagFindings(tags), ...missingBase, ...files.flatMap(fileFindings), ...baseFindings(files, base), ...moduleFinding(rootDir, tags, base)];
};

export { checkLocales };
