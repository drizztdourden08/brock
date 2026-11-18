/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LOCALES_DIR } from '../i18n.constants.mjs';
import { cliResult } from './cli-result.mjs';
import { loadAppLocales } from './load-app-locales.mjs';
import { messageProblems } from './message-problems.mjs';

const readTodo = (path) => {
  try {
    const todo = JSON.parse(readFileSync(path, 'utf8'));
    return typeof todo?.tag === 'string' && todo.namespaces && typeof todo.namespaces === 'object' ? { todo } : { problem: `${path} is not a todo file (it needs a tag and namespaces)` };
  } catch (error) {
    return { problem: `${path}: ${error instanceof Error ? error.message : String(error)}` };
  }
};

const entryProblems = (tag, namespace, baseFile, messages) => Object.entries(messages).flatMap(([key, text]) => {
  const where = `${tag}/${namespace}: "${key}"`;
  if (!baseFile) return [`${tag}/${namespace}: no such namespace in the base`];
  if (!(key in baseFile.messages)) return [`${where} is not in the base file`];
  if (typeof text !== 'string') return [`${where} is not a string`];
  return text === '' ? [] : messageProblems(baseFile.messages[key], text).map((problem) => `${where} ${problem}`);
});

const writeNamespace = (rootDir, tag, namespace, messages) => {
  const dir = join(rootDir, LOCALES_DIR, tag);
  const path = join(dir, `${namespace}.json`);
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
  const filled = Object.fromEntries(Object.entries(messages).filter(([, text]) => text !== ''));
  mkdirSync(dir, { recursive: true });
  writeFileSync(path, `${JSON.stringify({ ...existing, ...filled }, null, 2)}\n`);
  return Object.keys(filled).length;
};

/**
 * @param {{ rootDir: string, file?: string }} input the app and the translated todo file
 * @returns {import('./cli-result.mjs').CliResult} messages merged, or the errors that stopped it
 */
const mergeTodo = ({ rootDir, file }) => {
  if (!file) return cliResult({ errors: ['brock i18n merge <file>: name the translated todo file'] });
  const read = readTodo(join(rootDir, file));
  if (read.problem) return cliResult({ errors: [read.problem] });
  const { tag, namespaces } = read.todo;
  const app = loadAppLocales(rootDir);
  const errors = Object.entries(namespaces).flatMap(([namespace, messages]) => entryProblems(tag, namespace, app.baseFiles.get(namespace), messages));
  if (errors.length) return cliResult({ errors });
  const count = Object.entries(namespaces).reduce((sum, [namespace, messages]) => sum + writeNamespace(rootDir, tag, namespace, messages), 0);
  return cliResult({ lines: [`brock i18n merge: ${count} message(s) put into ${LOCALES_DIR}/${tag}`] });
};

export { mergeTodo };
