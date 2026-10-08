/* @layer tooling-scripts @kind logic */
import { dirname } from 'node:path';
import { renameTodos } from '../tessera/rename-todos.mjs';
import { copyTarget } from './copy-target.mjs';
import { CSS_REFERENCE } from './tessera-copy.constants.mjs';

/**
 * @param {{ path: string, source: string }} input a stylesheet, path absolute
 * @param {{ copyDir: string, aliases: string[] }} copy
 * @returns {{ line: number, message: string }[]} each @import or url() that reaches into the copy
 */
const copyStyles = ({ path, source }, { copyDir, aliases }) =>
  [...source.matchAll(CSS_REFERENCE)]
    .map((match) => ({ index: match.index, target: copyTarget(match[2], { fileDir: dirname(path), copyDir, aliases }) }))
    .filter(({ target }) => target !== null)
    .map(({ index, target }) => ({
      line: renameTodos.lineAt(source, index),
      message: `reaches ${target.inner} of the copy. Import @drizztdourden08/tessera/tokens.css and the brand palette in place of the copy's tokens, and keep only what this app adds in its theme.`,
    }));

export { copyStyles };
