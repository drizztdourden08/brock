/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = Object.freeze([
  {
    pattern: /<Facts\s*>/g,
    message: 'Facts takes rows now, a list of fact rows for the Hero composite: rows={[[{ label, value }]]}. Move each StatRow into a row.',
  },
  {
    pattern: /<Backdrop\s*>\s*<Text\b/g,
    message: 'Backdrop is the scene behind the Hero. Put the heading in <Title>, a kicker in <Eyebrow> and the intro line in <Aside>.',
  },
]);

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'hero-slots',
  summary: 'A hero page fills the Tessera Hero slots (Title, Eyebrow, Backdrop, Art, Actions, Tools, Facts, Aside, Panel); Facts children and a heading inside Backdrop become to-dos.',
  files: /\.hero\.tsx$/,
  apply,
});

export { migration };
