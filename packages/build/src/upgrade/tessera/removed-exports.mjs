/* @layer tooling-scripts @kind logic */
import { renameTodos } from './rename-todos.mjs';
import { tsSource } from './ts-source.mjs';

const nameOf = (key) => /^[A-Za-z_$][\w$]*/.exec(key)?.[0] ?? key;

/**
 * @param {import('typescript').SourceFile} file
 * @param {ReturnType<typeof import('./tessera-imports.mjs').tesseraImports>} imports
 * @param {Record<string, any>} release
 * @returns {{ edits: never[], todos: { line: number, message: string }[] }} one per import
 */
const removedExports = (file, imports, release) => {
  const removed = Object.entries(release.removedExports ?? {});
  const todos = imports.flatMap((entry) =>
    removed
      .filter(([key]) => nameOf(key) === entry.imported)
      .map(([key, note]) => ({
        line: tsSource.lineOf(file, entry.specifier),
        message: `${renameTodos.releaseLabel(release.version)} no longer exports ${key}: ${note}. Change it by hand.`,
      })));
  return { edits: [], todos };
};

export { removedExports };
