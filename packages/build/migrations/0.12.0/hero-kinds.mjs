/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const ART_WITHOUT_KIND = /<((?:slots\.)?Art)(?![^>]*\bkind=)(\s)/g;

const RULES = Object.freeze([
  {
    pattern: /<(?:slots\.)?Backdrop\s*>/g,
    message: 'Backdrop takes a kind now, as Tessera Hero 0.13 does: a scene is <Backdrop kind="node" node={<Scene />} />, a picture <Backdrop kind="image" src={nightPng} />, a colour <Backdrop kind="color" color="--c-surface" />, and <Backdrop kind="none" /> draws none. The brand gradient no longer draws under a scene.',
  },
]);

const apply = ({ source }) => {
  const next = source.replace(ART_WITHOUT_KIND, '<$1 kind="image"$2');
  return { source: next, todos: patternTodos(next, RULES) };
};

const migration = Object.freeze({
  id: 'hero-kinds',
  summary: 'A hero home names the kind of its art and backdrop, as Tessera Hero 0.13 does: Art without a kind gets kind="image", and a Backdrop with children becomes a to-do.',
  files: /\.hero\.tsx$/,
  apply,
});

export { migration };
