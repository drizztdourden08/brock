/* @layer tooling-scripts @kind logic */
import { addLocale } from '../i18n/cli/add-locale.mjs';
import { checkAppLocales } from '../i18n/cli/check-app-locales.mjs';
import { cliResult } from '../i18n/cli/cli-result.mjs';
import { I18N_USAGE, I18N_VERBS } from '../i18n/cli/cli.constants.mjs';
import { coverageLines } from '../i18n/cli/coverage-lines.mjs';
import { mergeTodo } from '../i18n/cli/merge-todo.mjs';
import { todoLocale } from '../i18n/cli/todo-locale.mjs';
import { writeTesseraBase } from '../i18n/cli/write-tessera-base.mjs';

const VERBS = {
  check: ({ rootDir, locale }) => checkAppLocales({ rootDir, locale }),
  coverage: ({ rootDir }) => coverageLines(rootDir),
  add: ({ rootDir, args }) => addLocale({ rootDir, tag: args[1] }),
  todo: ({ rootDir, args, file }) => todoLocale({ rootDir, tag: args[1], out: file }),
  merge: ({ rootDir, args }) => mergeTodo({ rootDir, file: args[1] }),
  'tessera-base': ({ rootDir, file }) => writeTesseraBase({ rootDir, out: file }),
};

const print = (result) => {
  for (const line of result.lines) console.log(line);
  for (const warning of result.warnings) console.warn(`warning: ${warning}`);
  for (const error of result.errors) console.error(`error: ${error}`);
  return result.code;
};

/**
 * @param {{ rootDir: string, args: string[], locale?: string, file?: string }} ctx args[0] is the verb
 * @returns {Promise<number>} exit code: 1 on an error finding
 */
const runI18n = async (ctx) => {
  const verb = ctx.args[0];
  if (!I18N_VERBS.includes(verb)) return print(cliResult({ errors: [`unknown verb "${verb ?? ''}"; ${I18N_USAGE}`] }));
  return print(await VERBS[verb](ctx));
};

export { runI18n };
