/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const BROCK_REACT = /['"]@drizztdourden08\/brock-react['"]/;

const RULES = Object.freeze([
  {
    pattern: /\b(?:setEscapeTo|escapeTo)\b/g,
    message: 'The navigation store no longer has escapeTo or setEscapeTo. Escape now closes the open window in one press and reopens the last closed one when none is open, so drop the call; use nav.reopen() to reopen the last window yourself.',
  },
]);

const apply = ({ source }) => ({ source, todos: BROCK_REACT.test(source) ? patternTodos(source, RULES) : [] });

const migration = Object.freeze({
  id: 'escape-to-removed',
  summary: 'The navigation store drops escapeTo and setEscapeTo; each use in a file that imports brock-react becomes a to-do, since Escape now closes the window and reopens the last one.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
