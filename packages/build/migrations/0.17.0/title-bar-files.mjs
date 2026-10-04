/* @layer tooling-scripts @kind logic */
import { addGeneratedProp, patternTodos } from '../../src/upgrade/index.mjs';

const MAIN = /(^|\/)src\/main\.tsx$/;

const RULES = [
  {
    pattern: /\btitleBarActions\s*:/g,
    message: 'An app can now put its own items in the title bar: src/title-bar/<id>.action.ts default-exports defineTitleBarItem({ kind: \'button\' | \'menu\' | \'status\', label, icon, ... }) or a hook that returns one. brock sync lists them in .brock/title-bar.ts. When this module exists only to add a title bar action, move it there and drop the module.',
  },
];

const apply = ({ path, source }) => {
  const next = MAIN.test(path) ? addGeneratedProp(source, { prop: 'titleBar', name: 'appTitleBar', file: 'title-bar' }) : source;
  return { source: next, todos: patternTodos(next, RULES) };
};

const migration = Object.freeze({
  id: 'title-bar-files',
  summary: 'Title bar items by convention: src/title-bar/<id>.action.ts files are listed by brock sync in .brock/title-bar.ts. src/main.tsx gets titleBar={appTitleBar} on BrockApp and the import beside the other .brock imports. An app module with titleBarActions becomes a to-do, since an app item no longer needs a module.',
  files: /(^|\/)src\/.+\.tsx?$/,
  apply,
});

export { migration };
