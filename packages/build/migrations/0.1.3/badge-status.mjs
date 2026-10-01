/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const TESSERA = /['"]@drizztdourden08\/tessera(?:\/[\w-]+)?['"]/;

const RULES = Object.freeze([
  {
    pattern: /<Badge\b(?![^>]*\bvalue\s*=)(?![^>]*\bvariant\s*=\s*['"{]*(?:inline|number|dot)\b)/g,
    message: 'Tessera Badge is now a count or a dot (value, and variant inline, number or dot). A status word is a Status: <Badge variant="success">Connected</Badge> becomes <Status tone="success">Connected</Status>.',
  },
  {
    pattern: /\b(?:StatusBadge|ScreenStatus)\b/g,
    message: 'StatusBadge and ScreenStatus are gone from Tessera. Use <Status tone="warning" variant="pill">Draft</Status> and map your own states to a tone and a label.',
  },
]);

const apply = ({ source }) => ({ source, todos: TESSERA.test(source) ? patternTodos(source, RULES) : [] });

const migration = Object.freeze({
  id: 'badge-status',
  summary: 'Tessera Badge is a count or a dot and the status word is Status; a Badge without a value and StatusBadge become to-dos.',
  files: /\.[jt]sx$/,
  apply,
});

export { migration };
