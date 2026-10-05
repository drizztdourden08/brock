/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = [
  {
    pattern: /\b(useMenuConfirmStore|MenuConfirmState)\b/g,
    message: 'useMenuConfirmStore and MenuConfirmState are gone: a menu entry with confirm is now a Tessera DropdownMenu item of kind confirm, which asks on the first press and runs on the second by itself. Drop the store calls; confirm: true takes Tessera\'s words (Click again to <label>), a string sets your own.',
  },
  {
    pattern: /\barmed\s*:/g,
    near: /\bMenuResolver\b|\btoMenuGroups\b/,
    message: 'MenuResolver no longer takes armed: toMenuGroups turns an entry with confirm into a Tessera confirm item, which keeps its own state. Remove armed.',
  },
];

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'menu-confirm-store',
  summary: 'Brock 0.23 draws a menu entry with confirm as a Tessera 0.20 DropdownMenu item of kind confirm. App code that used useMenuConfirmStore, the MenuConfirmState type or the armed field of MenuResolver becomes a to-do.',
  files: /(^|\/)src\/.+\.tsx?$/,
  apply,
});

export { migration };
