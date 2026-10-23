/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = Object.freeze([
  {
    pattern: /\brim\s*[:=]\s*\{?\s*['"]dark['"]/g,
    message: "Tessera 0.52 removed the dark rim, and product.icons.rim takes 'light' only. Use rim 'light' for an outline on a dark surface, or drop rim for none.",
  },
  {
    pattern: /\bground\s*[:=]\s*\{?\s*['"](?:light|dark)['"]/g,
    message: 'Tessera 0.52 removed the ground prop of BrandMark, Logo and Logo.Combined, since the light ground is gone. Delete it; a mark draws as drawn, and a mark inside Splash takes its dark look by itself.',
  },
]);

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'light-ground-removed',
  summary: "Tessera 0.52 drops the light ground and the dark rim; each rim 'dark' and each ground prop becomes a to-do.",
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
