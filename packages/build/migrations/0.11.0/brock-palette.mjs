/* @layer tooling-scripts @kind logic */

const OLD_STOCK = [
  ':root {',
  '--p-primary: #3b6fe0;',
  '--p-secondary: #9dbbff;',
  '--p-tertiary: #8e96a8;',
  '--p-on-primary: var(--p-pure-white);',
  '--p-on-secondary: var(--p-black);',
  '--p-on-tertiary: var(--p-black);',
  '}',
];

const BROCK_PALETTE = `:root {
  --p-primary: #f0862b;
  --p-secondary: #b9babc;
  --p-tertiary: #8a8b8d;
  --p-white: #f3f1ee;
  --p-black: #121314;
  --p-on-primary: var(--p-pure-black);
  --p-on-secondary: var(--p-pure-black);
  --p-on-tertiary: var(--p-pure-black);
}
`;

const bodyLines = (source) => source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== '' && !line.startsWith('/*'));

const isOldStock = (source) => {
  const lines = bodyLines(source);
  return lines.length === OLD_STOCK.length && lines.every((line, index) => line === OLD_STOCK[index]);
};

const apply = ({ source }) => {
  if (!isOldStock(source)) return { source, todos: [] };
  const header = source.match(/^\/\*[^\n]*\*\/\r?\n(?:\r?\n)?/)?.[0] ?? '';
  return { source: `${header}${BROCK_PALETTE}`, todos: [] };
};

const migration = Object.freeze({
  id: 'brock-palette',
  summary: 'The starter theme takes the Brock palette (orange, charcoal and greys, matching the Brock logo) in place of the old blue; only a src/theme.css still holding the untouched old starter seeds is rewritten.',
  files: /(^|\/)src\/theme\.css$/,
  apply,
});

export { migration };
