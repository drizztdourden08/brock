/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const BROCK_CORE = /['"]@drizztdourden08\/brock-core['"]/;

const RULES = Object.freeze([
  {
    pattern: /\bformatRelativeTime\b/g,
    message: 'brock-core no longer exports formatRelativeTime. Use Tessera: <DateText value={ts} format="relative" /> from @drizztdourden08/tessera/composites on screen, or formatDate(ts, \'relative\') from @drizztdourden08/tessera/primitives for a string.',
  },
  {
    pattern: /\bformatDate\b/g,
    message: 'brock-core no longer exports formatDate or DatePreset. Import formatDate from @drizztdourden08/tessera/primitives (its arguments differ: check the format names), or draw <DateText> from @drizztdourden08/tessera/composites on screen.',
  },
  {
    pattern: /\bDatePreset\b/g,
    message: 'brock-core no longer exports DatePreset. Use the format names of Tessera\'s formatDate and DateText.',
  },
]);

const apply = ({ source }) => ({ source, todos: BROCK_CORE.test(source) ? patternTodos(source, RULES) : [] });

const migration = Object.freeze({
  id: 'core-date-helpers',
  summary: 'brock-core drops its own formatDate, formatRelativeTime and DatePreset; every use in a file that imports brock-core becomes a to-do pointing to Tessera\'s formatDate and DateText.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
