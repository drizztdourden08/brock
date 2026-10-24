/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = Object.freeze([
  {
    pattern: /(?<!\bawait\s+(?:[\w$]+\.)*)\bdocuments\.resolve\(/g,
    message: 'Brock 0.80 made ctx.documents.resolve(path) return a promise. Await it: `await documents.resolve(path)`, and make the calling function async.',
  },
  {
    pattern: /(?<!\bawait\s+(?:[\w$]+\.)*)\bdocuments\.isAllowed\(/g,
    message: 'Brock 0.80 made ctx.documents.isAllowed(path) return a promise. Await it: `await documents.isAllowed(path)`, and make the calling function async. An un-awaited promise is always truthy.',
  },
]);

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'documents-access-async',
  summary: 'Brock 0.80 checks folder grants on the real path, so ctx.documents.resolve and ctx.documents.isAllowed return promises: each call that is not awaited becomes a to-do.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
