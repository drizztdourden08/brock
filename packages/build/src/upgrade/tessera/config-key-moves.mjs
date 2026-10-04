/* @layer tooling-scripts @kind logic */
import { configKeyPaths, leafOf, parentOf, sameList } from './config-key-paths.mjs';
import { jsonEdits } from './json-edits.mjs';
import { findJsonPath, parseJsonTree } from './json-tree.mjs';
import { renameTodos } from './rename-todos.mjs';

const dotted = (path) => path.join('.');

const ensureObject = (source, path) => {
  let text = source;
  for (let depth = 1; depth <= path.length; depth += 1) {
    const root = parseJsonTree(text);
    const found = findJsonPath(root, path.slice(0, depth));
    if (found && found.node.kind !== 'object') return null;
    if (!found) text = jsonEdits.insert(text, findJsonPath(root, path.slice(0, depth - 1)).node, { key: path[depth - 1], value: '{}' });
  }
  return text;
};

const pruneEmpty = (text, path) => {
  if (path.length === 0) return text;
  const found = findJsonPath(parseJsonTree(text), path);
  if (found?.node.kind !== 'object' || found.node.members.length > 0) return text;
  return pruneEmpty(jsonEdits.remove(text, found.parent, found.member), parentOf(path));
};

const carry = (text, { from, to }) => {
  const source = findJsonPath(parseJsonTree(text), from);
  const value = { key: leafOf(to), value: text.slice(source.node.start, source.node.end), indent: jsonEdits.lineIndent(text, source.member.keyStart) };
  const ready = ensureObject(text, parentOf(to));
  if (ready === null) return null;
  const placed = jsonEdits.insert(ready, findJsonPath(parseJsonTree(ready), parentOf(to)).node, value);
  const left = findJsonPath(parseJsonTree(placed), from);
  return pruneEmpty(jsonEdits.remove(placed, left.parent, left.member), parentOf(from));
};

const blocked = (text, move, { file, version }) => {
  const source = findJsonPath(parseJsonTree(text), move.from);
  const label = renameTodos.releaseLabel(version);
  return {
    line: renameTodos.lineAt(text, source.member.keyStart),
    message: `${label} moves the ${file} setting ${dotted(move.from)} to ${dotted(move.to)}, and ${dotted(move.to)} is already set or holds no object. Merge the two by hand, then delete ${dotted(move.from)}.`,
  };
};

const applyMove = (text, move, context) => {
  const root = parseJsonTree(text);
  if (!findJsonPath(root, move.from)) return { text, todo: null };
  if (findJsonPath(root, move.to)) return { text, todo: blocked(text, move, context) };
  const moved = sameList(parentOf(move.from), parentOf(move.to))
    ? jsonEdits.rename(text, findJsonPath(root, move.from).member, leafOf(move.to))
    : carry(text, move);
  return moved === null ? { text, todo: blocked(text, move, context) } : { text: moved, todo: null };
};

/**
 * @param {string} source the JSON file
 * @param {Record<string, string>} map old dotted path to new; * is any one key
 * @param {{ file: string, version: string }} context for the to-dos
 * @returns {{ source: string, todos: { line: number, message: string }[] }} the rest of the text kept as it was
 */
const configKeyMoves = (source, map, context) => {
  const root = parseJsonTree(source);
  if (root?.kind !== 'object') return { source, todos: [] };
  let text = source;
  const todos = [];
  for (const move of configKeyPaths(root, map)) {
    const result = applyMove(text, move, context);
    text = result.text;
    if (result.todo) todos.push(result.todo);
  }
  return { source: text, todos };
};

export { configKeyMoves };
