/* @layer tooling-scripts @kind logic */
import { cliResult } from './cli-result.mjs';
import { loadAppLocales } from './load-app-locales.mjs';

const lineOf = (tag, namespace, baseFile, own) => {
  const keys = Object.keys(baseFile.messages);
  const done = keys.filter((key) => typeof own?.messages[key] === 'string' && own.messages[key] !== '').length;
  const percent = keys.length ? Math.round((done / keys.length) * 100) : 100;
  return `${tag.padEnd(8)} ${namespace.padEnd(24)} ${done}/${keys.length} (${percent}%)`;
};

/**
 * @param {string} rootDir the app root
 * @returns {import('./cli-result.mjs').CliResult} one line per non-base tag and base namespace
 */
const coverageLines = (rootDir) => {
  const app = loadAppLocales(rootDir);
  const lines = app.tags.filter((tag) => tag !== app.base).flatMap((tag) => [...app.baseFiles].map(([namespace, baseFile]) => lineOf(tag, namespace, baseFile, app.files.find((file) => file.tag === tag && file.namespace === namespace))));
  return cliResult({ lines: lines.length ? lines : [`only the base ${app.base} exists; brock i18n add <tag> starts a language`] });
};

export { coverageLines };
