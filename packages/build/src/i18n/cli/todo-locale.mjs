/* @layer tooling-scripts @kind logic */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cliResult } from './cli-result.mjs';
import { loadAppLocales } from './load-app-locales.mjs';

const isTranslated = (own, key) => typeof own?.messages[key] === 'string' && own.messages[key] !== '';

const missingOf = (baseFile, own) => Object.fromEntries(Object.entries(baseFile.messages).filter(([key]) => !isTranslated(own, key)));

const namespacesOf = (app, tag) => Object.fromEntries([...app.baseFiles]
  .map(([namespace, baseFile]) => [namespace, missingOf(baseFile, app.files.find((file) => file.tag === tag && file.namespace === namespace))])
  .filter(([, messages]) => Object.keys(messages).length));

/**
 * @param {{ rootDir: string, tag?: string, out?: string }} input the app, the tag and the output file
 * @returns {import('./cli-result.mjs').CliResult} the todo file written
 */
const todoLocale = ({ rootDir, tag, out }) => {
  const app = loadAppLocales(rootDir);
  if (!tag || !app.tags.includes(tag)) return cliResult({ errors: [`brock i18n todo <tag>: no src/locales/${tag ?? '<tag>'} folder; brock i18n add creates one`] });
  const namespaces = namespacesOf(app, tag);
  const count = Object.values(namespaces).reduce((sum, messages) => sum + Object.keys(messages).length, 0);
  const target = join(rootDir, out ?? `todo.${tag}.json`);
  writeFileSync(target, `${JSON.stringify({ tag, base: app.base, namespaces }, null, 2)}\n`);
  return cliResult({ lines: [`brock i18n todo: ${count} message(s) of ${tag} written to ${target}; translate the values, then run brock i18n merge`] });
};

export { todoLocale };
