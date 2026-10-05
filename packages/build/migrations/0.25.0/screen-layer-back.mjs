/* @layer tooling-scripts @kind logic */
import { findJsxProps, patternTodos } from '../../src/upgrade/index.mjs';

const RULES = [
  {
    pattern: /\bonBack\s*:/g,
    near: /\bScreenLayer\b/,
    message: 'ScreenLayer takes back, Tessera\'s BackAction, in place of onBack: write back: { onSelect, label? }, where label is the page it goes back to, so the button reads Back to and the label.',
  },
];

const expressionOf = (source, { start, end }) => {
  const value = source.slice(start, end).replace(/^onBack\s*=\s*/, '');
  return value.startsWith('{') ? value.slice(1, -1).trim() : value;
};

const apply = ({ source }) => {
  const props = findJsxProps(source, 'ScreenLayer', ['onBack']);
  const moved = props.reduceRight(
    (text, prop) => `${text.slice(0, prop.start)}back={{ onSelect: ${expressionOf(source, prop)} }}${text.slice(prop.end)}`,
    source,
  );
  return { source: moved, todos: patternTodos(moved, RULES) };
};

const migration = Object.freeze({
  id: 'screen-layer-back',
  summary: 'Brock 0.25 moves to Tessera 0.21, where ScreenWindow takes back in place of onBack. ScreenLayer follows: <ScreenLayer onBack={fn}> becomes back={{ onSelect: fn }}, and an onBack it cannot rewrite becomes a to-do.',
  files: /(^|\/)src\/.+\.[jt]sx?$/,
  apply,
});

export { migration };
