/* @layer tooling-scripts @kind logic */
import { findJsxProps, patternTodos } from '../../src/upgrade/index.mjs';

const RULES = Object.freeze([
  {
    pattern: /import\s*(?:type\s*)?\{[^}]*\bMenuEntry\b[^}]*\}\s*from\s*['"]@drizztdourden08\/tessera(?:\/composites)?['"]/g,
    message: 'Tessera has no MenuEntry. A menu is MenuGroup[] of MenuNode: a MenuItem ({ id, label, onSelect }) or { separator: true }.',
  },
  {
    pattern: /\btoDropdownItems\b/g,
    message: 'brock-react has toMenuGroups(menu, { openScreen }) in place of toDropdownItems. It returns MenuGroup[], and the menu closes itself, so drop closeMenu.',
  },
  {
    pattern: /\bOperatorSpec\b/g,
    near: /\blabel\s*:/,
    message: 'OperatorSpec has no label any more: FilterBar names an operator with the filterOperators wording of its icon. Drop label and change the wording through TesseraProvider strings.',
  },
]);

const itemsTodo = ({ line }) => ({
  line,
  message: "DropdownMenu takes groups in place of items: groups={[{ id: 'menu', items }]}, with id for key, onSelect for onClick and { separator: true } for 'separator'.",
});

const apply = ({ source }) => ({
  source,
  todos: [...findJsxProps(source, 'DropdownMenu', ['items']).map(itemsTodo), ...patternTodos(source, RULES)],
});

const migration = Object.freeze({
  id: 'dropdown-menu-groups',
  summary: 'Tessera DropdownMenu builds from MenuGroup[]; items, the Tessera MenuEntry type, toDropdownItems and OperatorSpec labels become to-dos.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
