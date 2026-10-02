/* @layer tooling-scripts @kind logic */
import { renameTodos } from './rename-todos.mjs';
import { renameTokens } from './rename-tokens.mjs';
import { renameValue } from './rename-value.mjs';
import { scriptRenames } from './script-renames.mjs';
import { styleRenames } from './style-renames.mjs';
import { DATA_FILE, SCRIPT_FILE, STYLE_FILE } from './tessera-renames.constants.mjs';

const dataRenames = (source, release) => {
  const result = renameTokens(source, { map: release.cssCustomProperties ?? {}, kind: 'customProperty', isName: renameValue.customProperty });
  return { source: result.text, todos: renameTodos.tokenTodos(source, release.version, 'custom property', result) };
};

const unique = (todos) => [...new Map(todos.map((todo) => [`${todo.line}\n${todo.message}`, todo])).values()].sort((a, b) => a.line - b.line);

/**
 * @param {typeof import('typescript') | null} ts null leaves scripts alone
 * @param {{ path: string, source: string }} input
 * @param {Record<string, any>} release
 * @returns {{ source: string, todos: { line: number, message: string }[] }}
 */
const replayRelease = (ts, { path, source }, release) => {
  let result = { source, todos: [] };
  if (SCRIPT_FILE.test(path) && ts) result = scriptRenames(ts, { path, source }, release);
  else if (STYLE_FILE.test(path)) result = styleRenames(source, release);
  else if (DATA_FILE.test(path)) result = dataRenames(source, release);
  return { source: result.source, todos: unique(result.todos) };
};

export { replayRelease };
