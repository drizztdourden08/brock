/* @layer tooling-scripts @kind logic */
import { renameTodos } from './rename-todos.mjs';
import { tsSource } from './ts-source.mjs';

const nameOf = (key) => /^[A-Za-z_$][\w$]*/.exec(key)?.[0] ?? key;

const memberOf = (key) => /^[A-Za-z_$][\w$]*\.([A-Za-z_$][\w$]*)/.exec(key)?.[1] ?? null;

const isMemberUse = (ts, node, local, member) => {
  if (ts.isPropertyAccessExpression(node)) return ts.isIdentifier(node.expression) && node.expression.text === local && node.name.text === member;
  return ts.isQualifiedName(node) && ts.isIdentifier(node.left) && node.left.text === local && node.right.text === member;
};

const placesOf = (ts, file, entry, key) => {
  const member = memberOf(key);
  if (member === null) return [entry.specifier];
  return tsSource.nodesOf(ts, file, (node) => isMemberUse(ts, node, entry.local, member));
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file
 * @param {ReturnType<typeof import('./tessera-imports.mjs').tesseraImports>} imports
 * @param {Record<string, any>} release
 * @returns {{ edits: never[], todos: { line: number, message: string }[] }} per import, or per use of a member
 */
const removedExports = (ts, file, imports, release) => {
  const removed = Object.entries(release.removedExports ?? {});
  const todos = imports.flatMap((entry) =>
    removed
      .filter(([key]) => nameOf(key) === entry.imported)
      .flatMap(([key, note]) => placesOf(ts, file, entry, key).map((node) => ({
        line: tsSource.lineOf(file, node),
        message: `${renameTodos.releaseLabel(release.version)} no longer exports ${key}: ${note}. Change it by hand.`,
      }))));
  return { edits: [], todos };
};

export { removedExports };
