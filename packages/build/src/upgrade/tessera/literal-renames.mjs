/* @layer tooling-scripts @kind logic */
import { renameTodos } from './rename-todos.mjs';
import { renameValue } from './rename-value.mjs';
import { tsSource } from './ts-source.mjs';

/**
 * @param {import('typescript').SourceFile} file
 * @param {import('typescript').StringLiteralLike[]} literals
 * @param {{ map: Record<string, string>, kind: string, version: string }} rule kind names the owner, such as ProgressBar.variant
 * @returns {{ edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }}
 */
const literalRenames = (file, literals, { map, kind, version }) => {
  const edits = [];
  const todos = [];
  for (const literal of literals.filter((node) => Object.hasOwn(map, node.text))) {
    const value = map[literal.text];
    if (renameValue.literal(value)) edits.push({ start: literal.getStart(file) + 1, end: literal.end - 1, text: value });
    else todos.push({ line: tsSource.lineOf(file, literal), message: renameTodos.note(version, `${kind} value`, { key: literal.text, value }) });
  }
  return { edits, todos };
};

export { literalRenames };
